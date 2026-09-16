import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import FilePreviewV2 from './FilePreviewV2.vue'

// 依赖 stub：t-image-viewer 渲染 trigger 插槽；cb-image-secret 渲染占位；cb-icon 渲染图标名
const CbIconStub = defineComponent({
  name: 'CbIcon',
  props: { name: String, size: String },
  setup: (props) => () => h('span', { class: 'cb-icon-stub' }, props.name || ''),
})

const CbImageSecretStub = defineComponent({
  name: 'CbImageSecret',
  props: { tempUrl: String },
  setup: (props) => () => h('img', { class: 'image-secret-stub', alt: props.tempUrl || '' }),
})

const TImageViewerStub = defineComponent({
  name: 'TImageViewer',
  props: { defaultIndex: Number, images: Array },
  setup:
    (props, { slots }) =>
    () => {
      const trigger = slots.trigger
      const open = () => h('div', { class: 'viewer-opened' })
      return h('div', { class: 't-image-viewer-stub' }, trigger ? trigger({ open }) : [])
    },
})

const TEmptyStub = defineComponent({
  name: 'TEmpty',
  setup: () => () => h('div', { class: 't-empty-stub' }),
})

const CbFilepreviewStub = defineComponent({
  name: 'CbFilepreview',
  props: { dialogVisible: Boolean, fileList: Array },
  emits: ['update:dialogVisible'],
  setup: (props) => () =>
    h(
      'div',
      {
        class: 'filepreview-stub',
        'data-visible': String(props.dialogVisible),
      },
      'filepreview'
    ),
})

const global = {
  stubs: {
    'cb-icon': CbIconStub,
    'cb-image-secret': CbImageSecretStub,
    't-image-viewer': TImageViewerStub,
    't-empty': TEmptyStub,
    CbFilepreview: CbFilepreviewStub,
  },
}

describe('CbFilePreviewV2 附件图片预览', () => {
  it('图片模式（默认）按 imageNames 渲染缩略图网格', () => {
    const wrapper = mount(FilePreviewV2, {
      props: { imageNames: ['/a.jpg', '/b.jpg', '/c.jpg'] },
      global,
    })
    expect(wrapper.findAll('.t-image-viewer-stub').length).toBe(3)
    expect(wrapper.findAll('.image-secret-stub').length).toBe(3)
    // 不渲染附件入口
    expect(wrapper.find('.filepreview-stub').exists()).toBe(false)
  })

  it('single 模式仅渲染第一张并显示 +N 角标', () => {
    const wrapper = mount(FilePreviewV2, {
      props: {
        imageNames: ['/a.jpg', '/b.jpg', '/c.jpg'],
        single: true,
      },
      global,
    })
    // 源码行为：t-image-viewer 仍 v-for 全部，但仅 index 0 的 trigger 渲染内容
    expect(wrapper.findAll('.t-image-viewer-stub').length).toBe(3)
    expect(wrapper.findAll('.image-secret-stub').length).toBe(1)
    expect(wrapper.find('.imgnum').text()).toContain('+3')
  })

  it('点击删除图标触发 deleteImage(index)', async () => {
    const wrapper = mount(FilePreviewV2, {
      props: { imageNames: ['/a.jpg', '/b.jpg'] },
      global,
    })
    const deletes = wrapper.findAll('.tdesign-demo-image-viewer__ui-image--hover .absolute')
    expect(deletes.length).toBe(2)
    await deletes[1].trigger('click')
    expect(wrapper.emitted('deleteImage')?.[0]).toEqual([1])
  })

  it('附件模式渲染入口，点击打开 CbFilepreview 弹窗', async () => {
    const wrapper = mount(FilePreviewV2, {
      props: {
        imageNames: [{ url: '/a.pdf', fileName: '合同.pdf' }],
        showOnlyImages: false,
      },
      global,
    })
    // 附件入口文字
    expect(wrapper.text()).toContain('附件')
    // 点击打开
    const triggerEl = wrapper.findAll('div').find((el) => el.text().includes('附件'))
    await triggerEl!.trigger('click')
    expect(wrapper.find('.filepreview-stub').exists()).toBe(true)
  })

  it('无图片时渲染空态插槽/默认空态', () => {
    const wrapper = mount(FilePreviewV2, {
      props: { imageNames: [] },
      global,
    })
    expect(wrapper.find('.t-empty-stub').exists()).toBe(true)
  })

  it('附件模式自定义 trigger 插槽生效', () => {
    const wrapper = mount(FilePreviewV2, {
      props: {
        imageNames: [{ url: '/a.pdf', fileName: '合同.pdf' }],
        showOnlyImages: false,
      },
      slots: { trigger: () => h('button', { class: 'custom-trigger' }, '自定义入口') },
      global,
    })
    expect(wrapper.find('.custom-trigger').exists()).toBe(true)
  })
})
