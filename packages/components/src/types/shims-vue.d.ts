/**
 * Vue SFC 类型声明
 * 让 TypeScript 正确识别 .vue 文件模块
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
