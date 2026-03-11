# Sized Furniture

サイズ（幅・奥行き・高さ）で家具を検索できる Web アプリケーションです。Amazon・楽天など複数の EC サイトから商品を横断検索し、設置スペースにぴったりの家具を見つけられます。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript 5
- **UI**: React 19 + Tailwind CSS 4
- **データベース**: Supabase (PostgreSQL)
- **テスト**: Vitest + Testing Library
- **デプロイ**: Vercel
- **監視**: Sentry
- **外部 API**: Amazon Product Advertising API, 楽天 API

## セットアップ

### 前提条件

- Node.js 20+
- npm 10+
- Supabase アカウント

### インストール

```bash
git clone <repository-url>
cd sized_funiture
npm install
```

### 環境変数

`.env.example` をコピーして `.env.local` を作成し、各値を設定してください。

```bash
cp .env.example .env.local
```

必須の環境変数:

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `AMAZON_ACCESS_KEY` | Amazon PA API アクセスキー |
| `AMAZON_SECRET_KEY` | Amazon PA API シークレットキー |
| `AMAZON_PARTNER_TAG_JP` | Amazon アソシエイトタグ (JP) |
| `RAKUTEN_APPLICATION_ID` | 楽天 API アプリケーション ID |
| `RAKUTEN_AFFILIATE_ID` | 楽天アフィリエイト ID |
| `CRON_SECRET` | バッチ API の認証シークレット |

### データベース

Supabase にマイグレーションを適用します。

```bash
supabase db push
```

マイグレーションファイル:

- `001_initial_schema.sql` - テーブル定義・初期データ
- `002_categories_data.sql` - カテゴリ階層データ
- `003_colors_data.sql` - カラー・木材データ
- `004_add_au_ca_regions.sql` - AU/CA リージョン追加

### 開発サーバー

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm test` | テスト実行 |
| `npm run test:coverage` | カバレッジ付きテスト |

## プロジェクト構成

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API ルート
│   │   ├── search/       # 商品検索 API
│   │   ├── products/     # 商品詳細 API
│   │   ├── categories/   # カテゴリ API
│   │   ├── colors/       # カラー API
│   │   └── batch/        # バッチ処理 API (Cron)
│   ├── search/           # 検索結果ページ
│   ├── product/[id]/     # 商品詳細ページ
│   ├── category/[slug]/  # カテゴリページ
│   └── categories/       # カテゴリ一覧ページ
├── components/           # UI コンポーネント
├── lib/                  # ビジネスロジック
│   ├── amazon/           # Amazon API クライアント
│   ├── rakuten/          # 楽天 API クライアント
│   ├── affiliate/        # アフィリエイトリンク生成
│   ├── batch/            # バッチ処理
│   ├── supabase/         # Supabase クライアント・クエリ
│   ├── colors/           # カラー検出
│   ├── i18n/             # 多言語対応
│   ├── region/           # 地域設定
│   ├── utils/            # ユーティリティ
│   └── monitoring/       # Sentry 監視
├── types/                # 型定義
└── __tests__/            # テスト
```

## 対応地域

| 地域 | Amazon | 楽天 | 通貨 |
|------|--------|------|------|
| JP (日本) | o | o | JPY |
| US (アメリカ) | o | - | USD |
| UK (イギリス) | o | - | GBP |
| DE (ドイツ) | o | - | EUR |
| FR (フランス) | o | - | EUR |
| AU (オーストラリア) | o | - | AUD |
| CA (カナダ) | o | - | CAD |

## バッチ処理 (Cron)

商品データは Vercel Cron で地域別に毎日取得されます。

| 地域 | スケジュール (UTC) |
|------|-------------------|
| JP | 3:00 |
| US | 4:00 |
| UK | 5:00 |
| DE | 6:00 |
| FR | 7:00 |
| AU | 8:00 |
| CA | 9:00 |

## デプロイ

Vercel にデプロイされています。`main` ブランチへの push で自動デプロイが実行されます。

```bash
vercel --prod
```

## ライセンス

Private
