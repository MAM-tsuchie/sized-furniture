import Link from 'next/link';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { HeroSearch } from '@/components/home/hero-search';
import { getAllPosts } from '@/lib/blog';

const LATEST_POSTS_COUNT = 3;

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, LATEST_POSTS_COUNT);

  return (
    <>
      <HeroSearch />

      {latestPosts.length > 0 && (
        <section className="bg-[#0c0c0c] py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[#c9a962] text-xs tracking-[0.3em] uppercase mb-2">
                    Guide &amp; Column
                  </p>
                  <h2 className="text-xl md:text-2xl font-light text-white tracking-wide">
                    家具選びガイド
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm text-neutral-400 hover:text-[#c9a962] transition-colors flex items-center gap-1.5 group"
                >
                  すべての記事
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {latestPosts.map((post) => (
                  <article key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group h-full rounded-xl border border-neutral-800 p-5 hover:border-[#c9a962]/40 transition-all duration-300 hover:bg-neutral-900/50"
                    >
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#c9a962]/10 text-[#c9a962] text-[10px] font-medium mb-3">
                        {post.category}
                      </span>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#c9a962] transition-colors mb-2 leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-neutral-500 text-xs leading-relaxed mb-4 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-600 mt-auto">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {post.readingTime}分
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-0.5 text-[10px] text-neutral-500 bg-neutral-800/50 px-1.5 py-0.5 rounded"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
