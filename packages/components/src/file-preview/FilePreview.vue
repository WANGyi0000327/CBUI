<!--
 * @Description: 预览视频、pdf、图片等文件
-->
<template>
  <t-dialog
    v-model:visible="dialogVisible"
    :destroy-on-close="true"
    class="cb-file-preview-dialog"
    placement="center"
    :footer="false"
    :header="false"
    :close-btn="false"
    :width="'95vw'"
    :z-index="4000"
  >
    <div class="fileView_body" @contextmenu="handleContextMenu">
      <div class="header">
        <div>{{ title || "" }}</div>
        <div class="close" @click="close">
          <cb-icon name="guanbi" color="#666666" size="26px"></cb-icon>
        </div>
      </div>
      <div class="content">
        <div v-if="fileList.length > 1" class="file-view-dialog-tab">
          <!-- 文件展列区域 -->
          <div
            v-for="item in fileList"
            :key="item.url"
            :class="{ 'fvd-tab-item': true, border_color: taburl === item.url }"
            @click="handleClick(item.url, item.name, item.fileName)"
          >
            <img :src="getTopPic(item.url)" alt="" />
            <div
              class="fvd-tab-item-name"
              :title="item.fileName || getName(item.url)"
            >
              <div class="textname">
                {{ item.fileName || getName(item.url) }}
              </div>
            </div>
          </div>
        </div>
        <div :class="{ Exhibit: true, Exhibit_w: fileList.length <= 1 }">
          <!-- 视频预览区域 -->
          <!-- <video-player :playsinline="true" :options="playerOptions" v-if="fileType === 'video'">
                </video-player> -->
          <!-- 图片预览区域 -->
          <!-- <imgage :imgUrl="imgUrl" v-else-if="fileType === 'image'"></imgage> -->
          <!-- pdf预览区域 -->
          <!-- <pdf-viewer v-else-if="fileType === 'pdf'" :pdfUrl="pdfUrl" :key="pdfUrl"></pdf-viewer> -->
          <!-- html预览区域 -->
          <!-- <div class="fvdc-html" v-else-if="fileType === 'html'">
                    <iframe :src="h5Url" frameborder="0" width="100%" height="100%"></iframe>
                </div> -->
          <PdfViewer v-if="fileType === 'pdf'" :pdf-url="pdfUrl"></PdfViewer>
          <imgage v-else-if="fileType === 'image'" :img-url="imgUrl"></imgage>
          <CbAudio v-else-if="fileType === 'audio'" :src="audioUrl"></CbAudio>
          <CbVideo v-else-if="fileType === 'video'" :src="videoUrl"></CbVideo>
          <div v-else class="no-support">
            <p>抱歉，当前文件类型暂不支持在线预览</p>
            <t-button
              block
              theme="primary"
              variant="base"
              class="w-[100px]!"
              @click="download()"
            >
              <template #icon>
                <cb-icon
                  style="
                    font-size: 18px !important;
                    margin-right: 4px !important;
                  "
                  name="xiazai"
                />
              </template>
              <p>点击下载</p>
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </t-dialog>
</template>
<script setup lang="tsx">
defineOptions({
  name: 'CbFilepreview',
})
import { ref, onMounted, watch, nextTick } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
// 业务源码引用 ../../assets/images/*.png（业务目录在 src/components/fileViewDialog 下），
// 组件库 file-preview 位于 src/ 下，层级少一层，改为 ../assets/images/*.svg（png 二进制资源未随源码提供）
import pdfimg from '../assets/images/pdf.png'
import videoimg from '../assets/images/video.svg'
import picimg from '../assets/images/pic.svg'
import audioimg from '../assets/images/audio.svg'
import fileimg from '../assets/images/file.svg'
import PdfViewer from './components/PdfViewer.vue'
import imgage from './components/imgage.vue'
import CbAudio from './components/Audio.vue'
import CbVideo from './components/CbVideo.vue'
// downloadFileBySaveAs 原实现位于业务包 @repo/tdesign-ui（库内不存在），落地为库内工具 #/utils/useDownLoad
import { downloadFileBySaveAs } from '#/utils/useDownLoad'
const dialogVisible = defineModel('dialogVisible', {
  type: Boolean,
  default: false,
})
// 导入组件
// import PdfViewer from './PdfViewer.vue';
//   import Imgage from './imgage.vue';
//   import { getVideoConfig } from './config';
// 类型定义
interface FileItem {
  url: string
  name?: string
  fileName?: string
  profitImg?: string | null
}
interface Props {
  nowUrl?: string
  nowname?: string
  fileName?: string
  fileList: FileItem[]
}
const props = withDefaults(defineProps<Props>(), {
  nowUrl: '',
  nowname: '',
  fileName: '',
  fileList: () => [],
})
// 定义emit
// const emit = defineEmits(['close']);
// 响应式状态
// const playerOptions = ref({});// 视频配置信息
const fileType = ref('')
const imgUrl = ref('')
const pdfUrl = ref('')
const h5Url = ref('')
const title = ref('')
const taburl = ref('')
// 音频
const audioUrl = ref('')
// 视频
const videoUrl = ref('')
const otherUrl = ref('')
//   const videoUrl = ref('');
// const dialogVisible = ref(false)
//下载文件
const download = async () => {
  downloadFileBySaveAs(otherUrl.value, title.value ? title.value : '文件')
}
// 生命周期：替代created
onMounted(() => {
  // if (props.fileList.length > 0) {
  //   nextTick(() => {
  //     const openUrl = props.nowUrl || props.fileList[0].url
  //     const openname = props.nowname || props.fileList[0].name || ''
  //     const openfileName = props.fileName || props.fileList[0].fileName || ''
  //     setView(openUrl, openname, openfileName)
  //     dialogVisible.value = true
  //   })
  // }
})
watch(
  () => dialogVisible.value,
  (newVal) => {
    console.log('🚀 ~ newVal:', newVal)
    if (newVal) {
      nextTick(() => {
        const openUrl =
          props.nowUrl || (props.fileList[0] && props.fileList[0].url) || ''
        const openname = props.nowname || props.fileList[0]?.name || ''
        const openfileName = props.fileName || props.fileList[0]?.fileName || ''
        setView(openUrl, openname, openfileName)
        dialogVisible.value = true
      })
    }
  }
)
// 方法定义
// 禁用鼠标右键
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
}
/**
 * 获取文件顶部图标
 * 根据文件URL或自定义图片URL返回对应的文件类型图标
 *
 * @param url - 文件URL，用于判断文件类型
 * @param profitImg - 可选的自定义图片路径，优先级高于自动判断
 * @returns {string} 返回对应的图片URL，如果没有匹配类型则返回空字符串
 */
const getTopPic = (url: string) => {
  const type = getFileType(url)
  console.log('🐠-----type-----', type, url)
  switch (type) {
    case 'audio':
      return audioimg
    case 'video':
      return videoimg
    case 'pdf':
      return pdfimg
    case 'image':
      return picimg
    case 'html':
      return picimg
    default:
      return fileimg
  }
}
// 打开预览（暴露给外部调用）
const open = () => {
  if (props.fileList.length > 0) {
    const openUrl = props.nowUrl || props.fileList[0]?.url
    const openname = props.nowname || props.fileList[0]?.name || ''
    const openfileName = props.fileName || props.fileList[0]?.fileName || ''
    setView(openUrl || '', openname || '', openfileName || '')
    dialogVisible.value = true
  }
}
// 关闭预览
const close = () => {
  dialogVisible.value = false
  // 调用Vuex mutation
}
// 切换文件标签
const handleClick = (url: string, name?: string, fileName?: string) => {
  setView(url, name || '', fileName || '')
}
// 设置文件预览
const setView = (url: string, _name: string, fileName: string) => {
  // 处理文件URL前缀
  if (url.indexOf('urlId=') === -1) {
    // url = ''
  }
  const type = getFileType(url)
  console.log(type, '------------')
  fileType.value = type
  title.value = fileName
  taburl.value = url
  switch (type) {
    case 'video':
      videoUrl.value = url
      break
    case 'audio':
      audioUrl.value = url
      break
    case 'image':
      imgUrl.value = url
      break
    case 'pdf':
      pdfUrl.value = url
      break
    case 'html':
      h5Url.value = url
      break
    default:
      otherUrl.value = url
      console.log(`${url} 暂不支持该文件类型预览`)
      MessagePlugin.warning('暂不支持该文件类型预览')
  }
}
// 从URL提取文件名
const getName = (url: string) => {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  return lastPart
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
// 暴露open方法给父组件调用
defineExpose({
  open,
})
</script>
<style lang="scss">
 .t-dialog__ctx.cb-file-preview-dialog{
  .t-dialog{
    padding: 0 16px 24px!important;
    .t-dialog__body{
      padding: 0!important;
    }
    
  }
}
 
</style>
<style lang="scss" scoped>
.fileView_body {
  width: 100%;
  height: 88vh;
  background-color: #fff;
  padding: 0 10px 0px 10px;
  box-sizing: border-box;
  .header {
    width: 100%;
    height: 75px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666666;
    font-family: "PingFang SC";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    .close {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      padding-right: 15px;
      cursor: pointer;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 75px);
    box-sizing: border-box;
    background-color: #f6f6f6;
    display: flex;
    .Exhibit {
      width: calc(100% - 300px);
      height:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: auto;
      position: relative;
      .fvdc-image {
        width: 100%;
      }
      .fvdc-html {
        height: 100%;
        width: 750px;
        overflow: hidden;
        margin: 0 auto;
      }
      .video-player {
        height: 90%;
        width: 100%;
        position: absolute;
        top: 0;
      }
      ::v-deep(.vjs-big-play-button) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      ::v-deep(.vjs-fluid) {
        padding-top: 53.25%;
      }
    }
    .Exhibit_w {
      width: 100%;
    }
  }
}
.file-view-dialog {
  overflow: auto;
  display: flex;
  align-items: flex-start;
  padding: 10px 20px 20px;
  justify-content: space-between;
  height: 679px;
  &-tab {
    overflow: auto;
    padding: 15px 10px;
    border-radius: 4px 0 0 4px;
    border: 1px solid #d9d9d9;
    background: #f6f8fa;
    height: 100%;
    width: 300px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    .fvd-tab-item {
      width: 213px;
      cursor: pointer;
      box-sizing: border-box;
      margin-bottom: 15px;
      background-color: #fff;
      border: 1px solid red;
      &-name {
        border: 1px solid #e6e6e6;
        border-top: none;
        border-radius: 0 0 4px 4px;
        padding: 10px;
        .textname {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      img {
        border-radius: 4px;
        width: 100%;
        height: 100px;
        vertical-align: bottom;
      }
    }
    .border_color {
      border: 1px solid #268aff;
      border-radius: 4px;
      box-shadow: #268aff 0px 1px 3px;
    }
  }
}
.no-support {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
::v-deep(.vjs-current-time) {
  display: block !important;
  padding-right: 0;
}
::v-deep(.vjs-time-divider) {
  display: block !important;
}
::v-deep(.vjs-duration) {
  display: block !important;
  padding-left: 0;
}
// 适配Element Plus图标
.el-icon-close {
  font-size: 20px;
  color: #666;
  &:hover {
    color: #333;
  }
}
</style>
