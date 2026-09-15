<template>
  <div class="custom-tree-node">
    <div class="custom-tree-node" :data-level="level">
      <div
        class="custom-tree-node-content"
        :class="{
          'custom-tree-node-content-line': node.showLine,
          'custom-tree-node-content-end-line': node.endLine,
        }"
        :style="{ paddingLeft: paddingLeft + 'px' }"
      >
        <!-- 节点内容 -->
        <div
          class="custom-tree-node-item"
          :class="{
            'custom-tree-node-item-first': level === 0,
          }"
        >
          <div class="custom-icon">
            <cb-icon
              v-if="node.children?.length"
              :name="isExpand ? 'sanjiaojiantou_xia' : 'sanjiaojiantou_you'"
              @click="isExpand = !isExpand"
            />
          </div>
          <t-checkbox
            v-if="checkable"
            :checked="node.checked"
            :disabled="node.disabled"
            @change="(val: boolean) => handleChange(node.id, val)"
          >
            <span class="node-label">{{ node.label }}</span>
          </t-checkbox>
          <span v-else class="node-label">{{ node.label }}</span>
        </div>
        <!-- 子节点容器 -->
        <div v-if="isExpand && node.children?.length" class="custom-tree-children">
          <!-- 最后一级节点 -->
          <div v-if="node.hasNoChildrenLevel" class="last-level-children">
            <div v-for="item in node.children" :key="item.id" class="last-level-item">
              <t-checkbox
                v-if="checkable"
                :checked="item.checked"
                :disabled="item.disabled"
                @change="(val: boolean) => handleChange(item.id, val)"
              >
                <span>{{ item.label }}</span>
              </t-checkbox>
              <span v-else>{{ item.label }}</span>
            </div>
          </div>
          <!-- 递归节点 -->
          <div v-else class="nested-children">
            <TreeNode
              v-for="item in node.children"
              :key="item.id"
              :node="item"
              :checkable="checkable"
              :level="level + 1"
              :expand-all="expandAll"
              @update="handleChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { BackendTreeNode } from '../index.d'
import TreeNode from './TreeNode.vue'
defineOptions({
  name: 'TreeNode',
})
import { ref } from 'vue'
const props = defineProps({
  node: {
    type: Object as PropType<BackendTreeNode>,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  checkable: {
    type: Boolean,
    default: true,
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
const isExpand = ref(props.expandAll)
const emits = defineEmits(['update'])
const handleChange = (id: string | number, val: boolean) => {
  emits('update', id, val)
}
const paddingLeft = props.level > 0 ? 30 : 0
</script>
<style lang="scss" scoped>
.custom-tree-node {
  .custom-tree-node-item {
    padding: 5px 0;
    display: flex;
    height: 30px;
    align-items: center;
    gap: 5px;
    position: relative;
    .custom-icon {
      width: 14px;
      cursor: pointer;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 20px;
      height: 1px;
      background-color: var(--td-border-color-1);
      top: 50%;
      left: -22px;
    }
    &.custom-tree-node-item-first {
      &::after {
        display: none;
      }
    }
  }
  .last-level-children {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 5px 5px 50px;
    position: relative;
    flex-wrap: wrap;
    .last-level-item {
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    &::before {
      content: '';
      display: block;
      position: absolute;
      height: calc(100% - 50%);
      width: 1px;
      left: 7px;
      top: 0px;
      background-color: var(--td-border-color-1);
      z-index: 3;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 30px;
      height: 1px;
      background-color: var(--td-border-color-1);
      top: 50%;
      left: 7px;
    }
  }
  .custom-tree-node-content {
    position: relative;
    .custom-tree-node-content-line {
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 7px;
        height: 100%;
        width: 1px;
        background-color: var(--td-border-color-1);
        top: 0;
      }
      &.custom-tree-node-content-end-line {
        &::before {
          height: 15px;
        }
      }
    }
  }
}
</style>
