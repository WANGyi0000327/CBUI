import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, h } from 'vue'
import DynamicFormGenerator from './DynamicFormGenerator.vue'
import TDesign from 'tdesign-vue-next'
import type { FormField } from './dynamicFormGenerator'

type DFGVM = {
  validate: unknown
  reset: unknown
}

const mountCtrl = (fields: Array<Record<string, unknown>>, data: Record<string, unknown> = {}) => {
  const formData = reactive(data)
  const wrapper = mount(DynamicFormGenerator, {
    global: {
      plugins: [TDesign],
      stubs: {
        CbIcon: { template: '<span class="stub-icon" />' },
        'cb-icon': { template: '<span class="stub-icon" />' },
        't-icon': { template: '<span class="stub-ticon" />' },
      },
    },
    props: {
      fields: fields as FormField[],
      formData,
    },
  })
  return { wrapper, formData }
}

describe('CbDynamicFormGenerator', () => {
  it('渲染输入框字段（默认 type）', () => {
    const { wrapper } = mountCtrl([{ key: 'name', label: '姓名' }], {
      name: '张三',
    })
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('select 字段渲染 t-select', () => {
    const { wrapper } = mountCtrl(
      [
        {
          key: 'city',
          label: '城市',
          type: 'select',
          options: [
            { label: '北京', value: 'bj' },
            { label: '上海', value: 'sh' },
          ],
        },
      ],
      { city: 'bj' }
    )
    expect(wrapper.find('.t-select').exists()).toBe(true)
    expect(wrapper.find('.t-form__label').text()).toContain('城市')
  })

  it('checkbox 字段渲染 t-checkbox-group', () => {
    const { wrapper } = mountCtrl(
      [
        {
          key: 'tags',
          label: '标签',
          type: 'checkbox',
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ],
        },
      ],
      { tags: ['a'] }
    )
    expect(wrapper.find('.t-checkbox-group').exists()).toBe(true)
  })

  it('自定义 content 函数渲染', () => {
    const { wrapper } = mountCtrl(
      [
        {
          key: 'custom',
          label: '自定义',
          content: () => h('div', { class: 'custom-field' }, '自定义控件'),
        },
      ],
      { custom: 'x' }
    )
    expect(wrapper.find('.custom-field').exists()).toBe(true)
  })

  it('hidden 与 showWhen 条件显示', async () => {
    const { wrapper } = mountCtrl(
      [
        { key: 'a', label: '字段A' },
        { key: 'b', label: '字段B', hidden: true },
        {
          key: 'c',
          label: '字段C',
          showWhen: () => false,
        },
      ],
      { a: '', b: '', c: '' }
    )
    expect(wrapper.text()).toContain('字段A')
    expect(wrapper.text()).not.toContain('字段B')
    expect(wrapper.text()).not.toContain('字段C')
  })

  it('暴露 validate 与 reset 方法', () => {
    const { wrapper } = mountCtrl([{ key: 'name', label: '姓名' }], {
      name: '',
    })
    const vm = wrapper.vm as unknown as DFGVM
    expect(typeof vm.validate).toBe('function')
    expect(typeof vm.reset).toBe('function')
  })
})
