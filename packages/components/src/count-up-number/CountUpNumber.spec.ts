import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CountUpNumber from './CountUpNumber.vue'

// Mock countup.js：记录 start / update 调用，error 置空保证走正常分支
const startMock = vi.fn()
const updateMock = vi.fn()
const countUpInstances: Array<{ options: Record<string, unknown> }> = []
vi.mock('countup.js', () => {
  class CountUp {
    error: string | null = null
    options: Record<string, unknown>
    start = startMock
    update = updateMock
    constructor(_el: Element, _value: number, options: Record<string, unknown>) {
      this.options = options
      countUpInstances.push(this)
    }
  }
  return { CountUp }
})

const mountCount = (props = {}) =>
  mount(CountUpNumber, {
    attachTo: document.body,
    props: { value: 0, ...props },
  })

describe('CbCountUpNumber', () => {
  beforeEach(() => {
    startMock.mockClear()
    updateMock.mockClear()
    countUpInstances.length = 0
  })

  it('挂载后初始化数字动画并启动', () => {
    mountCount({ value: 15000 })
    expect(startMock).toHaveBeenCalled()
    const el = document.querySelector('.cb-count-up-number')
    expect(el).toBeTruthy()
  })

  it('value 变化时触发 update 动画', async () => {
    const wrapper = mountCount({ value: 100 })
    wrapper.setProps({ value: 200 })
    await nextTick()
    expect(updateMock).toHaveBeenCalledWith(200)
  })

  it('有小数时小数位最多保留两位', () => {
    mountCount({ value: 123.456 })
    // getDecimalPlaces(123.456) = 3 -> min(3, 2) = 2
    expect(countUpInstances[0].options.decimalPlaces).toBe(2)
  })
})
