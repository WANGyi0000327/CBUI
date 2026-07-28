import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// 组件库构建配置
// 使用 Vite library 模式打包，输出 ES / CJS / UMD 三种格式
export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 自动生成 .d.ts 类型声明文件
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      copyDtsFiles: true,
      staticImport: true,
    }),
  ],
  resolve: {
    alias: {
      '@cb-ui/utils': resolve(__dirname, '../utils/src'),
      // 注意：theme 指向 packages/theme 目录（不带 src），这样 @cb-ui/theme/src/variables 能正确解析
      '@cb-ui/theme': resolve(__dirname, '../theme'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 使用现代 API，避免 legacy 警告
        api: 'modern-compiler',
        // 自动注入 Sass 变量，组件无需单独 @use
        additionalData: `@use "@cb-ui/theme/src/variables" as *;`,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CBUI',
      fileName: (format) => `index.${format === 'es' ? 'es' : format === 'cjs' ? 'cjs' : 'umd'}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // vue 作为外部依赖，不打包进组件库
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        // 单独输出样式文件
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || 'assets/[name][extname]'
        },
      },
    },
    cssCodeSplit: false,
  },
})
