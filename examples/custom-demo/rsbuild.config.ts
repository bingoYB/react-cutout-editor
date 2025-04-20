import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    base: '/custom-demo/',
    port: 3001,
  },
  output: {
    assetPrefix: 'https://bingoyb.github.io/custom-demo/',
  },
});
