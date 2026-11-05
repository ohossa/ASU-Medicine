import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { trackPageView } from "../lib/analytics";

/**
 * Hook to automatically track pageviews on route transitions in React Router.
 */
export function usePageTracking(): void {
  const location = useLocation();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (lastTracked.current === currentPath) return;

    lastTracked.current = currentPath;
    
    // Give document.title a tick to update if the route sets it synchronously
    const timer = setTimeout(() => {
      trackPageView(currentPath, document.title);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);
}
