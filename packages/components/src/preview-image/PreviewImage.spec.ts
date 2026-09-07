import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TDesign from 'tdesign-vue-next'
import { h } from 'vue'
import PreviewImage from './PreviewImage.vue'

const images = ['https://example.com/a.jpg', 'https://example.com/b.jpg']

describe('PreviewImage', () => {
  it('默认触发器点击后打开预览', async () => {
    const wrapper = mount(PreviewImage, {
      global: { plugins: [TDesign] },
      props: { images },
    })
    const viewer = wrapper.findComponent({ name: 'TImageViewer' })
    expect(viewer.props('visible')).toBe(false)
    await wrapper.find('.preview-image-trigger').trigger('click')
    await wrapper.vm.$nextTick()
    expect(viewer.props('visible')).toBe(true)
  })

  it('自定义触发器（父组件插槽）点击后打开预览', async () => {
    const wrapper = mount(PreviewImage, {
      global: { plugins: [TDesign] },
      props: { images },
      slots: {
        trigger: () => h('button', { class: 'custom-trigger' }, '点击预览'),
      },
    })
    const viewer = wrapper.findComponent({ name: 'TImageViewer' })
    expect(viewer.props('visible')).toBe(false)
    // 自定义触发器内容在父作用域渲染，点击需冒泡到组件外层点击容器
    await wrapper.find('.custom-trigger').trigger('click')
    await wrapper.vm.$nextTick()
    expect(viewer.props('visible')).toBe(true)
  })
})
