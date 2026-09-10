/**
 * Vue SFC 类型声明
 * 让 TypeScript 正确识别 .vue 文件模块
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

/** 静态资源模块声明：SVG 图标（文件预览等组件引用） */
declare module '*.svg' {
  const src: string
  export default src
}
