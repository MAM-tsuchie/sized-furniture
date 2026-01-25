'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/product-grid';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import type { Product, Category } from '@/types';

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();
  const { regionCode } = useRegion();

  const slug = params.slug as string;
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'newest'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // カテゴリ情報を取得
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/categories?tree=true');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        const allCategories = data.categories || [];
        
        // スラッグからカテゴリを検索
        const found = findCategoryBySlug(allCategories, slug);
        
        if (found) {
          setCategory(found.category);
          setSubcategories(found.category.children || []);
          setBreadcrumbs(found.breadcrumbs);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  // 商品を検索
  const fetchProducts = useCallback(async (page: number = 1) => {
    if (!category) return;
    
    setIsSearching(true);
    
    const urlParams = new URLSearchParams();
    urlParams.set('categoryId', category.id);
    urlParams.set('region', regionCode);
    urlParams.set('page', String(page));
    urlParams.set('limit', '20');
    urlParams.set('sortBy', sortBy);
    urlParams.set('sortOrder', sortOrder);

    try {
      const response = await fetch(`/api/search?${urlParams.toString()}`);
      
      if (response.ok) {
        const data: SearchResponse = await response.json();
        setProducts(data.products);
        setTotalCount(data.total);
        setTotalPages(data.totalPages);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsSearching(false);
    }
  }, [category, regionCode, sortBy, sortOrder]);

  // カテゴリが取得できたら商品を検索
  useEffect(() => {
    if (category) {
      fetchProducts(currentPage);
    }
  }, [category, currentPage, fetchProducts]);

  // ページ変更
  const handlePageChange = useCallback((page: number) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', String(page));
    router.push(`/category/${slug}?${urlParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router, slug]);

  // ソート変更
  const handleSortChange = useCallback((value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as ['relevance' | 'price' | 'newest', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  // ソートが変更されたら再検索
  useEffect(() => {
    if (category) {
      fetchProducts(1);
      // ページをリセット
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete('page');
      router.push(`/category/${slug}?${urlParams.toString()}`);
    }
  }, [sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-10 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'ja' ? 'カテゴリが見つかりません' : 'Category not found'}
        </h1>
        <Link
          href="/categories"
          className="text-blue-600 hover:underline"
        >
          {language === 'ja' ? 'カテゴリ一覧に戻る' : 'Back to categories'}
        </Link>
      </div>
    );
  }

  const categoryName = language === 'ja' ? category.name : category.nameEn;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="flex items-center text-sm text-slate-500 mb-6 flex-wrap gap-1">
        <Link href="/" className="hover:text-slate-700">
          {language === 'ja' ? 'ホーム' : 'Home'}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/categories" className="hover:text-slate-700">
          {t.category.title}
        </Link>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.id} className="flex items-center">
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/category/${crumb.slug}`}
              className="hover:text-slate-700"
            >
              {language === 'ja' ? crumb.name : crumb.nameEn}
            </Link>
          </span>
        ))}
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900">{categoryName}</span>
      </nav>

      {/* カテゴリタイトル */}
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{categoryName}</h1>

      {/* サブカテゴリ */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">
            {language === 'ja' ? 'サブカテゴリ' : 'Subcategories'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${sub.slug}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
              >
                {language === 'ja' ? sub.name : sub.nameEn}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* サイズで絞り込むリンク */}
      <div className="mb-6">
        <Link
          href={`/search?categoryId=${category.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          {language === 'ja' ? 'サイズで絞り込む →' : 'Filter by size →'}
        </Link>
      </div>

      {/* 検索結果ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-slate-600">
          {t.search.resultsCount.replace('{count}', String(totalCount))}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">{t.common.sort}:</span>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-40"
          >
            <option value="relevance-desc">{t.sort.relevance}</option>
            <option value="price-asc">{t.sort.priceAsc}</option>
            <option value="price-desc">{t.sort.priceDesc}</option>
            <option value="newest-desc">{t.sort.newest}</option>
          </Select>
        </div>
      </div>

      {/* 商品一覧 */}
      {isSearching ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">{t.common.loading}</span>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// カテゴリツリーからスラッグで検索
function findCategoryBySlug(
  categories: CategoryWithChildren[],
  slug: string,
  breadcrumbs: Category[] = []
): { category: CategoryWithChildren; breadcrumbs: Category[] } | null {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return { category: cat, breadcrumbs };
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryBySlug(cat.children, slug, [...breadcrumbs, cat]);
      if (found) return found;
    }
  }
  return null;
}
