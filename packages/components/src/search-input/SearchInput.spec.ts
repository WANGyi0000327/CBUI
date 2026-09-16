import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import SearchInput from './SearchInput.vue'

const mountInput = (props = {}, options = {}) =>
  mount(SearchInput, {
    global: {
      plugins: [TDesign],
      stubs: { 'cb-icon': { template: '<span class="stub-icon" />' } },
    },
    props,
    ...options,
  })

describe('CbSearchInput', () => {
  it('渲染输入框与搜索按钮', () => {
    const wrapper = mountInput()
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.text()).toContain('搜索')
  })

  it('v-model 双向绑定并自动 trim', async () => {
    const wrapper = mountInput({ modelValue: '' })
    await wrapper.find('input').setValue('  成都  ')
    expect((wrapper.vm as unknown as { modelValue: string }).modelValue).toBe('成都')
  })

  it('点击搜索触发 search 事件并携带关键词', async () => {
    const wrapper = mountInput({ modelValue: '黄金ETF' })
    await wrapper.find('.search-suffix').trigger('click')
    const events = wrapper.emitted('search')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['黄金ETF'])
  })

  it('点击清空图标清空值并触发 search', async () => {
    const wrapper = mountInput({ modelValue: 'abc' })
    await new Promise((r) => setTimeout(r, 30))
    const clearIcon = wrapper.find('.input-close')
    expect(clearIcon.exists()).toBe(true)
    await clearIcon.trigger('click')
    expect((wrapper.vm as unknown as { modelValue: string | undefined }).modelValue).toBeUndefined()
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('支持宽度与禁用状态', () => {
    const wrapper = mountInput({ searchwidth: '400px', disabled: true })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.search-suffix').classes()).toContain('disabled')
  })
})
