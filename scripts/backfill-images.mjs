#!/usr/bin/env node

/**
 * 既存記事に Pexels 画像を追加するバックフィルスクリプト
 *
 * 使い方:
 *   PEXELS_API_KEY=... node scripts/backfill-images.mjs
 *
 * coverImage が既に設定されている記事はスキップされます。
 * --force オプションで既存画像も上書きします。
 */

import fs from 'node:fs';
import path from 'node:path';
import { getSearchQuery, fetchPexelsImages, insertInlineImages } from './pexels.mjs';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const FORCE = process.argv.includes('--force');

if (!process.env.PEXELS_API_KEY) {
  console.error('Error: PEXELS_API_KEY is not set');
  process.exit(1);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { meta: {}, body: content, raw: '' };

  const raw = match[0];
  const metaStr = match[1];
  const body = content.slice(raw.length);

  const meta = {};
  for (const line of metaStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (key === 'tags') {
      const tagMatch = value.match(/\[(.+)\]/);
      if (tagMatch) {
        meta.tags = tagMatch[1].split(',').map((t) => t.trim().replace(/"/g, ''));
      }
    } else {
      meta[key] = value;
    }
  }

  return { meta, body, raw: metaStr };
}

function rebuildFrontmatter(metaStr, coverImageUrl) {
  if (metaStr.includes('coverImage:')) {
    return metaStr.replace(/coverImage:.*/, `coverImage: "${coverImageUrl}"`);
  }
  return metaStr + `\ncoverImage: "${coverImageUrl}"`;
}

function bodyHasInlineImages(body) {
  return /!\[.*\]\(https:\/\/images\.pexels\.com/.test(body);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('🖼️  既存記事の画像バックフィルを開始...');
  if (FORCE) console.log('  --force モード: 既存画像も上書きします');

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('  content/blog/ が見つかりません');
    process.exit(0);
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  console.log(`  対象記事数: ${files.length}`);

  let updated = 0;
  let skipped = 0;

  for (const filename of files) {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { meta, body, raw: metaStr } = parseFrontmatter(fileContent);

    if (!FORCE && meta.coverImage) {
      console.log(`  ⏭ ${filename}: coverImage 設定済み、スキップ`);
      skipped++;
      continue;
    }

    const tags = meta.tags || [];
    const title = meta.title || filename.replace('.md', '');
    const searchQuery = getSearchQuery(tags, title);

    console.log(`  🔍 ${filename}: "${searchQuery}" で画像検索中...`);
    const images = await fetchPexelsImages(searchQuery, 3);

    if (images.length === 0) {
      console.log(`  ⚠ ${filename}: 画像が見つかりません、スキップ`);
      skipped++;
      continue;
    }

    const coverImage = images[0].large2x;
    const inlineImages = images.slice(1);
    const altPrefix = tags[0] || title;

    const newMetaStr = rebuildFrontmatter(metaStr, coverImage);

    let newBody = body;
    if (!bodyHasInlineImages(body)) {
      newBody = insertInlineImages(body, inlineImages, altPrefix);
    }

    const newContent = `---\n${newMetaStr}\n---\n${newBody}`;
    fs.writeFileSync(filePath, newContent, 'utf-8');

    console.log(`  ✅ ${filename}: 画像を追加しました (${images.length}枚)`);
    updated++;

    // Pexels API レート制限対策 (200 req/h)
    await sleep(500);
  }

  console.log(`\n🎉 完了: ${updated}件を更新、${skipped}件をスキップ`);
}

main().catch((err) => {
  console.error('❌ エラー:', err.message);
  process.exit(1);
});
