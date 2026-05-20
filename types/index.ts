// types/index.ts

export type {
  User,
  LostItem,
  FoundItem,
  Match,
  Claim,
  Notification,
  Role,
  ItemStatus,
  MatchStatus,
  ClaimStatus,
  NotificationType,
} from '@prisma/client'

import type { User, LostItem, FoundItem, Match, Claim, Notification } from '@prisma/client'
import type { Role, ItemStatus } from '@prisma/client'

export type SafeUser = Omit<User, 'password'>

export type UserWithStats = SafeUser & {
  _count: {
    lostItems:  number
    foundItems: number
    claims:     number
  }
}

export type LostItemWithUser  = LostItem & { user: SafeUser }
export type FoundItemWithUser = FoundItem & { user: SafeUser }

export type MatchWithItems = Match & {
  lostItem:  LostItemWithUser
  foundItem: FoundItemWithUser
  claim:     Claim | null
}

export type MatchWithLostItem = Match & {
  lostItem: LostItemWithUser
  claim:    Claim | null
}

export type MatchWithFoundItem = Match & {
  foundItem: FoundItemWithUser
  claim:     Claim | null
}

export type LostItemWithMatches = LostItem & {
  user:    SafeUser
  matches: MatchWithFoundItem[]
}

export type FoundItemWithMatches = FoundItem & {
  user:    SafeUser
  matches: MatchWithLostItem[]
}

export type ClaimWithDetails = Claim & {
  user:  SafeUser
  match: MatchWithItems
}

export type NotificationWithUser = Notification & {
  user: SafeUser
}

export type ApiSuccess<T> = {
  success: true
  data:    T
  message?: string
}

export type ApiError = {
  success: false
  error:   string
  code?:   string
  details?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export type PaginationParams = {
  page:  number
  limit: number
}

export type PaginatedResponse<T> = {
  data:       T[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
  hasNext:    boolean
  hasPrev:    boolean
}

export type SessionUser = {
  id:         string
  name:       string
  email:      string
  role:       Role
  avatarUrl?: string | null
}

export type MatchScore = {
  total:      number
  breakdown: {
    name:        number
    description: number
    color:       number
    location:    number
    date:        number
  }
}

export type MatchCandidate = {
  foundItem: FoundItem
  score:     MatchScore
}

export type MatchingResult = {
  lostItemId:   string
  candidates:   MatchCandidate[]
  matchesFound: number
}

export type ItemCategory =
  | 'Electronics'
  | 'Documents'
  | 'Clothing'
  | 'Accessories'
  | 'Books'
  | 'Keys'
  | 'Bags'
  | 'Jewellery'
  | 'Sports'
  | 'Other'

export const ITEM_CATEGORIES: readonly ItemCategory[] = [
  'Electronics',
  'Documents',
  'Clothing',
  'Accessories',
  'Books',
  'Keys',
  'Bags',
  'Jewellery',
  'Sports',
  'Other',
] as const

export type DashboardStats = {
  totalLostItems:   number
  totalFoundItems:  number
  totalMatches:     number
  totalRecovered:   number
  pendingClaims:    number
  recentLostItems:  LostItemWithUser[]
  recentFoundItems: FoundItemWithUser[]
  recentMatches:    MatchWithItems[]
}

export type AdminDashboardStats = DashboardStats & {
  totalUsers:          number
  totalStudents:       number
  totalStaff:          number
  pendingClaimsDetail: ClaimWithDetails[]
}

export type ItemFilterParams = {
  category?:  ItemCategory
  status?:    ItemStatus
  location?:  string
  dateFrom?:  Date
  dateTo?:    Date
  search?:    string
}

export type SortOrder = 'asc' | 'desc'

export type SortParams = {
  field: string
  order: SortOrder
}