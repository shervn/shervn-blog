const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config/scholar');
const s3Service = require('./s3Service');

const CACHE_FILE = 'scholarCache';
const PAGE_SIZE = 100;

// A desktop user-agent avoids Scholar's lightweight bot-detection on the
// plain (non-JS) profile page, which is otherwise scrape-friendly.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchProfilePage(cstart) {
  const url = `${config.BASE_URL}/citations`;
  const response = await axios.get(url, {
    params: {
      user: config.USER_ID,
      hl: 'en',
      cstart,
      pagesize: PAGE_SIZE,
    },
    headers: { 'User-Agent': USER_AGENT },
    timeout: 15000,
  });
  return response.data;
}

// The overview table only shows a truncated author preview and a shortened
// venue string; the full values only exist on each paper's own detail page.
async function fetchFullDetails(link) {
  const response = await axios.get(link, {
    headers: { 'User-Agent': USER_AGENT },
    timeout: 15000,
  });
  const $ = cheerio.load(response.data);

  const fields = {};
  $('.gsc_oci_field').each((i, el) => {
    const label = $(el).text().trim();
    const value = $($('.gsc_oci_value')[i]).text().trim();
    fields[label] = value;
  });

  const venueLabel = Object.keys(fields).find(
    (label) => !['Authors', 'Publication date', 'Volume', 'Issue', 'Pages', 'Publisher', 'Total citations', 'Scholar articles', 'Description'].includes(label)
  );

  const venueParts = [venueLabel && fields[venueLabel], fields.Volume, fields.Issue && `(${fields.Issue})`, fields.Pages]
    .filter(Boolean);

  return {
    authors: fields.Authors || null,
    venue: venueParts.length ? venueParts.join(' ').replace(/\s+,/g, ',') : null,
  };
}

function parsePapers(html) {
  const $ = cheerio.load(html);
  const papers = [];

  $('tr.gsc_a_tr').each((_, el) => {
    const $row = $(el);
    const titleEl = $row.find('.gsc_a_at');
    const title = titleEl.text().trim();
    const href = titleEl.attr('href');
    const grays = $row.find('.gs_gray');
    const authors = $(grays[0]).text().replace(/,?\s*(…|\.\.\.)\s*$/, '').trim();
    const venue = $(grays[1]).text().replace(/,\s*\d{4}\s*$/, '').trim();
    const citationsText = $row.find('.gsc_a_ac').text().trim();
    const yearText = $row.find('.gsc_a_y .gsc_a_h').text().trim();

    if (!title) return;

    papers.push({
      title,
      link: href ? `${config.BASE_URL}${href}` : null,
      authors,
      venue,
      citations: citationsText ? parseInt(citationsText, 10) : 0,
      year: yearText ? parseInt(yearText, 10) : null,
    });
  });

  return papers;
}

function parseStats(html) {
  const $ = cheerio.load(html);
  const cells = $('#gsc_rsb_st .gsc_rsb_std');
  return {
    citations: parseInt($(cells[0]).text(), 10) || 0,
    hIndex: parseInt($(cells[2]).text(), 10) || 0,
    i10Index: parseInt($(cells[4]).text(), 10) || 0,
  };
}

async function fetchFromScholar() {
  let cstart = 0;
  let allPapers = [];
  let stats = null;

  while (true) {
    const html = await fetchProfilePage(cstart);
    if (!stats) stats = parseStats(html);

    const papers = parsePapers(html);
    if (papers.length === 0) break;

    allPapers = allPapers.concat(papers);
    if (papers.length < PAGE_SIZE) break;
    cstart += PAGE_SIZE;
  }

  const seen = new Set();
  allPapers = allPapers.filter((p) => {
    if (!p.link || seen.has(p.link)) return false;
    seen.add(p.link);
    return true;
  });

  // Fill in the full (untruncated) author list and venue from each paper's own
  // page. Sequential with a small gap between requests to stay gentle on
  // Scholar; any single failure just keeps that paper's truncated preview
  // rather than failing the whole batch.
  for (const paper of allPapers) {
    try {
      const details = await fetchFullDetails(paper.link);
      if (details.authors) paper.authors = details.authors;
      if (details.venue) paper.venue = details.venue;
    } catch (err) {
      console.error(`Failed to fetch full details for "${paper.title}":`, err.message);
    }
    await sleep(300);
  }

  allPapers.sort((a, b) => (b.year || 0) - (a.year || 0) || b.citations - a.citations);

  return { stats, papers: allPapers };
}

// Fetching full per-paper details (needed for untruncated authors/venue) takes
// well over API Gateway's 29s hard integration timeout for ~28+ papers, so it
// can't run inside the HTTP request. A separate scheduled Lambda (see
// refresh.js) calls this on a timer and writes the result to S3; the /papers
// route (getPapers below) only ever reads that cache and returns immediately.
async function refreshCache() {
  const fresh = await fetchFromScholar();
  const result = { ...fresh, fetchedAt: new Date().toISOString() };
  await s3Service.writeJSON(CACHE_FILE, result);
  return result;
}

async function getPapers() {
  const cached = await s3Service.readJSON(CACHE_FILE, null);
  return cached || { stats: null, papers: [] };
}

module.exports = {
  getPapers,
  refreshCache,
};
