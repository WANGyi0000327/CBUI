import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OverBtns from './OverBtns.vue'
import type { OverBtn } from './utils/overBtns'

const TButtonStub = {
  name: 'TButton',
  props: ['disabled', 'theme', 'variant', 'style'],
  emits: ['click'],
  template:
    '<button class="stub-btn" :disabled="disabled" :style="style" @click="$emit(\'click\', $event)"><slot /></button>',
}

const TPopupStub = {
  name: 'TPopup',
  props: ['placement', 'trigger'],
  template: '<div class="stub-tpopup"><slot name="content" /></div>',
  methods: { close: () => {} },
}

const mountBtns = (props = {}) =>
  mount(OverBtns, {
    global: {
      stubs: {
        't-button': TButtonStub,
        't-popup': TPopupStub,
        'cb-icon': { template: '<span class="stub-icon" />' },
      },
    },
    props: {
      btnList: [
        { label: '编辑', type: 'edit', clickHandler: vi.fn() },
        { label: '删除', type: 'del', clickHandler: vi.fn() },
        { label: '审核', type: 'audit', clickHandler: vi.fn() },
      ] as OverBtn[],
      row: { id: 1 },
      ...props,
    },
  })

describe('CbOverBtns', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染前 maxShownNum 个按钮，多余折叠进 popup', () => {
    const wrapper = mountBtns({ maxShownNum: 2 })
    expect(wrapper.findAll('.stub-btn').length).toBe(3)
    // popup 内按钮：总 3 个 - 直显 2 个 = 1 个
    const popupBtns = wrapper.find('.stub-tpopup').findAll('.stub-btn')
    expect(popupBtns.length).toBe(1)
    expect(popupBtns[0].text()).toBe('审核')
  })

  it('按钮数不超过 maxShownNum 时不渲染 popup', () => {
    const wrapper = mountBtns({ maxShownNum: 3 })
    expect(wrapper.find('.stub-tpopup').exists()).toBe(false)
  })

  it('enablehide 为 true 的按钮被过滤', () => {
    const wrapper = mountBtns({
      btnList: [
        { label: '编辑', type: 'edit', clickHandler: vi.fn(), enablehide: true },
        { label: '删除', type: 'del', clickHandler: vi.fn() },
      ] as OverBtn[],
    })
    expect(wrapper.text()).not.toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('enablehide 支持函数按 row 判断', () => {
    const wrapper = mountBtns({
      btnList: [
        {
          label: '隐藏项',
          type: 'hide',
          clickHandler: vi.fn(),
          enablehide: (row: { id: number }) => row.id === 1,
        },
        { label: '显示项', type: 'show', clickHandler: vi.fn() },
      ] as OverBtn[],
      row: { id: 1 },
    })
    expect(wrapper.text()).not.toContain('隐藏项')
    expect(wrapper.text()).toContain('显示项')
  })

  it('disabled 为函数时按 row 判断禁用', () => {
    const wrapper = mountBtns({
      btnList: [
        {
          label: '禁用项',
          type: 'dis',
          clickHandler: vi.fn(),
          disabled: (row: { id: number }) => row.id === 1,
        },
      ] as OverBtn[],
    })
    const btn = wrapper.find('.stub-btn')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('label 支持函数动态渲染', () => {
    const wrapper = mountBtns({
      btnList: [
        {
          label: (row: { id: number }) => `查看${row.id}`,
          type: 'view',
          clickHandler: vi.fn(),
        },
      ] as OverBtn[],
      row: { id: 42 },
    })
    expect(wrapper.text()).toContain('查看42')
  })

  it('点击按钮触发 clickHandler(type, row)', async () => {
    const edit = vi.fn()
    const wrapper = mountBtns({
      btnList: [
        { label: '编辑', type: 'edit', clickHandler: edit },
        { label: '删除', type: 'del', clickHandler: vi.fn() },
      ] as OverBtn[],
      row: { id: 7 },
    })
    await wrapper.find('.stub-btn').trigger('click')
    expect(edit).toHaveBeenCalledWith('edit', { id: 7 })
  })

  it('popup 内按钮点击同样触发 clickHandler', async () => {
    const audit = vi.fn()
    const wrapper = mountBtns({
      btnList: [
        { label: '编辑', type: 'edit', clickHandler: vi.fn() },
        { label: '删除', type: 'del', clickHandler: vi.fn() },
        { label: '审核', type: 'audit', clickHandler: audit },
      ] as OverBtn[],
      row: { id: 9 },
      maxShownNum: 2,
    })
    const popupBtn = wrapper.find('.stub-tpopup .stub-btn')
    await popupBtn.trigger('click')
    expect(audit).toHaveBeenCalledWith('audit', { id: 9 })
  })
})
