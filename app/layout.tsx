import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto', weight: ['400', '700', '900'] })

export const metadata: Metadata = {
  title: '杉並区 駐車場付きレストラン【確認済み】',
  description: '杉並区の駐車場付きレストランを電話確認・公式情報で厳選。荻窪・阿佐ヶ谷・西荻窪・高円寺エリア対応。子連れ・家族でも安心。',
  openGraph: {
    title: '杉並区 駐車場付きレストラン',
    description: '確認済み駐車場情報付きレストランガイド',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans bg-white text-gray-900 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="text-lg font-black text-emerald-700 tracking-tight whitespace-nowrap">
              🚗 杉並パーキングめし
            </Link>
            <nav className="flex gap-4 text-sm text-gray-600 overflow-x-auto">
              <Link href="/suginami/ogikubo" className="hover:text-emerald-700 whitespace-nowrap">荻窪</Link>
              <Link href="/suginami/asagaya" className="hover:text-emerald-700 whitespace-nowrap">阿佐ヶ谷</Link>
              <Link href="/suginami/nishiogikubo" className="hover:text-emerald-700 whitespace-nowrap">西荻窪</Link>
              <Link href="/suginami/koenji" className="hover:text-emerald-700 whitespace-nowrap">高円寺</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-gray-400 text-sm">
          <p>© 2024 杉並パーキングめし — 確認済み駐車場情報付きレストランガイド</p>
          <p className="mt-1 text-xs">掲載情報は確認時点のものです。ご来店前に必ずお電話でご確認ください。</p>
        </footer>
      </body>
    </html>
  )
}
