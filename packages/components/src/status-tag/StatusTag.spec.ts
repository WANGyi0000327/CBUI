import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import StatusTag from './StatusTag.vue'

const typeList = [
  { id: 1, name: '启用', color: '#00A870', value: 'on' },
  { id: 2, name: '停用', color: '#D54941', value: 'off' },
]

const mountTag = (props = {}, options = {}) =>
  mount(StatusTag, {
    global: { plugins: [TDesign] },
    props: { typeList, ...props },
    ...options,
  })

describe('CbStatusTag', () => {
  it('默认 tag 模式渲染匹配状态的标签', () => {
    const wrapper = mountTag({ status: 1 })
    expect(wrapper.find('.t-tag').exists()).toBe(true)
    expect(wrapper.text()).toContain('启用')
  })

  it('按 value 匹配状态', () => {
    const wrapper = mountTag({ status: 'off' })
    expect(wrapper.text()).toContain('停用')
  })

  it('text 模式渲染纯文本并应用颜色', () => {
    const wrapper = mountTag({ status: 1, showType: 'text' })
    expect(wrapper.find('.t-tag').exists()).toBe(false)
    expect(wrapper.text()).toContain('启用')
    expect(wrapper.find('span').attributes('style')).toContain('#00A870')
  })

  it('无匹配状态时显示占位符 -', () => {
    const wrapper = mountTag({ status: 99 })
    expect(wrapper.text()).toBe('-')
  })

  it('dot 模式渲染圆点并传色给标签', () => {
    const wrapper = mountTag({ status: 1, dot: true })
    expect(wrapper.find('.dotbox').exists()).toBe(true)
  })
})
