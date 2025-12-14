import { useEffect, useState, useRef } from "react";
import { Statistic } from "semantic-ui-react";

export default function AnimatedStat({
  value,
  text,
  duration = 1500,
  isFarsi = false
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [showInfinity, setShowInfinity] = useState(false);
  const statRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (hasAnimatedRef.current) return;

    const currentRef = statRef.current;
    if (!currentRef) return;

    if (value === -1) {
      setShowInfinity(true);
      setDisplayValue(0);
      hasAnimatedRef.current = true;
      return;
    }

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      
      const startTime = performance.now();

      const target = value;
      const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      function animate(time) {
        const raw = Math.min((time - startTime) / duration, 1);
        const eased = easeOutExpo(raw);
        setDisplayValue(Math.floor(eased * target));

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(target);
          if (value === -1) {
            setShowInfinity(true);
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Check if already visible
    const rect = currentRef.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      startAnimation();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [value, duration]);

  const toFarsiDigits = (str) => {
    const map = {
      '0': '۰',
      '1': '۱',
      '2': '۲',
      '3': '۳',
      '4': '۴',
      '5': '۵',
      '6': '۶',
      '7': '۷',
      '8': '۸',
      '9': '۹'
    };
    return String(str).replace(/\d/g, (d) => map[d] || d);
  };

  const numberText = displayValue.toLocaleString('en-US');
  const displayNumber = isFarsi ? toFarsiDigits(numberText) : numberText;
  const fontFamily = isFarsi ? 'farsi' : "'Tahoma', sans-serif";

  return (
    <div ref={statRef}>
      <Statistic size="small">
        <Statistic.Value style={{display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          {value === -1 ? (
            <>{showInfinity ? (
              <span style={{ fontFamily: 'sans-serif' }}>∞</span>
            ) : (
              <span style={{ fontFamily }}>{displayNumber}</span>
            )}</>
          ) : (
            <span style={{ fontFamily }}>{displayNumber}</span>
          )}
        </Statistic.Value>
        <Statistic.Label style={{ fontFamily: "farsi" }}>{text}</Statistic.Label>
      </Statistic>
    </div>
  );
}
