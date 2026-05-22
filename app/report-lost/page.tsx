'use client'

// app/report-lost/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ITEM_CATEGORIES } from '@/types'
import type { LostItemSchema } from '@/lib/validations'
import type { ApiResponse, LostItemWithUser } from '@/types'

type FieldErrors = Partial<Record<keyof LostItemSchema, string | undefined>>

type FormState = {
  name:        string
  description: string
  category:    string
  color:       string
  size:        string
  brand:       string
  location:    string
  dateLost:    string
}

const INITIAL_FORM: FormState = {
  name: '', description: '', category: '', color: '',
  size: '', brand: '', location: '', dateLost: '',
}

const CATEGORY_OPTIONS = ITEM_CATEGORIES.map((c) => ({ value: c, label: c }))

export default function ReportLostPage() {
  const router = useRouter()

  const [form, setForm]           = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors]       = useState<FieldErrors>({})
  const [globalError, setGlobal]  = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess]     = useState(false)

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setGlobal(null)
    }
  }

  function validateClient(): boolean {
    const next: FieldErrors = {}
    if (!form.name.trim())        next.name        = 'Item name is required'
    if (!form.description.trim()) next.description = 'Description is required'
    if (!form.category)           next.category    = 'Category is required'
    if (!form.location.trim())    next.location    = 'Location is required'
    if (!form.dateLost)           next.dateLost    = 'Date lost is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateClient()) return

    setIsLoading(true)
    setGlobal(null)

    try {
      const res  = await fetch('/api/lost-items', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:        form.name.trim(),
          description: form.description.trim(),
          category:    form.category,
          color:       form.color    || undefined,
          size:        form.size     || undefined,
          brand:       form.brand    || undefined,
          location:    form.location.trim(),
          dateLost:    form.dateLost,
        }),
      })

      const data = await res.json() as ApiResponse<LostItemWithUser>

      if (!data.success) {
        if ('details' in data && data.details) {
          const fieldErrs: FieldErrors = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            if (msgs[0]) fieldErrs[key as keyof LostItemSchema] = msgs[0]
          }
          setErrors(fieldErrs)
        } else {
          setGlobal(data.error)
        }
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/my-items'), 1500)
    } catch {
      setGlobal('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
            Report a Lost Item
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Provide as much detail as possible to improve match accuracy.
          </p>
        </div>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            Item reported successfully! Checking for matches...
          </div>
        )}

        {globalError && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {globalError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '1rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <Input
            label="Item name"
            type="text"
            placeholder="e.g. Black iPhone 15"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            isRequired={true}
          />

          <Textarea
            label="Description"
            placeholder="Describe the item in detail — any distinctive features, marks, or contents"
            value={form.description}
            onChange={handleChange('description')}
            error={errors.description}
            isRequired={true}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
              value={form.category}
              onChange={handleChange('category')}
              error={errors.category}
              isRequired={true}
            />
            <Input
              label="Color"
              type="text"
              placeholder="e.g. Black"
              value={form.color}
              onChange={handleChange('color')}
              hint="Optional"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Brand"
              type="text"
              placeholder="e.g. Apple"
              value={form.brand}
              onChange={handleChange('brand')}
              hint="Optional"
            />
            <Input
              label="Size"
              type="text"
              placeholder="e.g. Small"
              value={form.size}
              onChange={handleChange('size')}
              hint="Optional"
            />
          </div>

          <Input
            label="Where was it lost?"
            type="text"
            placeholder="e.g. Library, 2nd floor reading room"
            value={form.location}
            onChange={handleChange('location')}
            error={errors.location}
            isRequired={true}
          />

          <Input
            label="Date lost"
            type="date"
            value={form.dateLost}
            onChange={handleChange('dateLost')}
            error={errors.dateLost}
            isRequired={true}
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              isLoading={isLoading}
              loadingText="Submitting..."
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}