import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import MorePopup from './MorePopup.vue'

const visibleContent = () => h('div', { class: 'menu-item' }, '菜单项')
// hasVisibleContent 在 onMounted / nextTick / MutationObserver 中异步计算
const flushPopup = () => new Promise((r) => setTimeout(r, 50))

const mountPopup = (props = {}, slots = {}) =>
  mount(MorePopup, {
    attachTo: document.body,
    global: {
      stubs: {
        'cb-icon': {
          emits: ['click'],
          template: '<span class="stub-icon" @click="$emit(\'click\')" />',
        },
        't-popup': {
          props: ['visible', 'disabled'],
          template:
            '<div class="stub-popup" :data-visible="visible"><slot /><slot name="content" /></div>',
        },
        't-button': {
          props: ['disabled'],
          template: '<button class="stub-tbutton" :disabled="disabled"><slot /></button>',
        },
      },
    },
    props,
    slots: { content: visibleContent, ...slots },
  })

describe('CbMorePopup', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('有可见 content 时渲染弹层（type 默认 button 显示文案）', async () => {
    const wrapper = mountPopup({ text: '更多操作' })
    await flushPopup()
    expect(wrapper.find('.stub-popup').exists()).toBe(true)
    expect(wrapper.find('.stub-tbutton').text()).toContain('更多操作')
  })

  it('type=icon 渲染图标触发器', async () => {
    const wrapper = mountPopup({ type: 'icon' })
    await flushPopup()
    expect(wrapper.find('.stub-icon').exists()).toBe(true)
  })

  it('点击触发器切换弹层可见性', async () => {
    const wrapper = mountPopup()
    await flushPopup()
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('false')
    await wrapper.find('.stub-tbutton').trigger('click')
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('true')
    await wrapper.find('.stub-tbutton').trigger('click')
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('false')
  })

  it('disabled 时按钮禁用且点击不展开', async () => {
    const wrapper = mountPopup({ disabled: true })
    await flushPopup()
    expect(wrapper.find('.stub-tbutton').attributes('disabled')).toBeDefined()
    await wrapper.find('.stub-tbutton').trigger('click')
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('false')
  })

  it('点击文字触发器 emit triggle-text-click 并携带 close', async () => {
    const wrapper = mountPopup()
    await flushPopup()
    await wrapper.find('.stub-tbutton span').trigger('click')
    const emitted = wrapper.emitted('triggle-text-click')
    expect(emitted).toBeTruthy()
    const payload = emitted![0][0] as { close: () => void }
    expect(typeof payload.close).toBe('function')
    // close 后弹层关闭
    payload.close()
    await flushPopup()
    expect(wrapper.find('.stub-popup').attributes('data-visible')).toBe('false')
  })

  it('content 无可见元素时不渲染弹层', async () => {
    const wrapper = mountPopup({}, { content: () => [] })
    await flushPopup()
    expect(wrapper.find('.stub-popup').exists()).toBe(false)
  })
})
