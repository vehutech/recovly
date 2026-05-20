// app/page.tsx

import { Logo } from '@/components/ui/Logo'
import { LinkButton } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Search, Bell, ShieldCheck } from 'lucide-react'

// ─────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────
type FeatureCardProps = {
  icon:        React.ReactNode
  title:       string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="flex flex-col gap-5 rounded-2xl p-7 border"
      style={{
        backgroundColor: 'var(--color-surface-val)',
        borderColor:     'var(--color-border-val)',
        boxShadow:       '0 2px 8px rgba(28,21,16,0.05)',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: 'var(--color-accent-muted-val)',
          color:           'var(--color-accent-val)',
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3
          className="text-base font-bold leading-tight"
          style={{ color: 'var(--color-text-val)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary-val)' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-val)' }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'var(--color-surface-val)',
          borderColor:     'var(--color-border-val)',
        }}
      >
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LinkButton variant="ghost" size="sm" href="/login">
              Sign in
            </LinkButton>
            <LinkButton size="sm" href="/register">
              Get started
            </LinkButton>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-8">
            <div>
              <span
                className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border mb-6"
                style={{
                  backgroundColor: 'var(--color-accent-muted-val)',
                  color:           'var(--color-accent-val)',
                  borderColor:     'var(--color-accent-val)',
                }}
              >
                Campus Property Recovery
              </span>

              <h1
                className="font-black tracking-tighter leading-[1.0]"
                style={{
                  fontSize: 'clamp(2.75rem, 5vw, 4.25rem)',
                  color:    'var(--color-text-val)',
                }}
              >
                Lost something<br />
                on campus?
              </h1>
            </div>

            <p
              className="text-lg leading-relaxed max-w-md"
              style={{ color: 'var(--color-text-secondary-val)' }}
            >
              recovly automatically matches lost items with found ones.
              Report in seconds, get notified the moment there's a match.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <LinkButton size="xl" href="/register">
                Report a lost item
              </LinkButton>
              <LinkButton size="xl" variant="secondary" href="/register">
                I found something
              </LinkButton>
            </div>
          </div>

          {/* Right — visual block */}
          <div className="flex items-center justify-center py-16">
            <div className="relative w-52 h-52">
              {/* Main accent square */}
              <div
                className="w-52 h-52 rounded-3xl flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-accent-val)',
                  boxShadow:       '0 32px 80px rgba(196,75,43,0.25)',
                }}
              >
                <Logo size="xl" showText={false} />
              </div>

              {/* Stat — bottom left */}
              <div
                className="absolute -bottom-8 -left-14 rounded-2xl px-5 py-3.5 border"
                style={{
                  backgroundColor: 'var(--color-bg-val)',
                  borderColor:     'var(--color-border-val)',
                  boxShadow:       '0 8px 32px rgba(28,21,16,0.10)',
                }}
              >
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: 'var(--color-text-muted-val)' }}
                >
                  Items recovered
                </p>
                <p
                  className="text-2xl font-black leading-none"
                  style={{ color: 'var(--color-accent-val)' }}
                >
                  94%
                </p>
              </div>

              {/* Stat — top right */}
              <div
                className="absolute -top-8 -right-14 rounded-2xl px-5 py-3.5 border"
                style={{
                  backgroundColor: 'var(--color-bg-val)',
                  borderColor:     'var(--color-border-val)',
                  boxShadow:       '0 8px 32px rgba(28,21,16,0.10)',
                }}
              >
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: 'var(--color-text-muted-val)' }}
                >
                  Match accuracy
                </p>
                <p
                  className="text-2xl font-black leading-none"
                  style={{ color: 'var(--color-accent3-val)' }}
                >
                  98%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div
          className="h-px w-full"
          style={{ backgroundColor: 'var(--color-border-val)' }}
        />
      </div>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-8 py-24 w-full">
        <div className="mb-14">
          <h2
            className="text-4xl font-black tracking-tighter mb-4"
            style={{ color: 'var(--color-text-val)' }}
          >
            How it works
          </h2>
          <p
            className="text-base leading-relaxed max-w-md"
            style={{ color: 'var(--color-text-secondary-val)' }}
          >
            A simple, fast, and transparent process for recovering lost campus property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Search className="h-5 w-5" />}
            title="Report & match"
            description="Submit a lost or found item. Our engine automatically scores and matches items based on name, description, color, location, and date."
          />
          <FeatureCard
            icon={<Bell className="h-5 w-5" />}
            title="Get notified"
            description="Receive instant in-app and email notifications the moment a match is found for your item. No manual checking required."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Verified recovery"
            description="Submit a claim with proof. Campus admins verify ownership and approve the handover — secure and accountable throughout."
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t mt-auto"
        style={{
          backgroundColor: 'var(--color-surface-val)',
          borderColor:     'var(--color-border-val)',
        }}
      >
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="xs" />
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-muted-val)' }}
          >
            © {new Date().getFullYear()} recovly. Built for campuses.
          </p>
        </div>
      </footer>
    </div>
  )
}