import { createClient } from '@supabase/supabase-js'
import { calculateConfidenceScore } from '../lib/scoring'

const supabaseUrl = 'https://cuinyjpiifcslzexrunc.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
const admin = createClient(supabaseUrl, serviceKey)

const seeds = [
  {
    place: {
      name: '石釜ダイニング 荻窪本店',
      slug: 'ishigama-dining-ogikubo',
      category_primary: 'イタリアン',
      ward: '杉並区',
      nearest_station: '荻窪',
      address: '東京都杉並区荻窪5-27-5',
      lat: 35.7044, lng: 139.6233,
      phone: '03-1234-5678',
      website_url: 'https://example.com/ishigama',
    },
    parking: {
      parking_type: 'on_site_exclusive' as const,
      has_parking: true,
      spaces_count: 8,
      height_limit_cm: 210,
      is_free: true,
      fee_text: 'お食事の方は無料',
      usage_conditions: 'ランチ・ディナーご利用で2時間無料',
      verification_status: 'official_confirmed' as const,
      last_verified_on: '2025-12-01',
    },
    evidence: {
      evidence_type: 'official_site' as const,
      url: 'https://example.com/ishigama/access',
      quote: '専用駐車場8台完備。お食事のお客様は2時間無料。',
      reliability_score: 85,
    },
  },
  {
    place: {
      name: '焼肉ざんまい 阿佐ヶ谷店',
      slug: 'yakiniku-zanmai-asagaya',
      category_primary: '焼肉',
      ward: '杉並区',
      nearest_station: '阿佐ヶ谷',
      address: '東京都杉並区阿佐谷南1-2-3',
      lat: 35.7057, lng: 139.6364,
      phone: '03-2345-6789',
      website_url: 'https://example.com/zanmai',
    },
    parking: {
      parking_type: 'partner_lot' as const,
      has_parking: true,
      spaces_count: 20,
      height_limit_cm: 200,
      is_free: false,
      fee_text: '30分無料、以降30分200円',
      usage_conditions: 'ご利用金額3,000円以上で1時間無料',
      verification_status: 'phone_confirmed' as const,
      last_verified_on: '2026-01-15',
    },
    evidence: {
      evidence_type: 'phone_call' as const,
      url: null,
      quote: '電話確認：店舗隣の第一パーキング（20台）と提携。3000円以上で1時間サービス。',
      reliability_score: 95,
    },
  },
  {
    place: {
      name: '天ぷら みやこ 西荻窪',
      slug: 'tempura-miyako-nishiogikubo',
      category_primary: '天ぷら',
      ward: '杉並区',
      nearest_station: '西荻窪',
      address: '東京都杉並区西荻北3-4-5',
      lat: 35.7063, lng: 139.6097,
      phone: '03-3456-7890',
      website_url: 'https://example.com/miyako',
    },
    parking: {
      parking_type: 'on_site_exclusive' as const,
      has_parking: true,
      spaces_count: 5,
      height_limit_cm: null,
      is_free: true,
      fee_text: '無料',
      usage_conditions: '要予約時に駐車場利用申告',
      verification_status: 'official_confirmed' as const,
      last_verified_on: '2025-11-20',
    },
    evidence: {
      evidence_type: 'official_site' as const,
      url: 'https://example.com/miyako/access',
      quote: '駐車場5台あり（無料）。ご予約の際にお申し付けください。',
      reliability_score: 80,
    },
  },
  {
    place: {
      name: '炭火焼鳥 とり清 高円寺',
      slug: 'yakitori-torisei-koenji',
      category_primary: '焼き鳥',
      ward: '杉並区',
      nearest_station: '高円寺',
      address: '東京都杉並区高円寺南2-5-6',
      lat: 35.7054, lng: 139.6496,
      phone: '03-4567-8901',
      website_url: null,
    },
    parking: {
      parking_type: 'coin_nearby' as const,
      has_parking: false,
      spaces_count: null,
      height_limit_cm: null,
      is_free: null,
      fee_text: null,
      usage_conditions: '徒歩2分のタイムズ高円寺第3（15台）が利用可能',
      verification_status: 'ai_extracted' as const,
      last_verified_on: '2026-02-01',
    },
    evidence: {
      evidence_type: 'other' as const,
      url: null,
      quote: '近隣コインパーキング利用推奨（店舗専用駐車場なし）',
      reliability_score: 40,
    },
  },
  {
    place: {
      name: 'フレンチレストラン ル・クール 荻窪',
      slug: 'french-le-coeur-ogikubo',
      category_primary: 'フレンチ',
      ward: '杉並区',
      nearest_station: '荻窪',
      address: '東京都杉並区荻窪4-30-10',
      lat: 35.7040, lng: 139.6220,
      phone: '03-5678-9012',
      website_url: 'https://example.com/lecoeur',
    },
    parking: {
      parking_type: 'on_site_exclusive' as const,
      has_parking: true,
      spaces_count: 12,
      height_limit_cm: 230,
      is_free: true,
      fee_text: '完全無料',
      usage_conditions: 'ご予約のお客様専用。前日までに台数をお知らせください。',
      verification_status: 'phone_confirmed' as const,
      last_verified_on: '2026-01-28',
    },
    evidence: {
      evidence_type: 'phone_call' as const,
      url: null,
      quote: '電話確認済み：敷地内12台、高さ制限230cm、完全無料、要事前連絡',
      reliability_score: 98,
    },
  },
  {
    place: {
      name: 'すし処 竹清 阿佐ヶ谷',
      slug: 'sushi-chikusei-asagaya',
      category_primary: '寿司',
      ward: '杉並区',
      nearest_station: '阿佐ヶ谷',
      address: '東京都杉並区阿佐谷北1-3-4',
      lat: 35.7068, lng: 139.6370,
      phone: '03-6789-0123',
      website_url: 'https://example.com/chikusei',
    },
    parking: {
      parking_type: 'on_site_exclusive' as const,
      has_parking: true,
      spaces_count: 6,
      height_limit_cm: 200,
      is_free: true,
      fee_text: '無料',
      usage_conditions: 'ランチ・ディナーご利用時',
      verification_status: 'official_confirmed' as const,
      last_verified_on: '2025-10-15',
    },
    evidence: {
      evidence_type: 'official_site' as const,
      url: 'https://example.com/chikusei/access',
      quote: '店舗専用駐車場6台完備（無料）。高さ制限200cm。',
      reliability_score: 82,
    },
  },
  {
    place: {
      name: '海鮮居酒屋 漁火 西荻窪',
      slug: 'kaisenizakaya-isaribi-nishiogikubo',
      category_primary: '居酒屋',
      ward: '杉並区',
      nearest_station: '西荻窪',
      address: '東京都杉並区西荻南2-8-9',
      lat: 35.7050, lng: 139.6090,
      phone: '03-7890-1234',
      website_url: 'https://example.com/isaribi',
    },
    parking: {
      parking_type: 'on_site_shared' as const,
      has_parking: true,
      spaces_count: 10,
      height_limit_cm: 195,
      is_free: false,
      fee_text: '2時間500円、以降1時間200円',
      usage_conditions: '1階テナント共有（マンション敷地内）',
      verification_status: 'official_confirmed' as const,
      last_verified_on: '2025-12-20',
    },
    evidence: {
      evidence_type: 'official_site' as const,
      url: 'https://example.com/isaribi/access',
      quote: '建物共有駐車場10台。2h500円。高さ制限195cm。',
      reliability_score: 75,
    },
  },
  {
    place: {
      name: '鉄板焼き 一凛 荻窪',
      slug: 'teppan-ichirin-ogikubo',
      category_primary: '鉄板焼き',
      ward: '杉並区',
      nearest_station: '荻窪',
      address: '東京都杉並区荻窪5-10-15',
      lat: 35.7048, lng: 139.6240,
      phone: '03-8901-2345',
      website_url: 'https://example.com/ichirin',
    },
    parking: {
      parking_type: 'on_site_exclusive' as const,
      has_parking: true,
      spaces_count: 15,
      height_limit_cm: 250,
      is_free: true,
      fee_text: '無料',
      usage_conditions: 'コース料理のお客様は3時間まで無料',
      verification_status: 'on_site_confirmed' as const,
      last_verified_on: '2026-02-10',
    },
    evidence: {
      evidence_type: 'on_site_photo' as const,
      url: null,
      quote: '現地確認：敷地内15台、高さ250cm対応、入口に看板あり',
      reliability_score: 99,
    },
  },
  {
    place: {
      name: 'ラーメン横綱 高円寺',
      slug: 'ramen-yokozuna-koenji',
      category_primary: 'ラーメン',
      ward: '杉並区',
      nearest_station: '高円寺',
      address: '東京都杉並区高円寺北3-1-2',
      lat: 35.7062, lng: 139.6490,
      phone: '03-9012-3456',
      website_url: 'https://example.com/yokozuna',
    },
    parking: {
      parking_type: 'partner_lot' as const,
      has_parking: true,
      spaces_count: 30,
      height_limit_cm: 200,
      is_free: false,
      fee_text: '1時間300円',
      usage_conditions: '隣接タイムズと提携。1000円以上で30分無料券配布',
      verification_status: 'phone_confirmed' as const,
      last_verified_on: '2026-01-05',
    },
    evidence: {
      evidence_type: 'phone_call' as const,
      url: null,
      quote: '電話確認：タイムズ高円寺北第1（30台）と提携。1000円以上で30分券。',
      reliability_score: 92,
    },
  },
  {
    place: {
      name: 'ファミリーレストラン さわやか亭 阿佐ヶ谷',
      slug: 'family-sawayakatei-asagaya',
      category_primary: 'ファミリーレストラン',
      ward: '杉並区',
      nearest_station: '阿佐ヶ谷',
      address: '東京都杉並区阿佐谷南3-6-7',
      lat: 35.7042, lng: 139.6380,
      phone: '03-0123-4567',
      website_url: 'https://example.com/sawayaka',
    },
    parking: {
      parking_type: 'on_site_exclusive' as const,
      has_parking: true,
      spaces_count: 25,
      height_limit_cm: 205,
      is_free: true,
      fee_text: '無料',
      usage_conditions: 'お食事の方は無料。障害者スペース2台含む。',
      verification_status: 'official_confirmed' as const,
      last_verified_on: '2026-02-15',
    },
    evidence: {
      evidence_type: 'official_site' as const,
      url: 'https://example.com/sawayaka/access',
      quote: '無料駐車場25台（障害者スペース含む）。高さ205cm制限。',
      reliability_score: 88,
    },
  },
]

async function main() {
  console.log('Seeding database...')

  for (const seed of seeds) {
    const { data: place, error: placeErr } = await admin
      .from('places')
      .upsert({ ...seed.place }, { onConflict: 'slug' })
      .select()
      .single()

    if (placeErr) {
      console.error(`Failed to insert place ${seed.place.name}:`, placeErr.message)
      continue
    }

    const placeId = place.id
    const score = calculateConfidenceScore({
      parking_type: seed.parking.parking_type,
      spaces_count: seed.parking.spaces_count,
      height_limit_cm: seed.parking.height_limit_cm,
      usage_conditions: seed.parking.usage_conditions,
      verification_status: seed.parking.verification_status,
      evidence_types: [seed.evidence.evidence_type],
      last_verified_on: seed.parking.last_verified_on,
    })

    const { error: parkErr } = await admin
      .from('parking_infos')
      .upsert(
        { place_id: placeId, ...seed.parking, confidence_score: score },
        { onConflict: 'place_id' }
      )
    if (parkErr) console.error(`parking_infos error:`, parkErr.message)

    const { error: evErr } = await admin
      .from('evidence_sources')
      .insert({ place_id: placeId, ...seed.evidence })
    if (evErr && !evErr.message.includes('duplicate')) console.error(`evidence error:`, evErr.message)

    console.log(`✅ ${seed.place.name} (score: ${score})`)
  }

  console.log('\n🌱 Seed complete!')
}

main().catch(console.error)
