// components/layout/AppShell.tsx

import { Sidebar } from '@/components/layout/Sidebar'

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: '2.5rem 2rem',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}