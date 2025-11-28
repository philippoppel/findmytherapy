'use client';

import { useTheme } from '../providers/ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type ThemeName = 'theme-light' | 'theme-dark' | 'theme-simple';

export function ThemeToggle() {
  const { theme, setTheme, resetToSystem, userPreference } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: ThemeName | 'system'; icon: typeof Sun; label: string }[] = [
    { value: 'theme-light', icon: Sun, label: 'Hell' },
    { value: 'theme-dark', icon: Moon, label: 'Dunkel' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const CurrentIcon = theme === 'theme-dark' ? Moon : Sun;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-muted transition-colors hover:bg-surface-3 hover:text-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Theme ändern"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-divider bg-surface-1 p-1 shadow-lg">
          {options.map((option) => {
            const isActive = option.value === 'system'
              ? userPreference === null
              : userPreference === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (option.value === 'system') {
                    resetToSystem();
                  } else {
                    setTheme(option.value);
                  }
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-muted hover:bg-surface-2 hover:text-default'
                }`}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
