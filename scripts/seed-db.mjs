import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REGIONS = [
  { code: 'jp', name: 'Japan',     name_local: '日本',          currency: 'JPY', currency_symbol: '¥',  language: 'ja', size_unit: 'cm',   amazon_domain: 'amazon.co.jp',   is_active: true, sort_order: 1 },
  { code: 'us', name: 'USA',       name_local: 'United States', currency: 'USD', currency_symbol: '$',  language: 'en', size_unit: 'inch', amazon_domain: 'amazon.com',      is_active: true, sort_order: 2 },
  { code: 'uk', name: 'UK',        name_local: 'United Kingdom',currency: 'GBP', currency_symbol: '£',  language: 'en', size_unit: 'cm',   amazon_domain: 'amazon.co.uk',    is_active: true, sort_order: 3 },
  { code: 'de', name: 'Germany',   name_local: 'Deutschland',   currency: 'EUR', currency_symbol: '€',  language: 'de', size_unit: 'cm',   amazon_domain: 'amazon.de',       is_active: true, sort_order: 4 },
  { code: 'fr', name: 'France',    name_local: 'France',        currency: 'EUR', currency_symbol: '€',  language: 'fr', size_unit: 'cm',   amazon_domain: 'amazon.fr',       is_active: true, sort_order: 5 },
  { code: 'au', name: 'Australia', name_local: 'Australia',     currency: 'AUD', currency_symbol: 'A$', language: 'en', size_unit: 'cm',   amazon_domain: 'amazon.com.au',   is_active: true, sort_order: 6 },
  { code: 'ca', name: 'Canada',    name_local: 'Canada',        currency: 'CAD', currency_symbol: 'C$', language: 'en', size_unit: 'inch', amazon_domain: 'amazon.ca',       is_active: true, sort_order: 7 },
];

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

const ALL_CATEGORIES = [...PARENT_CATEGORIES, ...CHILD_CATEGORIES];

function buildCategoryPaths() {
  const paths = [];
  for (const cat of ALL_CATEGORIES) {
    paths.push({ ancestor_id: cat.id, descendant_id: cat.id, depth: 0 });
  }
  for (const child of CHILD_CATEGORIES) {
    if (child.parent_id) {
      paths.push({ ancestor_id: child.parent_id, descendant_id: child.id, depth: 1 });
    }
  }
  return paths;
}

async function seed() {
  console.log('=== Seeding database ===\n');

  // 1. Regions
  console.log('1. Inserting regions...');
  const { data: regData, error: regErr } = await supabase
    .from('regions')
    .upsert(REGIONS, { onConflict: 'code' })
    .select('code');
  if (regErr) {
    console.error('  ERROR:', regErr.message);
  } else {
    console.log(`  OK: ${regData.length} regions upserted`);
  }

  // 2. Parent categories
  console.log('2. Inserting parent categories...');
  const { data: pData, error: pErr } = await supabase
    .from('categories')
    .upsert(PARENT_CATEGORIES, { onConflict: 'id' })
    .select('slug');
  if (pErr) {
    console.error('  ERROR:', pErr.message);
  } else {
    console.log(`  OK: ${pData.length} parent categories upserted`);
  }

  // 3. Child categories
  console.log('3. Inserting child categories...');
  const { data: cData, error: cErr } = await supabase
    .from('categories')
    .upsert(CHILD_CATEGORIES, { onConflict: 'id' })
    .select('slug');
  if (cErr) {
    console.error('  ERROR:', cErr.message);
  } else {
    console.log(`  OK: ${cData.length} child categories upserted`);
  }

  // 4. Category paths
  console.log('4. Inserting category_paths...');
  const paths = buildCategoryPaths();
  const { data: cpData, error: cpErr } = await supabase
    .from('category_paths')
    .upsert(paths, { onConflict: 'ancestor_id,descendant_id' })
    .select('ancestor_id');
  if (cpErr) {
    console.error('  ERROR:', cpErr.message);
    console.error('  Trying one-by-one insert...');
    let ok = 0;
    let skip = 0;
    for (const p of paths) {
      const { error } = await supabase.from('category_paths').insert(p);
      if (error) {
        if (error.code === '23505') { skip++; }
        else { console.error(`    Failed: ${p.ancestor_id} -> ${p.descendant_id}: ${error.message}`); }
      } else {
        ok++;
      }
    }
    console.log(`  One-by-one: ${ok} inserted, ${skip} already existed`);
  } else {
    console.log(`  OK: ${cpData.length} paths upserted`);
  }

  // Verify
  console.log('\n=== Verification ===');
  const { count: regCount } = await supabase.from('regions').select('*', { count: 'exact', head: true });
  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: cpCount } = await supabase.from('category_paths').select('*', { count: 'exact', head: true });
  console.log(`regions: ${regCount}`);
  console.log(`categories: ${catCount}`);
  console.log(`category_paths: ${cpCount}`);
  console.log('\nDone!');
}

seed().catch(console.error);
