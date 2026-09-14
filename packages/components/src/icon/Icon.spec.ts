import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'

describe('CbIcon', () => {
  it('渲染 svg use 且 href 指向 #icon-<name>', () => {
    const wrapper = mount(Icon, { props: { name: 'fuzhi' } })
    const use = wrapper.find('use')
    expect(use.exists()).toBe(true)
    // happy-dom 对 xlink:href 的序列化方式与浏览器不同，用 outerHTML 断言
    expect(wrapper.html()).toContain('#icon-fuzhi')
  })

  it('透传 size / color 到 style', () => {
    const wrapper = mount(Icon, {
      props: { name: 'fuzhi', size: '16px', color: 'red' },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('style')).toContain('color: red')
    expect(svg.attributes('style')).toContain('font-size: 16px')
  })

  it('透传 $attrs 到 svg（如 class / data 属性）', () => {
    const wrapper = mount(Icon, {
      props: { name: 'fuzhi', 'data-test': 'icon-test', class: 'my-icon' },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('data-test')).toBe('icon-test')
    expect(svg.classes()).toContain('my-icon')
  })
})
