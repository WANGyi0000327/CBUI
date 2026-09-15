<template>
  <div class="time-filter">
    <span class="label">{{ title }} <span v-if="title">：</span></span>
    <div class="filter-box">
      <div class="year-switcher">
        <span class="year-text">{{ innerYear }}</span>
        <div class="arrow-column">
          <div
            class="arrow-btn up"
            :class="{ disabled: isYearMaxed }"
            @click.stop="handleYearChange(1)"
          >
            <cb-icon name="sanjiaojiantou_shang" size="16px" />
          </div>
          <div class="arrow-btn down" @click.stop="handleYearChange(-1)">
            <cb-icon name="sanjiaojiantou_xia" size="16px" />
          </div>
        </div>
      </div>
      <div class="month-list">
        <!-- 仅渲染未禁用的月份 -->
        <div
          v-for="m in availableMonths"
          :key="m"
          class="month-item"
          :class="{
            active: innerMonth === m,
          }"
          @click="handleMonthChange(m)"
        >
          {{ m }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
defineOptions({
  name: 'CbTimeSelect',
})
export interface TimeFilterValue {
  year: number
  month: number | null
  timeRange: {
    start: string
    end: string
  }
}
// 定义数组返回形式的类型
export type TimeFilterArrayValue = [string, string]
interface Props {
  modelValue?: Partial<TimeFilterValue> | TimeFilterArrayValue
  type?: 'current' | 'default'
  title?: string
  isLastMonth?: boolean // 是否锁定在上个月模式
  supportFullYear?: boolean // 是否支持全年选择
  future?: boolean // 是否支持未来时间选择
  formatType?: 'object' | 'array' // 控制返回数据的形式
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  type: 'current',
  title: '时间',
  isLastMonth: false,
  supportFullYear: false,
  future: false, // 默认不支持未来
  formatType: 'object', // 默认保持原有对象格式
})
const emits = defineEmits(['update:modelValue', 'change'])
// === 时间基准 ===
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
// 最大可选时间：当前年月 + 10 年
const maxFutureYear = currentYear + 10
const maxFutureMonth = currentMonth
const lastMonthDate = new Date(currentYear, currentMonth - 2, 1)
const lastMonthYear = lastMonthDate.getFullYear()
const lastMonthValue = lastMonthDate.getMonth() + 1
// 年份最大限制
const maxYear = computed(() => (props.future ? maxFutureYear : currentYear))
// 年份是否到达最大（控制上箭头禁用）
const isYearMaxed = computed(() => innerYear.value >= maxYear.value)
// === 内部状态解析 ===
const getInitialState = () => {
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    const startDate = new Date(props.modelValue[0])
    if (!isNaN(startDate.getTime())) {
      return {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
      }
    }
  } else if (props.modelValue && !Array.isArray(props.modelValue)) {
    if (props.modelValue.year) {
      return {
        year: props.modelValue.year,
        month: props.modelValue.month !== undefined ? props.modelValue.month : null,
      }
    }
  }
  return null
}
const initialState = getInitialState()
const innerYear = ref(initialState?.year || (props.isLastMonth ? lastMonthYear : currentYear))
const innerMonth = ref<number | null>(
  initialState
    ? initialState.month
    : props.isLastMonth
      ? lastMonthValue
      : props.type === 'current'
        ? currentMonth
        : 1
)
// === 格式化工具 ===
const pad = (val: number) => (val < 10 ? `0${val}` : `${val}`)
const formatDate = (d: Date, isEnd: boolean = false): string => {
  const Y = d.getFullYear()
  const M = pad(d.getMonth() + 1)
  const D = pad(d.getDate())
  const h = isEnd ? '23' : '00'
  const m = isEnd ? '59' : '00'
  const s = isEnd ? '59' : '00'
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}
const getTimeRange = (year: number, month: number | null) => {
  let startDate: Date
  let endDate: Date
  if (month) {
    startDate = new Date(year, month - 1, 1)
    endDate = new Date(year, month, 0)
  } else {
    startDate = new Date(year, 0, 1)
    endDate = new Date(year, 11, 31, 23, 59, 59)
  }
  return {
    start: formatDate(startDate, false),
    end: formatDate(endDate, true),
  }
}
// === 判断月份是否禁用 ===
const isMonthDisabled = (y: number, m: number) => {
  if (!props.future) {
    if (y > currentYear) return true
    if (y === currentYear) {
      return props.isLastMonth ? m >= currentMonth : m > currentMonth
    }
    return false
  }
  if (y > maxFutureYear) return true
  if (y === maxFutureYear) {
    return m > maxFutureMonth
  }
  return false
}
// === 动态计算当前显示的可选月份列表（隐藏不可用月份） ===
const availableMonths = computed(() => {
  const months: number[] = []
  for (let m = 1; m <= 12; m++) {
    if (!isMonthDisabled(innerYear.value, m)) {
      months.push(m)
    }
  }
  return months
})
// === 触发更新 ===
const triggerUpdate = () => {
  const range = getTimeRange(innerYear.value, innerMonth.value)
  if (props.formatType === 'array') {
    const result: TimeFilterArrayValue = [range.start, range.end]
    emits('update:modelValue', result)
    emits('change', result)
  } else {
    const result: TimeFilterValue = {
      year: innerYear.value,
      month: innerMonth.value,
      timeRange: range,
    }
    emits('update:modelValue', result)
    emits('change', result)
  }
}
// === 年份切换 ===
const handleYearChange = (step: number) => {
  const targetYear = innerYear.value + step
  if (targetYear > maxYear.value) return
  innerYear.value = targetYear
  // 如果原月份在切换后的年份不存在（超出了可显示的月份），重置为该年份的最大可用月份
  if (innerMonth.value && isMonthDisabled(targetYear, innerMonth.value)) {
    const validMonths = availableMonths.value
    if (validMonths.length > 0) {
      innerMonth.value = validMonths[validMonths.length - 1]
    }
  }
  triggerUpdate()
}
// === 月份点击切换 ===
const handleMonthChange = (m: number) => {
  if (!props.supportFullYear) {
    if (innerMonth.value === m) return
    innerMonth.value = m
    triggerUpdate()
    return
  }
  innerMonth.value = m
  triggerUpdate()
}
// === 重置功能 ===
const handleReset = () => {
  innerYear.value = props.isLastMonth ? lastMonthYear : currentYear
  innerMonth.value = props.isLastMonth
    ? lastMonthValue
    : props.type === 'current'
      ? currentMonth
      : 1
  triggerUpdate()
}
defineExpose({
  handleReset,
})
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    if (Array.isArray(val) && val.length === 2) {
      const startDate = new Date(val[0])
      if (!isNaN(startDate.getTime())) {
        const y = startDate.getFullYear()
        const m = startDate.getMonth() + 1
        if (y !== innerYear.value) innerYear.value = y
        if (m !== innerMonth.value) innerMonth.value = m
      }
    } else if (!Array.isArray(val)) {
      if (val.year && val.year !== innerYear.value) innerYear.value = val.year
      if (val.month !== undefined && val.month !== innerMonth.value) {
        innerMonth.value = val.month || null
      }
    }
  },
  { deep: true }
)
onMounted(() => {
  if (Array.isArray(props.modelValue)) {
    // 注意：TimeFilterArrayValue 是 [string, string] 元组，TS 将 .length 推断为字面量 2，
    // 此处断言为 string[] 才能合法比较空数组（运行时 modelValue 可能为 []）
    if ((props.modelValue as string[]).length === 0) triggerUpdate()
  } else {
    if (!props.modelValue?.timeRange) triggerUpdate()
  }
})
</script>
<style scoped lang="scss">
$border-color: var(--td-component-stroke, #dcdcdc);
$bg-gray: #f7f8fa;
$hover-bg: var(--td-bg-color-container-hover, #eee);
$brand-color: var(--td-brand-color, #0052d9);
$brand-light: var(--td-brand-color-light, #ecf2fe);
$text-main: var(--td-text-color-primary, #333);
$text-disabled: var(--td-text-color-disabled, #ccc);
.time-filter {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-main;
  user-select: none;
}
.label {
  color: var(--td-text-color-placeholder, #999);
}
.filter-box {
  display: flex;
  height: 32px;
  border: 1px solid $border-color;
  border-radius: 3px;
  background: #fff;
  transition: border-color 0.2s;
}
.year-switcher {
  display: flex;
  align-items: center;
  width: 68px;
  background-color: $bg-gray;
  border-right: 1px solid $border-color;
}
.year-text {
  flex: 1;
  text-align: center;
  font-weight: 500;
  padding-left: 4px;
  line-height: 32px;
}
.arrow-column {
  display: flex;
  flex-direction: column;
  width: 18px;
  height: 100%;
}
.arrow-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--td-text-color-placeholder);
  &.down {
    margin-top: -10px;
  }
  &.disabled {
    cursor: not-allowed;
    color: $text-disabled;
    opacity: 0.5;
    pointer-events: none;
  }
}
.month-list {
  display: flex;
}
.month-item {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-right: 1px solid #f0f0f0;
  color: #666;
  &:last-child {
    border-right: none;
  }
  &:not(.active):hover {
    background-color: $hover-bg;
    color: $brand-color;
  }
  &.active {
    background-color: $brand-light;
    color: $brand-color;
    font-weight: 600;
  }
}
</style>
