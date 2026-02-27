# 杉並パーキングめし

駐車場確認済みレストランガイド - 杉並区テスト版

## 概要
杉並区の駐車場付きレストランを電話確認・公式情報で厳選したSEOメディア。

## エリア
- 荻窪 / 阿佐ヶ谷 / 西荻窪 / 高円寺

## セットアップ
```bash
cp .env.example .env.local
# 環境変数を設定してから:
npm install
npx tsx scripts/seed.ts
npm run dev
```

## デプロイ
- GitHub: https://github.com/acculief/suginami-parking
- Vercel: https://suginami-parking.vercel.app
