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
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
      },
      lineHeight: {
        'extra-relaxed': '1.8',
        'super-relaxed': '2',
      },
      letterSpacing: {
        'warm': '0.01em',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.005em' }],
        'xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0em' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      ringColor: {
        focus: withOpacity('--focus-ring'),
      },
      ringOffsetColor: {
        surface: withOpacity('--bg'),
      },
      boxShadow: {
        focus: `0 0 0 var(--focus-ring-width) rgb(var(--focus-ring))`,
        'soft': '0 2px 8px rgba(var(--shadow-color))',
        'soft-lg': '0 4px 16px rgba(var(--shadow-color))',
        'soft-xl': '0 8px 24px rgba(var(--shadow-color))',
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
