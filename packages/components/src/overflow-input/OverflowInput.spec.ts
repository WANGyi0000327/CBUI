import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OverflowInput from './OverflowInput.vue'

const mountOverflow = (props = {}) =>
  mount(OverflowInput, {
    props: {
      data: ['苹果', '香蕉', '橘子', '葡萄', '西瓜', '芒果', '柚子'],
      ...props,
    },
  })

describe('CbOverflowInput', () => {
  it('默认展示前 5 项并用 / 连接', () => {
    const wrapper = mountOverflow()
    expect(wrapper.text()).toContain('苹果/香蕉/橘子/葡萄/西瓜')
  })

  it('超出 max 时追加"等 N 个"计数后缀', () => {
    const wrapper = mountOverflow({ unit: '个' })
    expect(wrapper.text()).toContain('等2个')
  })

  it('未超出 max 时不显示计数后缀', () => {
    const wrapper = mountOverflow({ data: ['苹果', '香蕉'] })
    expect(wrapper.text()).toContain('苹果/香蕉')
    expect(wrapper.text()).not.toContain('等')
  })

  it('支持自定义 max / delimiter / unit', () => {
    const wrapper = mountOverflow({
      data: ['a', 'b', 'c'],
      max: 2,
      delimiter: '、',
      unit: '款',
    })
    expect(wrapper.text()).toContain('a、b')
    expect(wrapper.text()).toContain('等1款')
  })

  it('data 为空时不渲染内容', () => {
    const wrapper = mountOverflow({ data: [] })
    expect(wrapper.text()).toBe('')
  })
})
