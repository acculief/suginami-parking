import type { ParkingType, VerificationStatus, EvidenceType } from './types'

interface ScoringInput {
  parking_type: ParkingType
  spaces_count?: number | null
  height_limit_cm?: number | null
  usage_conditions?: string | null
  verification_status: VerificationStatus
  evidence_types?: EvidenceType[]
  last_verified_on?: string | null
}

export function calculateConfidenceScore(input: ScoringInput): number {
  let score = 0

  const typeScores: Record<ParkingType, number> = {
    on_site_exclusive: 45,
    on_site_shared: 35,
    partner_lot: 28,
    coin_nearby: 10,
    unknown: 0,
  }
  score += typeScores[input.parking_type] || 0

  if (input.spaces_count != null && input.spaces_count > 0) score += 10
  if (input.height_limit_cm != null) score += 5
  if (input.usage_conditions) score += 5

  const evidenceScores: Record<EvidenceType, number> = {
    official_site: 15,
    phone_call: 20,
    on_site_photo: 10,
    official_pdf: 12,
    other: 5,
  }
  for (const et of input.evidence_types || []) {
    score += evidenceScores[et] || 0
  }

  if (input.parking_type === 'coin_nearby') score -= 25
  if (input.last_verified_on) {
    const age = Date.now() - new Date(input.last_verified_on).getTime()
    const oneYear = 365 * 24 * 60 * 60 * 1000
    if (age > oneYear) score -= 10
  }

  return Math.max(0, Math.min(100, score))
}

export function getPublishStatus(score: number): 'publish' | 'needs_verification' | 'reject' {
  if (score >= 70) return 'publish'
  if (score >= 50) return 'needs_verification'
  return 'reject'
}

export function getParkingBadge(status: VerificationStatus): {
  label: string
  color: string
  emoji: string
} {
  switch (status) {
    case 'phone_confirmed':
      return { label: '電話確認済み', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', emoji: '📞' }
    case 'on_site_confirmed':
      return { label: '現地確認済み', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', emoji: '✅' }
    case 'official_confirmed':
      return { label: '公式確認済み', color: 'bg-blue-50 text-blue-700 border border-blue-200', emoji: '🏢' }
    case 'ai_extracted':
      return { label: 'AI推定', color: 'bg-gray-100 text-gray-600 border border-gray-200', emoji: '🤖' }
    default:
      return { label: '未確認', color: 'bg-gray-100 text-gray-500 border border-gray-200', emoji: '❓' }
  }
}

export function getParkingTypeLabel(type: ParkingType): string {
  const labels: Record<ParkingType, string> = {
    on_site_exclusive: '専用駐車場',
    on_site_shared: '共有駐車場',
    partner_lot: '提携駐車場',
    coin_nearby: '近隣コインパーキング',
    unknown: '不明',
  }
  return labels[type] || type
}
