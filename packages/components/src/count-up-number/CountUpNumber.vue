<template>
  <span ref="countUpElementRef" class="cb-count-up-number">0</span>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { CountUp, type CountUpOptions } from 'countup.js'

defineOptions({
  name: 'CbCountUpNumber',
})

/**
 * 数字动画组件属性。
 * 该组件的职责只负责“把数字以动画方式展示出来”，
 * 不耦合业务单位、百分号、颜色等页面语义，便于后续在不同位置复用。
 */
interface Props {
  /**
   * 是否开启大数格式化（超过10000自动转为 w 结尾，保留最多两位小数）
   */
  formatting?: boolean
  /**
   * 当前需要展示的目标数值。
   * 当该值变化时，组件会自动触发平滑过渡动画。
   */
  value: number
  /**
   * 动画时长，单位为秒。
   * 提供默认值是为了让大多数页面直接开箱即用，减少重复配置。
   */
  duration?: number
  /**
   * 是否启用数字缓动。
   * 开启后数字变化会更自然，适合看板、统计卡片等场景。
   */
  useEasing?: boolean
  /**
   * 是否启用千分位分组。
   * 统计类数据通常需要更好的可读性，因此默认开启。
   */
  useGrouping?: boolean
  /**
   * 千分位分隔符。
   * 默认使用英文逗号，兼容项目内当前展示习惯。
   */
  separator?: string
  /**
   * 小数点符号。
   * 默认使用英文句点，与常见数值格式保持一致。
   */
  decimal?: string
}

/**
 * 组件属性实例。
 * 使用 `withDefaults` 的原因是让组件在最常见场景下无需额外传参。
 */
const props = withDefaults(defineProps<Props>(), {
  formatting: false,
  duration: 1.5,
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
})

/**
 * 数字动画挂载节点引用。
 * CountUp 需要直接操作真实 DOM，因此这里必须保留元素引用。
 */
const countUpElementRef = ref<HTMLDivElement>()

/**
 * CountUp 实例。
 * 抽成单独变量的原因是：初始化后还需要在 `watch` 中持续复用它做更新动画。
 */
let countUpInstance: CountUp | null = null

/**
 * 根据当前数值计算应保留的小数位数。
 * 这里沿用原页面逻辑：
 * 1. 没有小数时不保留小数位；
 * 2. 有小数时最多保留两位；
 * 这样既能避免展示过长小数，又能保证动画数字格式稳定。
 *
 * @param currentValue 当前需要展示的数值
 * @returns 实际用于展示的小数位数
 */
const getDecimalPlaces = (currentValue: number): number => {
  if (currentValue === null) {
    return 0
  }
  /** 将数值转成字符串，便于判断小数点位置。 */
  const currentValueText = currentValue.toString()
  /** 小数点索引，用于判断当前数值是否包含小数部分。 */
  const decimalPointIndex = currentValueText.indexOf('.')

  if (decimalPointIndex === -1) {
    return 0
  }

  /** 实际存在的小数位长度。 */
  const actualDecimalLength = currentValueText.length - decimalPointIndex - 1

  return Math.min(actualDecimalLength, 2)
}
/**
 * 🎯 核心新增：CountUp 专用的自定义动态格式化渲染器
 * 这样可以确保数字在从 0 跳动到 15000 的流通过程中，界面显示也会平滑地从“9,999”变成“1.5w”
 */
const customFormattingFn = (n: number): string => {
  // 如果开启了格式化，且当前滚动的实时数字超过了 10000
  if (props.formatting && n >= 10000) {
    const wVal = n / 10000
    // 如果刚好是整数（比如2w，3w），不带小数点；如果是浮点数（比如1.25w），保留最多两位小数
    const formattedNum = Number.isInteger(wVal)
      ? wVal.toString()
      : wVal.toFixed(2)
    return `${formattedNum}w`
  }

  // 🎯 以下为你原有的 CountUp 内部默认千分位和小数点格式化逻辑的精简复刻
  // 确保在 1万 以下或者没开 formatting 时，千分位逗号和小数点依旧正常
  const options: any = countUpInstance?.options || props
  const decimals = getDecimalPlaces(n)

  // 处理负号
  const neg = n < 0 ? '-' : ''
  const absVal = Math.abs(n)

  // 固定小数位
  const fixedNum = absVal.toFixed(decimals)
  const parts = fixedNum.split('.')
  let x1 = parts[0]
  const x2 = parts.length > 1 ? options.decimal + parts[1] : ''

  // 插入千分位分隔符
  if (options.useGrouping) {
    const rgx = /(\d+)(\d{3})/
    while (rgx.test(x1 as string)) {
      x1 = (x1 as string).replace(rgx, '$1' + options.separator + '$2')
    }
  }

  return neg + x1 + x2
}
/**
 * 创建数字动画实例并启动首次动画。
 * 单独抽成方法的原因是让挂载初始化逻辑更清晰，也便于后续复用。
 */
const initCountUp = (): void => {
  if (!countUpElementRef.value) {
    return
  }

  /**
   * 创建 CountUp 实例。
   * 这里把所有配置项集中写在一起，便于后续组件复用时统一调整。
   */
  countUpInstance = new CountUp(countUpElementRef.value, props.value, {
    duration: props.duration,
    useEasing: props.useEasing,
    useGrouping: props.useGrouping,
    separator: props.separator,
    decimal: props.decimal,
    decimalPlaces: getDecimalPlaces(props.value),
    formattingFn: customFormattingFn,
  })

  if (!countUpInstance.error) {
    countUpInstance.start()
    return
  }

  console.error('CountUp 初始化失败:', countUpInstance.error)
}

/**
 * 根据新值更新动画。
 * 之所以在更新前同步刷新小数位，是为了避免旧格式残留，
 * 例如从整数切换到小数时，展示格式不一致的问题。
 *
 * @param nextValue 最新目标值
 */
const updateCountUp = (nextValue: number): void => {
  if (!countUpInstance || countUpInstance.error) {
    return
  }
  /** 先更新小数位配置，再执行数值过渡。 */
  ;(countUpInstance.options as CountUpOptions).decimalPlaces =
    getDecimalPlaces(nextValue)
  countUpInstance.update(nextValue)
}

/**
 * 监听外部传入数值变化。
 * 组件抽离后，父组件只需要维护业务值，这里统一负责动画过渡。
 */
watch(
  () => props.value,
  (nextValue: number) => {
    updateCountUp(nextValue)
  }
)

/**
 * 组件挂载后初始化首次动画。
 * 必须等真实 DOM 创建完成后再实例化 CountUp，否则动画库无法拿到挂载节点。
 */
onMounted(() => {
  initCountUp()
})
</script>

<style scoped>
.cb-count-up-number {
  display: inline-flex;
}
</style>
