import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import MultipleSelect from './MultipleSelect.vue'

const list = [
  { value: 1, label: '选项一' },
  { value: 2, label: '选项二' },
  { value: 3, label: '选项三' },
  { value: 4, label: '选项四（禁用）', disabled: true },
]

describe('MultipleSelect', () => {
  it('传递 :list 时 t-select 收到完整 options', () => {
    const wrapper = mount(MultipleSelect, {
      global: { plugins: [TDesign] },
      props: { list },
    })
    const select = wrapper.findComponent({ name: 'TSelect' })
    expect(select.exists()).toBe(true)
    // 显式绑定的 :options="list" 应生效
    expect(select.props('options')).toHaveLength(4)
  })

  it('传递 :options（透传习惯）时数据正常生效', () => {
    const wrapper = mount(MultipleSelect, {
      global: { plugins: [TDesign] },
      attrs: { options: list },
    })
    const select = wrapper.findComponent({ name: 'TSelect' })
    expect(select.exists()).toBe(true)
    // $attrs 中的 options 透传给 t-select（组件内 :options="list" 未传时不干扰）
    expect(select.props('options')).toHaveLength(4)
  })
})
