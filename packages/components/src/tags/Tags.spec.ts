import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import Tags from './Tags.vue'

const mountTags = (props = {}, options = {}) =>
  mount(Tags, {
    global: { plugins: [TDesign] },
    props,
    ...options,
  })

describe('CbTags', () => {
  it('渲染 values 全部标签（max 默认 Infinity）', () => {
    const wrapper = mountTags({ values: ['a', 'b', 'c'] })
    expect(wrapper.findAll('.t-tag').length).toBe(3)
    expect(wrapper.text()).toContain('a')
    expect(wrapper.text()).toContain('c')
  })

  it('超出 max 折叠为 +N', () => {
    const wrapper = mountTags({ values: ['a', 'b', 'c', 'd', 'e'], max: 3 })
    const tags = wrapper.findAll('.t-tag')
    expect(tags.length).toBe(4)
    expect(wrapper.text()).toContain('+2')
  })

  it('values 为空时无标签', () => {
    const wrapper = mountTags({ values: [] })
    expect(wrapper.findAll('.t-tag').length).toBe(0)
  })

  it('max 大于 values 长度时不折叠', () => {
    const wrapper = mountTags({ values: ['a', 'b'], max: 5 })
    expect(wrapper.findAll('.t-tag').length).toBe(2)
    expect(wrapper.text()).not.toContain('+')
  })
})
