'use client';

import * as React from 'react';

type ThemeName = 'theme-light' | 'theme-dark' | 'theme-simple';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  resetToSystem: () => void;
  userPreference: ThemeName | null;
  themes: ThemeName[];
}

const STORAGE_KEY = 'mental-health-theme';
const THEME_CLASSES: ThemeName[] = ['theme-light', 'theme-dark', 'theme-simple'];

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'theme-dark'
    : 'theme-light';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = React.useState<ThemeName>('theme-light');
  const [userPreference, setUserPreference] = React.useState<ThemeName | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && THEME_CLASSES.includes(stored)) {
      setThemeState(stored);
      setUserPreference(stored);
      return;
    }

    // Standard: immer hell, unabhängig von System-Präferenz
    setThemeState('theme-light');

    // System-Präferenz-Listener entfernt - Nutzer muss explizit Dark Mode wählen
  }, [userPreference]);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove(...THEME_CLASSES);
    root.classList.add(theme);
    root.dataset.theme = theme.replace('theme-', '');
  }, [theme]);

  const setTheme = React.useCallback((nextTheme: ThemeName) => {
    if (typeof window === 'undefined') {
      return;
    }
    setThemeState(nextTheme);
    setUserPreference(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }, []);

  const resetToSystem = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setUserPreference(null);
    setThemeState(getSystemTheme());
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resetToSystem,
      userPreference,
      themes: THEME_CLASSES,
    }),
    [theme, setTheme, resetToSystem, userPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
