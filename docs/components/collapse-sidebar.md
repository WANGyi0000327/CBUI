---
title: CbCollapseSidebar 可折叠侧边栏
---

<script setup>
import { ref } from 'vue'

const width = ref(274)
</script>

# CbCollapseSidebar 可折叠侧边栏

可折叠/可拖拽宽度侧边栏容器：内容区自动撑满剩余宽度，侧边折叠按钮（左/右均可），支持拖拽调整宽度（`min/max` 限制）并同步 `v-model:width`。适用于后台布局的菜单栏 / 详情面板等场景。

## 基础用法（可折叠）

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); height: 220px; border-radius: 4px; overflow: hidden;">
    <div style="display: flex; height: 100%;">
      <CbCollapseSidebar style="flex-shrink: 0; height: 100%;">
        <div style="padding: 16px; width: 240px; color: #666; font-size: 13px;">左侧菜单内容</div>
      </CbCollapseSidebar>
      <div style="flex: 1; padding: 16px; color: #999; font-size: 13px;">内容区域</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div style="display: flex; height: 220px;">
    <!-- 注意：不要给组件设置固定 width，宽度由内容撑开，收起（width: 0）才生效 -->
    <CbCollapseSidebar style="flex-shrink: 0; height: 100%;">
      <div style="padding: 16px; width: 240px;">左侧菜单内容</div>
    </CbCollapseSidebar>
    <div style="flex: 1; padding: 16px;">内容区域</div>
  </div>
</template>
```

</template>
</DemoBlock>

## 可拖拽宽度 + 品牌主题

`resizable` 开启后：拖动右侧分割线调整宽度（`minWidth`~`maxWidth`），点击折叠按钮收起/展开并同步 `v-model:width`。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); height: 220px; border-radius: 4px; overflow: hidden;">
    <div style="display: flex; height: 100%;">
      <CbCollapseSidebar
        v-model:width="width"
        resizable
        theme="brand"
        :init-width="274"
        style="flex-shrink: 0; height: 100%;"
      >
        <div style="padding: 16px; color: #666; font-size: 13px;">可拖拽侧边栏</div>
      </CbCollapseSidebar>
      <div style="flex: 1; padding: 16px; color: #999; font-size: 13px;">
        内容区域（当前宽度：{{ width }}px）
      </div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div style="display: flex; height: 220px;">
    <CbCollapseSidebar v-model:width="width" resizable theme="brand" :init-width="274">
      <div style="padding: 16px;">可拖拽侧边栏</div>
    </CbCollapseSidebar>
    <div style="flex: 1;">内容区域（当前宽度：{{ width }}px）</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const width = ref(274)
</script>
```

</template>
</DemoBlock>

## 右侧栏

`side="right"`：折叠按钮与分割线在组件**左侧**外缘，组件需放在布局容器**右侧**（外层 flex 顺序中位于内容区之后）。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); height: 220px; border-radius: 4px; overflow: hidden;">
    <div style="display: flex; height: 100%;">
      <div style="flex: 1; padding: 16px; color: #999; font-size: 13px;">内容区域</div>
      <CbCollapseSidebar side="right" resizable :init-width="240" style="flex-shrink: 0; height: 100%;">
        <div style="padding: 16px; width: 210px; color: #666; font-size: 13px;">右侧面板内容</div>
      </CbCollapseSidebar>
    </div>
  </div>

<template #code>

```vue
<template>
  <div style="display: flex; height: 220px;">
    <!-- side="right" 需放在布局容器右侧（flex 顺序在后） -->
    <div style="flex: 1; padding: 16px;">内容区域</div>
    <CbCollapseSidebar side="right" resizable :init-width="240">
      <div style="padding: 16px; width: 210px;">右侧面板内容</div>
    </CbCollapseSidebar>
  </div>
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性          | 说明                                        | 类型                 | 默认值    |
| ------------- | ------------------------------------------- | -------------------- | --------- |
| side          | 侧边栏位置                                  | `'left' \| 'right'`  | `'left'`  |
| theme         | 主题：`light` 默认 / `brand` 品牌色折叠按钮 | `'light' \| 'brand'` | `'light'` |
| resizable     | 是否可拖拽调整宽度                          | `boolean`            | `false`   |
| initWidth     | 初始宽度（收起后展开恢复该值）              | `number`             | `274`     |
| minWidth      | 最小宽度（拖拽）                            | `number`             | `200`     |
| maxWidth      | 最大宽度（拖拽）                            | `number`             | `600`     |
| v-model:width | 当前宽度                                    | `number`             | `-`       |

### Slots

| 插槽    | 说明       |
| ------- | ---------- |
| default | 侧边栏内容 |
