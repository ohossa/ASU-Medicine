import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { triggerCloudSync } from '../hooks/useCloudSync';
import { STARLIGHT_STORAGE_KEY } from '../config/secretThemes';
export { ThemeContext } from './ThemeContextValue';
import { ThemeContext } from './ThemeContextValue';

function readTheme() {
  try {
    if (typeof window !== "undefined" && window.location.search.includes("theme=light")) return false;
    return localStorage.getItem('theme') !== 'light';
  }
  catch { return true; }
}

function readStarlight() {
  try {
    return localStorage.getItem(STARLIGHT_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function applyTheme(dark: boolean, starlight: boolean) {
  document.documentElement.classList.toggle('theme-starlight', starlight);
  // Starlight operates on top of dark mode foundation
  const effectiveDark = starlight || dark;
  document.documentElement.classList.toggle('dark', effectiveDark);
  document.documentElement.style.colorScheme = effectiveDark ? 'dark' : 'light';
  
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (metaColor) {
    const color = starlight ? '#0c071d' : effectiveDark ? '#0c0e16' : '#f8f9fc';
    metaColor.setAttribute('content', color);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => readTheme());
  const [isStarlight, setIsStarlight] = useState(() => readStarlight());

  useLayoutEffect(() => {
    applyTheme(isDark, isStarlight);
    try {
      const prevTheme = localStorage.getItem('theme');
      const nextTheme = isDark ? 'dark' : 'light';
      localStorage.setItem('theme', nextTheme);

      const prevStarlight = localStorage.getItem(STARLIGHT_STORAGE_KEY) === 'true';
      localStorage.setItem(STARLIGHT_STORAGE_KEY, String(isStarlight));

      if (prevTheme !== nextTheme || prevStarlight !== isStarlight) {
        triggerCloudSync();
      }
    } catch {
      /* Private/storage-restricted browsers fallback gracefully */
    }
  }, [isDark, isStarlight]);

  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.key === 'theme' || event.key === null) {
        setIsDark(readTheme());
      }
      if (event.key === STARLIGHT_STORAGE_KEY || event.key === null) {
        setIsStarlight(readStarlight());
      }
    };
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(d => !d);
  }, []);

  const toggleStarlight = useCallback(() => {
    setIsStarlight(s => !s);
  }, []);

  const setStarlight = useCallback((active: boolean) => {
    setIsStarlight(active);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme: isDark ? 'dark' : 'light',
        toggleTheme,
        isStarlight,
        toggleStarlight,
        setStarlight,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
