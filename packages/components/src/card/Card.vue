<template>
  <div
    class="card"
    :style="{
      width: `${cardWidth}px`,
    }"
  >
    <div
      class="content flex flex-col cursor-pointer"
      @click="emits('click', items?.id, items?.productType)"
    >
      <!-- 商品主图 -->
      <div
        :style="{ height: adaptive ? `${(cardWidth - 24) * 0.54}px` : height }"
        class="content_imgwrapper"
      >
        <t-image
          :src="items?.mainImg"
          :alt="items?.productName"
          fit="cover"
          class="h-full w-full"
        />
        <!-- 下架遮罩 -->
        <div v-if="isShowOffLine" class="off_line_img">
          <img :src="offLineImg" alt="已下架" />
        </div>
      </div>

      <!-- 底部信息区 -->
      <div class="flex flex-col justify-between px-[8px] py-[8px] card_bottom">
        <!-- 商品名称 + 价格 -->
        <div class="flex justify-between items-center">
          <span class="text-[#333333] font-bold truncate text-[14px]" :title="items?.productName">
            {{ items?.productName }}
          </span>
          <span class="text-[#F80000] font-bold">
            ￥&nbsp;<span>{{ items?.minPrice }}</span> &nbsp;<span>{{ hasQi }}</span>
          </span>
        </div>

        <!-- 销量信息 + 操作按钮 -->
        <div class="flex justify-between items-end">
          <div
            class="flex relative h-[14px] mb-[4px]"
            @mouseleave="showMask = false"
            @mouseenter="showMask = true"
          >
            <!-- 累计销量 -->
            <div style="min-width: 60px" class="flex items-center mr-[5px]">
              <cb-icon
                class="mr-[8px]"
                style="vertical-align: -1px"
                color="#999"
                size="16px"
                name="leiji_xse"
              />
              {{ items?.totalSales || 0 }}
            </div>
            <!-- 本月销量 -->
            <div class="flex flex-1 items-center truncate">
              <cb-icon
                class="mr-[8px]"
                style="vertical-align: -1px"
                size="16px"
                color="#999"
                name="benyue_xse"
              />
              {{ items?.currentMonthSales || 0 }}
            </div>

            <!-- 悬浮提示 -->
            <div v-if="showMask" class="mask-style gap-x-[5px]">
              <div class="flex-1">累计销售量:&nbsp;{{ items?.totalSales || 0 }}</div>
              <div class="flex-1">本月销售量:&nbsp;{{ items?.currentMonthSales || 0 }}</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center cursor-pointer rounded-[2px] overflow-hidden">
            <button
              v-if="isbugcart"
              class="add-buy-style"
              :class="{ 'already-buy-style': items?.addCar }"
              @click.stop="but_addcart('add', items!)"
            >
              {{ items?.addCar ? '已加购' : '加购' }}
            </button>
            <button v-if="issignorder" class="sign-style" @click.stop="but_signorder">签单</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComputedRef } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { MIN_CARD_WIDTH } from './utils'
import type { CardProps, CardEmits, AddCartEventPayload, ProductHallListType } from './types'

defineOptions({ name: 'CbCard' })

// 下架图标（内联 base64，避免外部资源依赖）
const offLineImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAeCAYAAAA1aNaeAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAAOoAAADqAHuqzJQAAAGESURBVGje7doxTgMxFIDh57wTRVIgFUyFwBIuBEdgyAMElxM4AQu4AIu7wQ1YcAFKvJ+alLaQ0lK6+7BfZjKTeD9e/Kl///79X1NT05aensb27dsJwBjDGCMYI3jb6/X699FoNJvN5n4Aj8cjCAL3rK6u9vb2dv39/R+aplEKhb5fLpf3y+VyvV4PhmEcDoeHw2GPx6PL5YIgCNVqtV6vJ5NJWZb/3mw2d3d3q6qqKisrc3NzPM9bLBY455hjDGMcY4xjDGM0+GHMH1Yq/cBn5My9AAAAAElFTkSuQmCC'

const showMask = ref(false)

const props = withDefaults(defineProps<CardProps>(), {
  overWidth: 0,
  height: '220px',
  issignorder: true,
  isbugcart: true,
  isShowOffLine: false,
  adaptive: false,
})

const emits = defineEmits<CardEmits>()

/** 价格后缀："起" 或空 */
const hasQi = computed(() => {
  if (props.items?.minPrice) {
    if (props.items?.minPrice !== props.items?.maxPrice) {
      return '起'
    }
  }
  return ''
})

/** 卡片实际宽度 */
const cardWidth: ComputedRef<number> = computed(() => {
  if (props.minCardWidth) {
    return props.minCardWidth + props.overWidth
  }
  return MIN_CARD_WIDTH + props.overWidth
})

/** 加购按钮点击 */
const but_addcart = (type: string, items: ProductHallListType) => {
  const payload: AddCartEventPayload = {
    type,
    productType: items.productType,
    productId: items.id,
    productLogo: items.mainImg,
    productName: items.productName,
    source: items.source,
    addCar: items.addCar,
  }
  emits('addcart', payload)
}

/** 签单按钮点击 */
const but_signorder = () => {
  emits('signorder')
}

// 保留兼容：MessagePlugin 引用，业务层可能需要
void MessagePlugin
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 12px;
  position: relative;

  .content_imgwrapper {
    position: relative;

    .off_line_img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 200;

      img {
        position: absolute;
        top: 0;
        right: 0;
        width: 88px;
        height: 30px;
        object-fit: cover;
        z-index: 200;
      }
    }
  }

  .content {
    width: 100%;
    border-radius: 2px;
    overflow: hidden;
  }

  .card_bottom {
    height: 68px;
    border: 1px solid #f3f3f3;
    border-top-width: 0;
  }

  .sign-style {
    padding: 4px 8px;
    font-size: 12px;
    line-height: 16px;
    background-color: var(--td-brand-color);
    color: #fff;
  }

  .add-buy-style {
    padding: 4px 8px;
    font-size: 12px;
    line-height: 16px;
    background-color: var(--td-brand-color-10);
    color: var(--td-brand-color);

    &.already-buy-style {
      color: #c0c0c0;
      background-color: #f5f5f5;
    }
  }

  .mask-style {
    position: absolute;
    display: flex;
    align-items: center;
    padding: 10px;
    top: -55px;
    left: 0;
    z-index: 100;
    height: 50px;
    width: 250px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
  }
}
</style>
