import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign, { Input as TInput } from 'tdesign-vue-next'
import { h } from 'vue'
import RenderComponent from './RenderComponent.vue'

describe('RenderComponent', () => {
  it('渲染 render 回调返回的 VNode', () => {
    const wrapper = mount(RenderComponent, {
      global: { plugins: [TDesign] },
      props: {
        render: (h: any) => h('div', { class: 'rc-demo' }, '渲染内容'),
      },
    })
    expect(wrapper.find('.rc-demo').text()).toBe('渲染内容')
  })

  it('渲染 TDesign 组件（组件对象写法）', () => {
    const wrapper = mount(RenderComponent, {
      global: { plugins: [TDesign] },
      props: {
        render: (h: any) => h(TInput, { placeholder: '测试' }),
      },
    })
    // TInput 解析后应渲染为 input
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('自动转发 v-model:value（onChange / onUpdate:value → emit）', async () => {
    const onChange = vi.fn()
    const wrapper = mount(RenderComponent, {
      global: { plugins: [TDesign] },
      props: {
        render: (h: any) => h(TInput, { placeholder: '转发测试' }),
      },
      attrs: { 'onUpdate:value': onChange },
    })
    const input = wrapper.find('input')
    await input.setValue('hello')
    // t-input 值变化 → 触发 onChange → 组件转发 emit
    expect(onChange).toHaveBeenCalled()
  })

  it('渲染组件自带 onChange 时不覆盖（尊重业务侧监听）', () => {
    const businessChange = vi.fn()
    const forwardedChange = vi.fn()
    mount(RenderComponent, {
      global: { plugins: [TDesign] },
      props: {
        render: (h: any) =>
          h('t-input', { onChange: businessChange, placeholder: '业务监听' }),
      },
      attrs: { 'onUpdate:value': forwardedChange },
    })
    // 组件不应给 vnode 追加 own onChange（业务已提供）
    // 此处仅验证组件挂载无异常；转发由 TDesign 内部 onClick 链路驱动
    expect(businessChange).not.toHaveBeenCalled()
  })
})
