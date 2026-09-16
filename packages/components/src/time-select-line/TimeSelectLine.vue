<template>
  <div class="cb-time-select-line" :style="{ height }">
    <ul class="cb-time-list">
      <div class="time-line" :style="{ height: lineHeight + 'px' }"></div>
      <li
        v-for="item in dataRange"
        :key="item.key"
        :ref="(el) => setCompRef(el, item.key)"
        class="cb-time-item"
        :class="{
          actived: activeKey === item.key,
          disabled: item.completed === null,
        }"
        @click="handleItemClick(item, $event)"
      >
        <div v-if="item.isYear" class="year">{{ item.year }}年</div>
        <div v-else class="month">
          <span>{{ item.month }}</span
          >月
          <cb-icon
            v-show="item.completed !== null"
            class="icon"
            :color="item.completed ? 'var(--td-color-success)' : 'var(--td-brand-color)'"
            :name="item.completed ? completedIcon : progressIcon"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'CbTimeSelectLine',
})
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { computed, nextTick, onMounted, ref, watch, type PropType } from 'vue'
dayjs.extend(customParseFormat)
const props = defineProps({
  height: {
    type: String,
    default: '435px',
  },
  timeRanges: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  completedTime: {
    type: String,
    default: null,
  },
  completedIcon: {
    type: String,
    default: 'zhengque',
  },
  progressIcon: {
    type: String,
    default: 'ddai',
  },
  showMoreMonth: {
    type: Boolean,
    default: true,
  },
})
interface MonthItem {
  year: string
  month: string | null
  key: string
  completed: boolean | null
  isYear: boolean
}
const emits = defineEmits(['change'])
const activeKey = defineModel<string>()
const compRefs = ref<Record<string, HTMLElement | null>>({})
const setCompRef = (el: unknown, id: string) => {
  compRefs.value[id] = el as HTMLElement | null
}
// 竖线高度
const lineHeight = ref(0)
// 计算竖线高度到最后一个元素的中心位置
const calculateLineHeight = () => {
  const items = dataRange.value
  if (items.length === 0) {
    lineHeight.value = 0
    return
  }
  // 获取最后一个元素的key
  const lastItem = items[items.length - 1]
  if (!lastItem) {
    lineHeight.value = 0
    return
  }
  // 计算该元素的位置
  const lastEl = compRefs.value[lastItem.key]
  if (lastEl) {
    lineHeight.value = lastEl.offsetTop + lastEl.offsetHeight / 2
  }
}
/**
 * @param range [开始时间, 结束时间]
 * @param completedTime 已完成截止时间，可以为 null
 */
function generateExpandedMonthList(range: string[], completedTime: string | null): MonthItem[] {
  const originalStart = dayjs(range[0], 'YYYYMM')
  const originalEnd = dayjs(range[1], 'YYYYMM')
  let start = originalStart.subtract(0, 'month')
  let end = originalEnd.add(0, 'month')
  if (props.showMoreMonth) {
    start = originalStart.subtract(4, 'month')
    end = originalEnd.add(4, 'month')
  }
  const completed = completedTime ? dayjs(completedTime) : null
  const result: MonthItem[] = []
  let current = end
  while (!current.isBefore(start, 'month')) {
    let status: boolean | null = false
    if (current.isAfter(originalEnd, 'month') || current.isBefore(originalStart, 'month')) {
      status = null
    } else {
      status = completed ? !current.isAfter(completed, 'month') : false
    }
    result.push({
      year: current.format('YYYY'),
      month: current.format('M'),
      key: current.format('YYYYMM'),
      completed: status,
      isYear: false,
    })
    if (current.format('M') === '1') {
      result.push({
        year: current.format('YYYY'),
        month: null,
        key: `year-${current.format('YYYY')}`,
        completed: null,
        isYear: true,
      })
    }
    current = current.subtract(1, 'month')
  }
  return result.reverse()
}
const dataRange = computed(() => {
  return generateExpandedMonthList(props.timeRanges, props.completedTime)
})
const handleItemClick = (item: MonthItem, event: MouseEvent) => {
  if (item.completed === null) return
  activeKey.value = item.key
  const el = event.currentTarget as HTMLElement
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  }
  emits('change')
}
const refresh = () => {
  const activeEl = activeKey.value ? compRefs.value[activeKey.value] : null
  if (activeEl) {
    activeEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}
defineExpose({
  refresh,
})
onMounted(() => {
  calculateLineHeight()
  const activeEl = activeKey.value ? compRefs.value[activeKey.value] : null
  if (activeEl) {
    activeEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  }
})
// 监听数据变化,重新计算竖线高度
watch(
  dataRange,
  () => {
    nextTick(() => {
      calculateLineHeight()
    })
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
.cb-time-select-line {
  position: relative;
  overflow: hidden;
  // &::after {
  //   content: '';
  //   display: block;
  //   position: absolute;
  //   left: 50%;
  //   transform: translateX(-50%);
  //   top: 0;
  //   height: 100%;
  //   border-right: 2px dashed var(--td-border-color-1);
  // }
  .cb-time-list {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    align-items: center;
    &::-webkit-scrollbar {
      display: none !important;
    }
    gap: 24px;
    .time-line {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      width: 0;
      border-right: 2px dashed var(--td-border-color-1_7);
      pointer-events: none;
    }
    .cb-time-item {
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 20px;
      padding: 4px 8px;
      background-color: #f6f8fa;
      text-align: center;
      font-size: 12px;
      color: var(--td-text-color-6);
      position: relative;
      z-index: 9;
      cursor: pointer;
      &.disabled {
        cursor: not-allowed;
        color: var(--td-text-color-9);
      }
      .year {
        font-size: 14px;
        font-weight: bold;
        color: var(--td-text-color-6);
      }
      .month {
        min-width: 38px;
      }
      .icon {
        position: relative;
        top: -1px;
      }
      &.actived {
        font-size: 16px;
        font-weight: 600;
        background-color: var(--td-brand-color-10);
        color: var(--td-brand-color);
        padding: 6px 12px;
      }
    }
  }
}
</style>
