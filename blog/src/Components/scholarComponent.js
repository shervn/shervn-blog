import { useState, useEffect, useMemo } from "react";
import { Container, Loader, Header, Divider } from "semantic-ui-react";
import { getScholarPapers } from "../utils/lambdaUtils.js";
import { loadPostBody } from "../utils/general.js";
import { BLOG_PREVIEW_MAX_LENGTH } from "../utils/constants.js";
import PostMarkdown from "./postMarkdown.js";

// Not a scraped Scholar entry (dissertations rarely show up there) and not a
// blog post either - pinned as its own featured writeup above the paper list.
const FEATURED_POST_TYPE = 'research';
const FEATURED_POST_UUID = '2j8q6emk';
const FEATURED_POST_TITLE = 'Giving Sight and Intelligence to Sight-Giving Surgical Robots';

export default function ScholarComponent() {
  const [papers, setPapers] = useState([]);
  const [featuredBody, setFeaturedBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [data, body] = await Promise.all([
          getScholarPapers(),
          loadPostBody(FEATURED_POST_TYPE, FEATURED_POST_UUID),
        ]);
        setPapers(Array.isArray(data?.papers) ? data.papers : []);
        setFeaturedBody(body);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const sortedPapers = useMemo(() => {
    const sorted = [...papers];
    sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    return sorted;
  }, [papers]);

  if (loading) {
    return (
      <div className="scholar-loading" role="status" aria-live="polite">
        <Loader active indeterminate inline="centered" size="small" />
        <p>Loading publications...</p>
      </div>
    );
  }

  if (!papers.length && !featuredBody) return null;

  return (
    <Container className="scholar-container" role="main" aria-label="Publications">
      {featuredBody && (
        <>
          <Header as="h2" content={FEATURED_POST_TITLE} className="englishPost" />
          <PostMarkdown
            body={featuredBody}
            className="englishPost"
            maxLength={BLOG_PREVIEW_MAX_LENGTH}
            continueTo={`/${FEATURED_POST_TYPE}/${FEATURED_POST_UUID}`}
            continueLabel=" Continue "
          />
          <Divider />
        </>
      )}
      <ul className="scholar-list">
        {sortedPapers.map((paper, i) => (
          <li key={i} className="scholar-item">
            <div className="scholar-item-year">{paper.year || '—'}</div>
            <div className="scholar-item-body">
              <a
                href={paper.link}
                target="_blank"
                rel="noreferrer"
                className="scholar-item-title"
              >
                {paper.title}
              </a>
              {paper.authors && <div className="scholar-item-authors">{paper.authors}</div>}
              {paper.venue && <div className="scholar-item-venue">{paper.venue}</div>}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
