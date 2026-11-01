import { createContext } from 'react';

export interface ThemeContextType {
  isDark: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  isStarlight: boolean;
  toggleStarlight: () => void;
  setStarlight: (active: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: "dark",
  toggleTheme: () => {},
  isStarlight: false,
  toggleStarlight: () => {},
  setStarlight: () => {},
});
