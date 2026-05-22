'use client'

// app/report-found/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ITEM_CATEGORIES } from '@/types'
import type { FoundItemSchema } from '@/lib/validations'
import type { ApiResponse, FoundItemWithUser } from '@/types'

type FieldErrors = Partial<Record<keyof FoundItemSchema, string | undefined>>

type FormState = {
  name:        string
  description: string
  category:    string
  color:       string
  size:        string
  brand:       string
  location:    string
  dateFound:   string
}

const INITIAL_FORM: FormState = {
  name: '', description: '', category: '', color: '',
  size: '', brand: '', location: '', dateFound: '',
}

const CATEGORY_OPTIONS = ITEM_CATEGORIES.map((c) => ({ value: c, label: c }))

export default function ReportFoundPage() {
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
    if (!form.dateFound)          next.dateFound   = 'Date found is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateClient()) return

    setIsLoading(true)
    setGlobal(null)

    try {
      const res  = await fetch('/api/found-items', {
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
          dateFound:   form.dateFound,
        }),
      })

      const data = await res.json() as ApiResponse<FoundItemWithUser>

      if (!data.success) {
        if ('details' in data && data.details) {
          const fieldErrs: FieldErrors = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            if (msgs[0]) fieldErrs[key as keyof FoundItemSchema] = msgs[0]
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
            Report a Found Item
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Help reunite someone with their lost property. The system will automatically match it.
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
            placeholder="e.g. Student ID Card"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            isRequired={true}
          />

          <Textarea
            label="Description"
            placeholder="Describe the item — any distinctive features, name on the item, etc."
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
              placeholder="e.g. Blue"
              value={form.color}
              onChange={handleChange('color')}
              hint="Optional"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Brand"
              type="text"
              placeholder="e.g. Samsung"
              value={form.brand}
              onChange={handleChange('brand')}
              hint="Optional"
            />
            <Input
              label="Size"
              type="text"
              placeholder="e.g. Medium"
              value={form.size}
              onChange={handleChange('size')}
              hint="Optional"
            />
          </div>

          <Input
            label="Where was it found?"
            type="text"
            placeholder="e.g. Cafeteria, near entrance"
            value={form.location}
            onChange={handleChange('location')}
            error={errors.location}
            isRequired={true}
          />

          <Input
            label="Date found"
            type="date"
            value={form.dateFound}
            onChange={handleChange('dateFound')}
            error={errors.dateFound}
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