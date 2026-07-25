import { useState, useEffect } from "react";
import { Container, Loader, Icon } from "semantic-ui-react";
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
        {papers.map((paper, i) => (
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
            <div className="scholar-item-citations" title="Citations">
              <Icon name="quote right" />
              {paper.citations}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
