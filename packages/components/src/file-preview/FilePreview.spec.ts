import { describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import FilePreview from './FilePreview.vue'
import PdfViewer from './components/PdfViewer.vue'
import imgage from './components/imgage.vue'
import CbVideo from './components/CbVideo.vue'

// 测试通过 wrapper.vm 访问组件内部方法，用最小化接口替代 any
type FilePreviewVM = {
  open: () => void
  handleClick: (url: string, name: string, fileName: string) => void
  getFileType: (url: string) => string
  getTopPic: (url: string) => string
}
type ImgageVM = {
  rotateDeg: number
  scale: number
  handleButClick: (type: string) => void
}
const asFilePreviewVM = (wrapper: VueWrapper) =>
  wrapper.vm as unknown as FilePreviewVM
const asImgageVM = (wrapper: VueWrapper) => wrapper.vm as unknown as ImgageVM

// 子组件/依赖 stub：文件预览依赖真实文件资源与全局注册的 cb-icon / t-dialog
const CbIconStub = defineComponent({
  name: 'CbIcon',
  props: { name: String, color: String, size: String },
  setup: (props) => () => h('span', { class: 'cb-icon-stub' }, props.name || ''),
})

const global = {
  stubs: {
    'cb-icon': CbIconStub,
    't-dialog': defineComponent({
      name: 'TDialog',
      props: { visible: Boolean },
      emits: ['update:visible'],
      setup:
        (_props, { slots }) =>
        () =>
          h('div', { class: 't-dialog-stub' }, slots.body ? slots.body() : slots.default?.()),
    }),
    't-button': defineComponent({
      name: 'TButton',
      setup:
        (_props, { slots }) =>
        () =>
          h('button', slots.default?.()),
    }),
    't-loading': defineComponent({
      name: 'TLoading',
      setup:
        (_props, { slots }) =>
        () =>
          h('div', slots.default?.()),
    }),
    PdfViewer: defineComponent({
      name: 'PdfViewer',
      setup: () => () => h('div', { class: 'pdf-stub' }),
    }),
    imgage: defineComponent({
      name: 'Imgage',
      setup: () => () => h('div', { class: 'imgage-stub' }),
    }),
    CbAudio: defineComponent({
      name: 'CbAudio',
      setup: () => () => h('div', { class: 'audio-stub' }),
    }),
    CbVideo: defineComponent({
      name: 'CbVideo',
      setup: () => () => h('div', { class: 'video-stub' }),
    }),
  },
}

describe('CbFilepreview 文件预览', () => {
  it('open 打开 pdf 文件时渲染 PdfViewer', async () => {
    const wrapper = mount(FilePreview, {
      props: {
        fileList: [{ url: 'https://x.com/a.pdf', fileName: '合同.pdf' }],
      },
      global,
    })
    asFilePreviewVM(wrapper).open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.pdf-stub').exists()).toBe(true)
    expect(wrapper.find('.imgage-stub').exists()).toBe(false)
  })

  it('open 打开 image 文件时渲染 imgage', async () => {
    const wrapper = mount(FilePreview, {
      props: {
        fileList: [{ url: 'https://x.com/b.jpg', fileName: '照片.jpg' }],
      },
      global,
    })
    asFilePreviewVM(wrapper).open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.imgage-stub').exists()).toBe(true)
  })

  it('open 打开视频/音频文件时渲染对应子组件', async () => {
    const wrapper = mount(FilePreview, {
      props: {
        fileList: [{ url: 'https://x.com/c.mp4', fileName: '视频.mp4' }],
      },
      global,
    })
    asFilePreviewVM(wrapper).open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.video-stub').exists()).toBe(true)
    await wrapper.setProps({
      fileList: [{ url: 'https://x.com/d.mp3', fileName: '音频.mp3' }],
    })
    asFilePreviewVM(wrapper).open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.audio-stub').exists()).toBe(true)
  })

  it('getFileType 按后缀识别类型', () => {
    const vm = asFilePreviewVM(mount(FilePreview, {
      props: { fileList: [] },
      global,
    }))
    expect(vm.getFileType('a.mp3')).toBe('audio')
    expect(vm.getFileType('a.mp4')).toBe('video')
    expect(vm.getFileType('a.pdf')).toBe('pdf')
    expect(vm.getFileType('a.png')).toBe('image')
    expect(vm.getFileType('a.html')).toBe('html')
    expect(vm.getFileType('a.txt')).toBe('')
    // urlId 场景视为 html
    expect(vm.getFileType('https://x.com/f?urlId=1')).toBe('html')
  })

  it('getTopPic 返回对应类型图标', () => {
    const vm = asFilePreviewVM(mount(FilePreview, {
      props: { fileList: [] },
      global,
    }))
    const pic = vm.getTopPic('a.pdf')
    expect(typeof pic).toBe('string')
    expect(pic.length).toBeGreaterThan(0)
  })

  it('多文件时渲染文件标签区且切换标签更新预览', async () => {
    const wrapper = mount(FilePreview, {
      props: {
        fileList: [
          { url: 'https://x.com/a.pdf', fileName: '合同.pdf' },
          { url: 'https://x.com/b.jpg', fileName: '照片.jpg' },
        ],
      },
      global,
    })
    asFilePreviewVM(wrapper).open()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    // 标签区渲染
    expect(wrapper.find('.file-view-dialog-tab').exists()).toBe(true)
    // 点击第二个标签切换到图片
    const items = wrapper.findAll('.fvd-tab-item')
    expect(items.length).toBe(2)
    asFilePreviewVM(wrapper).handleClick('https://x.com/b.jpg', '', '照片.jpg')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.imgage-stub').exists()).toBe(true)
  })
})

describe('CbPdfViewer 基础', () => {
  it('挂载不报错（无 pdfUrl 时不加载）', () => {
    const wrapper = mount(PdfViewer, { props: { pdfUrl: '' }, global })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('CbImgage 图片查看器', () => {
  it('旋转/缩放按钮更新状态', async () => {
    const wrapper = mount(imgage, { props: { imgUrl: '' }, global })
    const vm = asImgageVM(wrapper)
    vm.handleButClick('左转')
    expect(vm.rotateDeg).toBe(-90)
    vm.handleButClick('右转')
    expect(vm.rotateDeg).toBe(0)
    vm.handleButClick('放大')
    expect(vm.scale).toBe(1.1)
    vm.handleButClick('缩小')
    expect(vm.scale).toBe(1)
  })
})

describe('CbVideo 视频壳', () => {
  it('挂载并透传 src', () => {
    const wrapper = mount(CbVideo, {
      props: { src: 'https://x.com/v.mp4' },
      global: {
        stubs: {
          CbVideoPlayer: defineComponent({
            name: 'CbVideoPlayer',
            setup: () => () => h('div', { class: 'vp-stub' }),
          }),
        },
      },
    })
    expect(wrapper.find('.vp-stub').exists()).toBe(true)
  })
})
