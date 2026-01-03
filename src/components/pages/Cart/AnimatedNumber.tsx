import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  formatter?: (v: number) => string;
  className?: string;
};

export function AnimatedNumber({
  value,
  formatter = (v: number) => `${v.toFixed(2)}$`,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const delta = value - start;
    const duration = 320;
    let frame: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(start + delta * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        previous.current = value;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{formatter(display)}</span>;
}
