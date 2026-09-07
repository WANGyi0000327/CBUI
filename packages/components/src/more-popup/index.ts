/**
 * MorePopup 更多弹层组件入口
 * ----------------------------------------------------------------
 * 模板内部显式 import CbIcon（../icon/Icon.vue），按需加载时无需全局注册。
 * SFC defineOptions name 已是 'CbMorePopup'（符合 Cb 前缀约定），
 * 因此无需 HOC 包装层，此文件仅作为导出门面（barrel），
 * 供 gen:index 扫描与 resolver 按需加载。
 */
import MorePopup from './MorePopup.vue'
import type { MorePopupProps, MorePopupEmits, MorePopupSlots } from './types'

export { MorePopup }
export type { MorePopupProps, MorePopupEmits, MorePopupSlots }
export default MorePopup
