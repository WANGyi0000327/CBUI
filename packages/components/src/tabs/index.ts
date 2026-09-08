/**
 * Cbtabs 标签页切换组件入口
 * ----------------------------------------------------------------
 * SFC 内部 defineOptions name 为 'Cbtabs'（用户指定命名），
 * CBUI.install 按该 name 注册，模板中需使用 <Cbtabs>。
 * 此文件作为导出门面（barrel），供 gen:index 扫描与 resolver 按需加载。
 */
import Tabs from './Tabs.vue'
import type { CbTabsProps, typeTab } from './types'

export { Tabs }
export type { CbTabsProps, typeTab }
export default Tabs
