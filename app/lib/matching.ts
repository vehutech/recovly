// lib/matching.ts

import type { LostItem, FoundItem } from '@prisma/client'
import type { MatchScore, MatchCandidate, MatchingResult } from '@/types'

const WEIGHTS = {
  name:        40,
  description: 30,
  color:       15,
  location:    10,
  date:         5,
} as const

const MATCH_THRESHOLD     = 60
const DATE_PROXIMITY_DAYS = 7

function normalise(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ')
}

function tokenise(str: string): Set<string> {
  const stopWords = new Set([
    'a','an','the','is','it','in','on','at','to','for','of','and','or','my','i','was',
  ])
  return new Set(
    normalise(str)
      .split(/\W+/)
      .filter((t) => t.length > 1 && !stopWords.has(t))
  )
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  const intersection = new Set([...a].filter((t) => b.has(t)))
  const union        = new Set([...a, ...b])
  return intersection.size / union.size
}

function scoreNameMatch(lost: string, found: string): number {
  const lNorm = normalise(lost)
  const fNorm = normalise(found)
  if (lNorm === fNorm) return 1
  if (lNorm.includes(fNorm) || fNorm.includes(lNorm)) return 0.85
  return jaccardSimilarity(tokenise(lost), tokenise(found))
}

function scoreDescriptionMatch(lost: string, found: string): number {
  return jaccardSimilarity(tokenise(lost), tokenise(found))
}

function scoreColorMatch(lostColor: string | null, foundColor: string | null): number {
  if (!lostColor || !foundColor) return 0.5
  const l = normalise(lostColor)
  const f = normalise(foundColor)
  if (l === f) return 1
  if (l.includes(f) || f.includes(l)) return 0.8
  return 0
}

function scoreLocationMatch(lostLocation: string, foundLocation: string): number {
  const l = normalise(lostLocation)
  const f = normalise(foundLocation)
  if (l === f) return 1
  if (l.includes(f) || f.includes(l)) return 0.7
  return jaccardSimilarity(tokenise(lostLocation), tokenise(foundLocation))
}

function scoreDateProximity(dateLost: Date, dateFound: Date): number {
  const diffMs   = dateFound.getTime() - dateLost.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays < -1) return 0
  if (diffDays <= 1) return 1
  if (diffDays <= DATE_PROXIMITY_DAYS) return 1 - (diffDays - 1) / DATE_PROXIMITY_DAYS
  return 0.2
}

export function computeMatchScore(lost: LostItem, found: FoundItem): MatchScore {
  const breakdown = {
    name:        Math.round(scoreNameMatch(lost.name, found.name)                        * WEIGHTS.name),
    description: Math.round(scoreDescriptionMatch(lost.description, found.description)   * WEIGHTS.description),
    color:       Math.round(scoreColorMatch(lost.color, found.color)                     * WEIGHTS.color),
    location:    Math.round(scoreLocationMatch(lost.location, found.location)            * WEIGHTS.location),
    date:        Math.round(scoreDateProximity(lost.dateLost, found.dateFound)           * WEIGHTS.date),
  }
  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0)
  return { total, breakdown }
}

export function findMatchCandidates(lostItem: LostItem, foundItems: FoundItem[]): MatchCandidate[] {
  const candidates: MatchCandidate[] = []
  for (const found of foundItems) {
    if (found.category !== lostItem.category) continue
    const score = computeMatchScore(lostItem, found)
    if (score.total >= MATCH_THRESHOLD) {
      candidates.push({ foundItem: found, score })
    }
  }
  return candidates.sort((a, b) => b.score.total - a.score.total)
}

export function runMatchingEngine(lostItem: LostItem, foundItems: FoundItem[]): MatchingResult {
  const candidates = findMatchCandidates(lostItem, foundItems)
  return { lostItemId: lostItem.id, candidates, matchesFound: candidates.length }
}

export type MatchConfidence = 'high' | 'medium' | 'low'

export function getMatchConfidence(score: number): MatchConfidence {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

export const MATCH_CONFIDENCE_LABELS: Record<MatchConfidence, string> = {
  high:   'Strong Match',
  medium: 'Possible Match',
  low:    'Weak Match',
}