import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '杉並区 駐車場付きレストラン【確認済み】完全ガイド',
  description: '杉並区の駐車場付きレストランを電話確認・公式情報で厳選。荻窪・阿佐ヶ谷・西荻窪・高円寺エリア対応。',
}

export default function SuganamiIndexPage() {
  const stations = [
    { name: '荻窪', slug: 'ogikubo', emoji: '🍜', count: '収集中' },
    { name: '阿佐ヶ谷', slug: 'asagaya', emoji: '🥩', count: '収集中' },
    { name: '西荻窪', slug: 'nishiogikubo', emoji: '🍣', count: '収集中' },
    { name: '高円寺', slug: 'koenji', emoji: '🍺', count: '収集中' },
  ]
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-3">杉並区 駐車場付きレストラン</h1>
      <p className="text-gray-600 mb-8">エリアを選択してください</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stations.map((s) => (
          <Link key={s.slug} href={`/suginami/${s.slug}`}
            className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-6 text-center transition">
            <div className="text-4xl mb-2">{s.emoji}</div>
            <div className="font-bold">{s.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
