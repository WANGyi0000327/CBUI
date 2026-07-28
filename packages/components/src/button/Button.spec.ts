import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  // 基础渲染
  it('renders default button correctly', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click Me' },
    })
    expect(wrapper.classes()).toContain('cb-button--default')
    expect(wrapper.classes()).toContain('cb-button--medium')
    expect(wrapper.text()).toBe('Click Me')
  })

  // 类型变体
  it('applies primary type class', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.classes()).toContain('cb-button--primary')
  })

  it('applies danger type class', () => {
    const wrapper = mount(Button, {
      props: { type: 'danger' },
    })
    expect(wrapper.classes()).toContain('cb-button--danger')
  })

  // 尺寸变体
  it('applies small size class', () => {
    const wrapper = mount(Button, {
      props: { size: 'small' },
    })
    expect(wrapper.classes()).toContain('cb-button--small')
  })

  it('applies large size class', () => {
    const wrapper = mount(Button, {
      props: { size: 'large' },
    })
    expect(wrapper.classes()).toContain('cb-button--large')
  })

  // 点击事件
  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  // 禁用状态不触发点击
  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  // 加载状态不触发点击
  it('does not emit click when loading', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  // 禁用状态添加 is-disabled 类
  it('adds is-disabled class when disabled', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  // 加载状态显示加载图标
  it('shows spinner when loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
    })
    expect(wrapper.find('.cb-button__spinner').exists()).toBe(true)
  })

  // 块级按钮
  it('adds is-block class when block is true', () => {
    const wrapper = mount(Button, {
      props: { block: true },
    })
    expect(wrapper.classes()).toContain('is-block')
  })

  // 原生 type 属性
  it('sets native type attribute', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
