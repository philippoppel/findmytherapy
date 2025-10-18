import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;
const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

const createPalette = (name: string) => {
  const palette: Record<string, string> = {
    DEFAULT: withOpacity(`--${name}`),
    foreground: withOpacity(`--${name}-foreground`),
    hover: withOpacity(`--${name}-hover`),
    active: withOpacity(`--${name}-active`),
  };

  shades.forEach((shade) => {
    palette[shade] = withOpacity(`--color-${name}-${shade}`);
  });

  return palette;
};

const colorConfig = {
  primary: createPalette('primary'),
  secondary: createPalette('secondary'),
  accent: createPalette('accent'),
  info: createPalette('info'),
  success: createPalette('success'),
  warning: createPalette('warning'),
  danger: createPalette('danger'),
  neutral: shades.reduce<Record<string, string>>((acc, shade) => {
    acc[shade] = withOpacity(`--color-neutral-${shade}`);
    return acc;
  }, { DEFAULT: withOpacity('--color-neutral-500') }),
  surface: {
    DEFAULT: withOpacity('--surface-1'),
    1: withOpacity('--surface-1'),
    2: withOpacity('--surface-2'),
    3: withOpacity('--surface-3'),
    bg: withOpacity('--surface-bg'),
    inverse: withOpacity('--surface-inverseSurface'),
    inverseBg: withOpacity('--surface-inverseBg'),
  },
  text: {
    DEFAULT: withOpacity('--text'),
    muted: withOpacity('--text-muted'),
    subtle: withOpacity('--text-subtle'),
    inverse: withOpacity('--token-text-inverse'),
    link: withOpacity('--link'),
  },
  border: {
    DEFAULT: withOpacity('--border'),
    strong: withOpacity('--border-strong'),
  },
  divider: {
    DEFAULT: withOpacity('--divider'),
  },
  focus: {
    ring: withOpacity('--focus-ring'),
  },
};

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './i18n/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '.theme-dark'],
  theme: {
    extend: {
      colors: colorConfig,
      ringColor: {
        focus: withOpacity('--focus-ring'),
      },
      ringOffsetColor: {
        surface: withOpacity('--bg'),
      },
      boxShadow: {
        focus: `0 0 0 var(--focus-ring-width) rgb(var(--focus-ring))`,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.bg-surface': {
          backgroundColor: 'rgb(var(--bg))',
        },
        '.bg-surface-1': {
          backgroundColor: 'rgb(var(--surface-1))',
        },
        '.bg-surface-2': {
          backgroundColor: 'rgb(var(--surface-2))',
        },
        '.bg-surface-3': {
          backgroundColor: 'rgb(var(--surface-3))',
        },
        '.text-default': {
          color: 'rgb(var(--text))',
        },
        '.text-muted': {
          color: 'rgb(var(--text-muted))',
        },
        '.text-subtle': {
          color: 'rgb(var(--text-subtle))',
        },
        '.text-link': {
          color: 'rgb(var(--link))',
        },
        '.text-primary-color': {
          color: 'rgb(var(--primary))',
        },
        '.border-divider': {
          borderColor: 'rgb(var(--divider))',
        },
        '.ring-focus': {
          '--tw-ring-color': 'rgb(var(--focus-ring))',
          '--tw-ring-offset-color': 'rgb(var(--bg))',
          '--tw-ring-offset-width': 'var(--focus-ring-offset)',
        },
      });
    }),
  ],
};

export default config;
