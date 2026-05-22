'use client'

// app/my-items/page.tsx

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ItemStatusBadge, MatchStatusBadge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/Button'
import type { LostItemWithUser, FoundItemWithUser, MatchWithItems, PaginatedResponse, ApiResponse } from '@/types'

// ─────────────────────────────────────────────
// TAB TYPE
// ─────────────────────────────────────────────
type Tab = 'lost' | 'found' | 'matches'

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState({ message, actionHref, actionLabel }: { message: string; actionHref: string; actionLabel: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{message}</p>
      <LinkButton href={actionHref} variant="primary" size="sm">{actionLabel}</LinkButton>
    </div>
  )
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function MyItemsPage() {
  const [activeTab, setActiveTab]   = useState<Tab>('lost')
  const [lostItems, setLostItems]   = useState<LostItemWithUser[]>([])
  const [foundItems, setFoundItems] = useState<FoundItemWithUser[]>([])
  const [matches, setMatches]       = useState<MatchWithItems[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [lostRes, foundRes, matchRes] = await Promise.all([
          fetch('/api/lost-items'),
          fetch('/api/found-items'),
          fetch('/api/matches'),
        ])
        const [lostData, foundData, matchData] = await Promise.all([
          lostRes.json()  as Promise<ApiResponse<PaginatedResponse<LostItemWithUser>>>,
          foundRes.json() as Promise<ApiResponse<PaginatedResponse<FoundItemWithUser>>>,
          matchRes.json() as Promise<ApiResponse<PaginatedResponse<MatchWithItems>>>,
        ])
        if (lostData.success)  setLostItems(lostData.data.data)
        if (foundData.success) setFoundItems(foundData.data.data)
        if (matchData.success) setMatches(matchData.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    void fetchAll()
  }, [])

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'lost',    label: 'Lost Items',  count: lostItems.length  },
    { key: 'found',   label: 'Found Items', count: foundItems.length },
    { key: 'matches', label: 'Matches',     count: matches.length    },
  ]

  return (
    <AppShell>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
          My Items
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Track all your reported items and matches
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--color-accent)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              marginBottom: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {tab.label}
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '0.125rem 0.4rem',
              borderRadius: '9999px',
              backgroundColor: activeTab === tab.key ? 'var(--color-accent-muted)' : 'var(--color-surface)',
              color: activeTab === tab.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '4rem', borderRadius: '0.75rem' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Lost Items Tab */}
          {activeTab === 'lost' && (
            lostItems.length === 0
              ? <EmptyState message="You haven't reported any lost items yet." actionHref="/report-lost" actionLabel="Report a lost item" />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {lostItems.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1rem 1.25rem', borderRadius: '0.75rem',
                      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    }}>
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem' }}>{item.name}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          {item.category} · {item.location} · Lost {new Date(item.dateLost).toLocaleDateString()}
                        </p>
                      </div>
                      <ItemStatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
              )
          )}

          {/* Found Items Tab */}
          {activeTab === 'found' && (
            foundItems.length === 0
              ? <EmptyState message="You haven't reported any found items yet." actionHref="/report-found" actionLabel="Report a found item" />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {foundItems.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1rem 1.25rem', borderRadius: '0.75rem',
                      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    }}>
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.2rem' }}>{item.name}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          {item.category} · {item.location} · Found {new Date(item.dateFound).toLocaleDateString()}
                        </p>
                      </div>
                      <ItemStatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
              )
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            matches.length === 0
              ? <EmptyState message="No matches found yet. Keep checking back." actionHref="/report-lost" actionLabel="Report a lost item" />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {matches.map((match) => (
                    <div key={match.id} style={{
                      padding: '1rem 1.25rem', borderRadius: '0.75rem',
                      backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>
                            {match.lostItem.name}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>↔</span>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>
                            {match.foundItem.name}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.8125rem', fontWeight: 700,
                            color: match.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
                          }}>
                            {Math.round(match.score)}% match
                          </span>
                          <MatchStatusBadge status={match.status} />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        {match.lostItem.location} · {new Date(match.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )
          )}
        </>
      )}
    </AppShell>
  )
}