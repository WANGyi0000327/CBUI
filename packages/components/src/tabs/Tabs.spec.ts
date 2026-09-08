import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import Tabs from './Tabs.vue'

const type_tab = [
  { id: 1, label: '全部', value: 0 },
  { id: 2, label: '启用', value: 1 },
  { id: 3, label: '停用', value: 2 },
]

const mountTabs = (props = {}, options = {}) =>
  mount(Tabs, {
    global: { plugins: [TDesign] },
    props: { type_tab, ...props },
    ...options,
  })

describe('Cbtabs', () => {
  it('渲染 type_tab 的标签文案', () => {
    const wrapper = mountTabs()
    const labels = wrapper.findAll('.t-radio-button')
    expect(labels.length).toBe(3)
    expect(wrapper.text()).toContain('全部')
    expect(wrapper.text()).toContain('启用')
    expect(wrapper.text()).toContain('停用')
  })

  it('v-model 值变化时选中态同步', async () => {
    const wrapper = mountTabs({ modelValue: 2 })
    const active = wrapper.find('.t-radio-button.t-is-checked')
    expect(active.exists()).toBe(true)
    expect(active.text()).toContain('启用')
  })

  it('点击标签切换：更新 v-model 并触发 tab_chk', async () => {
    const wrapper = mountTabs({ modelValue: 1 })
    await wrapper.findAll('.t-radio-button')[1].trigger('click')
    expect(wrapper.emitted('tab_chk')).toBeTruthy()
    expect(wrapper.emitted('tab_chk')![0]).toEqual([2])
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
  })

  it('点击当前选中项不重复触发', async () => {
    const wrapper = mountTabs({ modelValue: 2 })
    await wrapper.findAll('.t-radio-button')[1].trigger('click')
    expect(wrapper.emitted('tab_chk')).toBeUndefined()
  })
})
