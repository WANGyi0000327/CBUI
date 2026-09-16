/**
 * v-click-outside 指令
 * ----------------------------------------------------------------
 * 点击绑定元素外部时触发回调
 * 用法： <div v-click-outside="handleClose">...</div>
 *
 * 说明：Vue 3 无内置 click-outside 指令，TDesign 也未公开导出，
 * 因此组件库自带该指令并在 CBUI.install 时全局注册，保证 CbDateRangeConfirmPicker
 * 等组件 app.use(CBUI) 后开箱即用
 *
 * 实现要点：
 * 1. 使用 event.composedPath() 获取点击路径，兼容 Shadow DOM 场景
 * 2. 使用捕获阶段（addEventListener 第三参数 true），确保在事件被
 *    stopPropagation 之前能抓到，避免漏触发
 */
import type { DirectiveBinding } from 'vue'

// 绑定元素扩展：指令挂载的自定义属性
interface ClickOutsideElement extends HTMLElement {
  _clickOutsideHandler?: (event: MouseEvent) => void
}

export const clickOutside = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      // 获取点击经过的所有 DOM 节点路径
      const path = event.composedPath ? event.composedPath() : []

      // 如果路径里包含当前元素 el，说明点在里面，不触发
      if (path.includes(el)) return

      // 否则触发回调
      if (typeof binding.value === 'function') {
        binding.value(event)
      }
    }
    // 使用捕获阶段 (true)，确保在事件被 stopPropagation 之前能抓到
    document.addEventListener('click', el._clickOutsideHandler, true)
  },
  unmounted(el: ClickOutsideElement) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler, true)
    }
  },
}

export default clickOutside
