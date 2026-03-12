import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            fontSize: '22px',
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
