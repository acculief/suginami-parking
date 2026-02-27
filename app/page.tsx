import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { getParkingBadge, getParkingTypeLabel } from '@/lib/scoring'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getTopPlaces() {
  try {
    const { data } = await supabase
      .from('places')
      .select('*, parking_infos(*)')
      .order('created_at', { ascending: false })
      .limit(6)
    return data || []
  } catch { return [] }
}

const stations = [
  { name: '荻窪', slug: 'ogikubo', emoji: '🍜' },
  { name: '阿佐ヶ谷', slug: 'asagaya', emoji: '🥩' },
  { name: '西荻窪', slug: 'nishiogikubo', emoji: '🍣' },
  { name: '高円寺', slug: 'koenji', emoji: '🍺' },
]

export default async function HomePage() {
  const places = await getTopPlaces()

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">
          杉並区 駐車場付き<br className="sm:hidden" />レストラン
          <span className="block sm:inline text-emerald-700 text-lg sm:text-3xl">【確認済み】</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          電話確認・公式情報で厳選。「行ったら満車」を防ぐ。
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium">🟢 電話確認済み</span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-medium">🟡 公式確認済み</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium">🔵 AI抽出</span>
        </div>
      </div>

      {/* Station Grid - 2x2 on SP */}
      <section className="mb-6">
        <h2 className="text-base sm:text-2xl font-bold mb-3">エリアから探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stations.map((s) => (
            <Link key={s.slug} href={`/suginami/${s.slug}`}
              className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-4 text-center transition active:bg-emerald-50 group">
              <div className="text-3xl mb-1.5">{s.emoji}</div>
              <div className="font-bold text-sm group-hover:text-emerald-700 transition">{s.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Places */}
      {places.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base sm:text-2xl font-bold mb-3">確認済みレストラン</h2>
          <div className="space-y-2">
            {places.map((place: any) => {
              const parking = place.parking_infos?.[0]
              if (!parking) return null
              const badge = getParkingBadge(parking.verification_status)
              return (
                <Link key={place.id} href={`/p/${place.slug}`}
                  className="flex items-center gap-3 bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-3 sm:p-4 transition">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{place.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{place.category_primary} · {place.nearest_station}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${badge.color} whitespace-nowrap`}>
                      {badge.emoji} {badge.label}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{getParkingTypeLabel(parking.parking_type)}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Why trust - 1col on SP */}
      <section className="bg-gray-50 rounded-2xl p-4 sm:p-8">
        <h2 className="text-base sm:text-xl font-bold mb-4 text-center">なぜ信頼できるのか</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {[
            { icon: '📞', title: '電話確認', desc: 'スタッフが直接電話で確認' },
            { icon: '📋', title: '根拠開示', desc: '公式サイト引用・確認日を掲載' },
            { icon: '🔄', title: '定期更新', desc: '1年後に自動で再確認' },
          ].map((f) => (
            <div key={f.title} className="flex sm:flex-col items-center sm:items-start sm:text-center gap-3 sm:gap-0">
              <div className="text-2xl sm:text-3xl sm:mb-2 flex-shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-bold text-sm">{f.title}</h3>
                <p className="text-xs text-gray-600 sm:mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
