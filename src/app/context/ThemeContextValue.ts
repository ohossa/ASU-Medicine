import { createContext } from 'react';

interface ThemeContextType {
  isDark: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: "dark",
  toggleTheme: () => {},
});