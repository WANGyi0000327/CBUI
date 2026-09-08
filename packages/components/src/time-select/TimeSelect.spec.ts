import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeSelect from './TimeSelect.vue'

const now = new Date()
const Y = now.getFullYear()
const M = now.getMonth() + 1

const mountTs = (props = {}, options = {}) =>
  mount(TimeSelect, {
    global: {
      stubs: { 'cb-icon': { template: '<span class="stub-icon" />' } },
    },
    props,
    ...options,
  })

describe('CbTimeSelect', () => {
  it('默认渲染当前年月与可选月份列表（不支持未来）', () => {
    const wrapper = mountTs()
    expect(wrapper.find('.year-text').text()).toBe(String(Y))
    const months = wrapper.findAll('.month-item')
    // future=false 时当前年只显示 1 ~ 当前月
    expect(months.length).toBe(M)
    expect(months[0].text()).toBe('1')
    expect(months[months.length - 1].text()).toBe(String(M))
  })

  it('初始无值时 onMounted 触发一次 update（对象格式）', () => {
    const wrapper = mountTs()
    const emitted = wrapper.emitted('update:modelValue')!
    expect(emitted).toBeTruthy()
    const val = emitted[0][0] as {
      year: number
      month: number
      timeRange: { start: string; end: string }
    }
    expect(val.year).toBe(Y)
    expect(val.month).toBe(M)
    expect(val.timeRange.start).toContain(`${Y}-${String(M).padStart(2, '0')}-01 00:00:00`)
  })

  it('点击月份触发 update 与 change', async () => {
    const wrapper = mountTs()
    const target = wrapper.findAll('.month-item')[0]
    await target.trigger('click')
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as {
      month: number | null
    }
    expect(last.month).toBe(1)
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('formatType=array 时输出数组格式', async () => {
    const wrapper = mountTs({ formatType: 'array' })
    await wrapper.findAll('.month-item')[0].trigger('click')
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as [
      string,
      string,
    ]
    expect(Array.isArray(last)).toBe(true)
    expect(last[0]).toContain('00:00:00')
    expect(last[1]).toContain('23:59:59')
  })

  it('future=false 时上箭头初始禁用（当前年即最大年）', () => {
    const wrapper = mountTs()
    expect(wrapper.find('.arrow-btn.up').classes()).toContain('disabled')
  })

  it('future=true 时年上箭头可切换，到达最大年禁用', async () => {
    const wrapper = mountTs({ future: true })
    const up = wrapper.find('.arrow-btn.up')
    expect(up.classes()).not.toContain('disabled')
    await up.trigger('click')
    let last = wrapper.emitted('update:modelValue')!.at(-1)![0] as {
      year: number
    }
    expect(last.year).toBe(Y + 1)
    // 从 Y+1 连点到最大年 Y+10
    for (let i = 0; i < 9; i++) await up.trigger('click')
    last = wrapper.emitted('update:modelValue')!.at(-1)![0] as { year: number }
    expect(last.year).toBe(Y + 10)
    expect(up.classes()).toContain('disabled')
    // 禁用后点击不再更新
    await up.trigger('click')
    last = wrapper.emitted('update:modelValue')!.at(-1)![0] as { year: number }
    expect(last.year).toBe(Y + 10)
  })

  it('点击年下箭头切换', async () => {
    const wrapper = mountTs()
    await wrapper.find('.arrow-btn.down').trigger('click')
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as {
      year: number
    }
    expect(last.year).toBe(Y - 1)
  })

  it('isLastMonth 模式初始定位上个月', () => {
    const wrapper = mountTs({ isLastMonth: true })
    const lastMonthDate = new Date(Y, M - 2, 1)
    expect(wrapper.find('.year-text').text()).toBe(
      String(lastMonthDate.getFullYear())
    )
    const val = wrapper.emitted('update:modelValue')![0][0] as {
      month: number | null
    }
    expect(val.month).toBe(lastMonthDate.getMonth() + 1)
  })

  it('传入对象 modelValue 时解析初始值', () => {
    const wrapper = mountTs({
      modelValue: { year: 2024, month: 5 },
    })
    expect(wrapper.find('.year-text').text()).toBe('2024')
    const months = wrapper.findAll('.month-item')
    expect(months[4].classes()).toContain('active')
  })

  it('handleReset 重置到当前年月并触发 update', async () => {
    const wrapper = mountTs({ modelValue: { year: 2024, month: 5 } })
    await wrapper.vm.handleReset()
    expect(wrapper.find('.year-text').text()).toBe(String(Y))
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as {
      year: number
      month: number | null
    }
    expect(last.year).toBe(Y)
    expect(last.month).toBe(M)
  })
})
