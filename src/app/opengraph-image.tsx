import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sized Furniture - サイズで探す家具検索';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0c0c0c 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '72px', fontWeight: 700, color: '#c9a962' }}>
              Sized
            </span>
            <span style={{ fontSize: '72px', fontWeight: 300, color: '#ffffff' }}>
              Furniture
            </span>
          </div>
          <div
            style={{
              width: '120px',
              height: '2px',
              background: '#c9a962',
            }}
          />
          <p
            style={{
              fontSize: '28px',
              color: '#d4d4d8',
              letterSpacing: '0.1em',
            }}
          >
            置きたい場所にピッタリの家具を検索
          </p>
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '16px',
            }}
          >
            {['幅', '奥行き', '高さ'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  border: '1px solid rgba(201, 169, 98, 0.3)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#c9a962' }}>{label}</span>
                <span style={{ fontSize: '24px', color: '#ffffff' }}>__ cm</span>
              </div>
            ))}
          </div>
        </div>
        <p
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '16px',
            color: '#71717a',
          }}
        >
          sized-furniture.com
        </p>
      </div>
    ),
    { ...size }
  );
}
