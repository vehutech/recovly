// app/api/lost-items/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { lostItemSchema, itemFilterSchema, paginationSchema } from '@/lib/validations'
import { runMatchingEngine } from '@/lib/matching'
import { createMatchNotification } from '@/lib/notifications'
import { apiSuccess, apiError, apiValidationError } from '@/lib/api'
import type { ApiResponse, LostItemWithUser, PaginatedResponse } from '@/types'

// ─────────────────────────────────────────────
// GET /api/lost-items
// ─────────────────────────────────────────────
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedResponse<LostItemWithUser>>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const { searchParams } = request.nextUrl

    const pagination = paginationSchema.parse({
      page:  searchParams.get('page')  ?? 1,
      limit: searchParams.get('limit') ?? 20,
    })

    const filters = itemFilterSchema.parse({
      category: searchParams.get('category') ?? undefined,
      status:   searchParams.get('status')   ?? undefined,
      location: searchParams.get('location') ?? undefined,
      search:   searchParams.get('search')   ?? undefined,
    })

    const where = {
      ...(filters.category ? { category: filters.category }         : {}),
      ...(filters.status   ? { status:   filters.status   }         : {}),
      ...(filters.location ? { location: { contains: filters.location, mode: 'insensitive' as const } } : {}),
      ...(filters.search   ? {
        OR: [
          { name:        { contains: filters.search, mode: 'insensitive' as const } },
          { description: { contains: filters.search, mode: 'insensitive' as const } },
          { location:    { contains: filters.search, mode: 'insensitive' as const } },
        ],
      } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.lostItem.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true, phone: true, department: true, studentId: true, isActive: true, emailVerified: true, createdAt: true, updatedAt: true } } },
        orderBy: { createdAt: 'desc' },
        skip:    (pagination.page - 1) * pagination.limit,
        take:    pagination.limit,
      }),
      prisma.lostItem.count({ where }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return apiSuccess({
      data:       items as LostItemWithUser[],
      total,
      page:       pagination.page,
      limit:      pagination.limit,
      totalPages,
      hasNext:    pagination.page < totalPages,
      hasPrev:    pagination.page > 1,
    })
  } catch (error) {
    console.error('[GET /api/lost-items]', error)
    return apiError('Internal server error', 500)
  }
}

// ─────────────────────────────────────────────
// POST /api/lost-items
// Creates item then runs matching engine
// ─────────────────────────────────────────────
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<LostItemWithUser>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const body: unknown = await request.json()
    const parsed = lostItemSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const { name, description, category, color, size, brand, location, dateLost, imageUrl } = parsed.data

    // Create the lost item
    const lostItem = await prisma.lostItem.create({
      data: {
        userId:      session.user.id,
        name,
        description,
        category,
        color:       color    ?? null,
        size:        size     ?? null,
        brand:       brand    ?? null,
        location,
        dateLost,
        imageUrl:    imageUrl ?? null,
      },
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
    })

    // ── Run matching engine asynchronously ──
    // Fetch all active found items in the same category
    const foundItems = await prisma.foundItem.findMany({
      where: { category, status: 'ACTIVE' },
    })

    if (foundItems.length > 0) {
      const result = runMatchingEngine(lostItem, foundItems)

      // Persist matches and notify user for each candidate
      for (const candidate of result.candidates) {
        // Avoid duplicate match records
        const existing = await prisma.match.findUnique({
          where: { lostItemId_foundItemId: { lostItemId: lostItem.id, foundItemId: candidate.foundItem.id } },
        })
        if (existing) continue

        const match = await prisma.match.create({
          data: {
            lostItemId:  lostItem.id,
            foundItemId: candidate.foundItem.id,
            score:       candidate.score.total,
            status:      'PENDING',
          },
        })

        // Update lost item status to MATCHED
        await prisma.lostItem.update({
          where: { id: lostItem.id },
          data:  { status: 'MATCHED' },
        })

        // Notify the lost item owner
        await createMatchNotification(
          session.user.id,
          lostItem.name,
          match.id,
          candidate.score.total,
        )

        // Also notify the found item reporter
        await createMatchNotification(
          candidate.foundItem.userId,
          candidate.foundItem.name,
          match.id,
          candidate.score.total,
        )
      }
    }

    return apiSuccess(lostItem as LostItemWithUser, 'Lost item reported successfully', 201)
  } catch (error) {
    console.error('[POST /api/lost-items]', error)
    return apiError('Internal server error', 500)
  }
}