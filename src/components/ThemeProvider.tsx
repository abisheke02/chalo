'use client';

import { createContext, useContext, useEffect, useCallback } from 'react';
import { ACTIVE_THEME } from '@/lib/theme-config';
import { THEMES, type ThemeId, type ThemeMode, type ThemeOption } from '@/lib/themes';

export { THEMES };
export type { ThemeId, ThemeMode, ThemeOption };

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: ACTIVE_THEME,
  setTheme: () => {},
  themes: THEMES,
});

/** Applies the theme to <html> via the data-theme attribute. */
function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  // Always set the attribute so the chosen theme (including the default) applies explicitly.
  root.setAttribute('data-theme', theme);
}

/**
 * `activeTheme` is resolved server-side (DB override via the /theme Apply
 * button, falling back to the hardcoded ACTIVE_THEME) and passed down from
 * the root layout — this component itself never picks a default.
 */
export default function ThemeProvider({ children, activeTheme }: { children: React.ReactNode; activeTheme?: ThemeId }) {
  const theme = activeTheme ?? ACTIVE_THEME;

  // Public site: always apply the backend-configured theme. No user override.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // setTheme is a no-op on the public site (theme is backend-controlled).
  const setTheme = useCallback((_t: ThemeId) => {
    /* public site theme is fixed — no-op */
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
