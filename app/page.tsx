import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getParkingBadge, getParkingTypeLabel } from '@/lib/scoring'
import type { PlaceWithParking } from '@/lib/types'

export const revalidate = 3600

async function getTopPlaces() {
  try {
    const { data } = await supabase
      .from('places')
      .select(`*, parking_infos(*), evidence_sources(*)`)
      .order('created_at', { ascending: false })
      .limit(6)
    return (data || []) as PlaceWithParking[]
  } catch { return [] }
}

const stations = [
  { name: '荻窪', slug: 'ogikubo', emoji: '🍜', desc: '荻窪ラーメン・イタリアン充実' },
  { name: '阿佐ヶ谷', slug: 'asagaya', emoji: '🥩', desc: '焼肉・寿司の名店が集まる' },
  { name: '西荻窪', slug: 'nishiogikubo', emoji: '🍣', desc: '隠れ家系・和食が豊富' },
  { name: '高円寺', slug: 'koenji', emoji: '🍺', desc: '居酒屋・ラーメン・カフェ' },
]

export default async function HomePage() {
  const places = await getTopPlaces()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
          杉並区 駐車場付きレストラン<br />
          <span className="text-emerald-700">【確認済み】完全ガイド</span>
        </h1>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          電話確認・公式サイト調査済みの駐車場情報のみ掲載。<br />
          「行ったら満車だった」を防ぐ、信頼のレストランガイド。
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">🟢 電話確認済み</div>
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">🟡 公式確認済み</div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">🔵 AI抽出</div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">エリアから探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stations.map((s) => (
            <Link
              key={s.slug}
              href={`/suginami/${s.slug}`}
              className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-5 transition group"
            >
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="font-bold text-lg group-hover:text-emerald-700 transition">{s.name}</div>
              <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {places.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">最近確認したレストラン</h2>
          <div className="space-y-3">
            {places.map((place) => {
              const parking = place.parking_infos?.[0]
              if (!parking) return null
              const badge = getParkingBadge(parking.verification_status)
              return (
                <Link
                  key={place.id}
                  href={`/p/${place.slug}`}
                  className="flex items-center gap-4 bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-4 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{place.name}</div>
                    <div className="text-sm text-gray-500">{place.category_primary} · {place.nearest_station}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
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

      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6 text-center">なぜ信頼できるのか</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📞', title: '電話による一次確認', desc: 'スタッフが実際に店舗へ電話確認。情報の鮮度と正確さを担保。' },
            { icon: '📋', title: '根拠情報を全開示', desc: '公式サイトの引用文・確認日を掲載。情報源を隠しません。' },
            { icon: '🔄', title: '定期再確認', desc: '確認から1年後に再確認タスクを自動生成。古い情報を許しません。' },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
