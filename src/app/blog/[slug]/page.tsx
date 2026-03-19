import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, Calendar, Tag } from 'lucide-react';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/blog';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

import './blog-content.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: '記事が見つかりません' };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${slug}`,
      siteName: 'Sized Furniture',
      type: 'article',
      publishedTime: post.date,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: ['Sized Furniture'],
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

function ArticleJsonLd({
  post,
  slug,
}: {
  post: { title: string; description: string; date: string; updatedAt?: string; coverImage?: string };
  slug: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    ...(post.coverImage && { image: post.coverImage }),
    author: { '@type': 'Organization', name: 'Sized Furniture' },
    publisher: {
      '@type': 'Organization',
      name: 'Sized Furniture',
      url: BASE_URL,
    },
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleJsonLd post={post} slug={slug} />
      <BreadcrumbJsonLd
        items={[
          { name: 'ホーム', url: BASE_URL },
          { name: 'ガイド・コラム', url: `${BASE_URL}/blog` },
          { name: post.title, url: `${BASE_URL}/blog/${slug}` },
        ]}
      />

      <article className="max-w-3xl mx-auto">
        {/* パンくずリスト */}
        <nav className="flex items-center text-sm text-neutral-500 mb-8 flex-wrap gap-1">
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            ホーム
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-neutral-300 transition-colors">
            ガイド・コラム
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-300 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c9a962]/10 text-[#c9a962] font-medium text-xs">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed mb-6">
            {post.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime}分で読める
            </span>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative w-full aspect-2/1 mb-10 rounded-xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="w-full h-px bg-neutral-800 mb-10" />

        {/* 本文 */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />

        {/* タグ */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-sm text-neutral-400 bg-neutral-800/50 px-3 py-1 rounded-full"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 rounded-xl border border-[#c9a962]/20 bg-[#c9a962]/5 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            ぴったりの家具を探してみませんか？
          </h2>
          <p className="text-neutral-400 text-sm mb-6">
            幅・奥行き・高さを指定して、あなたのスペースに合う家具を見つけましょう。
          </p>
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b872] transition-colors"
          >
            サイズで家具を検索する
          </Link>
        </div>
      </article>

      {/* 関連記事 */}
      {relatedPosts.length > 0 && (
        <section className="max-w-3xl mx-auto mt-16">
          <h2 className="text-xl font-bold text-white mb-6">関連する記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="block rounded-lg border border-neutral-800 p-4 hover:border-[#c9a962]/40 transition-all duration-300"
              >
                <span className="text-xs text-[#c9a962] mb-2 block">
                  {related.category}
                </span>
                <h3 className="text-sm font-medium text-white line-clamp-2 mb-2">
                  {related.title}
                </h3>
                <time
                  dateTime={related.date}
                  className="text-xs text-neutral-500"
                >
                  {new Date(related.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
