import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Vitest 单元测试配置
// 复用 Vite 解析能力，支持 Vue SFC 与 TypeScript
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/components/src/**/*.{ts,vue}'],
      exclude: ['**/*.spec.ts', '**/*.d.ts', '**/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@cb-ui/components': resolve(__dirname, './packages/components/src'),
      '@cb-ui/theme': resolve(__dirname, './packages/theme/src'),
      '@cb-ui/utils': resolve(__dirname, './packages/utils/src'),
    },
  },
})
