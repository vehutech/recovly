// app/api/found-items/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { foundItemSchema, itemFilterSchema, paginationSchema } from '@/lib/validations'
import { runMatchingEngine } from '@/lib/matching'
import { createMatchNotification } from '@/lib/notifications'
import { apiSuccess, apiError, apiValidationError } from '@/lib/api'
import type { ApiResponse, FoundItemWithUser, PaginatedResponse } from '@/types'

// ─────────────────────────────────────────────
// GET /api/found-items
// ─────────────────────────────────────────────
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedResponse<FoundItemWithUser>>>> {
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
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.status   ? { status:   filters.status   } : {}),
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
      prisma.foundItem.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true, phone: true, department: true, studentId: true, isActive: true, emailVerified: true, createdAt: true, updatedAt: true } } },
        orderBy: { createdAt: 'desc' },
        skip:    (pagination.page - 1) * pagination.limit,
        take:    pagination.limit,
      }),
      prisma.foundItem.count({ where }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return apiSuccess({
      data:       items as FoundItemWithUser[],
      total,
      page:       pagination.page,
      limit:      pagination.limit,
      totalPages,
      hasNext:    pagination.page < totalPages,
      hasPrev:    pagination.page > 1,
    })
  } catch (error) {
    console.error('[GET /api/found-items]', error)
    return apiError('Internal server error', 500)
  }
}

// ─────────────────────────────────────────────
// POST /api/found-items
// Creates item then runs matching engine
// ─────────────────────────────────────────────
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<FoundItemWithUser>>> {
  try {
    const session = await auth()
    if (!session?.user) return apiError('Unauthorised', 401)

    const body: unknown = await request.json()
    const parsed = foundItemSchema.safeParse(body)
    if (!parsed.success) {
      return apiValidationError(parsed.error.flatten().fieldErrors as Record<string, string[]>)
    }

    const { name, description, category, color, size, brand, location, dateFound, imageUrl } = parsed.data

    // Create the found item
    const foundItem = await prisma.foundItem.create({
      data: {
        userId:      session.user.id,
        name,
        description,
        category,
        color:     color    ?? null,
        size:      size     ?? null,
        brand:     brand    ?? null,
        location,
        dateFound,
        imageUrl:  imageUrl ?? null,
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

    // ── Run matching engine ──
    // For a found item: check all active lost items in same category
    const lostItems = await prisma.lostItem.findMany({
      where: { category, status: { in: ['ACTIVE', 'MATCHED'] } },
    })

    if (lostItems.length > 0) {
      // runMatchingEngine expects lostItem + foundItems[]
      // Here we flip: score the new foundItem against each lost item
      for (const lostItem of lostItems) {
        const result = runMatchingEngine(lostItem, [foundItem])

        for (const candidate of result.candidates) {
          const existing = await prisma.match.findUnique({
            where: { lostItemId_foundItemId: { lostItemId: lostItem.id, foundItemId: foundItem.id } },
          })
          if (existing) continue

          const match = await prisma.match.create({
            data: {
              lostItemId:  lostItem.id,
              foundItemId: foundItem.id,
              score:       candidate.score.total,
              status:      'PENDING',
            },
          })

          // Update lost item status to MATCHED
          await prisma.lostItem.update({
            where: { id: lostItem.id },
            data:  { status: 'MATCHED' },
          })

          // Notify lost item owner
          await createMatchNotification(
            lostItem.userId,
            lostItem.name,
            match.id,
            candidate.score.total,
          )

          // Notify found item reporter
          await createMatchNotification(
            session.user.id,
            foundItem.name,
            match.id,
            candidate.score.total,
          )
        }
      }
    }

    return apiSuccess(foundItem as FoundItemWithUser, 'Found item reported successfully', 201)
  } catch (error) {
    console.error('[POST /api/found-items]', error)
    return apiError('Internal server error', 500)
  }
}