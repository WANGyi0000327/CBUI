<template>
  <div class="custom-tree">
    <template v-for="item in state" :key="item.id">
      <TreeNode
        :node="item"
        :checkable="checkable"
        :expand-all="expandAll"
        @update="handleNodeStateUpdate"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import type { CustomTreeKey, BackendTreeNode } from './index.d'
import TreeNode from './components/TreeNode.vue'
import { nextTick, type PropType, ref, watch } from 'vue'
import {
  initializeTreeWithState,
  updateNodeWithCascade,
  getCheckedTreeIds,
} from './tree'
const modeValue = defineModel<string[]>()
defineOptions({
  name: 'CbPermissionTree',
})
const props = defineProps({
  data: {
    type: Array as PropType<BackendTreeNode[]>,
    default: () => [],
  },
  keys: {
    type: Object as PropType<CustomTreeKey>,
    default: () => {
      return {
        value: 'key',
        label: 'label',
        children: 'children',
      }
    },
  },
  disabled: {
    type: Array as PropType<string[] | number[]>,
    default: () => [],
  },
  checkable: {
    type: Boolean,
    default: false,
  },
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  expandAll: {
    type: Boolean,
    default: false,
  },
  showChecked: {
    type: Boolean,
    default: false,
  },
})
const state = ref<BackendTreeNode[]>([])
const initData = () => {
  state.value = initializeTreeWithState(
    props.data,
    props.keys,
    props.disabled,
    modeValue.value || [],
    props.showChecked
  )
}
const handleNodeStateUpdate = (id: string | number, checked: boolean) => {
  state.value = updateNodeWithCascade(
    state.value,
    id,
    checked,
    props.checkStrictly
  )
}
const isUpdating = ref(false)
watch(
  () => state.value,
  () => {
    if (isUpdating.value) return
    isUpdating.value = true
    modeValue.value = getCheckedTreeIds(state.value)
    nextTick(() => {
      isUpdating.value = false
    })
  },
  {
    deep: true,
  }
)
watch(
  () => [props.data, modeValue.value, props.disabled],
  () => {
    if (!isUpdating.value) {
      isUpdating.value = true
      initData()
      nextTick(() => {
        isUpdating.value = false
      })
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>
