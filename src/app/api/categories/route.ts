import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { transformKeys } from '@/lib/utils/transform';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const searchParams = request.nextUrl.searchParams;
  const parentId = searchParams.get('parentId');
  const includeTree = searchParams.get('tree') === 'true';

  try {
    let query = supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (parentId) {
      query = query.eq('parent_id', parentId);
    }

    const { data: categories, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // ツリー構造に変換
    if (includeTree && categories) {
      const tree = buildCategoryTree(categories);
      return NextResponse.json({ categories: transformKeys(tree) });
    }

    return NextResponse.json({ categories: transformKeys(categories || []) });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface CategoryRow {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  parent_id: string | null;
  level: number;
  sort_order: number;
  icon: string | null;
  is_active: boolean;
}

interface CategoryNode extends CategoryRow {
  children: CategoryNode[];
}

function buildCategoryTree(categories: CategoryRow[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  // マップに登録
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  // ツリー構築
  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
