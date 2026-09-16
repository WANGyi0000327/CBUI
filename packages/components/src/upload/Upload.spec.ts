import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Upload from './Upload.vue'

// 全局 stub
const TButtonStub = defineComponent({
  name: 'TButton',
  props: ['loading', 'icon'],
  setup:
    (_props, { slots, attrs }) =>
    () =>
      h('button', attrs, slots.default ? slots.default() : []),
})
const TLoadingStub = defineComponent({
  name: 'TLoading',
  setup: () => () => h('div', { class: 't-loading-stub' }),
})
const global = {
  stubs: {
    't-button': TButtonStub,
    't-loading': TLoadingStub,
    't-image-viewer': { template: '<div><slot /><slot name="trigger" /></div>' },
    'cb-icon': { template: '<i class="cb-icon-stub"><slot /></i>' },
    'cb-image-secret': { template: '<img class="cb-image-secret-stub" />' },
    CbFilepreview: { template: '<div class="cb-filepreview-stub" />' },
    CbFilePreviewV2: {
      props: ['imageNames', 'showOnlyImages'],
      template: '<div class="cb-filepreviewv2-stub" />',
    },
  },
  global: {
    config: {
      globalProperties: {},
    },
  },
}

describe('CbUpload 上传组件', () => {
  it('file 主题渲染按钮与提示', () => {
    const wrapper = mount(Upload, {
      props: { theme: 'file', tips: '支持 pdf/docx' },
      global,
    })
    expect(wrapper.find('.custom-upload-trigger').exists()).toBe(true)
    expect(wrapper.text()).toContain('点击上传附件')
    expect(wrapper.text()).toContain('支持 pdf/docx')
  })

  it('file-drag 主题渲染拖拽区', () => {
    const wrapper = mount(Upload, {
      props: { theme: 'file-drag' },
      global,
    })
    expect(wrapper.find('.custom-upload-drag').exists()).toBe(true)
    expect(wrapper.text()).toContain('点击或将文件拖拽到这里上传')
  })

  it('image 主题渲染上传图片入口', () => {
    const wrapper = mount(Upload, {
      props: { theme: 'image' },
      global,
    })
    expect(wrapper.text()).toContain('上传图片')
  })

  it('外部 modelValue 回显为成功文件列表', async () => {
    const wrapper = mount(Upload, {
      props: { theme: 'file', modelValue: 'https://x.com/a.pdf' },
      global,
    })
    await new Promise((r) => setTimeout(r, 50))
    // 回显后 fileList 有 success 项 → 渲染删除操作图标
    const delIcons = wrapper.findAll('.cb-icon-stub')
    expect(wrapper.vm.$el.querySelector('.custom-upload-file-list')).toBeTruthy()
    expect(delIcons.length).toBeGreaterThan(0)
  })

  it('clearFiles 清空列表', async () => {
    const wrapper = mount(Upload, {
      props: { theme: 'file', modelValue: 'https://x.com/a.pdf' },
      global,
    })
    await new Promise((r) => setTimeout(r, 50))
    ;(wrapper.vm as unknown as { clearFiles: () => void }).clearFiles()
    await new Promise((r) => setTimeout(r, 50))
    expect(wrapper.find('.custom-upload-file-list').exists()).toBe(false)
  })

  it('zipMode 时 accept 追加 .zip 后缀', () => {
    const wrapper = mount(Upload, {
      props: { theme: 'file', accept: '.png,.jpg', zipMode: true },
      global,
    })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toContain('.zip')
  })
})
