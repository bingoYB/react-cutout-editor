import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/react-cutout-editor/nextjs/' : '/react-cutout-editor/examples/nextjs',
  output: 'export',
};

export default nextConfig;
