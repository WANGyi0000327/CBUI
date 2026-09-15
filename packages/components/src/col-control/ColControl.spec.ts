import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ColControl from './ColControl.vue'
import TDesign from 'tdesign-vue-next'

// 列配置：系统列 + 左固定 + 可编辑 + 操作列（右固定）
const columns = [
  { colKey: 'row-select', title: '', type: 'multiple' },
  { colKey: 'name', title: '姓名', visible: true },
  { colKey: 'age', title: '年龄', visible: false },
  { colKey: 'status', title: '状态', fixed: 'left', visible: true },
  { colKey: 'operation', title: '操作', visible: true },
]

const mountCtrl = (props = {}) =>
  mount(ColControl, {
    attachTo: document.body,
    global: {
      plugins: [TDesign],
      stubs: {
        CbIcon: { template: '<span class="stub-icon" />' },
        'cb-icon': { template: '<span class="stub-icon" />' },
        'vue-draggable': {
          template: '<div class="stub-draggable"><slot /></div>',
        },
      },
    },
    props: {
      appCode: 'demo-app',
      tableCode: 'demo-table',
      options: columns,
      popupProps: { visible: true },
      ...props,
    },
  })

// 打开弹层：popupProps 受控 visible（等同点击设置触发器）
const openPopup = async () => {
  await new Promise((r) => setTimeout(r, 100))
  return document.body.querySelector('.cb-col-control-content') as HTMLElement
}

describe('CbColControl', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染 label 与设置触发器', () => {
    const wrapper = mountCtrl({ label: '列设置' })
    expect(wrapper.text()).toContain('列设置')
    expect(wrapper.find('.stub-icon').exists()).toBe(true)
  })

  it('点击打开弹层：显示表头展示项目与重置链接', async () => {
    const wrapper = mountCtrl()
    const content = await openPopup()
    expect(content).toBeTruthy()
    expect(content.textContent).toContain('表头展示项目')
    expect(content.textContent).toContain('重置')
  })

  it('左固定列与操作列渲染为不可编辑项（no-drag + 禁用开关）', async () => {
    mountCtrl()
    const content = await openPopup()
    const noDrags = content.querySelectorAll('.cb-col-control-item.no-drag')
    expect(noDrags.length).toBe(2) // 状态(左固定) + 操作
    expect(noDrags[0].textContent).toContain('状态')
    expect(noDrags[1].textContent).toContain('操作')
    const disabledSwitches = content.querySelectorAll('.t-switch.t-is-disabled')
    expect(disabledSwitches.length).toBe(2)
  })

  it('可编辑列渲染在拖拽区且开关切换同步 v-model', async () => {
    const wrapper = mountCtrl()
    const content = await openPopup()
    const dragZone = content.querySelector('.stub-draggable')
    expect(dragZone!.textContent).toContain('姓名')
    expect(dragZone!.textContent).toContain('年龄')
    // 切换"姓名"列开关（关闭 → 不再展示）
    const nameItem = Array.from(content.querySelectorAll('.cb-col-control-item')).find((el) =>
      el.textContent.includes('姓名')
    ) as HTMLElement
    const nameSwitch = nameItem.querySelector('.t-switch') as HTMLElement
    nameSwitch.click()
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')!
    const lastValue = emitted.at(-1)![0] as any[]
    expect(lastValue.some((c) => c.colKey === 'name')).toBe(false)
    expect(lastValue.some((c) => c.colKey === 'age')).toBe(false)
    expect(lastValue.some((c) => c.colKey === 'status')).toBe(true)
  })

  it('重置恢复初始可见性', async () => {
    const wrapper = mountCtrl()
    const content = await openPopup()
    // 先关闭"姓名"
    const nameItem = Array.from(content.querySelectorAll('.cb-col-control-item')).find((el) =>
      el.textContent.includes('姓名')
    ) as HTMLElement
    nameItem.querySelector('.t-switch')!.click()
    await nextTick()
    // 点击重置
    const resetLink = content.querySelector('.t-link') as HTMLElement
    resetLink.click()
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')!
    const afterReset = emitted.at(-1)![0] as any[]
    expect(afterReset.some((c) => c.colKey === 'name')).toBe(true)
    expect(afterReset.some((c) => c.colKey === 'age')).toBe(false)
  })

  it('系统列（row-select）不出现在编辑区', async () => {
    mountCtrl()
    const content = await openPopup()
    const dragZone = content.querySelector('.stub-draggable')
    expect(dragZone!.textContent).not.toContain('row-select')
    expect(content.textContent).not.toContain('row-select')
  })
})
