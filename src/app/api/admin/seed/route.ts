import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';

const PARENT_CATEGORIES = [
  { id: 'c0000000-0000-0000-0000-000000000001', name: 'テーブル', name_en: 'Tables',  slug: 'tables',      parent_id: null, level: 0, sort_order: 1,  icon: 'table',    is_active: true },
  { id: 'c0000000-0000-0000-0000-000000000002', name: 'チェア',   name_en: 'Chairs',  slug: 'chairs',      parent_id: null, level: 0, sort_order: 2,  icon: 'armchair', is_active: true },
  { id: 'c0000000-0000-0000-0000-000000000003', name: '収納家具', name_en: 'Storage', slug: 'storage',     parent_id: null, level: 0, sort_order: 3,  icon: 'archive',  is_active: true },
  { id: 'c0000000-0000-0000-0000-000000000004', name: 'ベッド',   name_en: 'Beds',    slug: 'beds',        parent_id: null, level: 0, sort_order: 4,  icon: 'bed',      is_active: true },
  { id: 'c0000000-0000-0000-0000-000000000005', name: 'ソファ',   name_en: 'Sofas',   slug: 'sofas-group', parent_id: null, level: 0, sort_order: 5,  icon: 'sofa',     is_active: true },
];

const CHILD_CATEGORIES = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'デスク',             name_en: 'Desks',                slug: 'desks',             parent_id: 'c0000000-0000-0000-0000-000000000001', level: 1, sort_order: 11, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'ダイニングテーブル', name_en: 'Dining Tables',        slug: 'dining-tables',     parent_id: 'c0000000-0000-0000-0000-000000000001', level: 1, sort_order: 12, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'サイドテーブル',     name_en: 'Side Tables',          slug: 'side-tables',       parent_id: 'c0000000-0000-0000-0000-000000000001', level: 1, sort_order: 13, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'ローテーブル',       name_en: 'Coffee Tables',        slug: 'coffee-tables',     parent_id: 'c0000000-0000-0000-0000-000000000001', level: 1, sort_order: 14, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'オフィスチェア',     name_en: 'Office Chairs',        slug: 'office-chairs',     parent_id: 'c0000000-0000-0000-0000-000000000002', level: 1, sort_order: 21, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'ダイニングチェア',   name_en: 'Dining Chairs',        slug: 'dining-chairs',     parent_id: 'c0000000-0000-0000-0000-000000000002', level: 1, sort_order: 22, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000007', name: 'ラウンジチェア',     name_en: 'Lounge Chairs',        slug: 'lounge-chairs',     parent_id: 'c0000000-0000-0000-0000-000000000002', level: 1, sort_order: 23, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000008', name: '本棚・シェルフ',     name_en: 'Bookcases & Shelves',  slug: 'bookcases-shelves', parent_id: 'c0000000-0000-0000-0000-000000000003', level: 1, sort_order: 31, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-000000000009', name: 'テレビ台',           name_en: 'TV Stands',            slug: 'tv-stands',         parent_id: 'c0000000-0000-0000-0000-000000000003', level: 1, sort_order: 32, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-00000000000a', name: 'キャビネット',       name_en: 'Cabinets',             slug: 'cabinets',          parent_id: 'c0000000-0000-0000-0000-000000000003', level: 1, sort_order: 33, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-00000000000b', name: 'チェスト',           name_en: 'Chests',               slug: 'chests',            parent_id: 'c0000000-0000-0000-0000-000000000003', level: 1, sort_order: 34, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-00000000000c', name: 'ベッドフレーム',     name_en: 'Bed Frames',           slug: 'bed-frames',        parent_id: 'c0000000-0000-0000-0000-000000000004', level: 1, sort_order: 41, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-00000000000d', name: 'マットレス',         name_en: 'Mattresses',           slug: 'mattresses',        parent_id: 'c0000000-0000-0000-0000-000000000004', level: 1, sort_order: 42, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-00000000000e', name: 'ソファ',             name_en: 'Sofas',                slug: 'sofas',             parent_id: 'c0000000-0000-0000-0000-000000000005', level: 1, sort_order: 51, icon: null, is_active: true },
  { id: 'c1000000-0000-0000-0000-00000000000f', name: 'ソファベッド',       name_en: 'Sofa Beds',            slug: 'sofa-beds',         parent_id: 'c0000000-0000-0000-0000-000000000005', level: 1, sort_order: 52, icon: null, is_active: true },
];

const REGIONS = [
  { code: 'jp', name: 'Japan',     name_local: '日本',          currency: 'JPY', currency_symbol: '¥',  language: 'ja', size_unit: 'cm',   amazon_domain: 'amazon.co.jp',   is_active: true, sort_order: 1 },
  { code: 'us', name: 'USA',       name_local: 'United States', currency: 'USD', currency_symbol: '$',  language: 'en', size_unit: 'inch', amazon_domain: 'amazon.com',      is_active: true, sort_order: 2 },
  { code: 'uk', name: 'UK',        name_local: 'United Kingdom',currency: 'GBP', currency_symbol: '£',  language: 'en', size_unit: 'cm',   amazon_domain: 'amazon.co.uk',    is_active: true, sort_order: 3 },
  { code: 'de', name: 'Germany',   name_local: 'Deutschland',   currency: 'EUR', currency_symbol: '€',  language: 'de', size_unit: 'cm',   amazon_domain: 'amazon.de',       is_active: true, sort_order: 4 },
  { code: 'fr', name: 'France',    name_local: 'France',        currency: 'EUR', currency_symbol: '€',  language: 'fr', size_unit: 'cm',   amazon_domain: 'amazon.fr',       is_active: true, sort_order: 5 },
  { code: 'au', name: 'Australia', name_local: 'Australia',     currency: 'AUD', currency_symbol: 'A$', language: 'en', size_unit: 'cm',   amazon_domain: 'amazon.com.au',   is_active: true, sort_order: 6 },
  { code: 'ca', name: 'Canada',    name_local: 'Canada',        currency: 'CAD', currency_symbol: 'C$', language: 'en', size_unit: 'inch', amazon_domain: 'amazon.ca',       is_active: true, sort_order: 7 },
];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();
  const log: string[] = [];

  try {
    // 1. Regions
    const { error: regErr } = await supabase
      .from('regions')
      .upsert(REGIONS, { onConflict: 'code' });
    if (regErr) {
      log.push(`regions ERROR: ${regErr.message}`);
    } else {
      log.push(`regions: ${REGIONS.length} upserted`);
    }

    // 2. Parent categories (must be inserted before children due to FK)
    const { error: pErr } = await supabase
      .from('categories')
      .upsert(PARENT_CATEGORIES, { onConflict: 'id' });
    if (pErr) {
      log.push(`parent categories ERROR: ${pErr.message}`);
    } else {
      log.push(`parent categories: ${PARENT_CATEGORIES.length} upserted`);
    }

    // 3. Child categories
    const { error: cErr } = await supabase
      .from('categories')
      .upsert(CHILD_CATEGORIES, { onConflict: 'id' });
    if (cErr) {
      log.push(`child categories ERROR: ${cErr.message}`);
    } else {
      log.push(`child categories: ${CHILD_CATEGORIES.length} upserted`);
    }

    // 4. Category paths
    const allCategories = [...PARENT_CATEGORIES, ...CHILD_CATEGORIES];
    const paths: { ancestor_id: string; descendant_id: string; depth: number }[] = [];

    for (const cat of allCategories) {
      paths.push({ ancestor_id: cat.id, descendant_id: cat.id, depth: 0 });
    }
    for (const child of CHILD_CATEGORIES) {
      if (child.parent_id) {
        paths.push({ ancestor_id: child.parent_id, descendant_id: child.id, depth: 1 });
      }
    }

    let pathOk = 0;
    let pathSkip = 0;
    let pathFail = 0;
    for (const p of paths) {
      const { error } = await supabase.from('category_paths').insert(p);
      if (error) {
        if (error.code === '23505') pathSkip++;
        else { pathFail++; log.push(`path ERROR: ${error.message}`); }
      } else {
        pathOk++;
      }
    }
    log.push(`category_paths: ${pathOk} inserted, ${pathSkip} skipped, ${pathFail} failed`);

    // Verification
    const { count: regCount } = await supabase.from('regions').select('*', { count: 'exact', head: true });
    const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    const { count: cpCount } = await supabase.from('category_paths').select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      log,
      counts: { regions: regCount, categories: catCount, category_paths: cpCount },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      log,
    }, { status: 500 });
  }
}
