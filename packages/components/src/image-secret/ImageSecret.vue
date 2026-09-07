<template>
  <div class="custom-image">
    <img
      v-if="!loading"
      :src="url"
      v-bind="$attrs" />
    <!-- <t-loading v-if="loading" />
    <div v-if="loadError" class="error">图片加载失败</div> -->
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'CbImageSecret',
})

import { ref, watch } from 'vue'
import { serviceManager } from '#/config/api'

const props = defineProps({
  tempUrl: {
    type: String,
    required: true,
  },
})

const url = ref<string>('')

const loading = ref(false)

const http = serviceManager.getHttp()

const loadError = ref(false)

// const preloadImage = (src: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image()
//     img.onload = () => resolve()
//     img.onerror = () => reject(new Error('图片加载失败'))
//     img.src = src
//   })
// }

const isHttpUrl = (url: string): boolean => {
  return url.startsWith('http')
}

const getImageUrl = async () => {
  try {
    loading.value = true
    loadError.value = false
    if (isHttpUrl(props.tempUrl)) {
      url.value = props.tempUrl
    } else {
      url.value = await http.getFileTempUrl(props.tempUrl)
    }

    // 预加载图片
    // await preloadImage(url.value)
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => props.tempUrl,
  () => {
    props.tempUrl && getImageUrl()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
  .custom-image {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-6);
  }
</style>
