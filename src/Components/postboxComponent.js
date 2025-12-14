
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Grid, Image, Container } from "semantic-ui-react";
import { renderBoldQuotes } from '../utils/general.js';
import {
  POSTBOX_INITIAL_VISIBLE,
  POSTBOX_LOAD_MORE_COUNT,
  POSTBOX_NULL_FORCE_COUNT,
  POSTBOX_NULL_RANDOM_CHANCE,
  POSTBOX_MAX_COMMENT_LINES
} from '../utils/constants.js';

import AnimatedStat from "./animatedStat.js";

export default function PhotoGrid() {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(POSTBOX_INITIAL_VISIBLE);
  const [windowCount, setWindowCount] = useState(0); // counts items since last null
  const [data, setData] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const loadMoreRef = useRef(null);

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dataRes, commentsRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/data/postboxdata.json`),
          fetch(`${process.env.PUBLIC_URL}/data/comments.json`)
        ]);
        const [dataJson, commentsJson] = await Promise.all([
          dataRes.json(),
          commentsRes.json()
        ]);
        setData(dataJson);
        setAllComments(commentsJson);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Pre-shuffle comments once
  const shuffledComments = useMemo(() => {
    if (allComments.length === 0) return [];
    const arr = [...allComments];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [allComments]);

  const shuffleArray = useCallback((array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }, []);

  const insertEmptySquares = useCallback((items, startingWindowCount = 0) => {
    const result = [];
    let count = startingWindowCount;

    items.forEach((item, index) => {
      result.push(item);
      count++;

      // force a null if threshold items have passed without one
      if (count >= POSTBOX_NULL_FORCE_COUNT) {
        result.push(null);
        count = 0;
      } else if (index < items.length - 1 && Math.random() < POSTBOX_NULL_RANDOM_CHANCE) {
        // random null insertion
        result.push(null);
        count = 0;
      }
    });

    return { result, windowCount: count };
  }, []);

  // Process data when it's loaded
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const flat = data.map((item) => ({
      src: item.path,
      cityEn: item.city?.en || "",
      cityFa: item.city?.fa || "",
    }));

    const shuffledNewItems = shuffleArray(flat);
    const { result: processedNewItems, windowCount: newWindowCount } = insertEmptySquares(
      shuffledNewItems,
      0
    );

    setItems(processedNewItems);
    setWindowCount(newWindowCount);
  }, [data, shuffleArray, insertEmptySquares]);

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + POSTBOX_LOAD_MORE_COUNT, items.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [items.length]);

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
              <div className="commentPlaceHolder">
                {(() => {
                  const placeholderIndex =
                    items.slice(0, i + 1).filter((x) => x === null).length - 1;
                  const comment =
                    shuffledComments[placeholderIndex % shuffledComments.length];

                  const words = comment.split(" ");
                  const lines =
                    words.length <= POSTBOX_MAX_COMMENT_LINES
                      ? words
                      : [words[0], words[1], words.slice(2).join(" ")];

                  // Use placeholderIndex as seed for consistent alignment
                  const seed = placeholderIndex;
                  return lines.map((line, idx) => {
                    const textAlign = (seed + idx) % 2 === 0 ? "right" : "left";
                    return (
                      <p
                        key={idx}
                        className={`postbox-comment-text ${textAlign === "right" ? "right" : ""}`}
                      >
                        {renderBoldQuotes(line)}
                      </p>
                    );
                  });
                })()}
              </div>
            )}
          </Grid.Column>
        ))}
      </Grid>
      {visibleCount < items.length && <div ref={loadMoreRef} className="postbox-load-more" />}
      <Grid columns={3} divided >
        <Grid.Column textAlign="center">
          <AnimatedStat
            value={new Set(items.filter(Boolean).map(item => item.cityEn)).size}
            text="Cities"
          />
        </Grid.Column>
        <Grid.Column textAlign="center">
          <AnimatedStat
            value={items.filter(Boolean).length}
            text="Postboxes"
          />
        </Grid.Column>
        <Grid.Column textAlign="center">
          <AnimatedStat
            value={-1}
            text="Stories"
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
