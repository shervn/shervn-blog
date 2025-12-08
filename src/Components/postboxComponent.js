import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Grid, Image, Container } from "semantic-ui-react";

export default function PhotoGrid({ data }) {
  const [isPhone, setIsPhone] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [visibleCount, setVisibleCount] = useState(10);
  const loadMoreRef = useRef(null);

  // Update isPhone on resize
  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const insertEmptySquares = useCallback(
    (items) => {
      if (isPhone) return items;
      const result = [];
      items.forEach((item) => {
        result.push(item);
        if (Math.random() < 0.15) result.push(null);
      });
      return result;
    },
    [isPhone]
  );

  const shuffleArray = useCallback((array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }, []);

  const finalItems = useMemo(() => {
    if (!Array.isArray(data)) return [];

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

    if (flat.length === 0) return [];

    return insertEmptySquares(shuffleArray(flat));
  }, [data, insertEmptySquares, shuffleArray]);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 10, finalItems.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [finalItems.length]);

  if (finalItems.length === 0) {
    return (
      <Container className="instaContainer">
        <div style={{ padding: 20 }}>No photos available.</div>
      </Container>
    );
  }

  return (
    <Container className="instaContainer" style={{ userSelect: "none" }}>
      <Grid doubling stackable columns={3}>
        {finalItems.slice(0, visibleCount).map((item, i) => (
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
              <div style={{ width: "100%", paddingTop: "100%" }} />
            )}
          </Grid.Column>
        ))}
      </Grid>

      {/* Sentinel div to trigger loading more */}
      {visibleCount < finalItems.length && (
        <div ref={loadMoreRef} style={{ height: 1 }} />
      )}
    </Container>
  );
}
