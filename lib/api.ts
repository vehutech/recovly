// lib/api.ts

import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types'

export function apiSuccess<T>(data: T, message?: string, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, ...(message ? { message } : {}) }, { status })
}

export function apiError(error: string, status = 400, code?: string): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error, ...(code ? { code } : {}) }, { status })
}

export function apiValidationError(details: Record<string, string[]>): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: 'Validation failed', details }, { status: 400 })
}