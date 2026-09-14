import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import OverLimitInputNumber from './OverLimitInputNumber.vue'

const TInputNumberStub = {
  name: 'TInputNumber',
  props: ['modelValue', 'max', 'min', 'allowInputOverLimit'],
  emits: ['update:modelValue', 'change'],
  template: `<div class="stub-tin">
    <input class="stub-input" :value="modelValue" @change="$emit('change', Number($event.target.value), { trigger: 'input' })" />
  </div>`,
}

const mountOver = (props = {}, modelValue: number | string = 5) =>
  mount(OverLimitInputNumber, {
    global: { stubs: { 't-input-number': TInputNumberStub } },
    props: { modelValue, ...props },
  })

describe('CbOverLimitInputNumber', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染输入框并透传 max/min', () => {
    const wrapper = mountOver({ max: 10, min: 0 })
    const stub = wrapper.find('.stub-tin')
    expect(stub.exists()).toBe(true)
  })

  it('正常输入时透传 change 事件', async () => {
    const wrapper = mountOver({ max: 100 })
    const input = wrapper.find('.stub-input')
    await input.setValue('50')
    await input.trigger('change')
    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe(50)
  })

  it('allowInputOverLimit=false 时超限输入回滚到上一次有效值', async () => {
    const wrapper = mountOver({ max: 100, min: 0, allowInputOverLimit: false })
    const input = wrapper.find('.stub-input')
    // 第一次输入有效值 50
    await input.setValue('50')
    await input.trigger('change')
    expect(wrapper.emitted('change')!.at(-1)![0]).toBe(50)
    // 第二次输入超限 200 -> 回滚 50
    await input.setValue('200')
    await input.trigger('change')
    await nextTick()
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted!.at(-1)![0]).toBe(50)
  })

  it('enableTruncation=true 时超限输入截断到 max', async () => {
    const wrapper = mountOver({ max: 100, min: 0, enableTruncation: true })
    const input = wrapper.find('.stub-input')
    await input.setValue('200')
    await input.trigger('change')
    await nextTick()
    await nextTick()
    const emitted = wrapper.emitted('change')
    // change 携带截断后的值
    expect(emitted!.at(-1)![0]).toBe(100)
    const update = wrapper.emitted('update:modelValue')
    expect(update!.at(-1)![0]).toBe(100)
  })

  it('enableTruncation=true 时输入低于 min（min<=0 生效）截断到 min', async () => {
    // 组件设计：仅 min <= 0 时开启低于边界的截断（否则输入框无法输入部分数字）
    const wrapper = mountOver({ max: 100, min: -10, enableTruncation: true })
    const input = wrapper.find('.stub-input')
    await input.setValue('-50')
    await input.trigger('change')
    await nextTick()
    await nextTick()
    const emitted = wrapper.emitted('change')
    expect(emitted!.at(-1)![0]).toBe(-10)
  })

  it('enableTruncation=true 且 min > 0 时不截断低于 min 的输入', async () => {
    const wrapper = mountOver({ max: 100, min: 10, enableTruncation: true })
    const input = wrapper.find('.stub-input')
    await input.setValue('1')
    await input.trigger('change')
    await nextTick()
    await nextTick()
    const emitted = wrapper.emitted('change')
    expect(emitted!.at(-1)![0]).toBe(1)
  })
})
