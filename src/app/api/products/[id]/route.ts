import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { transformKeys } from '@/lib/utils/transform';
import type { Product } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  try {
    const { data: product, error } = await supabase
      .from('products_cache')
      .select(`
        *,
        categories (id, name, name_en, slug, parent_id),
        color_groups (id, name, name_en, slug, hex_code, color_types (name, name_en)),
        wood_types (id, name, name_en, description),
        regions (code, name, currency, currency_symbol)
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: transformKeys<Product>(product) });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
