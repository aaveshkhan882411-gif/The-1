import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;

