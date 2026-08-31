import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
  isDark: boolean;
  isHighContrast: boolean;
  isLight: boolean;
}

const THEME_STORAGE_KEY = 'talentio_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'high-contrast')) {
        return saved;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('high-contrast');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Clean previous theme classes
    root.classList.remove('light', 'dark', 'high-contrast', 'theme-light', 'theme-dark', 'theme-high-contrast');
    body.classList.remove('light', 'dark', 'high-contrast', 'theme-light', 'theme-dark', 'theme-high-contrast');

    // Add new theme class & data attributes
    root.classList.add(theme);
    root.classList.add(`theme-${theme}`);
    body.classList.add(theme);
    body.classList.add(`theme-${theme}`);
    root.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browser address bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (theme === 'high-contrast') {
        metaThemeColor.setAttribute('content', '#000000');
      } else if (theme === 'dark') {
        metaThemeColor.setAttribute('content', '#0F0B1E');
      } else {
        metaThemeColor.setAttribute('content', '#1A1633');
      }
    }
  }, [theme]);

  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high-contrast';
  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        cycleTheme,
        isDark,
        isHighContrast,
        isLight
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
