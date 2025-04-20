import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      exports: 'named',
    },
    // 添加压缩版本
    {
      file: 'dist/index.min.js',
      format: 'cjs',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      exports: 'named',
      plugins: [terser()],
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'es',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      exports: 'named',
      plugins: [terser()],
    },
  ],
  external: ['react', 'react-dom', 'konva', 'react-konva'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true,
      declaration: true,
      declarationDir: './dist/types',
      exclude: ['**/__tests__', '**/*.test.ts', './examples/**'],
      // 添加以下配置
      compilerOptions: {
        preserveConstEnums: true,
      },
    }),
    resolve(),
    commonjs(),
  ],
};
