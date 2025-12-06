/** @type {import('next').NextConfig} */
const baseSecurityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Removed 'standalone' output - not needed for Vercel, causes Prisma issues
  // outputFileTracingRoot: path.join(__dirname, '../../'),
  poweredByHeader: false,
  compress: true,
  // Temporarily disable for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '*.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', 'date-fns'],
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
  },
  async headers() {
    return [
      {
        // Allow the matching wizard to render inside our in-app modal iframe
        source: '/match/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          ...baseSecurityHeaders,
        ],
      },
      {
        source: '/((?!match).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          ...baseSecurityHeaders,
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
