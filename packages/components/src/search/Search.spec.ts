import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import Search from './Search.vue'

describe('CBSearch', () => {
  it('渲染输入框与搜索按钮，默认占位符生效', () => {
    const wrapper = mount(Search, {
      global: { plugins: [TDesign] },
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('请输入内容')
    expect(wrapper.text()).toContain('搜索')
  })

  it('v-model 双向绑定关键词', async () => {
    const wrapper = mount(Search, {
      global: { plugins: [TDesign] },
    })
    await wrapper.find('input').setValue('成都')
    expect((wrapper.vm as unknown as { keywords: string }).keywords).toBe('成都')
  })

  it('点击搜索按钮触发 search 事件并携带关键词', async () => {
    const wrapper = mount(Search, {
      global: { plugins: [TDesign] },
      props: { modelValue: '黄金' },
    })
    await wrapper.find('input').setValue('黄金ETF')
    await wrapper.find('button').trigger('click')
    const events = wrapper.emitted('search')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['黄金ETF'])
  })

  it('支持自定义宽度与占位符', () => {
    const wrapper = mount(Search, {
      global: { plugins: [TDesign] },
      props: { inputWidth: '400px', placeholder: '请输入名称' },
    })
    expect(wrapper.findComponent({ name: 'TInputAdornment' }).attributes('style')).toContain(
      '400px'
    )
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入名称')
  })
})
