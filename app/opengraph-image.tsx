import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Nexova — Build, Publish & Grow';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * /opengraph-image
 * Generates the default OG image for nexova.co
 * Auto-referenced by Next.js in <meta property="og:image"> on all pages
 * that don't override it with their own opengraph-image file.
 */
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #5BC0BE 0%, #7C74EA 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background circles for depth */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }}
      />

      {/* Inner content card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '64px 80px',
          maxWidth: '900px',
          width: '100%',
        }}
      >
        {/* Logo wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {/* Logo square */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #5BC0BE, #7C74EA)',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            Nexova
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: '800',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '1.05',
            letterSpacing: '-1.5px',
            marginBottom: '24px',
          }}
        >
          Build. Publish. Grow.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            lineHeight: '1.4',
            maxWidth: '600px',
          }}
        >
          The no-code page builder with native Malaysian payments built in.
        </div>

        {/* Product pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['X.IDE Builder', 'Lean.x Payments', 'Templates', 'Elements'].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>

      {/* nexova.co bottom label */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.75)',
          fontSize: '18px',
          fontWeight: '500',
        }}
      >
        nexova.co
      </div>
    </div>,
    {
      ...size,
    }
  );
}
