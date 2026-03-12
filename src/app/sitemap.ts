import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/affiliate-disclosure`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createServerSupabaseClient();

    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true });

    if (categories) {
      categoryPages = categories.map((cat) => ({
        url: `${BASE_URL}/category/${cat.slug}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
    }

    const { data: products } = await supabase
      .from('products_cache')
      .select('id, updated_at')
      .eq('is_available', true)
      .order('updated_at', { ascending: false })
      .limit(5000);

    if (products) {
      productPages = products.map((p) => ({
        url: `${BASE_URL}/product/${p.id}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch data for sitemap:', error);
  }

  const blogPosts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
