<template>
  <div class="over_btns flex items-center gap-[8px]">
    <template v-for="(btn, index) in btnList_new">
      <t-button
        v-if="index < maxShownNum"
        :key="btn.type"
        theme="default"
        variant="text"
        class="!text-[#C28D4D] !mr-[10px]"
        :class="{ '!text-[#FF6B35]': btn.colorType === 1 }"
        :style="getBtnStyle(btn)"
        :disabled="isBtnDisabled(btn)"
        @click.stop="btn.clickHandler(btn.type, props.row)"
      >
        {{ getBtnLabel(btn) }}
      </t-button>
    </template>
    <t-popup
      v-if="btnList_new.length > maxShownNum"
      ref="popupref"
      placement="bottom"
      trigger="click"
    >
      <div :style="iconStyle">
        <cb-icon name="gengduo_shu" color="var(--td-brand-color)" class="cursor-pointer"></cb-icon>
      </div>
      <!-- <MoreIcon class="text-theme-color font-bold text-[16px] cursor-pointer" /> -->
      <template #content>
        <div class="content" :style="{ margin: `0 ${margin}` }">
          <template v-for="btn in btnList_new.slice(maxShownNum)" :key="btn.type">
            <t-button
              theme="default"
              variant="text"
              class="!block !mr-0 !w-[100%]"
              :class="{ '!text-[#FF6B35]': btn.colorType === 1 }"
              :style="getBtnStyle(btn)"
              :disabled="isBtnDisabled(btn)"
              style="min-width: 72px"
              @click.stop="click(btn.clickHandler, btn.type, props.row)"
            >
              {{ getBtnLabel(btn) }}
            </t-button>
          </template>
        </div>
      </template>
    </t-popup>
  </div>
</template>
<script setup lang="ts">
// import { MoreIcon } from 'tdesign-icons-vue-next'
import { computed, type PropType, ref } from 'vue'
import type { OverBtn, OverRow } from './utils/overBtns'
defineOptions({
  name: 'CbOverBtns',
})
const props = defineProps({
  btnList: {
    type: Array as PropType<OverBtn[]>,
    default: () => [],
    required: true,
  },
  maxShownNum: {
    type: Number,
    default: 2,
  },
  row: {
    type: Object as PropType<OverRow>,
    default: () => ({}),
    required: true,
  },
  iconStyle: {
    type: Object,
    default: () => ({ width: '30px' }),
  },
})
// enablehide 用于权限控制按钮显示隐藏
const btnList_new = computed(() => {
  return props.btnList.filter((btn) => {
    // 处理 enablehide 判断 - 支持函数和布尔值
    let shouldHide = false
    if (typeof btn.enablehide === 'function') {
      shouldHide = btn.enablehide(props.row)
    } else {
      shouldHide = btn.enablehide || false
    }
    return !shouldHide
  })
})
const margin = computed(() => {
  // const hiddenBtnList = props.btnList.slice(props.maxShownNum)
  // const sortByText = hiddenBtnList.sort(
  //   (a, b) => b.label.length - a.label.length
  // )
  // if (sortByText[0].label.length <= 2) {
  //   return '24px'
  // }
  return 'auto'
})
/**
 * 判断按钮是否禁用（抽离为独立函数，复用逻辑）
 */
const isBtnDisabled = (btn: OverBtn) => {
  return typeof btn.disabled === 'function' ? btn.disabled(props.row) : btn.disabled
}
/**
 * 获取按钮标签文字，支持动态函数
 */
const getBtnLabel = (btn: OverBtn) => {
  return typeof btn.label === 'function' ? btn.label(props.row) : btn.label
}
/**
 * 生成按钮最终样式：禁用时不应用 btn.style
 */
const getBtnStyle = (btn: OverBtn) => {
  // 禁用状态：返回空对象（或基础样式，根据需求调整）
  if (isBtnDisabled(btn)) {
    return {}
  }
  // 非禁用状态：合并 btn.style（支持 undefined，避免报错）
  return btn.style || {}
}
const popupref = ref()
const click = (chk: OverBtn['clickHandler'], type: string, row: OverRow) => {
  chk(type, row)
  popupref.value?.close()
}
</script>
<style scoped lang="scss">
.t-button {
  min-width: auto !important;
  padding: 0 4px !important;
}
.content {
  display: flex;
  flex-direction: column;
  min-width: 72px;
}
</style>
