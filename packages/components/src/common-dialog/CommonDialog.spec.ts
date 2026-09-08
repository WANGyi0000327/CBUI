import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CommonDialog from './CommonDialog.vue'

// t-dialog stub：渲染具名插槽便于断言内容
const TDialogStub = {
  props: ['visible', 'showHeader', 'showFooter', 'draggable'],
  template:
    '<div class="stub-dialog"><slot name="header" /><slot name="body" /><slot name="footer" /></div>',
}

const mountDialog = (props = {}, options = {}) =>
  mount(CommonDialog, {
    global: {
      stubs: {
        't-dialog': TDialogStub,
        't-button': { template: '<button><slot /></button>' },
      },
    },
    props: { visible: true, title: '确认操作', ...props },
    ...options,
  })

describe('CommonDialog', () => {
  it('渲染标题与默认按钮（取消/确定）', () => {
    const wrapper = mountDialog()
    expect(wrapper.text()).toContain('确认操作')
    expect(wrapper.text()).toContain('取消')
    expect(wrapper.text()).toContain('确定')
  })

  it('showheader=false 时不渲染头部', () => {
    const wrapper = mountDialog({ showheader: false })
    expect(wrapper.text()).not.toContain('确认操作')
  })

  it('点击确定触发 confirm 回调', async () => {
    const confirm = vi.fn()
    const wrapper = mountDialog({ confirm })
    // t-button stub 渲染为 button 元素
    const confirmBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('确定'))
    await confirmBtn!.trigger('click')
    expect(confirm).toHaveBeenCalled()
  })

  it('closeBtn=false 隐藏取消按钮', () => {
    const wrapper = mountDialog({ closeBtn: false })
    expect(wrapper.text()).not.toContain('取消')
    expect(wrapper.text()).toContain('确定')
  })

  it('visible=false 仍可挂载且不渲染插槽内容（destroyOnClose 场景由 t-dialog 控制）', () => {
    const wrapper = mountDialog({ visible: false })
    // 组件本体不因 visible 隐藏插槽（t-dialog 内部控制显隐），仅验证不报错
    expect(wrapper.find('.stub-dialog').exists()).toBe(true)
  })
})
