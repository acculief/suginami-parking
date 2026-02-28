import Link from 'next/link'
import { supabaseAdmin as sb } from '@/lib/supabase'

export const revalidate = 3600

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

      {/* Latest places */}
      {places.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">最近追加されたレストラン</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {places.map((place: any) => {
              const p = place.parking_infos?.[0]
              if (!p) return null
              const v = VERIFICATION[p.verification_status] || VERIFICATION.ai_extracted
              return (
                <Link key={place.id} href={`/p/${place.slug}`}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{place.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{place.category_primary} · {place.nearest_station}駅</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${v.color}`}>
                      {v.label}
                    </span>
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
