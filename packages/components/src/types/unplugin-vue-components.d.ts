/**
 * unplugin-vue-components 类型声明
 * 用于提供 ComponentResolver 类型定义
 */
declare module 'unplugin-vue-components' {
  export interface ComponentResolver {
    type?: 'component' | 'directive'
    resolve: (name: string) => {
      name: string
      from: string
      sideEffects?: string
    } | undefined
  }
}

export {}