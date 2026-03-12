import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

interface CategoryRow {
  name: string;
  name_en: string;
  slug: string;
  description: string | null;
}

async function getCategory(slug: string): Promise<CategoryRow | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('name, name_en, slug, description')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data as CategoryRow;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'カテゴリが見つかりません',
    };
  }

  const description =
    category.description ||
    `${category.name}をサイズで検索。幅・奥行き・高さを指定して、ぴったりの${category.name}を見つけましょう。`;

  return {
    title: `${category.name} | サイズで探す家具`,
    description,
    alternates: {
      canonical: `${BASE_URL}/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Sized Furniture`,
      description,
      url: `${BASE_URL}/category/${category.slug}`,
      siteName: 'Sized Furniture',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Sized Furniture`,
      description,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
