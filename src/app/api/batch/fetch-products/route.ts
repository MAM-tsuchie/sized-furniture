import { type NextRequest, NextResponse } from 'next/server';
import { fetchAllProducts } from '@/lib/batch/product-fetcher';
import type { RegionCode } from '@/types';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
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
      success: !result.timedOut,
      partial: result.timedOut ?? false,
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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const regionParam = request.nextUrl.searchParams.get('region');
  const validRegions: RegionCode[] = ['jp', 'us', 'uk', 'de', 'fr', 'au', 'ca'];
  const regionCode: RegionCode = validRegions.includes(regionParam as RegionCode)
    ? (regionParam as RegionCode)
    : 'jp';

  try {
    console.log(`[Cron] Starting product fetch for region: ${regionCode}`);

    const result = await fetchAllProducts(regionCode);

    const elapsedSec = Math.round((result.elapsedMs ?? 0) / 1000);
    console.log(`[Cron] Product fetch completed for ${regionCode} in ${elapsedSec}s:`, result);

    return NextResponse.json({
      success: !result.timedOut,
      partial: result.timedOut ?? false,
      region: regionCode,
      result,
    });
  } catch (error) {
    console.error(`[Cron] Batch fetch error for ${regionCode}:`, error);
    return NextResponse.json(
      { error: 'Batch processing failed', region: regionCode },
      { status: 500 }
    );
  }
}
