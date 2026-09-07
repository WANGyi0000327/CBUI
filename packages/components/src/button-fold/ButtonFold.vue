<template>
  <div v-if="getNormalizedChildren().length" class="operation-container">
    <div class="first-operation flex item-center gap-[4px]">
      <template v-for="(item, index) in getFirstOperations()" :key="index">
        <component :is="item" v-bind="getMergedProps(item)" />
      </template>
    </div>

    <t-popup
      v-if="getOtherOperations().length > 0"
      :visible="visible"
      placement="bottom"
      :overlay-class-name="overlayClassName"
      @visible-change="handleVisibleChange"
      @overlay-click="handleContextClick"
    >
      <cb-icon
        v-if="type === 'icon'"
        name="gengduo_shu"
        class="cursor-pointer"
        :class="{ disabled: disabledAll }"
        color="var(--td-brand-color)"
        @click="handleMoreClick"
      />
      <t-button
        v-if="type === 'moreBtn'"
        theme="primary"
        class="cb-brand-default"
        :disabled="disabledAll"
        @click="handleMoreClick"
      >
        <span>{{ operationName }}</span>
        <cb-icon class="mt-[4px]" :name="visible ? 'jaintou_shang' : 'jaintou_xia'"></cb-icon>
      </t-button>
      <template #content>
        <div class="more-popup">
          <template v-for="(item, index) in getOtherOperations()" :key="index">
            <component :is="item" v-bind="getMergedProps(item)" />
          </template>
        </div>
      </template>
    </t-popup>
  </div>
</template>

<script setup lang="ts">
import { useSlots, ref, Comment, Fragment, type VNode } from 'vue'
defineOptions({
  name: 'CbButtonFold',
})

const props = defineProps({
  operationName: {
    type: String,
    default: '更多',
  },
  expendNum: {
    type: Number,
    default: 1,
  },
  disabledAll: {
    type: Boolean,
    default: false,
  },
  overlayClassName: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    // moreBtn 更多按钮 图标icon
    default: 'icon',
  },
})

const slots = useSlots()
const visible = ref(false)

const getNormalizedChildren = (): VNode[] => {
  const children = slots.default?.() || []
  const res: VNode[] = []

  children.forEach((child) => {
    if (child.type === Fragment) {
      if (Array.isArray(child.children)) {
        res.push(...(child.children as VNode[]))
      }
    } else if (child.type !== Comment) {
      res.push(child)
    }
  })
  // 过滤掉因为 v-if 产生的注释节点
  return res.filter((child) => child.type !== Comment)
}

const getFirstOperations = () => {
  return getNormalizedChildren().slice(0, props.expendNum)
}

const getOtherOperations = () => {
  return getNormalizedChildren().slice(props.expendNum)
}

const getMergedProps = (item: any) => {
  const originalProps = item.props || {}
  return {
    ...originalProps,
    disabled: props.disabledAll || originalProps.disabled === true || originalProps.disabled === '',
  }
}

const close = () => {
  visible.value = false
}

const handleContextClick = (context: { e: MouseEvent }) => {
  const triggerClassName = (context.e.target as any)?.className as string

  if (triggerClassName.indexOf('t-link') !== -1 || triggerClassName.indexOf('t-button') !== -1) {
    close()
  }
}

const handleVisibleChange = (val: boolean, context: { trigger: string }) => {
  if (context.trigger === 'trigger-element-click' || context.trigger === 'document') {
    visible.value = val
  }
}

const handleMoreClick = () => {
  if (props.disabledAll) return
  visible.value = !visible.value
}
</script>

<style lang="scss" scoped>
.operation-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.more-popup {
  display: flex;
  flex-direction: column;
  padding: 4px;
  :deep(.t-button) {
    display: flex;
    align-items: center;
    gap: 2px;
    width: 100% !important;
    min-width: 72px !important;
    background: #fff !important;
    color: var(--td-brand-color) !important;
    height: 40px;
  }
}
.disabled {
  cursor: not-allowed;
}
</style>
