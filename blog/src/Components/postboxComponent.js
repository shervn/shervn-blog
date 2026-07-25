
import { useMemo, useState, useEffect, useRef } from "react";
import { Grid, Image, Container, Loader } from "semantic-ui-react";
import { getS3Path, loadData, loadComments, shuffleArray, insertEmptySquares, getPlaceholderIndex } from '../utils/general.js';
import {
  POSTBOX_INITIAL_VISIBLE,
  POSTBOX_LOAD_MORE_COUNT,
  POSTBOX_NULL_FORCE_COUNT,
  POSTBOX_NULL_RANDOM_CHANCE,
} from '../utils/constants.js';
import CommentPlaceholder from './commentPlaceholder.js';

export default function PhotoGrid() {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(POSTBOX_INITIAL_VISIBLE);
  const [data, setData] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [dataJson, commentsJson] = await Promise.all([
          new Promise((resolve) => loadData((data) => resolve(data), 'postboxdata')),
          loadComments()
        ]);
        setData(dataJson);
        setAllComments(commentsJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Pre-shuffle comments once
  const shuffledComments = useMemo(() => shuffleArray(allComments), [allComments]);

  // Process data when it's loaded
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const flat = data.map((item) => ({
      src: getS3Path(item.path),
      cityEn: item.city?.en || "",
      cityFa: item.city?.fa || "",
    }));

    const shuffled = shuffleArray(flat);
    setItems(insertEmptySquares(shuffled, POSTBOX_NULL_FORCE_COUNT, POSTBOX_NULL_RANDOM_CHANCE));
  }, [data]);

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            const next = Math.min(prev + POSTBOX_LOAD_MORE_COUNT, items.length);
            if (window.gtag && next > prev) {
              window.gtag('event', 'postbox_scroll_depth', {
                visible_count: next,
                total_count: items.length,
                percent_loaded: Math.round((next / items.length) * 100)
              });
            }
            return next;
          });
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [items.length]);

  if (loading) {
    return (
      <Container className="instaContainer">
        <Loader active indeterminate inline="centered" size="small" />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="instaContainer">
        <div className="postbox-no-photos">No photos available.</div>
      </Container>
    );
  }

  return (
    <Container className="instaContainer postbox-container" role="main" aria-label="Photo grid">
      <Grid doubling stackable columns={3} role="grid" aria-label="Photo gallery grid">
        {items.slice(0, visibleCount).map((item, i) => (
          <Grid.Column key={i}>
            {item ? (
              <div className="postbox-image-wrapper">
                <Image
                  src={item.src}
                  className="postbox-image"
                  draggable={false}
                  alt={`${item.cityEn} ${item.cityFa}`}
                  loading="lazy"
                />
                <div className="overlayCityName">
                  <div>{item.cityEn}</div>
                  <div>{item.cityFa}</div>
                </div>
              </div>
            ) : (
              <CommentPlaceholder
                comment={shuffledComments[getPlaceholderIndex(items, i) % shuffledComments.length]}
              />
            )}
          </Grid.Column>
        ))}
      </Grid>
      {visibleCount < items.length && <div ref={loadMoreRef} className="postbox-load-more" />}
    </Container>
  );
}
