'use client';

import { Button } from '@mental-health/ui';
import { useTheme } from '../providers/ThemeProvider';

const OPTIONS = [
  { value: 'theme-light', label: 'Hell' },
  { value: 'theme-dark', label: 'Dunkel' },
  { value: 'theme-simple', label: 'Simple' },
] as const;

type ThemeName = (typeof OPTIONS)[number]['value'];

export const ThemeSwitcher = () => {
  const { theme, setTheme, resetToSystem } = useTheme();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-full border border-strong bg-surface-1 p-1 shadow-sm">
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={theme === option.value ? 'primary' : 'ghost'}
            onClick={() => setTheme(option.value as ThemeName)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <Button type="button" size="sm" variant="outline" onClick={resetToSystem}>
        System folgen
      </Button>
    </div>
  );
};
