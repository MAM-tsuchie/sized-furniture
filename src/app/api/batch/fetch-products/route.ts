import { NextRequest, NextResponse } from 'next/server';
import { fetchAllProducts } from '@/lib/batch/product-fetcher';
import type { RegionCode } from '@/types';

/**
 * 商品データ取得バッチAPI
 * 
 * 本番環境ではCronジョブから呼び出す想定
 * Vercel Cron または外部サービス（GitHub Actions等）から定期実行
 */
export async function POST(request: NextRequest) {
  // 認証チェック（本番環境では必須）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const regionCode = (body.region as RegionCode) || 'jp';

    console.log(`Starting product fetch for region: ${regionCode}`);

    const result = await fetchAllProducts(regionCode);

    console.log('Product fetch completed:', result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Batch fetch error:', error);
    return NextResponse.json(
      { error: 'Batch processing failed' },
      { status: 500 }
    );
  }
}

// Vercel Cron設定用のGETエンドポイント
export async function GET(request: NextRequest) {
  // Vercel Cronからのリクエストを確認
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 日本の商品を取得
  const result = await fetchAllProducts('jp');

  return NextResponse.json({
    success: true,
    result,
  });
}
