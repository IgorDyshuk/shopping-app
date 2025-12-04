import { useEffect, useState } from "react";

// Returns true when viewport width is below the given breakpoint (px).
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    // Set initial value and subscribe
    handler(mediaQuery);
    mediaQuery.addEventListener("change", handler as EventListener);

    return () => {
      mediaQuery.removeEventListener("change", handler as EventListener);
    };
  }, [breakpoint]);

  return isMobile;
}
