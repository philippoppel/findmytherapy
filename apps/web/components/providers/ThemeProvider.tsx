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

const STORAGE_KEY = 'mental-health-theme:v2';
const THEME_CLASSES: ThemeName[] = ['theme-light', 'theme-dark', 'theme-simple'];

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): ThemeName =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'theme-dark'
    : 'theme-light';

const getDocumentTheme = (): ThemeName => {
  if (typeof document === 'undefined') {
    return 'theme-light';
  }

  const datasetValue = document.documentElement.dataset.theme;

  if (datasetValue === 'dark') {
    return 'theme-dark';
  }
  if (datasetValue === 'simple') {
    return 'theme-simple';
  }

  const htmlClassMatch = THEME_CLASSES.find((themeName) =>
    document.documentElement.classList.contains(themeName),
  );

  if (htmlClassMatch) {
    return htmlClassMatch;
  }

  const bodyClassMatch = THEME_CLASSES.find((themeName) =>
    document.body.classList.contains(themeName),
  );

  return bodyClassMatch ?? 'theme-light';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const resolveStoredTheme = () => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (stored && THEME_CLASSES.includes(stored)) {
        return stored;
      }
    } catch (error) {
      return null;
    }

    return null;
  };

  const storedTheme = resolveStoredTheme();

  const [theme, setThemeState] = React.useState<ThemeName>(() => storedTheme ?? getDocumentTheme());
  const [userPreference, setUserPreference] = React.useState<ThemeName | null>(storedTheme);
  const [isReady, setIsReady] = React.useState(false);
  const userPreferenceRef = React.useRef<ThemeName | null>(storedTheme);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = resolveStoredTheme();

    if (stored) {
      setThemeState(stored);
      setUserPreference(stored);
      userPreferenceRef.current = stored;
    } else {
      setThemeState(getSystemTheme());
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (userPreferenceRef.current) {
        return;
      }
      setThemeState(event.matches ? 'theme-dark' : 'theme-light');
    };

    media.addEventListener('change', handleChange);
    setIsReady(true);
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  React.useEffect(() => {
    userPreferenceRef.current = userPreference;
  }, [userPreference]);

  React.useEffect(() => {
    if (typeof document === 'undefined' || !isReady) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    root.classList.remove(...THEME_CLASSES);
    body.classList.remove(...THEME_CLASSES);
    root.classList.add(theme);
    body.classList.add(theme);
    const themeName = theme.replace('theme-', '');
    root.dataset.theme = themeName;
    body.dataset.theme = themeName;
  }, [theme, isReady]);

  const setTheme = React.useCallback((nextTheme: ThemeName) => {
    if (typeof window === 'undefined') {
      return;
    }
    setThemeState(nextTheme);
    setUserPreference(nextTheme);
    userPreferenceRef.current = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }, []);

  const resetToSystem = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setUserPreference(null);
    userPreferenceRef.current = null;
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
