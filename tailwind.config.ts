// tailwind.config.ts
// Tailwind v4: colors and content scanning are in globals.css via @theme and @source
// This file only extends grid columns and spacing

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  theme: {
    extend: {
      gridTemplateColumns: {
        'thirds':     'repeat(3, minmax(0, 1fr))',
        'two-thirds': '2fr 1fr',
        'one-thirds': '1fr 2fr',
        'sidebar':    '280px 1fr',
        'sidebar-sm': '72px 1fr',
      },
      spacing: {
        sidebar:             '280px',
        'sidebar-collapsed': '72px',
        header:              '64px',
      },
    },
  },
  plugins: [],
}

export default config