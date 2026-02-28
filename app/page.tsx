import Link from 'next/link'
import { supabaseAdmin as sb } from '@/lib/supabase'

export const revalidate = 0

const STATIONS = [
  { slug: 'ogikubo', name: '荻窪', count: 20 },
  { slug: 'asagaya', name: '阿佐ヶ谷', count: 17 },
  { slug: 'nishiogikubo', name: '西荻窪', count: 9 },
  { slug: 'koenji', name: '高円寺', count: 21 },
  { slug: 'hamadayama', name: '浜田山', count: 3 },
  { slug: 'eifukucho', name: '永福町', count: 1 },
]

const VERIFICATION: Record<string, { label: string; color: string }> = {
  phone_confirmed: { label: '電話確認済み', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  on_site_confirmed: { label: '現地確認済み', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  official_confirmed: { label: '公式確認済み', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ai_extracted: { label: 'AI推定', color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

// カテゴリ別Unsplashフォールバック画像
const CATEGORY_IMAGES: Record<string, string> = {
  'ラーメン':       'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=240&fit=crop&q=80',
  '寿司':           'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=240&fit=crop&q=80',
  '回転寿司':       'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=240&fit=crop&q=80',
  '焼肉':           'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=240&fit=crop&q=80',
  '鉄板焼き':       'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=240&fit=crop&q=80',
  '焼き鳥':         'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=240&fit=crop&q=80',
  'イタリアン':     'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=240&fit=crop&q=80',
  'パスタ':         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=240&fit=crop&q=80',
  'ピザ':           'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=240&fit=crop&q=80',
  '喫茶':           'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=240&fit=crop&q=80',
  'フレンチ':       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop&q=80',
  'ファミレス':     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop&q=80',
  'ファミリーレストラン': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop&q=80',
  '牛丼':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=400&h=240&fit=crop&q=80',
  '定食':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=400&h=240&fit=crop&q=80',
  '天丼':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=400&h=240&fit=crop&q=80',
  '天ぷら':         'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=240&fit=crop&q=80',
  '中華':           'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=240&fit=crop&q=80',
  '海鮮':           'https://images.unsplash.com/photo-1559408255-e1ee6e2f0467?w=400&h=240&fit=crop&q=80',
  '居酒屋':         'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=240&fit=crop&q=80',
  'ファストフード': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop&q=80',
  'ハンバーグ':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop&q=80',
  'レストラン':     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=240&fit=crop&q=80',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=240&fit=crop&q=80'

async function getLatestPlaces() {
  try {
    const { data } = await sb
      .from('places')
      .select('*, parking_infos(*)')
      .order('created_at', { ascending: false })
      .limit(8)
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const places = await getLatestPlaces()
  const validPlaces = places.filter((p: any) => p.parking_infos)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">
          杉並区の駐車場付きレストラン<br />
          <span className="text-emerald-700">確認済みガイド</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl">
          電話・公式サイトで確認した駐車場情報のみ掲載。「行ったら満車だった」を防ぎます。
        </p>
      </div>

      {/* Verification legend */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(VERIFICATION).filter(([k]) => k !== 'on_site_confirmed').map(([key, v]) => (
          <span key={key} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${v.color}`}>
            {v.label}
          </span>
        ))}
      </div>

      {/* Station cards */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-3">エリアから探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATIONS.map(s => (
            <Link key={s.slug} href={`/suginami/${s.slug}`}
              className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-4 sm:p-5 transition group">
              <p className="font-bold text-sm sm:text-base group-hover:text-emerald-700 transition">{s.name}</p>
              <p className="text-xs text-gray-500 mt-1">{s.count}件掲載</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest places — card grid with images */}
      {validPlaces.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-4">最近追加されたレストラン</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {validPlaces.map((place: any) => {
              const pi = place.parking_infos
              const v = VERIFICATION[pi?.verification_status] || VERIFICATION.ai_extracted
              const imgSrc = place.image_url || CATEGORY_IMAGES[place.category_primary] || DEFAULT_IMAGE
              return (
                <Link key={place.id} href={`/p/${place.slug}`}
                  className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl overflow-hidden transition group">
                  {/* 店舗写真 */}
                  <div className="relative w-full h-28 sm:h-32 bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm ${v.color}`}>
                      {v.label}
                    </span>
                  </div>
                  {/* テキスト */}
                  <div className="p-3">
                    <p className="font-bold text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-emerald-700 transition">
                      {place.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{place.category_primary} · {place.nearest_station}駅</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Why trust section */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8">
        <h2 className="text-base font-bold text-gray-900 mb-5">なぜ信頼できるのか</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
          {[
            { title: '電話での直接確認', desc: 'スタッフが実際に電話をかけ、駐車場の有無・台数・料金を確認しています。' },
            { title: '公式情報の引用', desc: 'お店の公式サイト・SNSの情報を引用元URLとともに掲載しています。' },
            { title: '確認日の記載', desc: 'いつ確認した情報かを全件掲載。古い情報を掲載し続けません。' },
          ].map(f => (
            <div key={f.title}>
              <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
