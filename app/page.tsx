// app/page.tsx

import { Logo } from '@/components/ui/Logo'
import { LinkButton } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Search, Bell, ShieldCheck } from 'lucide-react'

type FeatureCardProps = {
  icon:        React.ReactNode
  title:       string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon-wrap">{icon}</div>
      <div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-desc">{description}</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="page-wrapper">

      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="navbar-inner">
          <Logo size="sm" />
          <div className="navbar-actions">
            <ThemeToggle />
            <LinkButton variant="ghost" size="sm" href="/login">Sign in</LinkButton>
            <LinkButton variant="primary" size="sm" href="/register">Get started</LinkButton>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="hero-section">
        <div className="hero-grid">

          {/* Left — copy */}
          <div className="hero-copy">
            <span className="hero-badge">Campus Property Recovery</span>
            <h1 className="hero-title">
              Lost something<br />on campus?
            </h1>
            <p className="hero-subtitle">
              recovly automatically matches lost items with found ones.
              Report in seconds, get notified the moment there&rsquo;s a match.
            </p>
            <div className="hero-actions">
              <LinkButton variant="primary" size="xl" href="/register">
                Report a lost item
              </LinkButton>
              <LinkButton variant="secondary" size="xl" href="/register">
                I found something
              </LinkButton>
            </div>
          </div>

          {/* Right — visual */}
          <div className="hero-visual">
            <div className="hero-visual-inner">
              <div className="hero-accent-block">
                <Logo size="xl" showText={false} />
              </div>
              <div className="hero-stat" style={{ bottom: '-2rem', left: '-3.5rem' }}>
                <p className="hero-stat-label">Items recovered</p>
                <p className="hero-stat-value" style={{ color: 'var(--color-accent)' }}>94%</p>
              </div>
              <div className="hero-stat" style={{ top: '-2rem', right: '-3.5rem' }}>
                <p className="hero-stat-label">Match accuracy</p>
                <p className="hero-stat-value" style={{ color: 'var(--color-accent3)' }}>98%</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="section-divider">
        <div className="section-divider-line" />
      </div>

      {/* ── Features ── */}
      <div className="features-section">
        <div className="features-header">
          <h2 className="features-title">How it works</h2>
          <p className="features-subtitle">
            A simple, fast, and transparent process for recovering lost campus property.
          </p>
        </div>
        <div className="features-grid">
          <FeatureCard
            icon={<Search size={18} />}
            title="Report & match"
            description="Submit a lost or found item. Our engine automatically scores and matches items based on name, description, color, location, and date."
          />
          <FeatureCard
            icon={<Bell size={18} />}
            title="Get notified"
            description="Receive instant in-app and email notifications the moment a match is found for your item. No manual checking required."
          />
          <FeatureCard
            icon={<ShieldCheck size={18} />}
            title="Verified recovery"
            description="Submit a claim with proof. Campus admins verify ownership and approve the handover — secure and accountable throughout."
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <Logo size="xs" />
          <p className="footer-copy">© {new Date().getFullYear()} recovly. Built for campuses.</p>
        </div>
      </footer>

    </div>
  )
}