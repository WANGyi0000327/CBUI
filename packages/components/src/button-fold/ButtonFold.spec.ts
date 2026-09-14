import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import ButtonFold from './ButtonFold.vue'
import TDesign from 'tdesign-vue-next'

// 三个操作按钮（原生 vnode，模拟业务传入的按钮/链接）
const threeOps = () => [
  h('button', { class: 'op' }, '编辑'),
  h('button', { class: 'op' }, '删除'),
  h('button', { class: 'op' }, '禁用'),
]

const mountFold = (props = {}, slots = {}) =>
  mount(ButtonFold, {
    attachTo: document.body,
    global: {
      plugins: [TDesign],
      stubs: {
        'cb-icon': {
          emits: ['click'],
          template: '<span class="stub-icon" @click="$emit(\'click\')" />',
        },
        't-popup': {
          props: ['visible'],
          template:
            '<div class="stub-popup" :data-visible="visible"><slot /><slot name="content" /></div>',
        },
        't-button': {
          props: ['disabled', 'theme'],
          template:
            '<button class="stub-tbutton" :disabled="disabled"><slot /></button>',
        },
      },
    },
    props,
    slots,
  })

describe('CbButtonFold', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('默认展示 expendNum 个操作，其余折叠进弹层', () => {
    const wrapper = mountFold({ expendNum: 1 }, { default: threeOps })
    const shown = wrapper.findAll('.first-operation button.op')
    expect(shown.length).toBe(1)
    expect(shown[0].text()).toBe('编辑')
    // 弹层内容渲染其余 2 个
    const popup = wrapper.find('.stub-popup')
    expect(popup.exists()).toBe(true)
    expect(popup.findAll('button.op').length).toBe(2)
  })

  it('操作数不超过 expendNum 时不渲染弹层', () => {
    const wrapper = mountFold({ expendNum: 3 }, { default: threeOps })
    expect(wrapper.findAll('.first-operation button.op').length).toBe(3)
    expect(wrapper.find('.stub-popup').exists()).toBe(false)
  })

  it('点击更多图标切换弹层可见性', async () => {
    const wrapper = mountFold({ expendNum: 1 }, { default: threeOps })
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('false')
    await wrapper.find('.stub-icon').trigger('click')
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('true')
  })

  it('disabledAll 时所有操作按钮被禁用', () => {
    const wrapper = mountFold(
      { expendNum: 1, disabledAll: true },
      { default: threeOps }
    )
    const shown = wrapper.findAll('.first-operation button.op')
    expect(shown.length).toBe(1)
    expect(shown[0].attributes('disabled')).toBeDefined()
  })

  it('type=moreBtn 显示操作文案按钮', async () => {
    const wrapper = mountFold(
      { expendNum: 1, type: 'moreBtn', operationName: '更多操作' },
      { default: threeOps }
    )
    const moreBtn = wrapper.find('.stub-tbutton')
    expect(moreBtn.exists()).toBe(true)
    expect(moreBtn.text()).toContain('更多操作')
  })

  it('disabledAll 时点击更多按钮不切换可见性', async () => {
    const wrapper = mountFold(
      { expendNum: 1, disabledAll: true, type: 'moreBtn' },
      { default: threeOps }
    )
    await wrapper.find('.stub-tbutton').trigger('click')
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('false')
  })
})
