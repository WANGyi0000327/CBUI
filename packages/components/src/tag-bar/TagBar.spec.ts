import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import TagBar from './TagBar.vue'

const tabs = [
  { path: '/a', meta: { title: '页面A' } },
  { path: '/b', meta: { title: '页面B' } },
  { path: '/c', meta: { title: '页面C' } },
]

const mountBar = (props = {}, options = {}) =>
  mount(TagBar, {
    global: {
      plugins: [TDesign],
      stubs: {
        'cb-icon': { template: '<span class="stub-icon" />' },
      },
    },
    props: { tabs, ...props },
    ...options,
  })

describe('CbTagBar', () => {
  it('渲染所有标签标题', () => {
    const wrapper = mountBar({ activeTab: '/a' })
    expect(wrapper.text()).toContain('页面A')
    expect(wrapper.text()).toContain('页面B')
    expect(wrapper.text()).toContain('页面C')
  })

  it('点击标签触发 jump 事件（携带 tab）', async () => {
    const wrapper = mountBar({ activeTab: '/a' })
    const items = wrapper.findAll('.tab-item')
    await items[1].trigger('click')
    expect(wrapper.emitted('jump')).toBeTruthy()
    expect(wrapper.emitted('jump')![0]).toEqual([tabs[1]])
  })

  it('右键标签显示上下文菜单并触发 jump', async () => {
    const wrapper = mountBar({ activeTab: '/a' })
    await wrapper.findAll('.tab-item')[0].trigger('contextmenu', { pageX: 120, pageY: 80 })
    expect(wrapper.find('.context-menu').isVisible()).toBe(true)
    expect(wrapper.emitted('jump')).toBeTruthy()
  })

  it('点击关闭图标触发 close（第一个标签关闭图标隐藏）', async () => {
    const wrapper = mountBar({ activeTab: '/a' })
    const items = wrapper.findAll('.tab-item')
    // 第一个标签关闭按钮 v-show 隐藏：包裹 span 为 display:none
    const firstHideSpan = items[0].findAll('span')[1]
    expect(firstHideSpan.attributes('style')).toContain('display: none')
    // 第二个标签关闭图标点击 → close '/b'
    await items[1].find('.close-icon').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')![0]).toEqual(['/b'])
  })

  it('菜单点击「关闭其他」触发 close-other', async () => {
    const wrapper = mountBar({ activeTab: '/a' })
    await wrapper.findAll('.tab-item')[0].trigger('contextmenu', { pageX: 120, pageY: 80 })
    await wrapper.findAll('.menu-item')[0].trigger('click')
    expect(wrapper.emitted('close-other')).toBeTruthy()
  })

  it('仅一个标签时点击关闭不触发 close', async () => {
    const wrapper = mountBar({ activeTab: '/a', tabs: [tabs[0]] })
    // 单标签时关闭图标隐藏，即使触发点击 closeTab 也因 tabs.length===1 直接 return
    const hideSpan = wrapper.find('.tab-item').findAll('span')[1]
    expect(hideSpan.attributes('style')).toContain('display: none')
    await hideSpan.trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })
})
