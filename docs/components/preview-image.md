---
title: PreviewImage 图片预览
---

<script setup>
const previewImages = [
  'https://picsum.photos/seed/cbui1/400/300',
  'https://picsum.photos/seed/cbui2/400/300',
  'https://picsum.photos/seed/cbui3/400/300',
]
</script>

# PreviewImage 图片预览

基于 **TDesign `t-image-viewer`** 二次开发的图片预览组件：默认触发器展示第一张图片（右下角带放大图标），点击打开全屏预览（支持缩放、旋转、上一张/下一张）。

> 特性说明：
> - **默认触发器**：展示首图 + 右下角放大图标，尺寸通过 `width` / `height` / `maxHeight` 控制。
> - **自定义触发器**：通过 `trigger` 插槽完全替换默认触发器。
> - **下载处理**：阿里云 OSS 地址（含 `aliyuncs.com`）直接触发下载并提示成功；其他地址新窗口打开。
> - **方法暴露**：可通过 ref 调用 `open()` 主动打开预览。

## 基础用法

<DemoBlock>
  <CbPreviewImage :images="previewImages" />

<template #code>

```vue
<template>
  <CbPreviewImage :images="images" />
</template>

<script setup lang="ts">
const images = [
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
  'https://example.com/c.jpg',
]
</script>
```

</template>
</DemoBlock>

## 自定义触发器尺寸

<DemoBlock>
  <CbPreviewImage
    :images="previewImages"
    width="120px"
    height="90px"
  />

<template #code>

```vue
<template>
  <CbPreviewImage
    :images="images"
    width="120px"
    height="90px"
  />
</template>
```

</template>
</DemoBlock>

> 说明：触发器内部图片自适应（`width: 100%`），固定 `height` 时图片可能裁剪，配合 `maxHeight` 可做高度上限。

## 自定义触发器

通过 `trigger` 插槽替换默认触发器，**点击触发器任意位置即自动打开预览**（组件在外层统一拦截点击，无需手动绑定 `open`）：

<DemoBlock>
  <CbPreviewImage :images="previewImages">
    <template #trigger>
      <t-button theme="default" variant="outline">点击预览（3 张）</t-button>
    </template>
  </CbPreviewImage>

<template #code>

```vue
<template>
  <CbPreviewImage :images="images">
    <template #trigger>
      <t-button theme="default" variant="outline">点击预览</t-button>
    </template>
  </CbPreviewImage>
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| images | 预览图片地址列表（首图用于默认触发器） | `string[]` | - |
| width | 默认触发器宽度 | `string` | `'60px'` |
| height | 默认触发器高度 | `string` | `'auto'` |
| maxHeight | 默认触发器最大高度 | `string` | `'none'` |
| （其余属性） | 通过 `v-bind="$attrs"` 透传给 [TDesign ImageViewer](https://tdesign.tencent.com/vue-next/components/image-viewer)，如 `closeOnOverlayClick`、`mode` 等 | - | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| trigger | 预览触发器（默认：首图 + 放大图标） |

### Exposed（通过 ref 访问）

| 名称 | 说明 |
| --- | --- |
| open | 主动打开预览（从第一张开始） |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| download | 点击下载按钮时触发（处理 OSS 直下 / 新窗口逻辑） | `string` |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign，并保证 `CbIcon` 已注册（全量 `app.use(CBUI)` 即可）、iconfont 含 `fangda` 图标；
2. **下载策略**：含 `aliyuncs.com` 的地址走 `a.click()` 直接下载并弹出"下载成功"；其余地址设置 `target="_blank"` 新窗口打开；
3. **触发器点击**：TDesign 的 `trigger` 是作用域插槽（把 `open` 作为插槽参数传出，需业务手动绑定），且父组件插槽内容无法直接访问本组件的 `open`。组件在插槽外层加了点击容器统一拦截，因此**默认与自定义触发器均即点即开**；若自定义触发器内部还有独立点击行为，请用 `@click.stop` 阻止冒泡；
3. **样式覆盖**：组件带全局样式段覆盖 `t-image-viewer` 的预览布局（隐藏上一张/下一张切换按钮、调整工具条/页码位置等），引入组件时随 SFC 样式一并生效；
4. **调试残留**：`open()` 中保留了一行 `console.log('🚀 ~ open ~ currentIndex:', ...)` 调试输出，确认无需后可在业务侧删除。
