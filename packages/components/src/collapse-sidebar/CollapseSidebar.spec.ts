import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CollapseSidebar from './CollapseSidebar.vue'

const mountSidebar = (props = {}, options = {}) =>
  mount(CollapseSidebar, {
    global: {
      stubs: { 'cb-icon': { template: '<span class="stub-icon" />' } },
    },
    props: { width: 274, ...props },
    ...options,
  })

describe('CbCollapseSidebar', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染 side-left / theme-light 默认类与内容插槽', () => {
    const wrapper = mountSidebar({}, { slots: { default: '<div class="side-content">菜单</div>' } })
    expect(wrapper.classes()).toContain('side-left')
    expect(wrapper.classes()).toContain('theme-light')
    expect(wrapper.text()).toContain('菜单')
    // 默认未收起
    expect(wrapper.classes()).not.toContain('cb-collapse-sidebar__close')
  })

  it('side=right / theme=brand 类名正确', () => {
    const wrapper = mountSidebar({ side: 'right', theme: 'brand' })
    expect(wrapper.classes()).toContain('side-right')
    expect(wrapper.classes()).toContain('theme-brand')
  })

  it('resizable=false 时点击折叠按钮仅切换收起态', async () => {
    const wrapper = mountSidebar()
    expect(wrapper.emitted('update:width')).toBeUndefined()
    await wrapper.find('.cb-collapse-sidebar-btn').trigger('click')
    expect(wrapper.classes()).toContain('cb-collapse-sidebar__close')
    expect(wrapper.emitted('update:width')).toBeUndefined()
  })

  it('resizable=true 点击折叠按钮：收起宽度 0 / 展开恢复 initWidth', async () => {
    const wrapper = mountSidebar({ resizable: true, initWidth: 300 })
    await wrapper.find('.cb-collapse-sidebar-btn').trigger('click')
    // 收起 → width=0
    expect(wrapper.emitted('update:width')!.at(-1)![0]).toBe(0)
    expect(wrapper.classes()).toContain('cb-collapse-sidebar__close')
    // 再点展开 → initWidth
    await wrapper.find('.cb-collapse-sidebar-btn').trigger('click')
    expect(wrapper.emitted('update:width')!.at(-1)![0]).toBe(300)
    expect(wrapper.classes()).not.toContain('cb-collapse-sidebar__close')
  })

  it('resizable=true 拖拽调整宽度并触发 update:width', async () => {
    const wrapper = mountSidebar({
      resizable: true,
      initWidth: 300,
      width: 300,
    })
    // jsdom 无布局计算，offsetWidth 恒为 0：以 style.width 为权威来源 mock
    Object.defineProperty(wrapper.element, 'offsetWidth', {
      get() {
        return parseInt((this as HTMLElement).style.width, 10) || 0
      },
      configurable: true,
    })
    const bar = wrapper.find('.resize-drag-bar')
    expect(bar.exists()).toBe(true)
    // 模拟拖拽：mousedown → document mousemove → mouseup
    await bar.trigger('mousedown', { clientX: 100 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150 }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    expect(wrapper.vm.isDragging).toBe(false)
    // side=left：newW = startDomWidth(300) + (150-100) = 350
    const lastEmit = wrapper.emitted('update:width')!.at(-1)![0] as number
    expect(lastEmit).toBe(350)
  })

  it('resizable=true + side=right：向右拖变宽（方向一致）', async () => {
    const wrapper = mountSidebar({
      side: 'right',
      resizable: true,
      initWidth: 300,
      width: 300,
    })
    Object.defineProperty(wrapper.element, 'offsetWidth', {
      get() {
        return parseInt((this as HTMLElement).style.width, 10) || 0
      },
      configurable: true,
    })
    const bar = wrapper.find('.resize-drag-bar')
    await bar.trigger('mousedown', { clientX: 100 })
    // 向右拖 +50：右侧栏同样变宽（300 + 50 = 350）
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150 }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    expect(wrapper.emitted('update:width')!.at(-1)![0]).toBe(350)
    // 向左拖 -50：变窄（起点 350，350 - 50 = 300）
    await bar.trigger('mousedown', { clientX: 100 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    expect(wrapper.emitted('update:width')!.at(-1)![0]).toBe(300)
  })

  it('resizable=false 不渲染拖拽分割线', () => {
    const wrapper = mountSidebar()
    expect(wrapper.find('.resize-drag-bar').exists()).toBe(false)
  })
})
