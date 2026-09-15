import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from './Pagination.vue'

const TPaginationStub = {
  name: 'TPagination',
  props: ['total', 'pageSizeOptions', 'maxPageBtn'],
  template: `<div class="stub-tpagination" :data-total="total">
    <span class="stub-options">{{ pageSizeOptions && pageSizeOptions.map((o) => o.label).join('|') }}</span>
  </div>`,
}

const mountPage = (props = {}) =>
  mount(Pagination, {
    global: { stubs: { 't-pagination': TPaginationStub } },
    props: { total: 100, ...props },
  })

describe('CbPagination', () => {
  it('total > 0 时渲染分页', () => {
    const wrapper = mountPage({ total: 50 })
    expect(wrapper.find('.stub-tpagination').exists()).toBe(true)
  })

  it('total = 0 时不渲染分页', () => {
    const wrapper = mountPage({ total: 0 })
    expect(wrapper.find('.stub-tpagination').exists()).toBe(false)
  })

  it('默认 pageSizeOptions 为 30/50/100', () => {
    const wrapper = mountPage()
    expect(wrapper.find('.stub-options').text()).toBe('30 条/页|50 条/页|100 条/页')
  })

  it('支持自定义 pageSizeOptions', () => {
    const wrapper = mountPage({
      pageSizeOptions: [
        { label: '20 条/页', value: 20 },
        { label: '40 条/页', value: 40 },
      ],
    })
    expect(wrapper.find('.stub-options').text()).toBe('20 条/页|40 条/页')
  })

  it('透传 total 到分页组件', () => {
    const wrapper = mountPage({ total: 300 })
    expect(wrapper.find('.stub-tpagination').attributes('data-total')).toBe('300')
  })
})
