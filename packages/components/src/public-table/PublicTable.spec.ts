import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PublicTable from './PublicTable.vue'
import TDesign from 'tdesign-vue-next'

const columns = [
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
]
const data = [
  { id: '1', name: '张三', age: 30 },
  { id: '2', name: '李四', age: 25 },
]

const mountTable = (props = {}) =>
  mount(PublicTable, {
    attachTo: document.body,
    global: {
      plugins: [TDesign],
      stubs: {
        CbIcon: { template: '<span class="stub-icon" />' },
        'cb-icon': { template: '<span class="stub-icon" />' },
        'cb-search-input': {
          props: ['modelValue', 'searchwidth', 'placeholder'],
          emits: ['update:modelValue', 'search'],
          template:
            '<div class="stub-search"><button class="stub-search-btn" @click="$emit(\'search\', \'关键词\')">搜索</button></div>',
        },
        CbSearchFilter: {
          props: ['list', 'popupwidth', 'filterNumber'],
          emits: ['submit', 'reset'],
          template:
            '<div class="stub-filter"><button class="stub-filter-submit" @click="$emit(\'submit\')">确定</button><button class="stub-filter-reset" @click="$emit(\'reset\')">重置</button></div>',
        },
        CbColumnControl: {
          props: ['visible', 'columnConfig', 'closeoperation', 'allColumns'],
          emits: ['update:visible', 'update:columnConfig', 'save'],
          template: '<div class="stub-column-control" />',
        },
      },
    },
    props: {
      tableConfig: {
        data,
        columns,
        rowKey: 'id',
        searchKey: 'keywords',
        searchPlaceholder: '请输入',
        isShowSearch: true,
        isShowFilter: true,
        showColumn: ['name', 'age'],
        closeoperation: true,
      },
      total: 2,
      ...props,
    },
  })

describe('CbPublicTable', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染表头与数据行', () => {
    const wrapper = mountTable()
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('年龄')
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('李四')
  })

  it('点击行触发 row-click 事件', async () => {
    const wrapper = mountTable()
    const rows = wrapper.findAll('.t-table__body tr')
    expect(rows.length).toBeGreaterThanOrEqual(2)
    await rows[0].trigger('click')
    const emitted = wrapper.emitted('row-click')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toMatchObject({ name: '张三' })
  })

  it('搜索触发 reqTable（pageIndex 重置为 1 并携带关键词）', async () => {
    const wrapper = mountTable()
    await wrapper.find('.stub-search-btn').trigger('click')
    const emitted = wrapper.emitted('reqTable')
    expect(emitted).toBeTruthy()
    const [reqForm, type] = emitted![0] as [Record<string, unknown>, string]
    expect(type).toBe('search')
    expect(reqForm.pageIndex).toBe(1)
    expect(reqForm.keywords).toBe('关键词')
  })

  it('筛选确定触发 reqTable（isreqTable 默认 true）', async () => {
    const wrapper = mountTable()
    await wrapper.find('.stub-filter-submit').trigger('click')
    const emitted = wrapper.emitted('reqTable')
    expect(emitted).toBeTruthy()
    expect(emitted![0][1]).toBe('search')
  })

  it('分页：total > 0 显示分页', () => {
    const wrapper = mountTable({ total: 30 })
    expect(wrapper.find('.CBPagination').exists()).toBe(true)
  })

  it('分页：total = 0 且非 showpageForever 隐藏分页', () => {
    const wrapper = mountTable({ total: 0 })
    expect(wrapper.find('.CBPagination').exists()).toBe(false)
  })

  it('showpageForever 时 total = 0 仍显示分页', () => {
    const wrapper = mountTable({ total: 0, showpageForever: true })
    expect(wrapper.find('.CBPagination').exists()).toBe(true)
  })

  it('清空输入：clearInput 重置搜索关键词', () => {
    const wrapper = mountTable()
    ;(wrapper.vm as unknown as { clearInput: () => void }).clearInput()
    const reqForm = (wrapper.vm as unknown as { reqForm: Record<string, unknown> })
      .reqForm
    expect(reqForm.keywords).toBe('')
  })
})
