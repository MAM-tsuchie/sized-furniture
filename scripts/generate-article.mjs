#!/usr/bin/env node

/**
 * AI記事自動生成スクリプト
 *
 * 使い方:
 *   OPENAI_API_KEY=sk-... node scripts/generate-article.mjs
 *
 * OpenAI / OpenRouter 両対応。キーの形式で自動判別:
 *   - sk-or-... → OpenRouter (https://openrouter.ai/api/v1)
 *   - sk-...    → OpenAI    (https://api.openai.com/v1)
 *
 * 環境変数:
 *   OPENAI_API_KEY  — APIキー（必須）
 *   OPENAI_MODEL    — モデル名（省略時は自動選択）
 *   LLM_BASE_URL    — ベースURL（明示的に指定する場合）
 */

import fs from 'node:fs';
import path from 'node:path';
import { topics } from './article-topics.mjs';
import { getSearchQuery, fetchPexelsImages, insertInlineImages } from './pexels.mjs';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set');
  process.exit(1);
}

const isOpenRouter = API_KEY.startsWith('sk-or-');
const BASE_URL = process.env.LLM_BASE_URL ||
  (isOpenRouter ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1');
const MODEL = process.env.OPENAI_MODEL ||
  (isOpenRouter ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

console.log(`  Provider: ${isOpenRouter ? 'OpenRouter' : 'OpenAI'}`);
console.log(`  Model: ${MODEL}`);

function getExistingSlugs() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return new Set();
  }
  return new Set(
    fs.readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''))
  );
}

function pickNextTopic(existingSlugs) {
  const unwritten = topics.filter((t) => !existingSlugs.has(t.slug));
  if (unwritten.length === 0) return null;
  // ランダムに1つ選ぶ（同じ順番だとカテゴリが偏るため）
  return unwritten[Math.floor(Math.random() * unwritten.length)];
}

function buildSystemPrompt() {
  return `あなたは日本語の家具・インテリア専門ライターです。
SEOに強く、読者に実用的な情報を提供する記事を書いてください。

## 記事のルール
- Markdown形式で書く（frontmatterは不要、本文のみ）
- H2（##）とH3（###）を使って構造化する
- 表（テーブル）を積極的に使い、サイズの数値を具体的に示す
- 「です・ます」調で書く
- 1500〜3000文字程度
- 冒頭に読者の悩みに共感する導入文を置く
- 中盤にサイズの具体的な数値・比較表を含む
- 末尾に「まとめ」セクションを置き、要点を箇条書きで整理する
- 末尾の最後に「Sized Furnitureでは、幅・奥行き・高さを指定して家具を検索できます。」という一文を自然に含める
- リンクは含めない（画像は自動で追加されます）
- 広告的な表現は避け、客観的で信頼できるトーンを保つ
- **で重要なポイントを強調する`;
}

function buildUserPrompt(topic) {
  return `以下のテーマで記事を書いてください。

タイトル: ${topic.title}
ターゲットキーワード: ${topic.keywords}
記事の方向性: ${topic.prompt}

Markdown本文のみを出力してください（frontmatterは不要）。`;
}

async function callLLM(systemPrompt, userPrompt) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  };

  if (isOpenRouter) {
    headers['HTTP-Referer'] = 'https://sized-furniture.com';
    headers['X-Title'] = 'Sized Furniture Blog Generator';
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LLM API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function buildFrontmatter(topic, coverImageUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const tagsStr = topic.tags.map((t) => `"${t}"`).join(', ');

  let fm = `---
title: "${topic.title}"
description: "${topic.prompt.slice(0, 120).replace(/"/g, '\\"')}"
date: "${today}"
category: "${topic.category}"
tags: [${tagsStr}]`;

  if (coverImageUrl) {
    fm += `\ncoverImage: "${coverImageUrl}"`;
  }

  fm += `\n---`;
  return fm;
}

async function main() {
  console.log('📝 記事生成を開始...');

  const existingSlugs = getExistingSlugs();
  console.log(`  既存記事数: ${existingSlugs.size}`);

  const topic = pickNextTopic(existingSlugs);
  if (!topic) {
    console.log('✅ すべてのトピックが執筆済みです。新しいトピックを追加してください。');
    process.exit(0);
  }

  console.log(`  選択されたトピック: ${topic.title} (${topic.slug})`);
  console.log(`  カテゴリ: ${topic.category}`);

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(topic);

  const searchQuery = getSearchQuery(topic.tags, topic.title);
  console.log(`  画像検索クエリ: ${searchQuery}`);

  console.log('  AI に記事を生成中 & Pexels から画像取得中...');
  const [content, images] = await Promise.all([
    callLLM(systemPrompt, userPrompt),
    fetchPexelsImages(searchQuery, 3),
  ]);

  if (images.length > 0) {
    console.log(`  📷 ${images.length}枚の画像を取得しました`);
  }

  const coverImage = images.length > 0 ? images[0].large2x : null;
  const inlineImages = images.slice(1);
  const altPrefix = topic.tags[0] || topic.title;

  const contentWithImages = insertInlineImages(content, inlineImages, altPrefix);

  const frontmatter = buildFrontmatter(topic, coverImage);
  const fullContent = `${frontmatter}\n\n${contentWithImages}\n`;

  const filePath = path.join(BLOG_DIR, `${topic.slug}.md`);
  fs.writeFileSync(filePath, fullContent, 'utf-8');

  console.log(`✅ 記事を保存しました: ${filePath}`);
  console.log(`  タイトル: ${topic.title}`);
  console.log(`  文字数: ${contentWithImages.length}`);
  if (coverImage) {
    console.log(`  カバー画像: ${coverImage}`);
  }

  // GitHub Actions のoutput用
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `slug=${topic.slug}\n`);
    fs.appendFileSync(outputFile, `title=${topic.title}\n`);
    fs.appendFileSync(outputFile, `generated=true\n`);
  }
}

main().catch((err) => {
  console.error('❌ エラー:', err.message);
  process.exit(1);
});
