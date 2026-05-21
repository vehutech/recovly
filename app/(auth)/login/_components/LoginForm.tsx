'use client'

// app/(auth)/login/_components/LoginForm.tsx

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type FieldErrors = {
  email?:    string | undefined
  password?: string | undefined
}

export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard'
  const registered   = searchParams.get('registered') === 'true'

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [errors, setErrors]       = useState<FieldErrors>({})
  const [globalError, setGlobal]  = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validateClient(): boolean {
    const next: FieldErrors = {}
    if (!email.trim())    next.email    = 'Email is required'
    if (!password.trim()) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateClient()) return
    setIsLoading(true)
    setGlobal(null)
    try {
      const result = await signIn('credentials', {
        email:    email.trim().toLowerCase(),
        password: password.trim(),
        redirect: false,
      })
      if (!result?.ok) { setGlobal('Invalid email or password. Please try again.'); return }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setGlobal('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">

      {/* Brand panel */}
      <div className="auth-brand-panel">
        <Logo size="md" />
        <div>
          <p className="auth-brand-headline">
            Welcome<br />
            <span style={{ color: 'var(--color-accent)' }}>back.</span>
          </p>
          <p className="auth-brand-sub">
            Your campus property recovery hub. Report, track, and recover lost items with ease.
          </p>
        </div>
        <p className="auth-brand-footer">© {new Date().getFullYear()} recovly. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">

          <div style={{ marginBottom: '1rem' }} className="lg:hidden">
            <Logo size="sm" />
          </div>

          <h1 className="auth-form-title">Sign in</h1>
          <p className="auth-form-sub">
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--color-accent2)', fontWeight: 600 }}>
              Create one
            </Link>
          </p>

          {registered && <div className="alert alert-success">Account created! Sign in to continue.</div>}
          {globalError && <div className="alert alert-error">{globalError}</div>}

          <form onSubmit={handleSubmit} noValidate className="auth-form-fields">
            <Input
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); setGlobal(null) }}
              error={errors.email}
              isRequired={true}
              autoComplete="email"
              autoFocus={true}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); setGlobal(null) }}
              error={errors.password}
              isRequired={true}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              loadingText="Signing in..."
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}