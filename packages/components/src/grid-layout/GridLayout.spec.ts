import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GridLayout from './GridLayout.vue'

const waitFrame = () => new Promise((r) => setTimeout(r, 30))

describe('CbGridLayout', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染容器并透传默认插槽', () => {
    const wrapper = mount(GridLayout, {
      slots: { default: '<div class="card">卡片</div>' },
    })
    expect(wrapper.find('.grid').exists()).toBe(true)
    expect(wrapper.find('.card').text()).toBe('卡片')
  })

  it('未配置 cardContainer 时不计算列样式', async () => {
    const wrapper = mount(GridLayout, {
      slots: { default: '<div>卡片</div>' },
    })
    await waitFrame()
    const el = wrapper.element as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('')
  })

  it('配置 cardContainer 后按容器宽度计算列数', async () => {
    document.body.innerHTML = '<div id="grid-container"></div>'
    const container = document.querySelector('#grid-container')!
    Object.defineProperty(container, 'clientWidth', {
      value: 800,
      configurable: true,
    })
    const wrapper = mount(GridLayout, {
      props: { cardContainer: '#grid-container', minCardWidth: 375, gap: 8 },
      slots: { default: '<div>卡片</div>' },
    })
    await waitFrame()
    const el = wrapper.element as HTMLElement
    // 800 / (375+8) = 2.08 -> floor 2 -> max(minCol=3, 2) = 3 列
    expect(el.style.gridTemplateColumns).toContain('repeat(3, minmax(375px')
    expect(el.style.gridTemplateColumns).toContain('px))')
  })

  it('容器过宽时列数受 minCol 兜底（窄容器至少 minCol 列）', async () => {
    document.body.innerHTML = '<div id="grid-container"></div>'
    const container = document.querySelector('#grid-container')!
    Object.defineProperty(container, 'clientWidth', {
      value: 200,
      configurable: true,
    })
    const wrapper = mount(GridLayout, {
      props: { cardContainer: '#grid-container', minCol: 2 },
      slots: { default: '<div>卡片</div>' },
    })
    await waitFrame()
    const el = wrapper.element as HTMLElement
    expect(el.style.gridTemplateColumns).toContain('repeat(2, minmax(375px')
  })
})
