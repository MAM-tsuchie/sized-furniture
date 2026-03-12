import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
          borderRadius: '40px',
        }}
      >
        <span
          style={{
            fontSize: '120px',
            fontWeight: 700,
            color: '#c9a962',
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size }
  );
}
