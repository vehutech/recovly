// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:             'var(--color-bg)',
        surface:        'var(--color-surface)',
        sunken:         'var(--color-sunken)',
        border:         'var(--color-border)',
        'border-strong':'var(--color-border-strong)',
        text: {
          DEFAULT:      'var(--color-text)',
          secondary:    'var(--color-text-secondary)',
          muted:        'var(--color-text-muted)',
          inverse:      'var(--color-text-inverse)',
          'on-accent':  'var(--color-text-on-accent)',
        },
        accent: {
          DEFAULT:      'var(--color-accent)',
          hover:        'var(--color-accent-hover)',
          muted:        'var(--color-accent-muted)',
        },
        accent2: {
          DEFAULT:      'var(--color-accent-2)',
          hover:        'var(--color-accent-2-hover)',
          muted:        'var(--color-accent-2-muted)',
        },
        accent3: {
          DEFAULT:      'var(--color-accent-3)',
          hover:        'var(--color-accent-3-hover)',
          muted:        'var(--color-accent-3-muted)',
        },
        success: {
          DEFAULT:      'var(--color-success)',
          muted:        'var(--color-success-muted)',
        },
        warning: {
          DEFAULT:      'var(--color-warning)',
          muted:        'var(--color-warning-muted)',
        },
        error: {
          DEFAULT:      'var(--color-error)',
          muted:        'var(--color-error-muted)',
        },
        info: {
          DEFAULT:      'var(--color-info)',
          muted:        'var(--color-info-muted)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl': ['3rem',     { lineHeight: '1.1' }],
        '6xl': ['3.75rem',  { lineHeight: '1.1' }],
        '7xl': ['4.5rem',   { lineHeight: '1' }],
      },
      borderRadius: {
        none:  '0',
        xs:    '0.125rem',
        sm:    '0.25rem',
        md:    '0.375rem',
        lg:    '0.5rem',
        xl:    '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full:  '9999px',
      },
      boxShadow: {
        xs:  'var(--shadow-sm)',
        sm:  'var(--shadow-sm)',
        md:  'var(--shadow-md)',
        lg:  'var(--shadow-lg)',
      },
      spacing: {
        sidebar:             '280px',
        'sidebar-collapsed': '72px',
        header:              '64px',
      },
      gridTemplateColumns: {
        'thirds':    'repeat(3, minmax(0, 1fr))',
        'two-thirds':'2fr 1fr',
        'one-thirds':'1fr 2fr',
        'sidebar':   '280px 1fr',
        'sidebar-sm':'72px 1fr',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in':  'fade-in 200ms ease forwards',
        'slide-in': 'slide-in 250ms ease forwards',
        'scale-in': 'scale-in 200ms ease forwards',
        shimmer:    'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}

export default config