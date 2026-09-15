<template>
  <div>
    <t-dialog
      :visible="visible"
      :show-header="showheader"
      :show-footer="showfooter"
      :width="width"
      :placement="placement"
      :close-on-esc-keydown="closeOnEscKeydown"
      :close-on-overlay-click="closeOnOverlayClick"
      :on-confirm="confirm"
      :on-close="close"
      :on-opened="open"
      :on-before-open="beforeOpen"
      :show-overlay="showOverlay"
      :top="top"
      :destroy-on-close="destroyOnClose"
      :theme="theme"
      :class="{ 'custom-border': customBorder, 'bg-border': bgBorder }"
      :attach="attach"
      :close-btn="dialogCloseBtn"
      :on-before-close="onBeforeClose"
      :z-index="zIndex"
      :draggable="draggable"
    >
      <template v-if="showheader" #header>
        <slot name="header">{{ title }}</slot>
      </template>
      <template #body>
        <slot name="body"></slot>
      </template>
      <template v-if="showfooter" #footer>
        <slot name="footer">
          <t-button
            v-if="closeBtn"
            theme="cb-brand-gray"
            :style="{ background: AlphaBgColor(), color: '#666666' }"
            @click="close"
            >{{ closeBtnText }}</t-button
          >
          <t-button v-if="confirmBtn" class="!w-[72px]" :loading="loading" @click="confirm">
            {{ confirmBtnText }}
          </t-button>
        </slot>
        <!-- <div class="flex justify-between items-center">
          <div>
            <slot name="footer-left"></slot>
          </div>
          <div>
          </div>
        </div> -->
      </template>
    </t-dialog>
  </div>
</template>
<script setup lang="tsx">
defineOptions({
  name: 'CommonDialog',
})
import type { DialogProps } from 'tdesign-vue-next'
// AlphaBgColor 原实现位于业务包 @repo/tdesign-ui（库内不存在），
// 已落地为库内工具 #/utils/alphaBgColor（SSR 安全 + hex 兜底）。
import { AlphaBgColor } from '#/utils/alphaBgColor'
interface BaseDialogProps extends Omit<
  DialogProps,
  'title' | 'showHeader' | 'showFooter' | 'visible' | 'confirmBtn'
> {
  placement?: DialogProps['placement'] /** 弹窗位置（可选，默认为 'center'） */
  closeBtnText?: string /** 取消按钮文本（可选，默认为 '取消'） */
  confirmBtnText?: string /** 确定按钮文本（可选，默认为 '确定'） */
  loading?: boolean /** 按钮是否加载中（可选，默认为 false） */
  visible: boolean /** 弹窗可见性（必传，由父组件控制） */
  title?: string /** 弹窗标题 */
  width?: number | string /** 弹窗宽度（支持数字/字符串，如 500、'80%'） */
  draggable?: boolean /** 是否支持拖拽（默认 false） */
  close?: () => void /** 关闭弹窗的回调（可选，父组件需处理 visible 状态） */
  showheader?: boolean // 自定义头部显示与否（可选，默认为 true）
  showfooter?: boolean // 自定义底部显示与否（可选，默认为 true）
  closeOnOverlayClick?: boolean // 点击遮罩层是否关闭弹窗（可选，默认为 true）
  closeOnEscKeydown?: boolean // 点击 ESC 键是否关闭弹窗（可选，默认为 true）
  showOverlay?: boolean // 是否显示遮罩层（可选，默认为 true）
  confirm?: () => void // 确定按钮的回调（可选，父组件需处理 visible 状态）
  open?: () => void // 弹窗打开时的回调（可选）
  beforeOpen?: () => void // 弹窗打开前的回调（可选）
  confirmBtn?: boolean // 是否显示确定按钮（可选，默认为 true）
  closeBtn?: boolean // 是否显示取消按钮（可选，默认为 true）
  customBorder?: boolean // 顶部线条样式
  bgBorder?: boolean // 背景线条样式
  theme?: DialogProps['theme'] // 弹窗主题
  destroyOnClose?: boolean // 关闭弹窗时是否销毁 DOM 元素（可选，默认为 false）
  attach?: string // 弹窗挂载元素
  dialogCloseBtn?: boolean
  onBeforeClose?: () => void // 弹窗关闭前的回调（可选）
  zIndex?: number
}
// Props 默认值
withDefaults(defineProps<BaseDialogProps>(), {
  closeBtnText: '取消',
  confirmBtnText: '确定',
  loading: false,
  visible: false,
  title: '',
  width: 600,
  draggable: false,
  close: () => {},
  open: () => {},
  showheader: true,
  showfooter: true,
  closeOnOverlayClick: false,
  closeOnEscKeydown: true,
  showOverlay: true,
  confirm: () => {},
  customBorder: false,
  bgBorder: false,
  theme: 'default',
  destroyOnClose: false,
  placement: () => 'center',
  confirmBtn: true,
  closeBtn: true,
  attach: '',
  dialogCloseBtn: true,
})
</script>
<style scoped lang="scss">
//默认标题样式
:deep(.t-dialog__header-content) {
  font-size: 18px;
  color: #333333;
}
:deep(.t-dialog__close) {
  color: #333333;
}
// 默认内容样式
.dialog-default-content {
  padding: 24px 0;
  color: #666;
  text-align: center;
  line-height: 1.5;
}
// 底部按钮样式
.dialog-footer-buttons {
  width: 100%;
  justify-content: flex-end; // 按钮靠右对齐
  gap: 8px; // 按钮间距
}
// 适配 TDesign 样式（可选，根据需求调整）
:deep(.t-dialog__body),
:deep(.t-dialog__body__icon) {
  padding: 10px 20px 24px 24px;
}
:deep(.custom-border .t-dialog) {
  border-radius: 2px;
  border-top: 4px solid var(--td-brand-color);
}
:deep(.t-dialog--default) {
  padding: 0;
}
:deep(.t-dialog__header) {
  padding: 16px 24px 16px 24px;
}
:deep(.bg-border .t-dialog__header) {
  width: 100%;
  padding: 16px 24px 16px 24px;
  background-color: var(--td-brand-color);
  border-radius: 5px 5px 0 0;
  color: #333333;
}
:deep(.t-dialog__footer) {
  padding: 16px 24px;
}
:deep(.t-dialog) {
  border: 0;
}
</style>
