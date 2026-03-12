import postgres from 'postgres';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is required. Example:');
  console.error('  DATABASE_URL="postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres" node scripts/init-db.mjs');
  process.exit(1);
}

const sql = postgres(dbUrl, {
  ssl: 'require',
  connection: { application_name: 'sized-furniture-init' },
});

async function run() {
  console.log('=== Creating schema ===\n');

  // 1. regions
  console.log('Creating regions table...');
  await sql`
    CREATE TABLE IF NOT EXISTS regions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      name_local TEXT NOT NULL DEFAULT '',
      currency TEXT NOT NULL,
      currency_symbol TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'en',
      size_unit TEXT NOT NULL DEFAULT 'cm',
      amazon_domain TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('  OK');

  // 2. categories
  console.log('Creating categories table...');
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      name_en TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL,
      parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT,
      level INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      icon TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('  OK');

  // 3. category_paths
  console.log('Creating category_paths table...');
  await sql`
    CREATE TABLE IF NOT EXISTS category_paths (
      ancestor_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      descendant_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      depth INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (ancestor_id, descendant_id)
    )
  `;
  console.log('  OK');

  // 4. color_types
  console.log('Creating color_types table...');
  await sql`
    CREATE TABLE IF NOT EXISTS color_types (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      name_en TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;
  console.log('  OK');

  // 5. color_groups
  console.log('Creating color_groups table...');
  await sql`
    CREATE TABLE IF NOT EXISTS color_groups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      color_type_id UUID NOT NULL REFERENCES color_types(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL,
      hex_code TEXT,
      preview_image TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;
  console.log('  OK');

  // 6. wood_types
  console.log('Creating wood_types table...');
  await sql`
    CREATE TABLE IF NOT EXISTS wood_types (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      color_group_id UUID NOT NULL REFERENCES color_groups(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL DEFAULT '',
      description TEXT,
      preview_image TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;
  console.log('  OK');

  // 7. products_cache
  console.log('Creating products_cache table...');
  await sql`
    CREATE TABLE IF NOT EXISTS products_cache (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      external_id TEXT NOT NULL,
      source TEXT NOT NULL,
      region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT '',
      price NUMERIC,
      original_currency TEXT,
      price_local NUMERIC,
      image_url TEXT,
      image_urls JSONB DEFAULT '[]'::jsonb,
      width_cm NUMERIC,
      depth_cm NUMERIC,
      height_cm NUMERIC,
      weight_kg NUMERIC,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      color_group_id UUID REFERENCES color_groups(id) ON DELETE SET NULL,
      wood_type_id UUID REFERENCES wood_types(id) ON DELETE SET NULL,
      color_name TEXT,
      brand TEXT,
      material TEXT,
      features JSONB DEFAULT '[]'::jsonb,
      affiliate_url TEXT,
      original_url TEXT,
      is_available BOOLEAN NOT NULL DEFAULT true,
      raw_data JSONB,
      fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (external_id, source, region_id)
    )
  `;
  console.log('  OK');

  // 8. search_logs
  console.log('Creating search_logs table...');
  await sql`
    CREATE TABLE IF NOT EXISTS search_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      width_min NUMERIC,
      width_max NUMERIC,
      depth_min NUMERIC,
      depth_max NUMERIC,
      height_min NUMERIC,
      height_max NUMERIC,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      color_group_id UUID REFERENCES color_groups(id) ON DELETE SET NULL,
      wood_type_id UUID REFERENCES wood_types(id) ON DELETE SET NULL,
      region_code TEXT,
      results_count INTEGER NOT NULL DEFAULT 0,
      user_agent TEXT,
      ip_country TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('  OK');

  // Indexes
  console.log('\nCreating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_region ON products_cache(region_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_category ON products_cache(category_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_source ON products_cache(source)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_available ON products_cache(is_available)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_width ON products_cache(width_cm)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_depth ON products_cache(depth_cm)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_height ON products_cache(height_cm)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_cache_fetched ON products_cache(fetched_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at)`;
  console.log('  OK');

  // Enable RLS but allow service role full access
  console.log('\nEnabling RLS...');
  const tables = ['regions', 'categories', 'category_paths', 'color_types', 'color_groups', 'wood_types', 'products_cache', 'search_logs'];
  for (const t of tables) {
    await sql.unsafe(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`);
    try { await sql.unsafe(`CREATE POLICY "anon_read_${t}" ON ${t} FOR SELECT TO anon USING (true)`); } catch { /* already exists */ }
    try { await sql.unsafe(`CREATE POLICY "service_all_${t}" ON ${t} FOR ALL TO service_role USING (true) WITH CHECK (true)`); } catch { /* already exists */ }
  }
  console.log('  OK');

  // ===== SEED DATA =====
  console.log('\n=== Seeding data ===\n');

  // Regions
  console.log('Seeding regions...');
  await sql`
    INSERT INTO regions (code, name, name_local, currency, currency_symbol, language, size_unit, amazon_domain, is_active, sort_order) VALUES
      ('jp', 'Japan',     '日本',          'JPY', '¥',  'ja', 'cm',   'amazon.co.jp',   true, 1),
      ('us', 'USA',       'United States', 'USD', '$',  'en', 'inch', 'amazon.com',      true, 2),
      ('uk', 'UK',        'United Kingdom','GBP', '£',  'en', 'cm',   'amazon.co.uk',    true, 3),
      ('de', 'Germany',   'Deutschland',   'EUR', '€',  'de', 'cm',   'amazon.de',       true, 4),
      ('fr', 'France',    'France',        'EUR', '€',  'fr', 'cm',   'amazon.fr',       true, 5),
      ('au', 'Australia', 'Australia',     'AUD', 'A$', 'en', 'cm',   'amazon.com.au',   true, 6),
      ('ca', 'Canada',    'Canada',        'CAD', 'C$', 'en', 'inch', 'amazon.ca',       true, 7)
    ON CONFLICT (code) DO NOTHING
  `;
  console.log('  OK');

  // Parent categories
  console.log('Seeding parent categories...');
  await sql`
    INSERT INTO categories (id, name, name_en, slug, parent_id, level, sort_order, icon, is_active) VALUES
      ('c0000000-0000-0000-0000-000000000001', 'テーブル',   'Tables',   'tables',      NULL, 0, 1,  'table',    true),
      ('c0000000-0000-0000-0000-000000000002', 'チェア',     'Chairs',   'chairs',      NULL, 0, 2,  'armchair',  true),
      ('c0000000-0000-0000-0000-000000000003', '収納家具',   'Storage',  'storage',     NULL, 0, 3,  'archive',   true),
      ('c0000000-0000-0000-0000-000000000004', 'ベッド',     'Beds',     'beds',        NULL, 0, 4,  'bed',       true),
      ('c0000000-0000-0000-0000-000000000005', 'ソファ',     'Sofas',    'sofas-group', NULL, 0, 5,  'sofa',      true)
    ON CONFLICT (id) DO NOTHING
  `;
  console.log('  OK');

  // Child categories
  console.log('Seeding child categories...');
  await sql`
    INSERT INTO categories (id, name, name_en, slug, parent_id, level, sort_order, icon, is_active) VALUES
      ('c1000000-0000-0000-0000-000000000001', 'デスク',             'Desks',                'desks',             'c0000000-0000-0000-0000-000000000001', 1, 11, NULL, true),
      ('c1000000-0000-0000-0000-000000000002', 'ダイニングテーブル', 'Dining Tables',        'dining-tables',     'c0000000-0000-0000-0000-000000000001', 1, 12, NULL, true),
      ('c1000000-0000-0000-0000-000000000003', 'サイドテーブル',     'Side Tables',          'side-tables',       'c0000000-0000-0000-0000-000000000001', 1, 13, NULL, true),
      ('c1000000-0000-0000-0000-000000000004', 'ローテーブル',       'Coffee Tables',        'coffee-tables',     'c0000000-0000-0000-0000-000000000001', 1, 14, NULL, true),
      ('c1000000-0000-0000-0000-000000000005', 'オフィスチェア',     'Office Chairs',        'office-chairs',     'c0000000-0000-0000-0000-000000000002', 1, 21, NULL, true),
      ('c1000000-0000-0000-0000-000000000006', 'ダイニングチェア',   'Dining Chairs',        'dining-chairs',     'c0000000-0000-0000-0000-000000000002', 1, 22, NULL, true),
      ('c1000000-0000-0000-0000-000000000007', 'ラウンジチェア',     'Lounge Chairs',        'lounge-chairs',     'c0000000-0000-0000-0000-000000000002', 1, 23, NULL, true),
      ('c1000000-0000-0000-0000-000000000008', '本棚・シェルフ',     'Bookcases & Shelves',  'bookcases-shelves', 'c0000000-0000-0000-0000-000000000003', 1, 31, NULL, true),
      ('c1000000-0000-0000-0000-000000000009', 'テレビ台',           'TV Stands',            'tv-stands',         'c0000000-0000-0000-0000-000000000003', 1, 32, NULL, true),
      ('c1000000-0000-0000-0000-00000000000a', 'キャビネット',       'Cabinets',             'cabinets',          'c0000000-0000-0000-0000-000000000003', 1, 33, NULL, true),
      ('c1000000-0000-0000-0000-00000000000b', 'チェスト',           'Chests',               'chests',            'c0000000-0000-0000-0000-000000000003', 1, 34, NULL, true),
      ('c1000000-0000-0000-0000-00000000000c', 'ベッドフレーム',     'Bed Frames',           'bed-frames',        'c0000000-0000-0000-0000-000000000004', 1, 41, NULL, true),
      ('c1000000-0000-0000-0000-00000000000d', 'マットレス',         'Mattresses',           'mattresses',        'c0000000-0000-0000-0000-000000000004', 1, 42, NULL, true),
      ('c1000000-0000-0000-0000-00000000000e', 'ソファ',             'Sofas',                'sofas',             'c0000000-0000-0000-0000-000000000005', 1, 51, NULL, true),
      ('c1000000-0000-0000-0000-00000000000f', 'ソファベッド',       'Sofa Beds',            'sofa-beds',         'c0000000-0000-0000-0000-000000000005', 1, 52, NULL, true)
    ON CONFLICT (id) DO NOTHING
  `;
  console.log('  OK');

  // Category paths
  console.log('Seeding category_paths...');
  const allIds = [
    'c0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000008',
    'c1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-00000000000a',
    'c1000000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-00000000000c',
    'c1000000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-00000000000e',
    'c1000000-0000-0000-0000-00000000000f',
  ];
  const parentChildMap = {
    'c0000000-0000-0000-0000-000000000001': ['c1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000004'],
    'c0000000-0000-0000-0000-000000000002': ['c1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000007'],
    'c0000000-0000-0000-0000-000000000003': ['c1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-00000000000a','c1000000-0000-0000-0000-00000000000b'],
    'c0000000-0000-0000-0000-000000000004': ['c1000000-0000-0000-0000-00000000000c','c1000000-0000-0000-0000-00000000000d'],
    'c0000000-0000-0000-0000-000000000005': ['c1000000-0000-0000-0000-00000000000e','c1000000-0000-0000-0000-00000000000f'],
  };

  const paths = [];
  for (const id of allIds) {
    paths.push({ ancestor_id: id, descendant_id: id, depth: 0 });
  }
  for (const [parent, children] of Object.entries(parentChildMap)) {
    for (const child of children) {
      paths.push({ ancestor_id: parent, descendant_id: child, depth: 1 });
    }
  }
  await sql`
    INSERT INTO category_paths ${sql(paths)}
    ON CONFLICT (ancestor_id, descendant_id) DO NOTHING
  `;
  console.log('  OK');

  // Color types + groups (basic)
  console.log('Seeding color_types and color_groups...');
  await sql`
    INSERT INTO color_types (id, name, name_en, slug, sort_order) VALUES
      ('d0000000-0000-0000-0000-000000000001', '木目',     'Wood',     'wood',     1),
      ('d0000000-0000-0000-0000-000000000002', 'ソリッド', 'Solid',    'solid',    2),
      ('d0000000-0000-0000-0000-000000000003', 'メタリック','Metallic', 'metallic', 3),
      ('d0000000-0000-0000-0000-000000000004', 'その他',   'Other',    'other',    4)
    ON CONFLICT (slug) DO NOTHING
  `;
  await sql`
    INSERT INTO color_groups (id, color_type_id, name, name_en, slug, hex_code, sort_order) VALUES
      ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'オーク',       'Oak',        'oak',        '#C4A265', 1),
      ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'ウォールナット','Walnut',     'walnut',     '#5B3A29', 2),
      ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'パイン',       'Pine',       'pine',       '#DEB887', 3),
      ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'チェリー',     'Cherry',     'cherry',     '#8B4513', 4),
      ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', 'メープル',     'Maple',      'maple',      '#F5DEB3', 5),
      ('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', 'ビーチ',       'Beech',      'beech',      '#D2B48C', 6),
      ('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000002', 'ホワイト',     'White',      'white',      '#FFFFFF', 11),
      ('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000002', 'ブラック',     'Black',      'black',      '#1A1A1A', 12),
      ('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000002', 'グレー',       'Gray',       'gray',       '#808080', 13),
      ('e0000000-0000-0000-0000-00000000000a', 'd0000000-0000-0000-0000-000000000002', 'ベージュ',     'Beige',      'beige',      '#F5F5DC', 14),
      ('e0000000-0000-0000-0000-00000000000b', 'd0000000-0000-0000-0000-000000000002', 'ブラウン',     'Brown',      'brown',      '#8B4513', 15),
      ('e0000000-0000-0000-0000-00000000000c', 'd0000000-0000-0000-0000-000000000002', 'ネイビー',     'Navy',       'navy',       '#001F3F', 16),
      ('e0000000-0000-0000-0000-00000000000d', 'd0000000-0000-0000-0000-000000000002', 'グリーン',     'Green',      'green',      '#2E8B57', 17)
    ON CONFLICT (id) DO NOTHING
  `;
  console.log('  OK');

  // Verify
  console.log('\n=== Verification ===');
  const counts = await sql`
    SELECT
      (SELECT count(*) FROM regions) as regions,
      (SELECT count(*) FROM categories) as categories,
      (SELECT count(*) FROM category_paths) as category_paths,
      (SELECT count(*) FROM color_types) as color_types,
      (SELECT count(*) FROM color_groups) as color_groups
  `;
  console.log(counts[0]);

  console.log('\nDone!');
  await sql.end();
}

run().catch(async (err) => {
  console.error('FATAL:', err);
  await sql.end();
  process.exit(1);
});
