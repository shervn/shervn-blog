
import { comments as allComments } from "../assets/postboxdata.js";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Grid, Image, Container } from "semantic-ui-react";
import { renderBoldQuotes } from '../utils.js';

export default function PhotoGrid({ data }) {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [windowCount, setWindowCount] = useState(0); // counts items since last null
  const loadMoreRef = useRef(null);

  // Pre-shuffle comments once
  const shuffledComments = useMemo(() => {
    const arr = [...allComments];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

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

      // force a null if 6 items have passed without one
      if (count >= 5) {
        result.push(null);
        count = 0;
      } else if (index < items.length - 1 && Math.random() < 0.25) {
        // random null insertion
        result.push(null);
        count = 0;
      }
    });

    return { result, windowCount: count };
  }, []);

  // Append only new items when data changes
  useEffect(() => {
    if (!Array.isArray(data)) return;

    const flat = data.flatMap((section) => {
      const photos = section.Photos || [];
      const cityEn = section.City?.English || "";
      const cityFa = section.City?.Farsi || "";

      return photos.map((src) => ({
        src,
        cityEn,
        cityFa,
      }));
    });

    if (flat.length === 0) return;

    const newItems = flat.slice(items.length); // only new
    const shuffledNewItems = shuffleArray(newItems);
    const { result: processedNewItems, windowCount: newWindowCount } = insertEmptySquares(
      shuffledNewItems,
      windowCount
    );

    setItems((prev) => [...prev, ...processedNewItems]);
    setWindowCount(newWindowCount);
  }, [data, items.length, shuffleArray, insertEmptySquares, windowCount]);

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 10, items.length));
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
        <div style={{ padding: 20 }}>No photos available.</div>
      </Container>
    );
  }

  return (
    <Container className="instaContainer" style={{ userSelect: "none" }}>
      <Grid doubling stackable columns={3}>
        {items.slice(0, visibleCount).map((item, i) => (
          <Grid.Column key={i}>
            {item ? (
              <div style={{ position: "relative" }}>
                <Image
                  src={item.src}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
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
                    words.length <= 3
                      ? words
                      : [words[0], words[1], words.slice(2).join(" ")];

                  return lines.map((line, idx) => (
                    <p
                      key={idx}
                      style={{
                        textAlign: Math.random() < 0.5 ? "left" : "right",
                      }}
                    >
                      {renderBoldQuotes(line)}
                    </p>
                  ));
                })()}
              </div>
            )}
          </Grid.Column>
        ))}
      </Grid>

      {visibleCount < items.length && <div ref={loadMoreRef} style={{ height: 1 }} />}
    </Container>
  );
}
