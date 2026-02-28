import { supabaseAdmin as supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { getParkingBadge, getParkingTypeLabel } from '@/lib/scoring'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { PlaceWithParking, EvidenceType } from '@/lib/types'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase.from('places').select('*, parking_infos(*)').eq('slug', slug).single()
  if (!data) return {}
  const parking = (data as PlaceWithParking).parking_infos
  return {
    title: `${data.name} 駐車場情報【確認済み】| 杉並パーキングめし`,
    description: `${data.name}（${data.nearest_station}）の駐車場情報。${parking ? getParkingTypeLabel(parking.parking_type) + '・' + parking.spaces_count + '台' : ''}。確認済み情報のみ掲載。`,
  }
}

const evidenceLabels: Record<EvidenceType, string> = {
  official_site: '公式サイト',
  phone_call: '電話確認',
  official_pdf: '公式PDF',
  on_site_photo: '現地写真',
  other: 'その他',
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, error } = await supabase
    .from('places')
    .select(`*, parking_infos(*), evidence_sources(*)`)
    .eq('slug', slug)
    .single()

  if (error || !data) notFound()

  const place = data as PlaceWithParking
  const parking = place.parking_infos
  const evidence = place.evidence_sources || []
  const badge = parking ? getParkingBadge(parking.verification_status) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: place.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressLocality: '杉並区',
      addressRegion: '東京都',
      addressCountry: 'JP',
    },
    telephone: place.phone,
    url: place.website_url,
    geo: place.lat && place.lng ? {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    } : undefined,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-700">トップ</Link>
        <span>/</span>
        <span>{place.nearest_station}</span>
        <span>/</span>
        <span>{place.name}</span>
      </nav>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">{place.category_primary} · {place.nearest_station}駅エリア</div>
            <h1 className="text-2xl font-black">{place.name}</h1>
          </div>
          {badge && (
            <span className={`text-sm px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600">{place.address}</div>
        {place.phone && (
          <a href={`tel:${place.phone}`} className="text-emerald-700 text-sm mt-1 block hover:underline">
            {place.phone}
          </a>
        )}
        {place.website_url && (
          <a href={place.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-1 block hover:underline">
            公式サイト
          </a>
        )}
      </div>

      {parking && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-black mb-5 text-emerald-900">駐車場情報</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">駐車場タイプ</div>
              <div className="font-bold text-lg">{getParkingTypeLabel(parking.parking_type)}</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">台数</div>
              <div className="font-bold text-lg">{parking.spaces_count ? `${parking.spaces_count}台` : '不明'}</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">高さ制限</div>
              <div className="font-bold text-lg">{parking.height_limit_cm ? `${parking.height_limit_cm}cm以下` : '制限なし/不明'}</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">料金</div>
              <div className="font-bold text-lg">{parking.is_free ? '無料' : parking.fee_text || '要確認'}</div>
            </div>
          </div>
          {parking.usage_conditions && (
            <div className="bg-white rounded-xl p-4 mt-4">
              <div className="text-xs text-gray-500 mb-1">利用条件</div>
              <div className="text-sm">{parking.usage_conditions}</div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>最終確認日: <strong className="text-gray-700">{parking.last_verified_on}</strong></span>
            <span>信頼スコア: <strong className="text-emerald-700">{parking.confidence_score}/100</strong></span>
          </div>
        </div>
      )}

      {evidence.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">確認根拠</h2>
          <div className="space-y-3">
            {evidence.map((ev: any) => (
              <div key={ev.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                    {evidenceLabels[ev.evidence_type as EvidenceType] || ev.evidence_type}
                  </span>
                  <span className="text-xs text-gray-400">信頼度: {ev.reliability_score}/100</span>
                  <span className="text-xs text-gray-400">{ev.captured_at?.split('T')[0]}</span>
                </div>
                {ev.quote && (
                  <blockquote className="text-sm text-gray-700 border-l-2 border-emerald-400 pl-3 italic">
                    &quot;{ev.quote}&quot;
                  </blockquote>
                )}
                {ev.url && (
                  <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:underline mt-2 block">
                    ソースを確認
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>ご来店前に必ずご確認ください</strong>
        <p className="mt-1">掲載情報は確認時点のものです。駐車場情報は変更される場合があります。ご来店前に店舗へお電話でご確認いただくことをお勧めします。</p>
      </div>
    </div>
  )
}
