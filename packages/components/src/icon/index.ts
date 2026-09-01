import Icon from './Icon.vue'
import type { IconProps } from './types'

// 同时提供 named export，原因：
// 1. scripts/generate-index.mjs 通过 named export 模式提取组件名生成全量入口，
//    若只有 default export 会导致 Icon 被漏注册（CBUI.install 不注册 CbIcon）。
// 2. resolver 按需加载时按 named import 解析，必须有 named export 才能成功
//    （仅有 default export 时按需加载会失败）。
export { Icon }
export type { IconProps }
export default Icon
