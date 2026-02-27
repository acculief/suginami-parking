import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '杉並区 駐車場付きレストラン【確認済み】完全ガイド',
  description: '杉並区の駐車場付きレストランを電話確認・公式情報で厳選。荻窪・阿佐ヶ谷・西荻窪・高円寺エリア対応。',
}

export default function SuganamiIndexPage() {
  const stations = [
    { name: '荻窪', slug: 'ogikubo', count: '13件掲載' },
    { name: '阿佐ヶ谷', slug: 'asagaya', count: '11件掲載' },
    { name: '西荻窪', slug: 'nishiogikubo', count: '9件掲載' },
    { name: '高円寺', slug: 'koenji', count: '10件掲載' },
  ]
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">トップ</Link>
        <span>/</span>
        <span className="text-gray-900">杉並区</span>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-black mb-3">杉並区 駐車場付きレストラン</h1>
      <p className="text-gray-600 mb-8">エリアを選択してください</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stations.map((s) => (
          <Link key={s.slug} href={`/suginami/${s.slug}`}
            className="bg-white border border-gray-200 hover:border-emerald-400 rounded-xl p-6 text-center transition group">
            <div className="font-bold group-hover:text-emerald-700 transition">{s.name}</div>
            <div className="text-xs text-gray-500 mt-1">{s.count}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
