import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DateRangeConfirmPicker from './DateRangeConfirmPicker.vue'

const TDateRangePickerStub = {
  name: 'TDateRangePicker',
  props: ['modelValue', 'popupProps', 'presets'],
  emits: ['update:modelValue', 'click', 'preset-click'],
  template: `<div class="stub-drp" :data-visible="popupProps && popupProps.visible">
    <button class="open" @click="$emit('click')">open</button>
    <button class="confirm" @click="$emit('preset-click')">确定</button>
  </div>`,
}

const mountPicker = (modelValue: string[] = ['2024-01-01', '2024-01-31']) =>
  mount(DateRangeConfirmPicker, {
    attachTo: document.body,
    global: {
      directives: {
        'click-outside': {
          mounted(el: HTMLElement, binding: { value: unknown }) {
            ;(el as unknown as { __handler: unknown }).__handler = binding.value
          },
        },
      },
      stubs: { 't-date-range-picker': TDateRangePickerStub },
    },
    props: { modelValue },
  })

describe('CbDateRangeConfirmPicker', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染日期范围选择器且初始弹层关闭', () => {
    const wrapper = mountPicker()
    expect(wrapper.find('.stub-drp').exists()).toBe(true)
    expect(wrapper.find('.stub-drp').attributes('data-visible')).toBe('false')
  })

  it('点击打开弹层：visible 置为 true', async () => {
    const wrapper = mountPicker()
    await wrapper.find('.open').trigger('click')
    expect(wrapper.find('.stub-drp').attributes('data-visible')).toBe('true')
  })

  it('点击"确定"预设触发 change 并关闭弹层', async () => {
    const wrapper = mountPicker()
    await wrapper.find('.open').trigger('click')
    await wrapper.find('.confirm').trigger('click')
    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual(['2024-01-01', '2024-01-31'])
    expect(wrapper.find('.stub-drp').attributes('data-visible')).toBe('false')
  })

  it('点击外部（未确认）回滚到打开时备份的值', async () => {
    const wrapper = mountPicker(['2024-01-01', '2024-01-31'])
    // 打开：备份 snapshot = 当前值
    await wrapper.find('.open').trigger('click')
    // 模拟用户改选了日期（未点确定）
    await wrapper
      .find('.stub-drp')
      .trigger('update:modelValue', ['2024-02-01', '2024-02-28'])
    // 点击外部触发 handleClose
    ;(
      wrapper.element as unknown as { __handler: () => void }
    ).__handler()
    await Promise.resolve()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    // 回滚到打开时的备份
    expect(emitted!.at(-1)![0]).toEqual(['2024-01-01', '2024-01-31'])
    expect(wrapper.find('.stub-drp').attributes('data-visible')).toBe('false')
  })
})
