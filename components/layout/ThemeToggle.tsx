'use client'

// components/layout/ThemeToggle.tsx

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: 'var(--color-surface-val)',
        borderColor:     'var(--color-border-val)',
        color:           'var(--color-text-secondary-val)',
      }}
    >
      {theme === 'light'
        ? <Moon className="h-4 w-4" />
        : <Sun  className="h-4 w-4" />
      }
    </button>
  )
}