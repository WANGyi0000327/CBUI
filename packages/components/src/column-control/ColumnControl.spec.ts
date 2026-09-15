import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColumnControl from './ColumnControl.vue'
import TDesign from 'tdesign-vue-next'

const allColumns = [
  { colKey: 'row-select', title: '多选' },
  { colKey: 'name', title: '姓名' },
  { colKey: 'age', title: '年龄' },
  { colKey: 'status', title: '状态', head_disabled: true },
  { colKey: 'operation', title: '操作', Coldisabled: true },
]
const columnConfig = {
  visibleColumns: ['row-select', 'name', 'age', 'status', 'operation'],
  columnOptions: [],
}

const mountCtrl = (props = {}) =>
  mount(ColumnControl, {
    attachTo: document.body,
    global: {
      plugins: [TDesign],
      stubs: {
        CbIcon: { template: '<span class="stub-icon" />' },
        'cb-icon': { template: '<span class="stub-icon" />' },
        't-icon': { template: '<span class="stub-ticon" />' },
      },
    },
    props: {
      columnConfig,
      visible: true,
      allColumns,
      // 提供 update:visible 监听，使 TDesign popup 进入受控模式（与父组件 v-model:visible 等价）
      'onUpdate:visible': () => {},
      ...props,
    },
  })

const getPopup = async () => {
  await new Promise((r) => setTimeout(r, 100))
  return document.body.querySelector('.column-control-popup') as HTMLElement
}

describe('CbColumnControl', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染触发按钮与设置图标', () => {
    const wrapper = mountCtrl()
    expect(wrapper.text()).toContain('列设置')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('弹层打开：显示表头展示项目与列分类', async () => {
    mountCtrl()
    const popup = await getPopup()
    expect(popup).toBeTruthy()
    expect(popup.textContent).toContain('表头展示项目')
    // 不可拖拽列：row-select + 状态(head_disabled)
    expect(popup.textContent).toContain('多选')
    expect(popup.textContent).toContain('状态')
    // 可拖拽列：姓名 + 年龄
    expect(popup.textContent).toContain('姓名')
    expect(popup.textContent).toContain('年龄')
    // 操作行（closeoperation 默认 true）
    expect(popup.textContent).toContain('操作')
  })

  it('head_disabled 列开关禁用', async () => {
    mountCtrl()
    const popup = await getPopup()
    const statusItem = Array.from(popup.querySelectorAll('.column-item')).find((el) =>
      el.textContent.includes('状态')
    ) as HTMLElement
    expect(statusItem.querySelector('.t-switch.t-is-disabled')).toBeTruthy()
  })

  it('开关切换同步 v-model:columnConfig', async () => {
    const wrapper = mountCtrl()
    const popup = await getPopup()
    const nameItem = Array.from(popup.querySelectorAll('.column-item')).find((el) =>
      el.textContent.includes('姓名')
    ) as HTMLElement
    nameItem.querySelector('.t-switch')!.click()
    await new Promise((r) => setTimeout(r, 50))
    const emitted = wrapper.emitted('update:columnConfig')
    expect(emitted).toBeTruthy()
    const lastConfig = emitted!.at(-1)![0] as any
    expect(lastConfig.visibleColumns).not.toContain('name')
    expect(lastConfig.visibleColumns).toContain('age')
  })

  it('closeoperation=false 时不显示操作行', async () => {
    mountCtrl({ closeoperation: false })
    const popup = await getPopup()
    const items = Array.from(popup.querySelectorAll('.column-item')).map((el) => el.textContent)
    expect(items.every((t) => !t.includes('操作'))).toBe(true)
    expect(popup.textContent).toContain('姓名')
  })

  it('拖拽排序后触发 columnOrderChange', async () => {
    const wrapper = mountCtrl()
    const popup = await getPopup()
    const items = Array.from(popup.querySelectorAll('.column-item'))
    const nameIdx = items.findIndex((el) => el.textContent.includes('姓名'))
    const ageIdx = items.findIndex((el) => el.textContent.includes('年龄'))
    const nameEl = items[nameIdx] as HTMLElement
    const ageEl = items[ageIdx] as HTMLElement
    // 可拖行应带 data-draggable-item 标记与 data-index
    expect(nameEl.dataset.draggableItem).toBeDefined()
    expect(Number(nameEl.dataset.index)).toBe(0)
    // Pointer 拖拽模拟：pointerdown → 移动超阈值激活 → 悬停目标行 → pointerup
    // happy-dom 中行元素 rect 均为 0，mock 目标行 rect 使坐标命中
    const mockRect = {
      left: 0,
      top: 0,
      right: 200,
      bottom: 40,
      width: 200,
      height: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect
    const rectSpy = vi.spyOn(ageEl, 'getBoundingClientRect').mockReturnValue(mockRect)
    const mkEv = (type: string, x: number, y: number) =>
      new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        button: 0,
      })
    nameEl.dispatchEvent(mkEv('pointerdown', 10, 10))
    document.dispatchEvent(mkEv('pointermove', 40, 40))
    document.dispatchEvent(mkEv('pointerup', 100, 20))
    rectSpy.mockRestore()
    await new Promise((r) => setTimeout(r, 50))
    const emitted = wrapper.emitted('columnOrderChange')
    expect(emitted).toBeTruthy()
  })
})
