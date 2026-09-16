import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import GoodMainImage from './GoodMainImage.vue'

// t-image / t-loading stub
const TImageStub = defineComponent({
  name: 'TImage',
  props: { src: String, fit: String, position: String },
  setup:
    (props, { slots }) =>
    () =>
      h('div', { class: 't-image-stub' }, [
        slots.error ? h('div', { class: 'img-error' }, slots.error()) : [],
        slots.loading ? h('div', { class: 'img-loading' }, slots.loading()) : [],
      ]),
})

const TLoadingStub = defineComponent({
  name: 'TLoading',
  props: { size: String },
  setup: () => () => h('div', { class: 't-loading-stub' }),
})

const global = {
  stubs: {
    't-image': TImageStub,
    't-loading': TLoadingStub,
  },
}

describe('CbGoodMainImage 商品主图', () => {
  it('渲染容器并透传尺寸（数字转 px）', () => {
    const wrapper = mount(GoodMainImage, {
      props: { src: 'https://x.com/a.jpg', width: 120, height: 120 },
      global,
    })
    const style = wrapper.find('.cb-good-main-image').attributes('style') || ''
    expect(style).toContain('width: 120px')
    expect(style).toContain('height: 120px')
  })

  it('name 超过 20 字截断为 20 字（错误兜底文字）', () => {
    const wrapper = mount(GoodMainImage, {
      props: {
        src: '',
        name: '这是一个非常长的商品名称用来测试截断逻辑是否正常工作',
      },
      global,
    })
    const vm = wrapper.vm as unknown as { displayName: string }
    expect(vm.displayName.length).toBe(20)
    // 渲染在错误兜底里
    expect(wrapper.find('.fallback-text').text()).toBe(vm.displayName)
  })

  it('空 name 时兜底文字为空', () => {
    const wrapper = mount(GoodMainImage, { props: { src: '' }, global })
    expect((wrapper.vm as unknown as { displayName: string }).displayName).toBe('')
  })

  it('默认尺寸为 100%', () => {
    const wrapper = mount(GoodMainImage, {
      props: { src: 'https://x.com/a.jpg' },
      global,
    })
    const style = wrapper.find('.cb-good-main-image').attributes('style') || ''
    expect(style).toContain('width: 100%')
    expect(style).toContain('height: 100%')
  })
})
