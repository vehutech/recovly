'use client'

// components/ui/Badge.tsx

import { cn } from '@/lib/cn'
import type { ItemStatus, MatchStatus, ClaimStatus } from '@/types'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'
type BadgeSize    = 'sm' | 'md'

type BadgeProps = {
  children:   React.ReactNode
  variant?:   BadgeVariant | undefined
  size?:      BadgeSize    | undefined
  className?: string       | undefined
}

// ─────────────────────────────────────────────
// VARIANT STYLES
// ─────────────────────────────────────────────
const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  default: { backgroundColor: 'var(--color-surface)',       color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' },
  success: { backgroundColor: 'var(--color-success-muted)', color: 'var(--color-success)',        border: '1px solid var(--color-success)' },
  warning: { backgroundColor: 'var(--color-warning-muted)', color: 'var(--color-warning)',        border: '1px solid var(--color-warning)' },
  error:   { backgroundColor: 'var(--color-error-muted)',   color: 'var(--color-error)',          border: '1px solid var(--color-error)'   },
  info:    { backgroundColor: 'var(--color-info-muted)',    color: 'var(--color-info)',           border: '1px solid var(--color-info)'    },
  accent:  { backgroundColor: 'var(--color-accent-muted)',  color: 'var(--color-accent)',         border: '1px solid var(--color-accent)'  },
}

const SIZE_STYLES: Record<BadgeSize, React.CSSProperties> = {
  sm: { fontSize: '0.6875rem', padding: '0.125rem 0.5rem',  borderRadius: '9999px', fontWeight: 600 },
  md: { fontSize: '0.75rem',   padding: '0.1875rem 0.625rem', borderRadius: '9999px', fontWeight: 600 },
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center whitespace-nowrap', className)}
      style={{ ...VARIANT_STYLES[variant], ...SIZE_STYLES[size] }}
    >
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────
// STATUS BADGE HELPERS
// ─────────────────────────────────────────────
const ITEM_STATUS_MAP: Record<ItemStatus, { label: string; variant: BadgeVariant }> = {
  ACTIVE:    { label: 'Active',    variant: 'info'    },
  MATCHED:   { label: 'Matched',   variant: 'warning' },
  CLAIMED:   { label: 'Claimed',   variant: 'accent'  },
  RECOVERED: { label: 'Recovered', variant: 'success' },
  CLOSED:    { label: 'Closed',    variant: 'default' },
}

const MATCH_STATUS_MAP: Record<MatchStatus, { label: string; variant: BadgeVariant }> = {
  PENDING:   { label: 'Pending',   variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'success' },
  REJECTED:  { label: 'Rejected',  variant: 'error'   },
}

const CLAIM_STATUS_MAP: Record<ClaimStatus, { label: string; variant: BadgeVariant }> = {
  PENDING:  { label: 'Pending',  variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'error'   },
}

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const { label, variant } = ITEM_STATUS_MAP[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const { label, variant } = MATCH_STATUS_MAP[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const { label, variant } = CLAIM_STATUS_MAP[status]
  return <Badge variant={variant}>{label}</Badge>
}