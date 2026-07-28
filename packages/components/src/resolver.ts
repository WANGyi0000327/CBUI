/**
 * 组件解析器接口
 * 与 unplugin-vue-components 的 ComponentResolver 接口一致
 */
export interface ComponentResolver {
  type?: 'component' | 'directive'
  resolve: (name: string) => {
    name: string
    from: string
    sideEffects?: string
  } | undefined
}

/**
 * CB UI Resolver 选项
 */
export interface CBUIResolverOptions {
  /**
   * 是否自动导入样式
   * @default true
   */
  importStyle?: boolean
  /**
   * 组件名前缀
   * @default 'Cb'
   */
  prefix?: string
  /**
   * 组件库名称
   * @default '@cb-ui/components'
   */
  libraryName?: string
  /**
   * 样式文件后缀
   * @default 'scss'
   */
  styleSuffix?: 'scss' | 'css'
}

/**
 * CB UI 组件库 Resolver
 * ------------------------------------------------------------
 * 配合 unplugin-vue-components 实现组件按需自动引入
 *
 * @example
 * // vite.config.ts
 * Components({
 *   resolvers: [CBUIResolver()],
 * })
 *
 * // 使用时无需手动 import
 * <CbButton>按钮</CbButton>
 */
export function CBUIResolver(options: CBUIResolverOptions = {}): ComponentResolver {
  const {
    importStyle = true,
    prefix = 'Cb',
    libraryName = '@cb-ui/components',
    styleSuffix = 'scss',
  } = options

  return {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith(prefix)) return

      const partialName = name.slice(prefix.length)
      if (!partialName) return

      const kebabName = partialName
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()

      const result: {
        name: string
        from: string
        sideEffects?: string
      } = {
        name: partialName,
        from: `${libraryName}/${kebabName}`,
      }

      if (importStyle) {
        result.sideEffects = `${libraryName}/${kebabName}/style.${styleSuffix}`
      }

      return result
    },
  }
}

export default CBUIResolver
