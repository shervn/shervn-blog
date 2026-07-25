import { useState, useEffect, useMemo } from "react";
import { Container, Loader } from "semantic-ui-react";
import { getScholarPapers } from "../utils/lambdaUtils.js";

export default function ScholarComponent() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getScholarPapers();
        setPapers(Array.isArray(data?.papers) ? data.papers : []);
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

  if (!papers.length) return null;

  return (
    <Container className="scholar-container" role="main" aria-label="Publications">
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
