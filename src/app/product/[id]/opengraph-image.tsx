import { ImageResponse } from 'next/og';
import { createServerSupabaseClient } from '@/lib/supabase/client';

export const runtime = 'edge';
export const alt = '商品画像';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ProductRow {
  title: string;
  image_url: string;
  brand: string | null;
  price: number | null;
  original_currency: string;
  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;
}

async function getProduct(id: string): Promise<ProductRow | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products_cache')
      .select('title, image_url, brand, price, original_currency, width_cm, depth_cm, height_cm')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as ProductRow;
  } catch {
    return null;
  }
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'JPY') return `¥${price.toLocaleString()}`;
  if (currency === 'USD') return `$${price.toFixed(2)}`;
  if (currency === 'GBP') return `£${price.toFixed(2)}`;
  if (currency === 'EUR') return `€${price.toFixed(2)}`;
  return `${price.toLocaleString()} ${currency}`;
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0c0c0c',
            color: '#c9a962',
            fontSize: '48px',
            fontFamily: 'sans-serif',
          }}
        >
          Sized Furniture
        </div>
      ),
      { ...size }
    );
  }

  const sizeLabels = [
    product.width_cm && `W ${product.width_cm}cm`,
    product.depth_cm && `D ${product.depth_cm}cm`,
    product.height_cm && `H ${product.height_cm}cm`,
  ].filter(Boolean);

  const title =
    product.title.length > 60 ? `${product.title.slice(0, 57)}...` : product.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0c0c0c 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        {/* Left: product image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '400px',
            height: '100%',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url}
            alt={product.title}
            width={320}
            height={320}
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Right: product info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 40px',
            flex: 1,
            gap: '16px',
          }}
        >
          {product.brand && (
            <span style={{ fontSize: '18px', color: '#a1a1aa' }}>{product.brand}</span>
          )}
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {product.price && (
            <span style={{ fontSize: '36px', fontWeight: 700, color: '#c9a962' }}>
              {formatPrice(product.price, product.original_currency)}
            </span>
          )}
          {sizeLabels.length > 0 && (
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {sizeLabels.map((label) => (
                <span
                  key={label}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid rgba(201,169,98,0.4)',
                    borderRadius: '6px',
                    color: '#d4d4d8',
                    fontSize: '18px',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            <span style={{ color: '#c9a962', fontSize: '16px', fontWeight: 700 }}>
              Sized
            </span>
            <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 300 }}>
              Furniture
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
