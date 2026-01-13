import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        pathname: '/img/**',
      },
    ],
    // Increase timeout for slow image sources
    minimumCacheTTL: 60,
    // Disable image optimization for better reliability with slow sources
    unoptimized: false,
  },
};

export default nextConfig;
