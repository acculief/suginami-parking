'use client'
import { useState } from 'react'

const CATEGORY_IMAGES: Record<string, string> = {
  'ラーメン':       'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=240&fit=crop&q=80',
  '寿司':           'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=240&fit=crop&q=80',
  '回転寿司':       'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=240&fit=crop&q=80',
  '焼肉':           'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=240&fit=crop&q=80',
  '鉄板焼き':       'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=240&fit=crop&q=80',
  '焼き鳥':         'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=240&fit=crop&q=80',
  'イタリアン':     'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=240&fit=crop&q=80',
  'パスタ':         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=240&fit=crop&q=80',
  'ピザ':           'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=240&fit=crop&q=80',
  '喫茶':           'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=240&fit=crop&q=80',
  'フレンチ':       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop&q=80',
  'ファミレス':     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop&q=80',
  'ファミリーレストラン': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop&q=80',
  '牛丼':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=400&h=240&fit=crop&q=80',
  '定食':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=400&h=240&fit=crop&q=80',
  '天丼':           'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=400&h=240&fit=crop&q=80',
  '天ぷら':         'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=240&fit=crop&q=80',
  '中華':           'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=240&fit=crop&q=80',
  '海鮮':           'https://images.unsplash.com/photo-1559408255-e1ee6e2f0467?w=400&h=240&fit=crop&q=80',
  '居酒屋':         'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=240&fit=crop&q=80',
  'ファストフード': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop&q=80',
  'ハンバーグ':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=240&fit=crop&q=80',
  'レストラン':     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=240&fit=crop&q=80',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=240&fit=crop&q=80'

interface Props {
  src: string | null
  category: string
  alt: string
  className?: string
}

export function PlaceImage({ src, category, alt, className }: Props) {
  const fallback = CATEGORY_IMAGES[category] || DEFAULT_IMAGE
  const [imgSrc, setImgSrc] = useState(src || fallback)

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setImgSrc(fallback)}
      loading="lazy"
    />
  )
}
