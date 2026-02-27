import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '杉並パーキングめし'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>
          SUGINAMI PARKING MESHI
        </div>
        <div style={{ color: 'white', fontSize: '54px', fontWeight: '900', lineHeight: 1.25, marginBottom: '24px' }}>
          杉並区駐車場確認済みレストラン
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: '電話確認済み', bg: 'rgba(255,255,255,0.25)' },
            { label: '公式確認済み', bg: 'rgba(255,255,255,0.15)' },
          ].map(b => (
            <div key={b.label} style={{
              background: b.bg,
              borderRadius: '999px',
              padding: '8px 20px',
              color: 'white',
              fontSize: '22px',
              fontWeight: '600',
            }}>
              {b.label}
            </div>
          ))}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '24px' }}>
          荻窪 / 阿佐ヶ谷 / 西荻窪 / 高円寺
        </div>
      </div>
    ),
    { ...size }
  )
}
