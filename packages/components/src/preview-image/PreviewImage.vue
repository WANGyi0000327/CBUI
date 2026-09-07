<template>
  <t-image-viewer
    v-model:visible="visible"
    v-bind="$attrs"
    v-model:index="currentIndex"
    :images="images"
    @download="handleDownload"
  >
    <template #trigger>
      <!--
        点击容器：TDesign 的 trigger 是作用域插槽（通过插槽参数传 open），
        不会自动绑点击；且父组件插槽内容在父作用域编译、拿不到本组件 open。
        因此统一在外层拦截点击调用 open，默认与自定义触发器均即点即开。
      -->
      <div class="cb-preview-image-trigger-wrap" @click="open">
        <slot name="trigger">
          <div
            class="preview-image-trigger"
            :style="{ width, height, maxHeight }"
          >
            <img :src="images[0]" />
            <div class="preview-image-icon">
              <cb-icon name="fangda" />
            </div>
          </div>
        </slot>
      </div>
    </template>
  </t-image-viewer>
</template>
<script lang="ts" setup>
import { MessagePlugin } from 'tdesign-vue-next'
import { ref, type PropType } from 'vue'
defineOptions({
  name: 'CbPreviewImage',
})
const currentIndex = ref(0)
const visible = ref(false)
defineProps({
  images: {
    type: Array as PropType<string[]>,
    required: true,
  },
  width: {
    type: String,
    default: '60px',
  },
  height: {
    type: String,
    default: 'auto',
  },
  maxHeight: {
    type: String,
    default: 'none',
  },
})
const open = () => {
  currentIndex.value = 0
  console.log('🚀 ~ open ~ currentIndex:', currentIndex)
  visible.value = true
}
const handleDownload = (url: string) => {
  const a = document.createElement('a')
  a.href = url
  const regex = /aliyuncs\.com/
  if (!regex.test(url)) {
    a.target = '_blank'
  }
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  if (regex.test(url)) {
    a.target = '_blank'
    MessagePlugin.success('下载成功')
  }
}
defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.cb-preview-image-trigger-wrap {
  display: inline-block;
  cursor: pointer;
}
.preview-image-trigger {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  > img {
    width: 100%;
    height: auto;
  }
  .preview-image-icon {
    width: 18px;
    height: 18px;
    border-radius: 4px 0 0 0;
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.t-image-viewer__modal-icon.t-image-viewer__header-pre-bt {
  display: none!important;
}
.t-image-viewer-preview-image .t-image-viewer__modal-header {
  bottom: 6px !important;
  height: 64px !important;
  top:auto !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.t-image-viewer__utils {
  bottom: 104px !important;
}
.t-image-viewer__modal-index {
  top: auto !important;
  bottom: 74px !important;
}
// 隐藏下载按钮
.t-image-viewer__utils-content {
  .t-image-viewer__modal-icon:nth-child(7) {
    display: none!important;
  }
}
.t-image-viewer-preview-image .t-image-viewer__header-box:hover, .t-image-viewer-preview-image .t-image-viewer__header-box.t-is-active {
  border:3px solid var(--td-brand-color) !important;
}
.t-image-viewer__header-prev {
  &::before {
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.4) 0%,    /* 起始色：完全等同于你的深色背景色 */
      rgba(0, 0, 0, 0) 100%     /* 结束色：同色系，全透明 */
    ) !important;
  }
  &::after {
    background-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0) 100%
    ) !important;
  }
}
// .t-image-viewer__utils-content {
//   background: var(--td-brand-color) !important;
//   .t-image-viewer__modal-icon {
//     background: var(--td-brand-color-1) !important;
//     svg {
//       color: var(--td-brand-color-1) !important;
//     }
//   }
// }
</style>
