'use client'

import { useState, useCallback } from 'react'

interface ParkingInfo {
  has_parking: boolean | null
  notes: string | null
}

interface Place {
  id: string
  name: string
  slug: string
  category_primary: string
  nearest_station: string
  address: string
  parking_infos: ParkingInfo | ParkingInfo[] | null
}

const STATIONS = ['全て', '荻窪', '阿佐ヶ谷', '西荻窪', '高円寺', '浜田山', '永福町']

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [station, setStation] = useState('全て')
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  const handleLogin = useCallback(async (pw: string) => {
    setAuthError('')
    setLoading(true)
    const res = await fetch(`/api/admin?secret=${pw}`)
    if (res.status === 401) {
      setAuthError('パスワードが違います')
      setLoading(false)
      return
    }
    const data = await res.json()
    setPlaces(data.places || [])
    setAuthed(true)
    setLoading(false)
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await fetch(`/api/admin?secret=${secret}&id=${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) {
      setPlaces(prev => prev.filter(p => p.id !== deleteTarget.id))
      setMessage(`「${deleteTarget.name}」を削除しました`)
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('削除に失敗しました')
    }
    setDeleteTarget(null)
    setDeleting(false)
  }

  const getParking = (p: Place): ParkingInfo | null => {
    if (!p.parking_infos) return null
    if (Array.isArray(p.parking_infos)) return p.parking_infos[0] ?? null
    return p.parking_infos
  }

  const filtered = places.filter(p => {
    const stationMatch = station === '全て' || p.nearest_station === station
    const searchMatch = !search ||
      p.name.includes(search) ||
      p.category_primary.includes(search) ||
      p.address.includes(search)
    return stationMatch && searchMatch
  })

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f5f5f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          background: 'white', padding: '2rem', borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '320px'
        }}>
          <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', color: '#333' }}>🔒 管理画面</h1>
          <input
            type="password"
            placeholder="パスワード"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin(secret)}
            style={{
              width: '100%', padding: '0.6rem', border: '1px solid #ddd',
              borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box'
            }}
          />
          {authError && <p style={{ color: '#e53e3e', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>{authError}</p>}
          <button
            onClick={() => handleLogin(secret)}
            disabled={loading}
            style={{
              marginTop: '1rem', width: '100%', padding: '0.6rem',
              background: '#4a90e2', color: 'white', border: 'none',
              borderRadius: '4px', fontSize: '1rem', cursor: 'pointer'
            }}
          >
            {loading ? '...' : 'ログイン'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{
        background: '#2d3748', color: 'white', padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>🍜 suginami-parking 管理</span>
        <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>全{places.length}件 / 表示{filtered.length}件</span>
        <div style={{ marginLeft: 'auto' }}>
          <input
            type="text"
            placeholder="店名・カテゴリ・住所で検索"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none',
              fontSize: '0.85rem', width: '220px'
            }}
          />
        </div>
      </div>

      <div style={{
        background: 'white', padding: '0.75rem 1.5rem',
        display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap'
      }}>
        {STATIONS.map(s => (
          <button
            key={s}
            onClick={() => setStation(s)}
            style={{
              padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid',
              borderColor: station === s ? '#4a90e2' : '#e2e8f0',
              background: station === s ? '#4a90e2' : 'white',
              color: station === s ? 'white' : '#4a5568',
              fontSize: '0.85rem', cursor: 'pointer',
              fontWeight: station === s ? 'bold' : 'normal'
            }}
          >
            {s}{s !== '全て' && ` (${places.filter(p => p.nearest_station === s).length})`}
          </button>
        ))}
      </div>

      {message && (
        <div style={{ background: '#c6f6d5', color: '#276749', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
          ✅ {message}
        </div>
      )}

      <div style={{ padding: '1rem 1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568' }}>店名</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568' }}>駅</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568' }}>カテゴリ</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568' }}>駐車場</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568' }}>メモ</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#4a5568' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const parking = getParking(p)
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: '500', color: '#2d3748' }}>
                      <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#4a90e2', textDecoration: 'none' }}>
                        {p.name}
                      </a>
                    </td>
                    <td style={{ padding: '0.6rem 1rem', color: '#718096' }}>{p.nearest_station}</td>
                    <td style={{ padding: '0.6rem 1rem', color: '#718096' }}>{p.category_primary}</td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      {parking === null
                        ? <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>不明</span>
                        : parking.has_parking
                          ? <span style={{ color: '#38a169', fontWeight: 'bold' }}>✅ あり</span>
                          : <span style={{ color: '#e53e3e' }}>❌ なし</span>
                      }
                    </td>
                    <td style={{ padding: '0.6rem 1rem', color: '#718096', fontSize: '0.8rem', maxWidth: '200px' }}>
                      {parking?.notes || '—'}
                    </td>
                    <td style={{ padding: '0.6rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        style={{
                          padding: '0.3rem 0.75rem', background: '#fff5f5', color: '#e53e3e',
                          border: '1px solid #fed7d7', borderRadius: '4px',
                          cursor: 'pointer', fontSize: '0.8rem'
                        }}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>該当なし</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '8px', padding: '2rem', width: '360px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem', color: '#2d3748' }}>削除確認</h3>
            <p style={{ color: '#718096', margin: '0 0 1.5rem' }}>
              「<strong style={{ color: '#2d3748' }}>{deleteTarget.name}</strong>」を削除しますか？<br />
              <span style={{ fontSize: '0.8rem' }}>この操作は取り消せません。</span>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setDeleteTarget(null)} disabled={deleting}
                style={{
                  flex: 1, padding: '0.6rem', background: '#e2e8f0', color: '#4a5568',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                }}
              >キャンセル</button>
              <button
                onClick={handleDelete} disabled={deleting}
                style={{
                  flex: 1, padding: '0.6rem', background: '#e53e3e', color: 'white',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold'
                }}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
