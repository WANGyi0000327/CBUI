import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagImg from './TagImg.vue'

const typeList = [
  { id: 1, name: '启用', color: '#00A870', textcolor: '#00A870', icon: 'zhengque', value: 'on' },
  { id: 2, name: '停用', color: '#D54941', textcolor: '#D54941', icon: 'cuowu', value: 'off' },
]

const mountTag = (props = {}, options = {}) =>
  mount(TagImg, {
    global: {
      stubs: { 'cb-icon': { template: '<span class="stub-icon" />' } },
    },
    props: { typeList, ...props },
    ...options,
  })

describe('CbTagImg', () => {
  it('有 status 且匹配时渲染图标与名称', () => {
    const wrapper = mountTag({ status: 1 })
    expect(wrapper.text()).toContain('启用')
    expect(wrapper.find('.stub-icon').exists()).toBe(true)
  })

  it('无 status 时显示占位符 -', () => {
    const wrapper = mountTag({})
    expect(wrapper.text()).toBe('-')
  })

  it('status 有值但未匹配时展示空内容（不显示 -）', () => {
    const wrapper = mountTag({ status: 99 })
    expect(wrapper.text()).toBe('')
  })

  it('按 value 匹配并应用文本颜色', () => {
    const wrapper = mountTag({ status: 'off' })
    const span = wrapper.find('.title')
    expect(span.exists()).toBe(true)
    expect(span.attributes('style')).toContain('#D54941')
  })
})
