/**
 * CbStatusTag 状态标签类型
 * ----------------------------------------------------------------
 * 状态标签组件的类型定义（用户指定文件名为 interface，组件内
 * 通过 `import type { tagType } from './interface'` 引用）
 */
export type tagType = {
  id?: string | number
  name?: string
  color?: string
  label?: string
  value?: boolean | string | number
  variant?: string | 'dark'
}
