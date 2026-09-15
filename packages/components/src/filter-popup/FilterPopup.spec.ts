import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import FilterPopup from './FilterPopup.vue'

// 依赖 stub
const CbIconStub = defineComponent({
  name: 'CbIcon',
  props: { name: String, size: String },
  setup: (props) => () => h('span', { class: 'cb-icon-stub' }, props.name || ''),
})

const CbDynamicFormGeneratorStub = defineComponent({
  name: 'CbDynamicFormGenerator',
  props: { fields: Array, formData: Object },
  emits: ['update:formData'],
  setup: (props) => () =>
    h('div', { class: 'form-generator-stub' }, `fields:${(props.fields || []).length}`),
  methods: {
    reset() {
      // stub reset 不做事
    },
  },
})

const TButtonStub = defineComponent({
  name: 'TButton',
  props: { theme: String, disabled: Boolean, loading: Boolean },
  setup:
    (_props, { slots }) =>
    () =>
      h('button', { class: 't-button-stub' }, slots.default?.()),
})

const TPopupStub = defineComponent({
  name: 'TPopup',
  props: { modelValue: Boolean, placement: String },
  emits: ['update:modelValue'],
  setup:
    (props, { slots, emit }) =>
    () => {
      // TDesign Popup：默认插槽为触发元素，content 插槽为弹层内容；点击触发切换 visible
      const trigger = slots.default
      const content = slots.content
      return h('div', { class: 't-popup-stub' }, [
        h(
          'div',
          {
            class: 'popup-trigger',
            onClick: () => emit('update:modelValue', !props.modelValue),
          },
          trigger ? trigger() : []
        ),
        props.modelValue && content ? h('div', { class: 'popup-content' }, content()) : [],
      ])
    },
})

const global = {
  stubs: {
    'cb-icon': CbIconStub,
    'cb-dynamic-form-generator': CbDynamicFormGeneratorStub,
    't-button': TButtonStub,
    't-popup': TPopupStub,
  },
}

const fields = [
  { key: 'name', label: '姓名', type: 'input' },
  { key: 'age', label: '年龄', type: 'input' },
]

describe('CbFilterPopup 筛选弹层', () => {
  it('渲染筛选按钮（无筛选时无角标）', () => {
    const wrapper = mount(FilterPopup, {
      props: {
        fields,
        formData: { name: '', age: '' },
      },
      global,
    })
    expect(wrapper.text()).toContain('筛选')
    expect(wrapper.text()).not.toContain('(')
  })

  it('formData 有值时 filterLen 显示角标', async () => {
    const wrapper = mount(FilterPopup, {
      props: {
        fields,
        formData: { name: '', age: '' },
      },
      global,
    })
    const vm = wrapper.vm as any
    // 初始挂载后 defaultValue 已由 immediate watch 记录
    expect(vm.filterLen).toBe(0)
    // 更新 formData 值（直接改 props）
    await wrapper.setProps({ formData: { name: '', age: '28' } })
    await wrapper.vm.$nextTick()
    expect(vm.filterLen).toBe(1)
  })

  it('点击按钮打开弹层渲染动态表单', async () => {
    const wrapper = mount(FilterPopup, {
      props: {
        fields,
        formData: { name: '', age: '' },
      },
      global,
    })
    expect(wrapper.find('.popup-content').exists()).toBe(false)
    // 点击 trigger 内按钮 → t-popup 更新 modelValue
    await wrapper.find('.popup-trigger button').trigger('click')
    await wrapper.vm.$nextTick()
    // stub 通过 v-model 联动 visible
    expect(wrapper.find('.form-generator-stub').exists()).toBe(true)
  })

  it('点击确定触发 query 并关闭弹层', async () => {
    const wrapper = mount(FilterPopup, {
      props: {
        fields,
        formData: { name: '', age: '' },
      },
      global,
    })
    // 打开
    await wrapper.find('.popup-trigger button').trigger('click')
    await wrapper.vm.$nextTick()
    // 点确定（content 里第二个 t-button）
    const btns = wrapper.findAll('.popup-content button')
    await btns[1].trigger('click')
    const emitted = wrapper.emitted('query')
    expect(emitted).toBeTruthy()
    // 弹层关闭
    expect(wrapper.find('.form-generator-stub').exists()).toBe(false)
  })

  it('有筛选值时点击清除按钮触发 handleClear 与 query', async () => {
    const wrapper = mount(FilterPopup, {
      props: {
        fields,
        formData: { name: '', age: '' },
      },
      global,
    })
    // 先打开弹层，保证 formRef 挂载
    await wrapper.find('.popup-trigger button').trigger('click')
    await wrapper.vm.$nextTick()
    wrapper.setProps({ formData: { name: '', age: '28' } })
    await wrapper.vm.$nextTick()
    const vm = wrapper.vm as any
    vm.handleClear()
    expect(wrapper.emitted('query')).toBeTruthy()
  })
})
