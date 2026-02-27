import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { default: '杉並パーキングめし | 駐車場確認済みレストラン', template: '%s | 杉並パーキングめし' },
  description: '杉並区の駐車場付きレストランを電話・公式確認した情報を掲載。荻窪・阿佐ヶ谷・西荻窪・高円寺。',
}

const STATIONS = [
  { href: '/suginami/ogikubo', label: '荻窪' },
  { href: '/suginami/asagaya', label: '阿佐ヶ谷' },
  { href: '/suginami/nishiogikubo', label: '西荻窪' },
  { href: '/suginami/koenji', label: '高円寺' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center h-14 gap-4">
              <Link href="/" className="font-black text-emerald-700 text-base sm:text-lg shrink-0 leading-tight">
                杉並パーキングめし
              </Link>
              <nav className="flex items-center gap-0.5 ml-auto overflow-x-auto">
                {STATIONS.map(s => (
                  <Link key={s.href} href={s.href}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition whitespace-nowrap font-medium">
                    {s.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-100 mt-12 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-gray-500">掲載情報は確認時点のものです。来店前に必ずご確認ください。</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 杉並パーキングめし</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
