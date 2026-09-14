import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrencyInput from './CurrencyInput.vue'

vi.mock('tdesign-vue-next', async (importOriginal) => {
  const mod = (await importOriginal()) as Record<string, unknown>
  return {
    ...mod,
    MessagePlugin: {
      success: vi.fn(),
      warning: vi.fn(),
    },
  }
})

import { MessagePlugin } from 'tdesign-vue-next'
const mockedWarning = MessagePlugin.warning as ReturnType<typeof vi.fn>

const TInputNumberStub = {
  name: 'TInputNumber',
  props: ['modelValue', 'max', 'min', 'decimalPlaces', 'placeholder'],
  emits: ['update:modelValue', 'blur'],
  methods: { focus: () => {} },
  template: `<div class="stub-tin">
    <input class="stub-input" :value="modelValue" @blur="$emit('blur', Number($event.target.value))" />
    <slot name="suffix" />
  </div>`,
}

const mountCurrency = (props = {}, modelValue: number | null = 100) =>
  mount(CurrencyInput, {
    global: { stubs: { 't-input-number': TInputNumberStub } },
    props: { modelValue, ...props },
  })

describe('CbCurrencyInput', () => {
  beforeEach(() => {
    mockedWarning.mockClear()
  })

  it('渲染输入框并带"元"后缀（默认 isShowSuffix）', () => {
    const wrapper = mountCurrency()
    expect(wrapper.find('.stub-tin').exists()).toBe(true)
    expect(wrapper.text()).toContain('元')
  })

  it('isShowSuffix=false 时不渲染后缀', () => {
    const wrapper = mountCurrency({ isShowSuffix: false })
    expect(wrapper.text()).not.toContain('元')
  })

  it('blur 超过 max 时提示并回填为 max（isassignment 默认 true）', async () => {
    // 初始值 50，max=100：回填 100 与初始不同才会触发 update:modelValue
    const wrapper = mountCurrency({ max: 100 }, 50)
    const input = wrapper.find('.stub-input')
    await input.setValue('99999')
    await input.trigger('blur')
    expect(mockedWarning).toHaveBeenCalledWith('请输入100以内的数字')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)![0]).toBe(100)
  })

  it('blur 低于 min 时提示并清空', async () => {
    const wrapper = mountCurrency({ min: 10 })
    const input = wrapper.find('.stub-input')
    await input.setValue('1')
    await input.trigger('blur')
    expect(mockedWarning).toHaveBeenCalledWith('价格不能小于10')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted!.at(-1)![0]).toBeNull()
  })

  it('allowInputZero=false 时输入 0 提示并清空', async () => {
    const wrapper = mountCurrency({ allowInputZero: false })
    const input = wrapper.find('.stub-input')
    await input.setValue('0')
    await input.trigger('blur')
    expect(mockedWarning).toHaveBeenCalledWith('不能输入0')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted!.at(-1)![0]).toBeNull()
  })

  it('暴露 focus 实例方法且调用不报错', async () => {
    const wrapper = mountCurrency()
    const vm = wrapper.vm as unknown as { focus: () => Promise<void> }
    await expect(vm.focus()).resolves.toBeUndefined()
  })
})
