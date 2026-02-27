import { supabase } from '@/lib/supabase'
import { getParkingBadge, getParkingTypeLabel, getPublishStatus } from '@/lib/scoring'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { PlaceWithParking } from '@/lib/types'

const stationInfo: Record<string, { name: string; title: string; desc: string; keywords: string[] }> = {
  ogikubo: {
    name: '荻窪',
    title: '荻窪 駐車場付きレストラン【確認済み】',
    desc: '荻窪エリアの駐車場付きレストランを確認済み情報で紹介。専用駐車場・提携駐車場のある飲食店を厳選。',
    keywords: ['荻窪 駐車場付き レストラン', '荻窪 車で行ける 飲食店', '荻窪 ランチ 駐車場'],
  },
  asagaya: {
    name: '阿佐ヶ谷',
    title: '阿佐ヶ谷 駐車場付きレストラン【確認済み】',
    desc: '阿佐ヶ谷エリアの駐車場付きレストランを確認済み情報で紹介。',
    keywords: ['阿佐ヶ谷 駐車場付き レストラン', '阿佐ヶ谷 車で行ける', '阿佐谷 駐車場 ディナー'],
  },
  nishiogikubo: {
    name: '西荻窪',
    title: '西荻窪 駐車場付きレストラン【確認済み】子連れOK',
    desc: '西荻窪エリアの駐車場付きレストランを厳選。子連れ・ファミリーでも安心。',
    keywords: ['西荻窪 駐車場 レストラン', '西荻窪 子連れ 駐車場', '西荻窪 車 外食'],
  },
  koenji: {
    name: '高円寺',
    title: '高円寺 駐車場付きレストラン【確認済み】',
    desc: '高円寺エリアの駐車場付きレストランを確認済み情報で紹介。',
    keywords: ['高円寺 駐車場付き レストラン', '高円寺 車で行ける 飲食店'],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ station: string }> }): Promise<Metadata> {
  const { station } = await params
  const info = stationInfo[station]
  if (!info) return {}
  return {
    title: info.title,
    description: info.desc,
    keywords: info.keywords,
  }
}

export async function generateStaticParams() {
  return Object.keys(stationInfo).map((station) => ({ station }))
}

export const revalidate = 3600

export default async function StationPage({ params }: { params: Promise<{ station: string }> }) {
  const { station } = await params
  const info = stationInfo[station]
  if (!info) return <div className="p-8 text-center">エリアが見つかりません</div>

  let places: PlaceWithParking[] = []
  try {
    const { data } = await supabase
      .from('places')
      .select(`*, parking_infos(*), evidence_sources(*)`)
      .eq('nearest_station', info.name)
      .order('created_at', { ascending: false })
    places = (data || []) as PlaceWithParking[]
  } catch {}

  const publishedPlaces = places.filter((p) => {
    const parking = p.parking_infos?.[0]
    if (!parking) return false
    return getPublishStatus(parking.confidence_score) === 'publish'
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: info.title,
    description: info.desc,
    numberOfItems: publishedPlaces.length,
    itemListElement: publishedPlaces.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://suginami-parking.vercel.app/p/${p.slug}`,
    })),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-700">トップ</Link>
        {' › '}
        <Link href="/suginami" className="hover:text-emerald-700">杉並区</Link>
        {' › '}
        <span>{info.name}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-black mb-3">{info.title}</h1>
      <p className="text-gray-600 mb-8">{info.desc}</p>

      <div className="flex gap-4 mb-8 text-sm">
        <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg font-medium">
          ✅ 確認済み {publishedPlaces.length}件
        </div>
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
          総掲載 {places.length}件
        </div>
      </div>

      {publishedPlaces.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>このエリアのデータを収集中です</p>
        </div>
      ) : (
        <div className="space-y-4">
          {publishedPlaces.map((place) => {
            const parking = place.parking_infos?.[0]
            if (!parking) return null
            const badge = getParkingBadge(parking.verification_status)
            return (
              <Link
                key={place.id}
                href={`/p/${place.slug}`}
                className="block bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-5 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-lg">{place.name}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.emoji} {badge.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {place.category_primary} · {place.address}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-emerald-700 font-medium">
                        🅿️ {getParkingTypeLabel(parking.parking_type)}
                      </span>
                      {parking.spaces_count && (
                        <span className="text-gray-600">📦 {parking.spaces_count}台</span>
                      )}
                      {parking.height_limit_cm && (
                        <span className="text-gray-600">📏 高さ{parking.height_limit_cm}cm以下</span>
                      )}
                      {parking.is_free && (
                        <span className="text-blue-600 font-medium">✨ 無料</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400 whitespace-nowrap">
                    確認日<br />{parking.last_verified_on}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
