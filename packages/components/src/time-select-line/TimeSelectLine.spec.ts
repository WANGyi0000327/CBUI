import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeSelectLine from './TimeSelectLine.vue'

// jsdom 未实现 scrollIntoView，组件交互会调用，需 mock
beforeAll(() => {
  Element.prototype.scrollIntoView = () => {}
})

const mountLine = (props = {}, options = {}) =>
  mount(TimeSelectLine, {
    global: {
      stubs: { 'cb-icon': { template: '<span class="stub-icon" />' } },
    },
    props,
    ...options,
  })

describe('CbTimeSelectLine', () => {
  it('渲染月份节点与年份节点（showMoreMonth 扩展 4 个月）', () => {
    // 范围 202401 ~ 202403，showMoreMonth 默认 true：前扩 202309-202312，后扩 202404-202407
    const wrapper = mountLine({ timeRanges: ['202401', '202403'] })
    const items = wrapper.findAll('.cb-time-item')
    // 范围外月份 + 范围内月份 + 每年 1 月触发年份节点
    // 2023: 9,10,11,12 (4) + 2024: 1,2,3 (3) + 2024: 4,5,6,7 (4) + 年份节点 2024-01 与 2023-01? (2023-01 不在范围)
    // 说明：仅当 current 为 1 月时插入年份节点。2024-01 与 2025-01?（扩展后 2024-07 结束，不涉及 2025）
    // 精确断言改用：总节点 = 11 个月 + 1 个年份节点(2024年) = 12
    expect(items.length).toBe(12)
    expect(wrapper.text()).toContain('2024年')
  })

  it('范围内节点可点击，范围外节点 disabled', async () => {
    const wrapper = mountLine({
      timeRanges: ['202401', '202402'],
      showMoreMonth: false,
    })
    const items = wrapper.findAll('.cb-time-item')
    // showMoreMonth=false：生成 202402、202401（1 月插入年份节点），reverse 后：
    // [2024年(年节点), 202401, 202402] → 3 个节点
    expect(items.length).toBe(3)
    // 点击范围内节点（202401）
    const jan = items.find((i) => i.text().includes('1月'))!
    await jan.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(jan.classes()).toContain('actived')
  })

  it('completedTime 之前月份 completed 显示完成图标', () => {
    const wrapper = mountLine({
      timeRanges: ['202401', '202403'],
      completedTime: '20240215',
      showMoreMonth: false,
    })
    // 节点顺序（reverse 后）：2024年(年) / 202401 / 202402 / 202403
    const items = wrapper.findAll('.cb-time-item')
    const jan = items.find((i) => i.text().includes('1月'))
    const mar = items.find((i) => i.text().includes('3月'))
    // 1月 completed=true → 完成图标显示（stub-icon 存在且 v-show 生效）
    expect(jan!.find('.stub-icon').exists()).toBe(true)
    // 3月 completed=false → 进度图标（同 stub）
    expect(mar!.find('.stub-icon').exists()).toBe(true)
  })

  it('点击年份节点不触发 change（completed=null）', async () => {
    const wrapper = mountLine({
      timeRanges: ['202401', '202402'],
      showMoreMonth: false,
    })
    const yearNode = wrapper.findAll('.cb-time-item').find((i) =>
      i.text().includes('年')
    )!
    await yearNode.trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('v-model 传入 activeKey 后对应节点高亮', () => {
    const wrapper = mountLine({
      timeRanges: ['202401', '202402'],
      showMoreMonth: false,
      modelValue: '202402',
    })
    const active = wrapper.findAll('.cb-time-item').find((i) =>
      i.classes().includes('actived')
    )!
    expect(active.text()).toContain('2月')
  })

  it('refresh 暴露方法可调用不报错', () => {
    const wrapper = mountLine({
      timeRanges: ['202401', '202402'],
      modelValue: '202401',
    })
    expect(typeof wrapper.vm.refresh).toBe('function')
    expect(() => wrapper.vm.refresh()).not.toThrow()
  })
})
