import { useEffect, useState, useRef } from "react";
import { Statistic } from "semantic-ui-react";

export default function AnimatedStat({
  value,
  text,
  duration = 1500
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const statRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (value === -1 || hasAnimatedRef.current) return;

    const currentRef = statRef.current;
    if (!currentRef) return;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      
      const startTime = performance.now();

      const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      function animate(time) {
        const raw = Math.min((time - startTime) / duration, 1);
        const eased = easeOutExpo(raw);
        setDisplayValue(Math.floor(eased * value));

        if (raw < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    };

    // Check if already visible
    const rect = currentRef.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <div ref={statRef}>
      <Statistic size="small">
        <Statistic.Value style={{ fontFamily: "'Tahoma', sans-serif" }}>
          {value === -1 ? "∞" : displayValue}
        </Statistic.Value>
        <Statistic.Label style={{ fontFamily: "farsi" }}>{text}</Statistic.Label>
      </Statistic>
    </div>
  );
}
