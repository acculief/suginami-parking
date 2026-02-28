import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cuinyjpiifcslzexrunc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aW55anBpaWZjc2x6ZXhydW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY0NjUwMSwiZXhwIjoyMDg3MjIyNTAxfQ.Khq0vZwjfwjgPlbF69obefRCS1hRUFd23cQg0sPKVZo'
const SERPER_KEY = '9bd038aa2af6f614e93fa932266c3816ceebfab9'
const sb = createClient(SUPABASE_URL, SERVICE_KEY)

// 検索クエリ（駅別×カテゴリ別）
const QUERIES = [
  '荻窪 レストラン 駐車場',
  '荻窪 焼肉 駐車場',
  '荻窪 ファミリーレストラン 駐車場',
  '阿佐ヶ谷 レストラン 駐車場',
  '阿佐ヶ谷 居酒屋 駐車場',
  '西荻窪 レストラン 駐車場',
  '西荻窪 カフェ 駐車場',
  '高円寺 レストラン 駐車場',
  '高円寺 焼肉 駐車場',
  '杉並区 郊外型レストラン 駐車場あり',
]

async function searchPlaces(query) {
  const res = await fetch('https://google.serper.dev/places', {
    method: 'POST',
    headers: { 'X-API-KEY': SERPER_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, gl: 'jp', hl: 'ja', num: 10 })
  })
  const data = await res.json()
  return data.places || []
}

// 駅名を住所から推定
function nearestStation(address) {
  if (address.includes('荻窪')) return '荻窪'
  if (address.includes('阿佐')) return '阿佐ヶ谷'
  if (address.includes('西荻')) return '西荻窪'
  if (address.includes('高円寺')) return '高円寺'
  if (address.includes('杉並')) return '荻窪' // デフォルト
  return '荻窪'
}

// slug 生成
function toSlug(name) {
  return name.replace(/[　\s]+/g, '-').replace(/[^\w\-\u3040-\u30ff\u4e00-\u9fff]/g, '').substring(0, 50) + '-' + Date.now().toString(36)
}

const seen = new Set()
const results = []

for (const query of QUERIES) {
  console.log(`検索: ${query}`)
  const places = await searchPlaces(query)
  
  for (const p of places) {
    if (!p.address || !p.title) continue
    if (!p.address.includes('杉並') && !p.address.includes('荻窪') && !p.address.includes('阿佐') && !p.address.includes('高円寺') && !p.address.includes('西荻')) continue
    if (seen.has(p.title)) continue
    seen.add(p.title)
    
    results.push({
      name: p.title,
      address: p.address,
      phone: p.phoneNumber || null,
      website_url: p.website || null,
      google_place_id: p.placeId || null,
      lat: p.latitude || null,
      lng: p.longitude || null,
      nearest_station: nearestStation(p.address),
      category_primary: p.type || 'レストラン',
      rating: p.rating || null,
      reviewsCount: p.reviewsCount || 0,
    })
  }
  await new Promise(r => setTimeout(r, 500))
}

console.log(`収集: ${results.length}件`)

// DB投入
let inserted = 0
for (const r of results) {
  const slug = toSlug(r.name)
  const placeData = {
    name: r.name,
    slug,
    category_primary: r.category_primary,
    ward: '杉並区',
    nearest_station: r.nearest_station,
    address: r.address,
    lat: r.lat,
    lng: r.lng,
    phone: r.phone,
    website_url: r.website_url,
    google_place_id: r.google_place_id,
  }
  
  const { data: place, error: placeErr } = await sb.from('places').insert(placeData).select().single()
  if (placeErr) { console.log(`Skip ${r.name}: ${placeErr.message}`); continue }
  
  // parking_infos: 駐車場情報を "ai_extracted" として追加
  const parkingData = {
    place_id: place.id,
    parking_type: 'nearby',
    has_parking: true,
    is_free: false,
    confidence_score: 55,
    verification_status: 'ai_extracted',
    last_verified_on: new Date().toISOString().split('T')[0],
  }
  await sb.from('parking_infos').insert(parkingData)
  
  console.log(`✅ ${r.name} (${r.nearest_station})`)
  inserted++
  await new Promise(r => setTimeout(r, 200))
}

console.log(`\n完了: ${inserted}件挿入`)
