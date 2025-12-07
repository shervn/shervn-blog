import { useState, useRef, useEffect } from "react";
import { Container, Button, Icon } from "semantic-ui-react";

export default function TrainComponent({ data }) {
  const [start, setStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef();

  const [visible, setVisible] = useState(
  typeof window !== "undefined" && window.innerWidth < 768 ? 4 : 6);

  useEffect(() => {
    const handleResize = () => {
      setVisible(window.innerWidth < 768 ? 4 : 6);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const visible = 4;
  const goLeft = () => setStart((s) => (s - 1 + data.length) % data.length);
  const goRight = () => setStart((s) => (s + 1) % data.length);
  
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setDragStartX(clientX);
  };
  
  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const diff = dragStartX - clientX;
    if (diff > 50) {
      goRight();
      setIsDragging(false);
    } else if (diff < -50) {
      goLeft();
      setIsDragging(false);
    }
  };
  
  const handleDragEnd = () => setIsDragging(false);
  
  const slideWidth = 100 / visible;
  
  return (
    <Container
    textAlign="center"
    className="noselect"
    style={{ marginTop: "1rem", overflow: "hidden" }}
    >
    <div
    ref={containerRef}
    style={{
      display: "flex",
      width: `${(data.length * 100) / visible}%`,
      transform: `translateX(-${start * slideWidth}%)`,
      transition: "transform 0.2s ease-out",
      cursor: isDragging ? "grabbing" : "grab",
    }}
    onMouseDown={(e) => handleDragStart(e.clientX)}
    onMouseMove={(e) => handleDragMove(e.clientX)}
    onMouseUp={handleDragEnd}
    onMouseLeave={handleDragEnd}
    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
    onTouchEnd={handleDragEnd}
    >
    {data.map((item, i) => (
      <div
      key={i}
      style={{
        flex: `0 0 ${slideWidth}%`,
        padding: "0 8px",
        boxSizing: "border-box",
      }}
      >
      <div
      style={{
        width: "100%",
        aspectRatio: "9/16",
        overflow: "hidden",
        background: "#eee",
        position: "relative",
        maxHeight: "550px",
      }}
      >
      <h3 className="overlayCityName">
      {item.city}
      </h3>
      <img
      src={item.src}
      alt={`${item.city} ${item.year}`}
      onDragStart={(e) => e.preventDefault()}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      </div>
      </div>
    ))}
    </div>
    
    {/* Navigation */}
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
      marginTop: "2rem",
    }}
    >
    <Button icon onClick={goLeft}>
    <Icon name="angle left" />
    </Button>
    
    <div style={{ display: "flex", gap: "8px" }}>
    {Array.from({ length: data.length }).map((_, i) => (
      <div
      key={i}
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "black",
        opacity: i === start ? 1 : 0.3,
      }}
      />
    ))}
    </div>
    
    <Button icon onClick={goRight}>
    <Icon name="angle right" />
    </Button>
    </div>
    </Container>
  );
}
