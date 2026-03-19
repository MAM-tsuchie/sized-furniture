import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronRight, Tag } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: '家具選びガイド・コラム',
  description:
    '家具のサイズ選びに役立つガイド記事やコラム。デスク、テレビ台、収納家具など、カテゴリ別のサイズガイドや、間取り別のおすすめ家具サイズをご紹介します。',
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: '家具選びガイド・コラム | Sized Furniture',
    description: '家具のサイズ選びに役立つガイド記事やコラム',
    url: `${BASE_URL}/blog`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* パンくずリスト */}
      <nav className="flex items-center text-sm text-neutral-500 mb-8">
        <Link href="/" className="hover:text-neutral-300 transition-colors">
          ホーム
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-neutral-300">ガイド・コラム</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-3">
          家具選びガイド・コラム
        </h1>
        <p className="text-neutral-400 mb-12">
          サイズ選びのコツから間取り別のおすすめまで、家具選びに役立つ情報をお届けします。
        </p>

        {posts.length === 0 ? (
          <p className="text-neutral-500 text-center py-16">
            記事の準備中です。しばらくお待ちください。
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group rounded-xl border border-neutral-800 overflow-hidden hover:border-[#c9a962]/40 transition-all duration-300 hover:bg-neutral-900/50"
                >
                  <div className="flex flex-col sm:flex-row">
                    {post.coverImage && (
                      <div className="relative w-full sm:w-48 md:w-56 h-40 sm:h-auto shrink-0">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 224px"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 min-w-0">
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#c9a962]/10 text-[#c9a962] font-medium">
                          {post.category}
                        </span>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}分で読める
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-[#c9a962] transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                        {post.description}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
