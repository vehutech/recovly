// app/dashboard/page.tsx

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/components/layout/AppShell'
import { ItemStatusBadge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/Button'
import { SearchX, PackageSearch, GitMerge, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

type StatCardProps = {
  label:  string
  value:  number
  icon:   React.ReactNode
  accent: string
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '1rem',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>{label}</p>
        <div style={{
          width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
          backgroundColor: accent, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--color-text)', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userId = session.user.id

  const [
    totalLost,
    totalFound,
    totalMatches,
    totalRecovered,
    recentLostItems,
    recentMatches,
  ] = await Promise.all([
    prisma.lostItem.count({ where: { userId } }),
    prisma.foundItem.count({ where: { userId } }),
    prisma.match.count({
      where: { OR: [{ lostItem: { userId } }, { foundItem: { userId } }] },
    }),
    prisma.lostItem.count({ where: { userId, status: 'RECOVERED' } }),
    prisma.lostItem.findMany({
      where:   { userId },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, role: true,
            avatarUrl: true, phone: true, department: true,
            studentId: true, isActive: true, emailVerified: true,
            createdAt: true, updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take:    5,
    }),
    prisma.match.findMany({
      where: { OR: [{ lostItem: { userId } }, { foundItem: { userId } }] },
      include: {
        lostItem:  true,
        foundItem: true,
        claim:     true,
      },
      orderBy: { score: 'desc' },
      take:    5,
    }),
  ])

  return (
    <AppShell>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
          Welcome back, {session.user.name?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Here's what's happening with your items
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <StatCard label="Lost Items"  value={totalLost}      icon={<SearchX       size={16} />} accent="var(--color-error)"   />
        <StatCard label="Found Items" value={totalFound}     icon={<PackageSearch size={16} />} accent="var(--color-info)"    />
        <StatCard label="Matches"     value={totalMatches}   icon={<GitMerge      size={16} />} accent="var(--color-warning)" />
        <StatCard label="Recovered"   value={totalRecovered} icon={<CheckCircle   size={16} />} accent="var(--color-success)" />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <LinkButton href="/report-lost"  variant="primary"   size="md">Report Lost Item</LinkButton>
        <LinkButton href="/report-found" variant="secondary" size="md">Report Found Item</LinkButton>
      </div>

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

        {/* Recent lost items */}
        <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>Recent Lost Items</h2>
            <LinkButton href="/my-items" variant="ghost" size="sm">View all</LinkButton>
          </div>
          {recentLostItems.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No lost items yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentLostItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem', borderRadius: '0.625rem',
                  backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)',
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.location}</p>
                  </div>
                  <ItemStatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent matches */}
        <section style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>Recent Matches</h2>
            <LinkButton href="/my-items" variant="ghost" size="sm">View all</LinkButton>
          </div>
          {recentMatches.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No matches yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentMatches.map((match) => (
                <div key={match.id} style={{
                  padding: '0.75rem', borderRadius: '0.625rem',
                  backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                      {match.lostItem.name}
                    </p>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      color: match.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
                    }}>
                      {Math.round(match.score)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Matched with: {match.foundItem.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </AppShell>
  )
}