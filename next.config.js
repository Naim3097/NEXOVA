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
};

module.exports = nextConfig;
