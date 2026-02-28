import Link from 'next/link'
import { supabaseAdmin as sb } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

const STATIONS: Record<string, { name: string; title: string; desc: string }> = {
  ogikubo: {
    name: '荻窪',
    title: '荻窪 駐車場付きレストラン【確認済み】',
    desc: '荻窪エリアの駐車場付きレストランを確認済み情報で紹介。専用駐車場・提携駐車場のある飲食店を厳選。',
  },
  asagaya: {
    name: '阿佐ヶ谷',
    title: '阿佐ヶ谷 駐車場付きレストラン【確認済み】',
    desc: '阿佐ヶ谷エリアの駐車場付きレストランを確認済み情報で紹介。',
  },
  nishiogikubo: {
    name: '西荻窪',
    title: '西荻窪 駐車場付きレストラン【確認済み】',
    desc: '西荻窪エリアの駐車場付きレストランを厳選。子連れ・ファミリーでも安心。',
  },
  koenji: {
    name: '高円寺',
    title: '高円寺 駐車場付きレストラン【確認済み】',
    desc: '高円寺エリアの駐車場付きレストランを確認済み情報で紹介。',
  },
  hamadayama: {
    name: '浜田山',
    title: '浜田山 駐車場付きレストラン【確認済み】',
    desc: '浜田山エリアの駐車場付きレストランを確認済み情報で紹介。ファミリーにも便利な駐車場完備の飲食店。',
  },
  eifukucho: {
    name: '永福町',
    title: '永福町 駐車場付きレストラン【確認済み】',
    desc: '永福町エリアの駐車場付きレストランを確認済み情報で紹介。',
  },
}

const VERIFICATION: Record<string, { label: string; color: string }> = {
  phone_confirmed: { label: '電話確認済み', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  on_site_confirmed: { label: '現地確認済み', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  official_confirmed: { label: '公式確認', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ai_extracted: { label: 'AI推定', color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const PARKING_TYPE: Record<string, string> = {
  on_site_exclusive: '専用駐車場',
  on_site_shared: '共有駐車場',
  partner_lot: '提携駐車場',
  coin_nearby: '近隣コインP',
  unknown: '不明',
}

const CATEGORY_IMAGES: Record<string, string> = {
  'ラーメン':       'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=120&h=120&fit=crop&q=80',
  '寿司':           'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=120&h=120&fit=crop&q=80',
  '回転寿司':       'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=120&h=120&fit=crop&q=80',
  '焼肉':           'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=120&h=120&fit=crop&q=80',
  '鉄板焼き':       'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=120&h=120&fit=crop&q=80',
  '焼き鳥':         'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=120&h=120&fit=crop&q=80',
  'イタリアン':     'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop&q=80',
  'パスタ':         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop&q=80',
  'ピザ':           'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop&q=80',
  '喫茶':           'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop&q=80',
  'フレンチ':       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop&q=80',
  'ファミレス':     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop&q=80',
  'ファミリーレストラン': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop&q=80',
  '牛丼':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=120&h=120&fit=crop&q=80',
  '定食':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=120&h=120&fit=crop&q=80',
  '天丼':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=120&h=120&fit=crop&q=80',
  '天ぷら':         'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=120&h=120&fit=crop&q=80',
  '中華':           'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=120&h=120&fit=crop&q=80',
  '海鮮':           'https://images.unsplash.com/photo-1559408255-e1ee6e2f0467?w=120&h=120&fit=crop&q=80',
  '居酒屋':         'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=120&h=120&fit=crop&q=80',
  'ファストフード': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop&q=80',
  'ハンバーグ':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop&q=80',
  'レストラン':     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop&q=80',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop&q=80'

export async function generateMetadata({ params }: { params: Promise<{ station: string }> }): Promise<Metadata> {
  const { station } = await params
  const info = STATIONS[station]
  if (!info) return {}
  return {
    title: info.title,
    description: info.desc,
  }
}

export async function generateStaticParams() {
  return Object.keys(STATIONS).map(s => ({ station: s }))
}

export default async function StationPage({ params }: { params: Promise<{ station: string }> }) {
  const { station } = await params
  const info = STATIONS[station]
  if (!info) notFound()

  let places: any[] = []
  try {
    const { data } = await sb
      .from('places')
      .select('*, parking_infos(*)')
      .eq('nearest_station', info.name)
      .order('created_at', { ascending: false })
    places = data || []
  } catch {}

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">トップ</Link>
        <span>/</span>
        <span className="text-gray-900">{info.name}駅周辺</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-black mb-1">{info.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{places.length}件の駐車場確認済みレストラン</p>

      {/* Restaurant list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {places.map((place: any) => {
          const p = place.parking_infos
          if (!p) return null
          const v = VERIFICATION[p.verification_status] || VERIFICATION.ai_extracted
          const pType = PARKING_TYPE[p.parking_type] || p.parking_type

          return (
            <Link key={place.id} href={`/p/${place.slug}`}
              className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-gray-50 transition">
              {/* サムネイル */}
              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.image_url || CATEGORY_IMAGES[place.category_primary] || DEFAULT_IMAGE}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <p className="font-bold text-sm">{place.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${v.color}`}>
                    {v.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{place.category_primary}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {pType}
                  {p.spaces_count && ` · ${p.spaces_count}台`}
                  {p.height_limit_cm && ` · 高さ${p.height_limit_cm}cm以下`}
                  {p.is_free && ' · 無料'}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        })}
      </div>

      {places.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          このエリアの情報はまだありません
        </div>
      )}
    </div>
  )
}
