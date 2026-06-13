import { createContext, useContext, useEffect, useState } from 'react';
import { triggerCloudSync } from '../hooks/useCloudSync';

interface ThemeContextType {
  isDark: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const pref = localStorage.getItem('theme');
      // Default to dark mode unless pref is explicitly 'light'
      const dark = pref !== 'light';
      if (dark) document.documentElement.classList.add('dark');
      return dark;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const prev = localStorage.getItem('theme');
    const next = isDark ? 'dark' : 'light';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', next);
    if (prev !== next) {
      triggerCloudSync();
    }
  }, [isDark]);

  useEffect(() => {
    const handleStorageChange = () => {
      const pref = localStorage.getItem('theme');
      setIsDark(pref !== 'light');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, theme: isDark ? "dark" : "light", toggleTheme: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
