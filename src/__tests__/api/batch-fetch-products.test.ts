import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/batch/product-fetcher', () => ({
  fetchAllProducts: vi.fn(),
}));

import { GET, POST } from '@/app/api/batch/fetch-products/route';
import { fetchAllProducts } from '@/lib/batch/product-fetcher';
import { NextRequest } from 'next/server';

const mockFetchAllProducts = vi.mocked(fetchAllProducts);

function createRequest(
  method: 'GET' | 'POST',
  options: { searchParams?: Record<string, string>; body?: Record<string, unknown>; authHeader?: string } = {}
) {
  const url = new URL('http://localhost:3000/api/batch/fetch-products');
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const headers = new Headers();
  if (options.authHeader) {
    headers.set('authorization', options.authHeader);
  }

  return new NextRequest(url, {
    method,
    headers,
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
}

describe('/api/batch/fetch-products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchAllProducts.mockResolvedValue({
      success: 10,
      failed: 0,
      skipped: 5,
      errors: [],
    });
  });

  describe('GET', () => {
    it('region クエリパラメータに基づいて商品を取得する', async () => {
      const request = createRequest('GET', { searchParams: { region: 'us' } });
      const response = await GET(request);
      const data = await response.json();

      expect(mockFetchAllProducts).toHaveBeenCalledWith('us');
      expect(data.success).toBe(true);
      expect(data.region).toBe('us');
    });

    it('region 未指定の場合は jp をデフォルトにする', async () => {
      const request = createRequest('GET');
      const response = await GET(request);
      const data = await response.json();

      expect(mockFetchAllProducts).toHaveBeenCalledWith('jp');
      expect(data.region).toBe('jp');
    });

    it('無効な region の場合は jp にフォールバックする', async () => {
      const request = createRequest('GET', { searchParams: { region: 'invalid' } });
      const response = await GET(request);
      const data = await response.json();

      expect(mockFetchAllProducts).toHaveBeenCalledWith('jp');
      expect(data.region).toBe('jp');
    });

    it('CRON_SECRET 設定時に認証なしのリクエストを拒否する', async () => {
      vi.stubEnv('CRON_SECRET', 'test-secret');
      const request = createRequest('GET', { searchParams: { region: 'jp' } });
      const response = await GET(request);

      expect(response.status).toBe(401);
      vi.unstubAllEnvs();
    });

    it('正しい Bearer トークンで認証が通る', async () => {
      vi.stubEnv('CRON_SECRET', 'test-secret');
      const request = createRequest('GET', {
        searchParams: { region: 'de' },
        authHeader: 'Bearer test-secret',
      });
      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.region).toBe('de');
      vi.unstubAllEnvs();
    });

    it('fetchAllProducts がエラーを投げた場合 500 を返す', async () => {
      mockFetchAllProducts.mockRejectedValue(new Error('DB connection failed'));
      const request = createRequest('GET', { searchParams: { region: 'jp' } });
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Batch processing failed');
    });
  });

  describe('POST', () => {
    it('body の region に基づいて商品を取得する', async () => {
      const request = createRequest('POST', { body: { region: 'fr' } });
      const response = await POST(request);
      const data = await response.json();

      expect(mockFetchAllProducts).toHaveBeenCalledWith('fr');
      expect(data.success).toBe(true);
    });

    it('body に region がない場合は jp をデフォルトにする', async () => {
      const request = createRequest('POST', { body: {} });
      const response = await POST(request);
      await response.json();

      expect(mockFetchAllProducts).toHaveBeenCalledWith('jp');
    });
  });
});
