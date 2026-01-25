import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import type { ProductSearchParams, RegionCode } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const supabase = createServerSupabaseClient();

  // パラメータ取得
  const params: ProductSearchParams = {
    widthMin: searchParams.get('widthMin') ? Number(searchParams.get('widthMin')) : undefined,
    widthMax: searchParams.get('widthMax') ? Number(searchParams.get('widthMax')) : undefined,
    depthMin: searchParams.get('depthMin') ? Number(searchParams.get('depthMin')) : undefined,
    depthMax: searchParams.get('depthMax') ? Number(searchParams.get('depthMax')) : undefined,
    heightMin: searchParams.get('heightMin') ? Number(searchParams.get('heightMin')) : undefined,
    heightMax: searchParams.get('heightMax') ? Number(searchParams.get('heightMax')) : undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    colorGroupId: searchParams.get('colorGroupId') || undefined,
    woodTypeId: searchParams.get('woodTypeId') || undefined,
    regionCode: (searchParams.get('region') as RegionCode) || 'jp',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    sortBy: (searchParams.get('sortBy') as 'price' | 'relevance' | 'newest') || 'relevance',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };

  try {
    // 地域IDを取得
    const { data: region } = await supabase
      .from('regions')
      .select('id')
      .eq('code', params.regionCode)
      .single();

    // クエリ構築
    let query = supabase
      .from('products_cache')
      .select(`
        *,
        categories (id, name, name_en, slug),
        color_groups (id, name, name_en, slug, hex_code),
        wood_types (id, name, name_en)
      `, { count: 'exact' })
      .eq('is_available', true);

    // 地域フィルタ
    if (region) {
      query = query.eq('region_id', region.id);
    }

    // サイズフィルタ
    if (params.widthMin !== undefined) {
      query = query.gte('width_cm', params.widthMin);
    }
    if (params.widthMax !== undefined) {
      query = query.lte('width_cm', params.widthMax);
    }
    if (params.depthMin !== undefined) {
      query = query.gte('depth_cm', params.depthMin);
    }
    if (params.depthMax !== undefined) {
      query = query.lte('depth_cm', params.depthMax);
    }
    if (params.heightMin !== undefined) {
      query = query.gte('height_cm', params.heightMin);
    }
    if (params.heightMax !== undefined) {
      query = query.lte('height_cm', params.heightMax);
    }

    // カテゴリフィルタ（子孫も含む）
    if (params.categoryId) {
      const { data: descendants } = await supabase
        .from('category_paths')
        .select('descendant_id')
        .eq('ancestor_id', params.categoryId);
      
      if (descendants && descendants.length > 0) {
        const ids = descendants.map(d => d.descendant_id);
        query = query.in('category_id', ids);
      } else {
        query = query.eq('category_id', params.categoryId);
      }
    }

    // カラーフィルタ
    if (params.colorGroupId) {
      query = query.eq('color_group_id', params.colorGroupId);
    }

    // 木材タイプフィルタ
    if (params.woodTypeId) {
      query = query.eq('wood_type_id', params.woodTypeId);
    }

    // ソート
    const orderColumn = params.sortBy === 'price' 
      ? 'price' 
      : params.sortBy === 'newest' 
        ? 'created_at' 
        : 'fetched_at';
    query = query.order(orderColumn, { ascending: params.sortOrder === 'asc' });

    // ページネーション
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // 実行
    const { data: products, count, error } = await query;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Search failed', details: error.message },
        { status: 500 }
      );
    }

    // 検索ログを保存
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipCountry = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry') || undefined;

    await supabase.from('search_logs').insert({
      width_min: params.widthMin,
      width_max: params.widthMax,
      depth_min: params.depthMin,
      depth_max: params.depthMax,
      height_min: params.heightMin,
      height_max: params.heightMax,
      category_id: params.categoryId,
      color_group_id: params.colorGroupId,
      wood_type_id: params.woodTypeId,
      region_code: params.regionCode,
      results_count: count || 0,
      user_agent: userAgent,
      ip_country: ipCountry,
    });

    return NextResponse.json({
      products: products || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      searchParams: params,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
