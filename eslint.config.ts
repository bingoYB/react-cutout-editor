import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import type { Config } from 'typescript-eslint';
import globals from 'globals';

const config: Config = [
  js.configs.recommended, // JavaScript 推荐规则
  reactHooksPlugin.configs['recommended-latest'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // 使用已导入的插件对象
      react: reactPlugin, // 使用已导入的插件对象
      prettier: prettierPlugin, // 使用已导入的插件对象
    },
    rules: {
      'react/prop-types': 'off', // TypeScript 不需要 PropTypes
      '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any
      '@typescript-eslint/no-non-null-assertion': 'warn', // 避免不安全的非空断言
      'no-unused-vars': 'off', // 避免类型声明中未使用的变量
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      'prettier/prettier': 'error', // 启用 Prettier 规则
    },
  },
  {
    ignores: [
      'node_modules/', // 忽略 node_modules
      'dist/', // 忽略构建产物
      'build/', // 忽略构建目录
      'public/', // 忽略静态资源
      '**/*.min.js', // 忽略压缩 JS
      '**/vendor/**', // 忽略第三方库
      'coverage/', // 忽略测试覆盖率报告
    ],
  },
];

export default config;
