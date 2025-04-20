import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/react-cutout-editor/examples/nextjs' : 'https://github.com/bingoYB/react-cutout-editor/nextjs',
  output: 'export',
};

export default nextConfig;
