import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NumericInput from './NumericInput.vue'

const TInputStub = {
  name: 'TInput',
  props: ['modelValue'],
  emits: ['update:modelValue', 'input', 'blur', 'change'],
  template: `<div class="stub-tinput">
    <input class="stub-input" :value="modelValue" @input="$emit('input', $event.target.value)" @blur="$emit('blur')" @change="$emit('change', Number($event.target.value))" />
  </div>`,
}

const mountNumeric = (props = {}, modelValue: number | null = 10) =>
  mount(NumericInput, {
    global: { stubs: { 't-input': TInputStub } },
    props: { modelValue, ...props },
  })

describe('CbNumericInput', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染输入框并展示初始值', () => {
    const wrapper = mountNumeric({}, 12.5)
    const input = wrapper.find('.stub-input')
    expect((input.element as HTMLInputElement).value).toBe('12.5')
  })

  it('输入小数时按 decimalPlaces 截断并更新 modelValue', async () => {
    const wrapper = mountNumeric({ decimalPlaces: 2 })
    const input = wrapper.find('.stub-input')
    await input.setValue('12.345')
    await input.trigger('input')
    expect((input.element as HTMLInputElement).value).toBe('12.34')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted!.at(-1)![0]).toBe(12.34)
  })

  it('失焦时超过 max 钳制到 max', async () => {
    const wrapper = mountNumeric({ max: 100 })
    const input = wrapper.find('.stub-input')
    await input.setValue('200')
    await input.trigger('input')
    await input.trigger('blur')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted!.at(-1)![0]).toBe(100)
    expect((input.element as HTMLInputElement).value).toBe('100')
  })

  it('失焦时低于 min 钳制到 min', async () => {
    const wrapper = mountNumeric({ min: 0 })
    const input = wrapper.find('.stub-input')
    await input.setValue('-5')
    await input.trigger('input')
    await input.trigger('blur')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted!.at(-1)![0]).toBe(0)
  })

  it('失焦时触发 blur 事件', async () => {
    const wrapper = mountNumeric()
    const input = wrapper.find('.stub-input')
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('change 事件透传', async () => {
    const wrapper = mountNumeric()
    const input = wrapper.find('.stub-input')
    await input.trigger('change')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('modelValue 置空时清空显示', async () => {
    const wrapper = mountNumeric({}, null)
    const input = wrapper.find('.stub-input')
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
