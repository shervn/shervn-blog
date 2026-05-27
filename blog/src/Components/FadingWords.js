import { useState, useEffect } from "react";

const BLUR_DURATION = 750;

export default function FadingWords({ words }) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase("blur-out");
      setTimeout(() => {
        setCurrent(i => (i + 1) % words.length);
        setPhase("blur-in");
        setTimeout(() => setPhase("idle"), BLUR_DURATION);
      }, BLUR_DURATION);
    }, 2000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <span className="fading-word-outer">
      {words.map((word, i) => (
        <span
          key={i}
          className={i === current ? `fading-word-active ${phase}` : "fading-word-inactive"}
          aria-hidden={i !== current}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
