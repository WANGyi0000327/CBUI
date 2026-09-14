import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PermissionTree from './PermissionTree.vue'
import TDesign from 'tdesign-vue-next'
import {
  initializeTreeWithState,
  updateNodeWithCascade,
  getCheckedTreeIds,
} from './tree'

const keys = { value: 'key', label: 'label', children: 'children' }
const tree = [
  {
    key: '1',
    label: '系统管理',
    children: [
      {
        key: '1-1',
        label: '用户管理',
        children: [
          { key: '1-1-1', label: '新增用户' },
          { key: '1-1-2', label: '删除用户' },
        ],
      },
      { key: '1-2', label: '角色管理' },
    ],
  },
  {
    key: '2',
    label: '内容管理',
    children: [{ key: '2-1', label: '文章管理' }],
  },
]

const mountTree = (props = {}, model = []) =>
  mount(PermissionTree, {
    attachTo: document.body,
    global: {
      plugins: [TDesign],
      stubs: {
        CbIcon: { template: '<span class="stub-icon" />' },
        'cb-icon': { template: '<span class="stub-icon" />' },
      },
    },
    props: {
      data: tree,
      ...props,
    },
    attrs: {
      'onUpdate:modelValue': (v: string[]) => (model.length ? model.splice(0, model.length, ...v) : model.push(...v)),
    },
  })

describe('tree.ts 纯函数', () => {
  it('initializeTreeWithState：默认未选中未禁用，id/label/line 状态正确', () => {
    const state = initializeTreeWithState(tree, keys)
    expect(state).toHaveLength(2)
    const root = state[0]
    expect(root.id).toBe('1')
    expect(root.label).toBe('系统管理')
    expect(root.checked).toBe(false)
    expect(root.disabled).toBe(false)
    // 非 showChecked 路径下 hasNoChildrenLevel 默认 false（业务实现）
    expect(root.hasNoChildrenLevel).toBe(false)
    expect(root.children[0].children[0].hasNoChildrenLevel).toBe(false)
    expect(root.showLine).toBe(false)
    expect(root.children[0].showLine).toBe(true)
  })

  it('initializeTreeWithState：checkedKeys 与 disabledIds 生效', () => {
    const state = initializeTreeWithState(
      tree,
      keys,
      ['1-1-1'],
      ['1-1'],
      false
    )
    expect(state[0].children[0].checked).toBe(true)
    expect(state[0].children[0].children[0].disabled).toBe(true)
    expect(state[0].children[0].children[0].checked).toBe(false)
  })

  it('initializeTreeWithState：showChecked 只保留选中节点链', () => {
    const state = initializeTreeWithState(tree, keys, [], ['1-1'], true)
    expect(state).toHaveLength(1)
    expect(state[0].id).toBe('1')
    expect(state[0].children[0].id).toBe('1-1')
    expect(state[0].children[0].children).toBeUndefined()
    // showChecked 路径下叶子 hasNoChildrenLevel 为 true（getCheckedTreeNodes）
    expect(state[0].children[0].hasNoChildrenLevel).toBe(true)
  })

  it('updateNodeWithCascade：勾选父节点级联全选子孙', () => {
    const init = initializeTreeWithState(tree, keys)
    const state = updateNodeWithCascade(init, '1', true, false)
    expect(state[0].checked).toBe(true)
    expect(state[0].children[0].checked).toBe(true)
    expect(state[0].children[0].children[1].checked).toBe(true)
  })

  it('updateNodeWithCascade：勾选子节点向上级联父节点', () => {
    const init = initializeTreeWithState(tree, keys)
    const state = updateNodeWithCascade(init, '1-1-2', true, false)
    expect(state[0].children[0].checked).toBe(true)
    expect(state[0].checked).toBe(true)
    expect(state[0].children[1].checked).toBe(false)
  })

  it('updateNodeWithCascade：checkStrictly 只更新目标节点', () => {
    const init = initializeTreeWithState(tree, keys)
    const state = updateNodeWithCascade(init, '1', true, true)
    expect(state[0].checked).toBe(true)
    expect(state[0].children[0].checked).toBe(false)
    expect(state[1].checked).toBe(false)
  })

  it('getCheckedTreeIds：收集全部选中 id', () => {
    const init = initializeTreeWithState(tree, keys)
    const state = updateNodeWithCascade(init, '1-1', true, false)
    const ids = getCheckedTreeIds(state)
    expect(ids).toContain('1-1')
    expect(ids).toContain('1-1-1')
    expect(ids).toContain('1-1-2')
    expect(ids).toContain('1')
  })
})

describe('CbPermissionTree 组件', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('渲染树节点 label（expandAll 展开全部）', () => {
    const wrapper = mountTree({ expandAll: true })
    expect(wrapper.text()).toContain('系统管理')
    expect(wrapper.text()).toContain('用户管理')
    expect(wrapper.text()).toContain('新增用户')
    expect(wrapper.text()).toContain('内容管理')
  })

  it('默认折叠：仅渲染根节点', () => {
    const wrapper = mountTree()
    expect(wrapper.text()).toContain('系统管理')
    expect(wrapper.text()).not.toContain('用户管理')
  })

  it('checkable 时渲染 checkbox', () => {
    const wrapper = mountTree({ checkable: true, expandAll: true })
    expect(wrapper.findAllComponents({ name: 'TCheckbox' })).toHaveLength(7)
  })

  it('点击 checkbox 触发级联并更新 v-model', async () => {
    const model: string[] = []
    const wrapper = mountTree({ checkable: true, expandAll: true }, model)
    // 等 mount 的 immediate watch（isUpdating 防护）完成
    await nextTick()
    await nextTick()
    // 勾选根节点"系统管理"
    const checkboxes = wrapper.findAllComponents({ name: 'TCheckbox' })
    checkboxes[0].vm.$emit('change', true)
    await nextTick()
    await nextTick()
    expect(model).toContain('1')
    expect(model).toContain('1-1-1')
    expect(model).toContain('1-1-2')
    expect(model).toContain('1-2')
  })

  it('disabled 节点点击不改变选中', async () => {
    const model: string[] = []
    const wrapper = mountTree(
      { checkable: true, expandAll: true, disabled: ['1-1-1'] },
      model
    )
    await nextTick()
    await nextTick()
    // 勾选父节点"用户管理"：禁用子节点不选中
    const checkboxes = wrapper.findAllComponents({ name: 'TCheckbox' })
    checkboxes[1].vm.$emit('change', true)
    await nextTick()
    await nextTick()
    expect(model).toContain('1-1')
    expect(model).not.toContain('1-1-1')
  })
})
