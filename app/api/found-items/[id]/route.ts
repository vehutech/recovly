// app/api/found-items/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateFoundItemSchema } from '@/lib/validations'
import { apiSuccess, apiError, apiValidationError } from '@/lib/api'
import type { ApiResponse, FoundItemWithUser } from '@/types'
import type { Prisma } from '@prisma/client'

const USER_SELECT = {
  id: true, name: true, email: true, role: true,
  avatarUrl: true, phone: true, department: true,
  studentId: true, isActive: true, emailVerified: true,
  createdAt: true, updatedAt: true,
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<FoundItemWithUser>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const { id } = await params

    const item = await prisma.foundItem.findUnique({
      where:   { id },
      include: { user: { select: USER_SELECT } },
    })

    if (!item) return apiError('Item not found', 404)
    return apiSuccess(item as FoundItemWithUser)
  } catch (error) {
    console.error('[GET /api/found-items/[id]]', error)
    return apiError('Internal server error', 500)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<FoundItemWithUser>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const { id } = await params

    const item = await prisma.foundItem.findUnique({ where: { id } })
    if (!item) return apiError('Item not found', 404)

    if (item.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return apiError('Forbidden', 403)
    }

    const body: unknown = await request.json()
    const parsed = updateFoundItemSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const data: Prisma.FoundItemUpdateInput = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    ) as Prisma.FoundItemUpdateInput

    const updated = await prisma.foundItem.update({
      where:   { id },
      data,
      include: { user: { select: USER_SELECT } },
    })

    return apiSuccess(updated as FoundItemWithUser)
  } catch (error) {
    console.error('[PATCH /api/found-items/[id]]', error)
    return apiError('Internal server error', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ deleted: true }>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const { id } = await params

    const item = await prisma.foundItem.findUnique({ where: { id } })
    if (!item) return apiError('Item not found', 404)

    if (item.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return apiError('Forbidden', 403)
    }

    await prisma.foundItem.delete({ where: { id } })
    return apiSuccess({ deleted: true as const })
  } catch (error) {
    console.error('[DELETE /api/found-items/[id]]', error)
    return apiError('Internal server error', 500)
  }
}