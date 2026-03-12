'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchForm } from '@/components/search/search-form';
import { ProductGrid } from '@/components/product/product-grid';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import { trackSearch } from '@/components/analytics/google-analytics';
import type { ProductSearchParams, Product, Category, ColorGroup, WoodType } from '@/types';

interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { regionCode } = useRegion();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([]);
  const [woodTypes, setWoodTypes] = useState<WoodType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'newest'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // URLパラメータから初期値を取得
  const getInitialParams = useCallback((): Partial<ProductSearchParams> => ({
    widthMin: searchParams.get('widthMin') ? Number(searchParams.get('widthMin')) : undefined,
    widthMax: searchParams.get('widthMax') ? Number(searchParams.get('widthMax')) : undefined,
    depthMin: searchParams.get('depthMin') ? Number(searchParams.get('depthMin')) : undefined,
    depthMax: searchParams.get('depthMax') ? Number(searchParams.get('depthMax')) : undefined,
    heightMin: searchParams.get('heightMin') ? Number(searchParams.get('heightMin')) : undefined,
    heightMax: searchParams.get('heightMax') ? Number(searchParams.get('heightMax')) : undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    categorySlug: searchParams.get('category') || searchParams.get('categorySlug') || undefined,
    colorGroupId: searchParams.get('colorGroupId') || undefined,
    woodTypeId: searchParams.get('woodTypeId') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  }), [searchParams]);

  // カテゴリ・カラー・木材タイプを取得
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, colorsRes] = await Promise.all([
          fetch('/api/categories?tree=true'),
          fetch('/api/colors'),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(flattenCategories(data.categories || []));
        }

        if (colorsRes.ok) {
          const data = await colorsRes.json();
          setColorGroups(data.colorGroups || []);
          setWoodTypes(data.woodTypes || []);
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // 検索実行
  const executeSearch = useCallback(async (params: Partial<ProductSearchParams>, page: number = 1) => {
    setIsSearching(true);

    const urlParams = new URLSearchParams();
    if (params.widthMin) urlParams.set('widthMin', String(params.widthMin));
    if (params.widthMax) urlParams.set('widthMax', String(params.widthMax));
    if (params.depthMin) urlParams.set('depthMin', String(params.depthMin));
    if (params.depthMax) urlParams.set('depthMax', String(params.depthMax));
    if (params.heightMin) urlParams.set('heightMin', String(params.heightMin));
    if (params.heightMax) urlParams.set('heightMax', String(params.heightMax));
    if (params.categoryId) urlParams.set('categoryId', params.categoryId);
    if (!params.categoryId && params.categorySlug) urlParams.set('category', params.categorySlug);
    if (params.colorGroupId) urlParams.set('colorGroupId', params.colorGroupId);
    if (params.woodTypeId) urlParams.set('woodTypeId', params.woodTypeId);
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
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);

        trackSearch({
          category: params.categoryId,
          widthMin: params.widthMin,
          widthMax: params.widthMax,
          depthMin: params.depthMin,
          depthMax: params.depthMax,
          heightMin: params.heightMin,
          heightMax: params.heightMax,
          colorGroup: params.colorGroupId,
          woodType: params.woodTypeId,
          resultsCount: data.total,
        });
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsSearching(false);
    }
  }, [regionCode, sortBy, sortOrder]);

  // フォームから検索
  const handleSearch = useCallback((params: ProductSearchParams) => {
    // URLを更新
    const urlParams = new URLSearchParams();
    if (params.widthMin) urlParams.set('widthMin', String(params.widthMin));
    if (params.widthMax) urlParams.set('widthMax', String(params.widthMax));
    if (params.depthMin) urlParams.set('depthMin', String(params.depthMin));
    if (params.depthMax) urlParams.set('depthMax', String(params.depthMax));
    if (params.heightMin) urlParams.set('heightMin', String(params.heightMin));
    if (params.heightMax) urlParams.set('heightMax', String(params.heightMax));
    if (params.categoryId) urlParams.set('categoryId', params.categoryId);
    if (params.colorGroupId) urlParams.set('colorGroupId', params.colorGroupId);
    if (params.woodTypeId) urlParams.set('woodTypeId', params.woodTypeId);

    router.push(`/search?${urlParams.toString()}`);
    executeSearch(params, 1);
  }, [router, executeSearch]);

  // ページ変更
  const handlePageChange = useCallback((page: number) => {
    const params = getInitialParams();
    
    // URLを更新
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', String(page));
    router.push(`/search?${urlParams.toString()}`);
    
    executeSearch(params, page);
    
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router, executeSearch, getInitialParams]);

  // ソート変更
  const handleSortChange = useCallback((value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as ['relevance' | 'price' | 'newest', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    
    const params = getInitialParams();
    executeSearch(params, 1);
  }, [executeSearch, getInitialParams]);

  // 初回検索
  useEffect(() => {
    if (!isLoading) {
      const params = getInitialParams();
      executeSearch(params, params.page || 1);
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const initialParams = getInitialParams();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {t.search.title}
      </h1>

      {/* 検索フォーム */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
        <SearchForm
          categories={categories}
          colorGroups={colorGroups}
          woodTypes={woodTypes}
          initialParams={initialParams}
          onSearch={handleSearch}
        />
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

      {/* 検索結果 */}
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

// カテゴリツリーをフラット化
function flattenCategories(tree: Category[], result: Category[] = []): Category[] {
  for (const cat of tree) {
    result.push(cat);
    if ((cat as Category & { children?: Category[] }).children) {
      flattenCategories((cat as Category & { children?: Category[] }).children!, result);
    }
  }
  return result;
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded mb-8"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
