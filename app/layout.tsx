import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '杉並区 駐車場付きレストラン【確認済み】',
  description: '杉並区の駐車場付きレストランを確認済み情報で紹介。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-base font-black text-emerald-700 whitespace-nowrap">
                🚗 杉並P めし
              </Link>
              <nav className="flex items-center gap-0.5 sm:gap-2 overflow-x-auto">
                {[
                  { href: '/suginami/ogikubo', label: '荻窪' },
                  { href: '/suginami/asagaya', label: '阿佐ヶ谷' },
                  { href: '/suginami/nishiogikubo', label: '西荻窪' },
                  { href: '/suginami/koenji', label: '高円寺' },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition whitespace-nowrap font-medium">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-100 mt-12 py-6 text-center text-gray-400 text-xs px-4">
          <p>© 2024 杉並パーキングめし</p>
          <p className="mt-1">掲載情報は確認時点のものです。ご来店前に必ずご確認ください。</p>
        </footer>
      </body>
    </html>
  )
}
