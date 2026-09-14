import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock @vueuse/core：happy-dom 无 ResizeObserver/IntersectionObserver 时组件内部会退化，
// 测试只需验证插槽渲染与 expose 结构，不依赖真实测量
vi.mock('@vueuse/core', () => ({
  useResizeObserver: vi.fn(),
  useElementVisibility: vi.fn(() => ({ value: false })),
}))

import PageLayout from './PageLayout.vue'

describe('CbPageLayout', () => {
  it('渲染 header / content / footer 三段插槽', () => {
    const wrapper = mount(PageLayout, {
      slots: {
        header: '<div class="hdr">标题栏</div>',
        content: '<div class="ct">内容区</div>',
        footer: '<div class="ftr">底部操作</div>',
      },
    })
    expect(wrapper.find('.hdr').text()).toBe('标题栏')
    expect(wrapper.find('.ct').text()).toBe('内容区')
    expect(wrapper.find('.ftr').text()).toBe('底部操作')
  })

  it('未传插槽时不渲染对应区域', () => {
    const wrapper = mount(PageLayout, {
      slots: { content: '<div>只有内容</div>' },
    })
    expect(wrapper.find('.base-layout-header').exists()).toBe(false)
    expect(wrapper.find('.base-layout-footer').exists()).toBe(false)
    expect(wrapper.find('.base-layout-content').exists()).toBe(true)
  })

  it('暴露 contentHeight（容器不可见时返回 0）', () => {
    const wrapper = mount(PageLayout, {
      slots: { content: '<div>内容</div>' },
    })
    // Vue 3.3+ defineExpose 的 ref/computed 自动解包，contentHeight 直接是数值
    const vm = wrapper.vm as unknown as { contentHeight: number }
    expect(vm.contentHeight).toBe(0)
  })
})
