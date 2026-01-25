import { supabase } from './client';
import type { 
  Category, 
  ColorGroup, 
  WoodType, 
  Product, 
  ProductSearchParams,
  ProductSearchResult,
  RegionCode 
} from '@/types';

/**
 * カテゴリ一覧を取得（階層構造付き）
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

/**
 * カテゴリをツリー構造に変換
 */
export function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  // まずすべてのカテゴリをマップに登録
  for (const category of categories) {
    map.set(category.id, { ...category, children: [] });
  }

  // 親子関係を構築
  for (const category of categories) {
    const node = map.get(category.id)!;
    if (category.parentId && map.has(category.parentId)) {
      const parent = map.get(category.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * カテゴリの子孫IDをすべて取得
 */
export async function getCategoryDescendants(categoryId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('category_paths')
    .select('descendant_id')
    .eq('ancestor_id', categoryId);

  if (error) {
    console.error('Error fetching category descendants:', error);
    return [categoryId];
  }

  return data?.map((d) => d.descendant_id) || [categoryId];
}

/**
 * カラーグループ一覧を取得
 */
export async function getColorGroups(): Promise<ColorGroup[]> {
  const { data, error } = await supabase
    .from('color_groups')
    .select('*, color_types(*)')
    .order('sort_order');

  if (error) {
    console.error('Error fetching color groups:', error);
    return [];
  }

  return data || [];
}

/**
 * 木材タイプ一覧を取得
 */
export async function getWoodTypes(): Promise<WoodType[]> {
  const { data, error } = await supabase
    .from('wood_types')
    .select('*, color_groups(*)')
    .order('sort_order');

  if (error) {
    console.error('Error fetching wood types:', error);
    return [];
  }

  return data || [];
}

/**
 * 商品を検索
 */
export async function searchProducts(
  params: ProductSearchParams
): Promise<ProductSearchResult> {
  const {
    widthMin,
    widthMax,
    depthMin,
    depthMax,
    heightMin,
    heightMax,
    categoryId,
    colorGroupId,
    woodTypeId,
    regionCode = 'jp',
    page = 1,
    limit = 20,
    sortBy = 'relevance',
    sortOrder = 'desc',
  } = params;

  let query = supabase
    .from('products_cache')
    .select('*, categories(*), color_groups(*), wood_types(*)', { count: 'exact' })
    .eq('is_available', true);

  // 地域フィルタ
  const { data: region } = await supabase
    .from('regions')
    .select('id')
    .eq('code', regionCode)
    .single();

  if (region) {
    query = query.eq('region_id', region.id);
  }

  // サイズフィルタ
  if (widthMin !== undefined) query = query.gte('width_cm', widthMin);
  if (widthMax !== undefined) query = query.lte('width_cm', widthMax);
  if (depthMin !== undefined) query = query.gte('depth_cm', depthMin);
  if (depthMax !== undefined) query = query.lte('depth_cm', depthMax);
  if (heightMin !== undefined) query = query.gte('height_cm', heightMin);
  if (heightMax !== undefined) query = query.lte('height_cm', heightMax);

  // カテゴリフィルタ（子孫も含む）
  if (categoryId) {
    const descendantIds = await getCategoryDescendants(categoryId);
    query = query.in('category_id', descendantIds);
  }

  // カラーフィルタ
  if (colorGroupId) {
    query = query.eq('color_group_id', colorGroupId);
  }

  // 木材タイプフィルタ
  if (woodTypeId) {
    query = query.eq('wood_type_id', woodTypeId);
  }

  // ソート
  const orderColumn = sortBy === 'price' ? 'price' : sortBy === 'newest' ? 'created_at' : 'fetched_at';
  query = query.order(orderColumn, { ascending: sortOrder === 'asc' });

  // ページネーション
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error searching products:', error);
    return {
      products: [],
      total: 0,
      page,
      totalPages: 0,
      searchParams: params,
    };
  }

  return {
    products: (data as Product[]) || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
    searchParams: params,
  };
}

/**
 * 検索ログを保存
 */
export async function logSearch(
  params: ProductSearchParams,
  resultsCount: number,
  userAgent?: string,
  ipCountry?: string
): Promise<void> {
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
    results_count: resultsCount,
    user_agent: userAgent,
    ip_country: ipCountry,
  });
}
