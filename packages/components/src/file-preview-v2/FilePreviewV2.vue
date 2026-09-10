<template>
  <div class="file-preview">
    <template v-if="!isEmpty">
      <template v-if="showOnlyImages">
        <t-image-viewer
          v-for="(img, index) in previewImages"
          :key="img"
          :default-index="index"
          :images="previewImages"
          :z-index="10000"
          @IndexChange="handleChange"
        >
          <template #trigger="{ open }">
            <div
              class="imgbox"
              v-if="single && index === 0"
              :style="{ width: width, height: height }"
              @click="openpreviewTask(index,open)"
            > 
              <cb-image-secret :temp-url="img" class="w-full h-full" />
              <!-- <img alt="test" :src="img" class="img" /> -->
              <div class="imgnum">+{{ previewImages?.length }}</div>
            </div>
            <div
              v-else-if="!single"
              class="tdesign-demo-image-viewer__ui-image tdesign-demo-image-viewer__base"
            >
              <!-- <img
                alt="test"
                :src="img"
                class="tdesign-demo-image-viewer__ui-image--img"
              /> -->
              <cb-image-secret :temp-url="img" class="w-full h-full" />
              <div
                class="tdesign-demo-image-viewer__ui-image--hover relative"
                @click="openpreviewTask(index,open)"
              >
                <span>
                  <cb-icon name="fangda" size="16px"></cb-icon>
                  预览</span
                >
                <span class="absolute" style="top:0;right: 0;" @click.stop="deleteImage(index)">
                  <cb-icon name="guanbi" size="16px"></cb-icon>
                  </span>
              </div>
            </div>
          </template>
        </t-image-viewer>
      </template>
      <template v-else>
        <div
          class="text-[var(--td-brand-color)]"
          style="cursor: pointer"
          @click="openpreview"
        >
          <template v-if="$slots.trigger">
            <slot name="trigger"></slot>
          </template>
          <template v-else>
            <cb-icon
              name="fujian"
              color="var(--td-brand-color)"
              class="cursor-pointer"
              size="16px"
              style="margin-right: 8px"
            ></cb-icon>
            附件 x{{ previewImages.length }}
          </template>
        </div>
      </template>
    </template>
    <slot v-else name="empty"> <t-empty /> </slot>
    <CbFilepreview
      v-if="previewImages?.length > 0 && !showOnlyImages"
      v-model:dialogVisible="dialogVisible"
      :fileList="previewImages"
    ></CbFilepreview>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'CbFilePreviewV2',
})
import { useFilePreview } from './hooks/index'
// Props 定义
interface Props {
  /** 图片列表：纯 URL 字符串，或附件模式（showOnlyImages=false）下的 { url, name?, fileName? } 对象 */
  imageNames: Array<string | { url: string; name?: string; fileName?: string }>
  showOnlyImages?: boolean
  single?: boolean
  width?: string
  height?: string
  isShowDeleteIcon?: boolean
}
const emit = defineEmits(['deleteImage'])
const props = withDefaults(defineProps<Props>(), {
  showOnlyImages: true,
  single: false,
  width: '56px',
  height: '56px',
  isShowDeleteIcon: false,
})
const deleteImage = (index: number) => {
  emit('deleteImage', index)
}
// 使用图片预览 Hook
const {
  previewImages,
  isEmpty,
  dialogVisible,
  openpreview,
  openpreviewTask,
  handleChange,
} = useFilePreview(props)
</script>
<style lang="scss" scoped>
.file-preview {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .fileView_body {
    z-index: 4001;
  }
}
.tdesign-demo-image-viewer__ui-image {
  width: 100%;
  height: 100%;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
}
.tdesign-demo-image-viewer__ui-image--hover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}
.tdesign-demo-image-viewer__ui-image:hover
  .tdesign-demo-image-viewer__ui-image--hover {
  opacity: 1;
  cursor: pointer;
}
.tdesign-demo-image-viewer__ui-image--img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
}
.tdesign-demo-image-viewer__ui-image--footer {
  padding: 0 16px;
  height: 56px;
  width: 100%;
  line-height: 56px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  display: flex;
  box-sizing: border-box;
}
.tdesign-demo-image-viewer__ui-image--title {
  flex: 1;
}
.tdesign-demo-popup__reference {
  margin-left: 16px;
}
.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
  cursor: pointer;
}
.tdesign-demo-image-viewer__base {
  width: 100px !important;
  height: 100px !important;
  margin: 10px !important;
  border: 4px solid var(--td-bg-color-secondarycontainer) !important;
  border-radius: var(--td-radius-medium) !important;
}
.imgbox {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  .img {
    // width: auto;
    // height: auto;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  .imgnum {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 12px;
    border-radius: 2px;
  }
}
</style>
