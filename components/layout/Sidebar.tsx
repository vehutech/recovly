'use client'

// components/layout/Sidebar.tsx

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { useTheme } from '@/components/layout/ThemeProvider'
import {
  LayoutDashboard,
  SearchX,
  PackageSearch,
  ListFilter,
  Bell,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

// ─────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────
type NavItem = {
  label: string
  href:  string
  icon:  React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',    icon: <LayoutDashboard size={18} /> },
  { label: 'Report Lost',  href: '/report-lost',  icon: <SearchX         size={18} /> },
  { label: 'Report Found', href: '/report-found', icon: <PackageSearch   size={18} /> },
  { label: 'My Items',     href: '/my-items',     icon: <ListFilter      size={18} /> },
  { label: 'Notifications',href: '/notifications',icon: <Bell            size={18} /> },
]

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        padding: '1.5rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        <Logo size="sm" />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 150ms ease',
                backgroundColor: isActive ? 'var(--color-accent-muted)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                border: `1px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.625rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: 'none',
            border: '1px solid transparent',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            width: '100%',
            transition: 'all 150ms ease',
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>

        <Link
          href="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.625rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: 'var(--color-text-secondary)',
            border: '1px solid transparent',
            transition: 'all 150ms ease',
          }}
        >
          <Settings size={18} />
          Settings
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.625rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: 'none',
            border: '1px solid transparent',
            cursor: 'pointer',
            color: 'var(--color-error)',
            width: '100%',
            transition: 'all 150ms ease',
          }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  )
}