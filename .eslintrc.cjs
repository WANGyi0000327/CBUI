module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-console': 'off',
  },
  overrides: [
    {
      // scripts/*.cjs 是故意用 CommonJS 编写的 Node 工具脚本，
      // require() 是其正常用法，不适用 TS 的 no-require-imports 规则
      files: ['**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    '**/*.d.ts', // vite-plugin-dts 构建产物（含 defineProps<Props, {}> 声明），不做 lint 检查
  ],
}
