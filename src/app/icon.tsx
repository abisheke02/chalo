import { ImageResponse } from 'next/og';

// Next.js file-convention favicon — auto-wires <link rel="icon"> and serves
// at /icon. A simple "C" monogram in brand blue, replacing the full logo PNG
// that was previously (mis)used as the favicon.
export const size = { width: 64, height: 64 };
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
          background: '#026dde',
          borderRadius: '14px',
          color: 'white',
          fontSize: 42,
          fontWeight: 800,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
