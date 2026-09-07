import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

/**
 * Button 组件测试
 * ------------------------------------------------------------
 * 组件是基于 TDesign (TButton) 的二次封装：
 * - 标准 theme（default/primary/danger/warning/success）直接透传给 TButton
 * - 自定义主题 cb-brand-* 作为额外 class 绑定在根元素，theme 回退为 default
 * - 字符串 icon 会渲染为 CbIcon（svg.svg-icon）
 * - 其余 attrs（disabled / nativeType / size 等）通过 $attrs 透传
 */
describe('Button', () => {
  // 基础渲染
  it('renders default button correctly', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click Me' },
    })
    expect(wrapper.get('button').classes()).toContain('t-button')
    expect(wrapper.text()).toBe('Click Me')
  })

  // 默认主题
  it('defaults to primary theme', () => {
    const wrapper = mount(Button)
    expect(wrapper.get('button').classes()).toContain('t-button--theme-primary')
  })

  // 标准主题透传给 TDesign
  it('passes standard theme to TDesign Button', () => {
    const wrapper = mount(Button, {
      props: { theme: 'danger' },
    })
    expect(wrapper.get('button').classes()).toContain('t-button--theme-danger')
  })

  // 自定义品牌主题：类绑定在根元素，theme 回退为 default
  it('applies cb-brand-default custom theme and falls back to default', () => {
    const wrapper = mount(Button, {
      props: { theme: 'cb-brand-default' },
    })
    const btn = wrapper.get('button')
    expect(btn.classes()).toContain('cb-brand-default')
    expect(btn.classes()).toContain('t-button--theme-default')
  })

  it('applies cb-brand-gray custom theme', () => {
    const wrapper = mount(Button, {
      props: { theme: 'cb-brand-gray' },
    })
    expect(wrapper.get('button').classes()).toContain('cb-brand-gray')
  })

  // 字符串 icon → CbIcon
  it('renders string icon as CbIcon', () => {
    const wrapper = mount(Button, {
      props: { icon: 'search' },
    })
    const svg = wrapper.get('svg.svg-icon')
    expect(svg.find('use').attributes('href')).toBe('#icon-search')
  })

  // 点击事件
  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  // attrs 透传：disabled
  it('passes disabled attribute through to native button', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  // attrs 透传：原生 type 属性（文档契约：type=submit/reset/button 原样透传）
  it('passes native type attribute when type is submit', () => {
    const wrapper = mount(Button, {
      props: { type: 'submit' },
    })
    expect(wrapper.get('button').attributes('type')).toBe('submit')
  })

  it('passes native type attribute when type is reset', () => {
    const wrapper = mount(Button, {
      props: { type: 'reset' },
    })
    expect(wrapper.get('button').attributes('type')).toBe('reset')
  })

  // type 双通道：主题色写入 type 时自动映射为 theme
  it('maps theme color written in type to theme', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
    })
    const btn = wrapper.get('button')
    expect(btn.classes()).toContain('t-button--theme-primary')
    // 原生 type 不应被主题色污染
    expect(btn.attributes('type')).toBe('button')
  })

  // type 双通道：type 优先级高于 theme
  it('gives type higher priority than theme', () => {
    const wrapper = mount(Button, {
      props: { type: 'danger', theme: 'primary' },
    })
    expect(wrapper.get('button').classes()).toContain('t-button--theme-danger')
  })

  // type 双通道：自定义主题写入 type 同样生效
  it('maps custom theme written in type', () => {
    const wrapper = mount(Button, {
      props: { type: 'cb-brand-default' },
    })
    const btn = wrapper.get('button')
    expect(btn.classes()).toContain('cb-brand-default')
    expect(btn.classes()).toContain('t-button--theme-default')
  })
})
