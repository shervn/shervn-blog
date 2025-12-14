import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Container, Icon, Image } from "semantic-ui-react";
import { TRAIN_VISIBLE_DESKTOP, TRAIN_VISIBLE_MOBILE, TRAIN_MOBILE_BREAKPOINT } from "../utils/constants.js";
import { debounce } from "../utils/debounce.js";

export default function TrainComponent() {
  const [start, setStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [traindata, setTraindata] = useState([]);
  const containerRef = useRef();

  // Load data from JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/traindata.json`);
        const jsonData = await response.json();
        setTraindata(jsonData);
      } catch (error) {
        console.error('Error loading train data:', error);
      }
    };
    loadData();
  }, []);
  
  const [visible, setVisible] = useState(
    typeof window !== "undefined" && window.innerWidth < TRAIN_MOBILE_BREAKPOINT ? TRAIN_VISIBLE_MOBILE : TRAIN_VISIBLE_DESKTOP);
    
    // Debounced resize handler for better performance
    const handleResize = useMemo(
      () => debounce(() => {
        setVisible(window.innerWidth < TRAIN_MOBILE_BREAKPOINT ? TRAIN_VISIBLE_MOBILE : TRAIN_VISIBLE_DESKTOP);
      }, 150),
      []
    );
    
    useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        handleResize.cancel?.();
      };
    }, [handleResize]);
    
    const goLeft = useCallback(() => setStart((s) => (s - 1 + traindata.length) % traindata.length), [traindata.length]);
    const goRight = useCallback(() => setStart((s) => (s + 1) % traindata.length), [traindata.length]);
    
    const handleDragStart = useCallback((clientX) => {
      setIsDragging(true);
      setDragStartX(clientX);
    }, []);
    
    const handleDragMove = useCallback((clientX) => {
      if (!isDragging) return;
      const diff = dragStartX - clientX;
      if (diff > 50) {
        goRight();
        setIsDragging(false);
      } else if (diff < -50) {
        goLeft();
        setIsDragging(false);
      }
    }, [isDragging, dragStartX, goLeft, goRight]);
    
    const handleDragEnd = useCallback(() => setIsDragging(false), []);
    
    const handleKeyDown = useCallback((e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goRight();
      }
    }, [goLeft, goRight]);
    
    const slideWidth = 100 / visible;
    
    return (
      <Container
      textAlign="center"
      className="noselect train-container"
      role="region"
      aria-label="Photo gallery carousel"
      >
      <div
      ref={containerRef}
      className={`train-slider ${isDragging ? 'dragging' : ''}`}
      style={{
        width: `${(traindata.length * 100) / visible}%`,
        transform: `translateX(-${start * slideWidth}%)`,
      }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label={`Slide ${start + 1} of ${traindata.length}`}
      >
      {traindata.map((item, i) => (
        <div
        key={i}
        className="train-slide"
        style={{
          flex: `0 0 ${slideWidth}%`,
        }}
        >
          <div className="train-image-wrapper">
            <Image
            src={item.path}
            alt={`${item.city.en}`}
            onDragStart={(e) => e.preventDefault()}
            className="train-image"
              />
            <div className="overlayCityName">
              <div>{item.city.en}</div>
              <div>{item.city.fa}</div>
            </div>
          </div>
        </div>
        ))}
        </div>
        
        <div className="train-pagination" role="group" aria-label="Carousel navigation">
        <button 
          type="button"
          className="blog-pagination-button"
          onClick={goLeft}
          aria-label="Previous slide"
          tabIndex={0}
        >
        <Icon name="angle left" />
        </button>
        
        <div className="train-pagination-dots" role="tablist" aria-label="Slide indicators">
        {Array.from({ length: traindata.length }).map((_, i) => (
          <div
          key={i}
          className={`train-pagination-dot ${i === start ? 'active' : ''}`}
          role="tab"
          aria-selected={i === start}
          aria-label={`Go to slide ${i + 1}`}
          tabIndex={i === start ? 0 : -1}
          onClick={() => setStart(i)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStart(i);
            }
          }}
          />
        ))}
        </div>
        
        <button 
          type="button"
          className="blog-pagination-button"
          onClick={goRight}
          aria-label="Next slide"
          tabIndex={0}
        >
        <Icon name="angle right" />
        </button>
        </div>
        </Container>
      );
    }
    