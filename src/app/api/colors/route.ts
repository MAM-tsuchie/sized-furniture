import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const searchParams = request.nextUrl.searchParams;
  const typeSlug = searchParams.get('type'); // 'wood', 'solid', 'metallic'

  try {
    // カラータイプ取得
    const { data: colorTypes, error: typesError } = await supabase
      .from('color_types')
      .select('*')
      .order('sort_order');

    if (typesError) {
      return NextResponse.json(
        { error: 'Failed to fetch color types' },
        { status: 500 }
      );
    }

    // カラーグループ取得
    let colorGroupsQuery = supabase
      .from('color_groups')
      .select('*, color_types (slug)')
      .order('sort_order');

    if (typeSlug) {
      const type = colorTypes?.find(t => t.slug === typeSlug);
      if (type) {
        colorGroupsQuery = colorGroupsQuery.eq('color_type_id', type.id);
      }
    }

    const { data: colorGroups, error: groupsError } = await colorGroupsQuery;

    if (groupsError) {
      return NextResponse.json(
        { error: 'Failed to fetch color groups' },
        { status: 500 }
      );
    }

    // 木材タイプ取得
    const { data: woodTypes, error: woodError } = await supabase
      .from('wood_types')
      .select('*, color_groups (slug, name)')
      .order('sort_order');

    if (woodError) {
      return NextResponse.json(
        { error: 'Failed to fetch wood types' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      colorTypes: colorTypes || [],
      colorGroups: colorGroups || [],
      woodTypes: woodTypes || [],
    });
  } catch (error) {
    console.error('Get colors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
