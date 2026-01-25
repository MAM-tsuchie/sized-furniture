'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import type { Category } from '@/types';

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

export default function CategoriesPage() {
  const { t, language } = useTranslation();
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?tree=true');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
          
          // 最初のレベルを展開
          const topLevelIds = new Set<string>((data.categories || []).map((c: Category) => c.id));
          setExpandedIds(topLevelIds);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-700">
          {language === 'ja' ? 'ホーム' : 'Home'}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-900">{t.category.title}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">{t.category.title}</h1>

      {/* カテゴリツリー */}
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            language={language}
            expandedIds={expandedIds}
            onToggle={toggleExpand}
            level={0}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-slate-500 text-center py-12">
          {language === 'ja' ? 'カテゴリがありません' : 'No categories found'}
        </p>
      )}
    </div>
  );
}

interface CategoryItemProps {
  category: CategoryWithChildren;
  language: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  level: number;
}

function CategoryItem({ category, language, expandedIds, onToggle, level }: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const name = language === 'ja' ? category.name : category.nameEn;

  return (
    <div style={{ marginLeft: level * 24 }}>
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-50 group">
        {hasChildren ? (
          <button
            onClick={() => onToggle(category.id)}
            className="p-1 rounded hover:bg-slate-200"
          >
            {isExpanded ? (
              <FolderOpen className="w-5 h-5 text-amber-500" />
            ) : (
              <Folder className="w-5 h-5 text-slate-400" />
            )}
          </button>
        ) : (
          <span className="w-7" />
        )}

        <Link
          href={`/category/${category.slug}`}
          className="flex-1 text-slate-700 hover:text-blue-600 font-medium"
        >
          {name}
        </Link>

        <Link
          href={`/search?categoryId=${category.id}`}
          className="text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {language === 'ja' ? 'サイズで探す' : 'Search by size'}
        </Link>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              language={language}
              expandedIds={expandedIds}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
