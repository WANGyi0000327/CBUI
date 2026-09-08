---
title: CommonDialog 通用弹窗
---

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const open = () => {
  visible.value = true
}
const handleClose = () => {
  visible.value = false
}
const handleConfirm = () => {
  visible.value = false
}

// demo2：自定义样式弹窗
const visible2 = ref(false)
</script>

# CommonDialog 通用弹窗

二次封装 **TDesign Dialog** 的通用弹窗：标题/内容/底部按钮插槽、取消/确定按钮（含 loading）、遮罩与键盘关闭配置、主题与边框样式（顶部线条 / 品牌色头部）。`visible` 由父组件控制，关闭/确定通过回调 prop 通知父组件更新状态。

> 组件注册名为 **`CommonDialog`**（用户指定，非 Cb 前缀）。

## 基础用法

<DemoBlock>
  <div style="display: flex; gap: 12px; align-items: center;">
    <t-button theme="primary" @click="open">打开弹窗</t-button>
    <CommonDialog
      :visible="visible"
      title="确认操作"
      :close="handleClose"
      :confirm="handleConfirm"
    >
      <template #body>确定要执行此操作吗？</template>
    </CommonDialog>
  </div>

<template #code>

```vue
<template>
  <t-button theme="primary" @click="open">打开弹窗</t-button>
  <CommonDialog
    :visible="visible"
    title="确认操作"
    :close="handleClose"
    :confirm="handleConfirm"
  >
    <template #body>确定要执行此操作吗？</template>
  </CommonDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const open = () => {
  visible.value = true
}
const handleClose = () => {
  visible.value = false
}
const handleConfirm = () => {
  visible.value = false
}
</script>
```

</template>
</DemoBlock>

## 无底部 / 自定义内容

<DemoBlock>
  <div style="display: flex; gap: 12px; align-items: center;">
    <t-button theme="default" @click="visible2 = true">打开自定义样式弹窗</t-button>
    <CommonDialog
      :visible="visible2"
      title="自定义样式"
      :showfooter="false"
      custom-border
      width="480"
      :close="() => (visible2 = false)"
    >
      <template #body>
        <div style="text-align: center; color: #666; padding: 24px 0;">
          顶部品牌色线条 + 无底部按钮
        </div>
      </template>
    </CommonDialog>
  </div>

<template #code>

```vue
<template>
  <t-button theme="default" @click="visible2 = true">打开自定义样式弹窗</t-button>
  <CommonDialog
    :visible="visible2"
    title="自定义样式"
    :showfooter="false"
    custom-border
    width="480"
    :close="() => (visible2 = false)"
  >
    <template #body>顶部品牌色线条 + 无底部按钮</template>
  </CommonDialog>
</template>
```

</template>
</DemoBlock>

## 说明

- `visible` 为**必传 prop**（父组件控制）；关闭/确定后由 `close` / `confirm` 回调通知父组件更新状态
- `showheader` / `showfooter` 控制头部/底部插槽显隐（默认 true）
- `closeBtn` / `confirmBtn` 控制底部默认按钮显隐，`loading` 控制确定按钮加载态
- `customBorder` 顶部品牌色线条；`bgBorder` 头部品牌色背景
- 取消按钮样式引用 `AlphaBgColor()`（原实现位于业务包 `@repo/tdesign-ui`，已落地为库内工具 `#/utils/alphaBgColor`：读取 `--td-brand-color` 主题色转透明背景，SSR 安全；`theme="cb-brand-gray"` 为业务自定义 TDesign 主题，需业务侧注册主题才生效）

## API

### Props（继承 TDesign DialogProps，以下为常用）

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 弹窗可见性（必传） | `boolean` | `false` |
| title | 弹窗标题 | `string` | `''` |
| width | 弹窗宽度 | `number \| string` | `600` |
| placement | 弹窗位置 | `'center' \| 'top' \| 'left' \| 'right' \| 'bottom'` | `'center'` |
| closeBtnText / confirmBtnText | 按钮文本 | `string` | `'取消' / '确定'` |
| loading | 确定按钮加载中 | `boolean` | `false` |
| closeBtn / confirmBtn | 是否显示取消/确定按钮 | `boolean` | `true` |
| showheader / showfooter | 是否显示头部/底部 | `boolean` | `true` |
| closeOnOverlayClick | 点击遮罩关闭 | `boolean` | `false` |
| closeOnEscKeydown | ESC 关闭 | `boolean` | `true` |
| showOverlay | 显示遮罩 | `boolean` | `true` |
| destroyOnClose | 关闭时销毁 DOM | `boolean` | `false` |
| customBorder / bgBorder | 顶部线条 / 头部品牌色背景 | `boolean` | `false` |
| close / confirm | 关闭/确定回调 | `() => void` | `() => {}` |
| open / beforeOpen / onBeforeClose | 生命周期回调 | `() => void` | `-` |
| draggable | 是否支持拖拽 | `boolean` | `false` |
| attach / dialogCloseBtn / zIndex / theme | 挂载点 / 关闭按钮 / 层级 / 主题 | 见 TDesign | - |

### Slots

| 插槽 | 说明 |
| --- | --- |
| header | 头部（默认渲染 `title`） |
| body | 内容 |
| footer | 底部（默认渲染取消/确定按钮） |
