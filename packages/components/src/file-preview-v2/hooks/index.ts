// composables/useImagePreview.ts
import { ref, computed, watch } from 'vue'
import { serviceManager } from '#/config/api'
// import { getTempAccessUrlMap } from "@/api/system/index";
/** 附件项：纯 URL 字符串，或附件模式（showOnlyImages=false）下的对象 */
export type FilePreviewImageName =
  | string
  | { url: string; name?: string; fileName?: string }
export function useFilePreview(props: {
  imageNames: Array<FilePreviewImageName>
  showOnlyImages: boolean
}) {
  const imageList = ref<string[]>([])
  const loading = ref(false)
  const previewUrl = ref('')
  // 计算属性：预览图片列表
  const previewImages = computed(() => imageList.value)
  // 数据加载状态
  const isEmpty = computed(() => !loading.value && imageList.value.length === 0)
  /**
   * 获取图片数据
   */
  const fetchImages = async (names: Array<FilePreviewImageName>) => {
    // 前置条件检查
    if (loading.value || !names?.length) {
      imageList.value = []
      return
    }
    loading.value = true
    // 准备参数
    const params = props.showOnlyImages
      ? names
      : names.map((item: any) => item.url)
    try {
      //   const res: any = await getTempAccessUrlMap(params);
      const res: any = {}
      if (!res) {
        imageList.value = []
        return
      }
      // 处理响应数据
      imageList.value = props.showOnlyImages
        ? names.map((name) => res[name as string] || '')
        : names.map((item: any) => ({
            ...item,
            url: res[item.url] ?? item.url, // 使用空值合并运算符
          }))
      console.log('🦄-----imageList.value-----', imageList.value)
    } catch (error) {
      console.error('获取图片数据失败:', error)
      imageList.value = []
    } finally {
      loading.value = false
    }
    loading.value = false
  }
  // 根据URL后缀判断文件类型
  const getFileType = (url: string, getType = false): string => {
    console.log('🌵-----url-----', url)
    if (!url) return ''
    if (url.indexOf('urlId=') > -1) {
      return 'html'
    }
    // const fileExt = url.split('.').pop()?.toLowerCase() || ''
    const fileExt =
      url?.split(/[?#]/)[0]?.split('.').pop()?.trim().toLowerCase() || ''
    if (getType) {
      return fileExt
    }
    switch (fileExt) {
      // 音频
      case 'mp3':
        return 'audio'
      case 'mp4':
        return 'video'
      case 'pdf':
        return 'pdf'
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image'
      case 'html':
        return 'html'
      default:
        return ''
    }
  }
  // 监听图片名称变化
  watch(
    () => [...(props.imageNames || [])],
    (newNames) => {
      //   fetchImages(newNames);
      imageList.value = newNames as string[]
    },
    { immediate: true, deep: true }
  )
  const dialogVisible = ref(false)
  const fileList = ref([])
  const isHttpUrl = (url: string): boolean => {
    return url.startsWith('http')
  }
  const handleChange = async (index: number) => {
    console.log('🚀 ~ handleChange ~ index:', index)
    const url: any = previewImages.value[index]
    await getImageUrl(url)
    previewImages.value[index] = previewUrl.value
  }
  const http = serviceManager.getHttp()
  const getImageUrl = async (url: string) => {
    try {
      if (isHttpUrl(url)) {
        previewUrl.value = url
      } else {
        previewUrl.value = await http.getFileTempUrl(url)
      }
      console.log('🚀 ~ getImageUrl ~ urls:', previewUrl.value)
      // 预加载图片
      // await preloadImage(url.value)
    } catch {
      // 忽略获取临时 URL 的异常，保持原逻辑
    } finally {
      // 无清理逻辑，保留空块语义
    }
  }
  const openpreviewTask = async (index: number, open: any) => {
    const url: any = previewImages.value[index]
    console.log('🚀 ~ openpreviewTask ~ url:', url)
    await getImageUrl(url)
    previewImages.value[index] = previewUrl.value
    // dialogVisible.value = true
    open(index)
    console.log(
      '🚀 ~ openpreviewTask ~ urls:',
      previewImages.value,
      dialogVisible.value
    )
  }
  const openpreview = () => {
    console.log('🦄-----previewImages.value-----', previewImages.value)
    // 检查是否有支持的类型
    const hasSupportedType = previewImages.value.some((item: any) => {
      // 根据模式确定如何获取URL
      const url = props.showOnlyImages ? item : item.url || item
      const type = getFileType(url)
      return type && ['audio', 'video', 'pdf', 'image', 'html'].includes(type)
    })
    if (hasSupportedType) {
      dialogVisible.value = true
    } else {
      console.log('没有支持预览的文件类型')
    }
  }
  return {
    fileList,
    dialogVisible,
    openpreview,
    openpreviewTask,
    previewImages,
    loading,
    handleChange,
    isEmpty,
  }
}
