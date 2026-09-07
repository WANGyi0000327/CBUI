import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import SearchFilter from './SearchFilter.vue'

const list = [
  { label: '关键词', name: 'keyword', type: 'input', placeholder: '请输入关键词' },
  { label: '状态', name: 'status', type: 'select', options: [{ label: '启用', value: 1 }] },
  { label: '类型', name: 'kind', type: 'radio', options: [{ label: 'A', value: 'a' }] },
]

const mountFilter = (props = {}, options = {}) =>
  mount(SearchFilter, {
    global: {
      plugins: [TDesign],
      stubs: { 'cb-icon': { template: '<span class="stub-icon" />' } },
    },
    props,
    attachTo: document.body,
    ...options,
  })

describe('CbSearchFilter', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染筛选按钮，filterNumber=0 时无角标', () => {
    const wrapper = mountFilter()
    expect(wrapper.text()).toContain('筛选')
    expect(wrapper.text()).not.toContain('(')
  })

  it('filterNumber>0 时显示数量角标与清除图标', () => {
    const wrapper = mountFilter({ filterNumber: 3 })
    expect(wrapper.text()).toContain('(3)')
  })

  it('弹层打开时渲染 list 动态字段与操作按钮', async () => {
    const wrapper = mountFilter({ list, visible: true })
    await new Promise((r) => setTimeout(r, 100))
    const popupText = document.body.textContent || ''
    expect(popupText).toContain('关键词')
    expect(popupText).toContain('状态')
    expect(popupText).toContain('类型')
    expect(popupText).toContain('重置')
    expect(popupText).toContain('确定')
  })

  it('点击确定触发 submit 事件并携带表单数据', async () => {
    const wrapper = mountFilter({ list, visible: true })
    await new Promise((r) => setTimeout(r, 100))
    const submitBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('确定')
    )
    expect(submitBtn).toBeTruthy()
    submitBtn!.click()
    await new Promise((r) => setTimeout(r, 100))
    const events = wrapper.emitted('submit')
    expect(events).toBeTruthy()
    expect(events![0][0]).toHaveProperty('keyword')
  })
})
