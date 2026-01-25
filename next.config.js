/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent development double-renders
  eslint: {
    // Disable ESLint during production builds (already ran in pre-commit)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during production builds (already ran in pre-commit)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Stricter CSP for application pages (dashboard, builder, etc.)
        source: '/(dashboard|builder|projects|templates|settings)/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for builder
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.leanx.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // More permissive CSP for published pages (user-generated content)
        // Includes tracking pixels: Meta/Facebook, TikTok, Google Analytics/Ads
        source: '/(p|s)/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: Meta Pixel, TikTok Pixel, Google Analytics/Ads
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://connect.facebook.net https://analytics.tiktok.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              // Connect: API calls for tracking, payments, CAPI
              "connect-src 'self' https://api.leanx.com https://www.facebook.com https://analytics.tiktok.com https://www.google-analytics.com https://region1.google-analytics.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              "media-src 'self' https:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
