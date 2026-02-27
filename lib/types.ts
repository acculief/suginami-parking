export type ParkingType =
  | 'on_site_exclusive'
  | 'on_site_shared'
  | 'partner_lot'
  | 'coin_nearby'
  | 'unknown'

export type VerificationStatus =
  | 'ai_extracted'
  | 'official_confirmed'
  | 'phone_confirmed'
  | 'on_site_confirmed'
  | 'rejected'

export type EvidenceType =
  | 'official_site'
  | 'phone_call'
  | 'official_pdf'
  | 'on_site_photo'
  | 'other'

export interface Place {
  slug: string
  id: string
  name: string
  category_primary: string
  ward: string
  nearest_station: string
  address: string
  lat: number
  lng: number
  phone: string | null
  website_url: string | null
  google_place_id: string | null
  created_at: string
  updated_at: string
}

export interface ParkingInfo {
  id: string
  place_id: string
  parking_type: ParkingType
  has_parking: boolean
  spaces_count: number | null
  height_limit_cm: number | null
  is_free: boolean | null
  fee_text: string | null
  usage_conditions: string | null
  confidence_score: number
  verification_status: VerificationStatus
  last_verified_on: string
  next_review_on: string | null
}

export interface EvidenceSource {
  id: string
  place_id: string
  evidence_type: EvidenceType
  url: string | null
  quote: string | null
  reliability_score: number
  captured_at: string
}

export interface ReviewPage {
  id: string
  slug: string
  title: string
  ward: string
  station: string | null
  theme: string | null
  content_md: string
  published: boolean
}

export interface PlaceWithParking extends Place {
  parking_infos: ParkingInfo[]
  evidence_sources: EvidenceSource[]
}
