// tailwind.config.ts
// In Tailwind v4, color tokens are defined in globals.css via @theme
// This file handles content paths, custom grid columns and animations only

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'thirds':    'repeat(3, minmax(0, 1fr))',
        'two-thirds':'2fr 1fr',
        'one-thirds':'1fr 2fr',
        'sidebar':   '280px 1fr',
        'sidebar-sm':'72px 1fr',
      },
      spacing: {
        sidebar:             '280px',
        'sidebar-collapsed': '72px',
        header:              '64px',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 200ms ease forwards',
        'scale-in': 'scale-in 200ms ease forwards',
      },
    },
  },
  plugins: [],
}

export default config