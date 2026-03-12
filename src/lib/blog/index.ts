import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  content: string;
  htmlContent: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function estimateReadingTime(text: string): number {
  const charCount = text.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(charCount / 600));
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      category: data.category || '',
      tags: data.tags || [],
      coverImage: data.coverImage,
      readingTime: estimateReadingTime(content),
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const htmlContent = marked.parse(content, { async: false }) as string;

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || '',
    updatedAt: data.updatedAt,
    category: data.category || '',
    tags: data.tags || [],
    coverImage: data.coverImage,
    readingTime: estimateReadingTime(content),
    content,
    htmlContent,
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPostMeta[] {
  const allPosts = getAllPosts();
  const current = allPosts.find((p) => p.slug === currentSlug);
  if (!current) return allPosts.filter((p) => p.slug !== currentSlug).slice(0, limit);

  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      score:
        (p.category === current.category ? 2 : 0) +
        p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
