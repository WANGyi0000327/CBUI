---
title: PageLayout 页面布局容器
---

# PageLayout 页面布局容器

三段式页面布局容器：**header / content / footer** 三个具名插槽，content 区域自动撑满剩余高度，并通过 ResizeObserver 实时测量 content 高度暴露给父组件（可用于表格高度联动等场景）。

> 特性说明：
>
> - **三插槽布局**：`header`（顶部，两端对齐可换行）、`content`（弹性撑满）、`footer`（底部，右对齐）。
> - **content 高度测量**：基于 `@vueuse/core` 的 `useResizeObserver` 实时监听 content 尺寸，通过组件 ref 暴露 `contentHeight`。
> - **可见性兜底**：容器不可见时 `contentHeight` 返回 `0`；高度 ≤ 10px 时兜底返回 `100`。

## 基础用法

<DemoBlock>
  <CbPageLayout style="height: 260px; border: 1px dashed var(--td-border-level-2-color); border-radius: 6px;">
    <template #header>
      <div>页面标题 / 筛选区</div>
      <t-button theme="primary">操作按钮</t-button>
    </template>
    <template #content>
      <div style="height: 100%; background: var(--td-bg-color-container-hover); border-radius: 4px; display: flex; align-items: center; justify-content: center;">
        Content 区域（自适应撑满）
      </div>
    </template>
    <template #footer>
      <t-button theme="default">取消</t-button>
      <t-button theme="primary" style="margin-left: 8px;">确认</t-button>
    </template>
  </CbPageLayout>

<template #code>

```vue
<template>
  <CbPageLayout ref="layoutRef" style="height: 100%;">
    <template #header>
      <div>页面标题 / 筛选区</div>
      <t-button theme="primary">操作按钮</t-button>
    </template>
    <template #content>
      <!-- 业务内容，高度自动撑满 -->
    </template>
    <template #footer>
      <t-button theme="default">取消</t-button>
      <t-button theme="primary">确认</t-button>
    </template>
  </CbPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CbPageLayoutInstance } from '@cb-ui/components'

const layoutRef = ref<CbPageLayoutInstance>()
// 读取 content 高度（用于表格高度联动等）：
// layoutRef.value?.contentHeight.value
</script>
```

</template>
</DemoBlock>

## 获取 content 高度

通过 ref 获取 `contentHeight`（`ComputedRef<number>`），容器尺寸变化时自动更新：

<DemoBlock>
  <CbPageLayout
    style="height: 200px; border: 1px dashed var(--td-border-level-2-color); border-radius: 6px;"
  >
    <template #content>
      <div style="height: 100%; display: flex; align-items: center; justify-content: center; color: var(--td-text-color-secondary);">
        拖动窗口改变容器尺寸，content 高度实时更新
      </div>
    </template>
  </CbPageLayout>

<template #code>

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CbPageLayoutInstance } from '@cb-ui/components'

const layoutRef = ref<CbPageLayoutInstance>()

watch(
  () => layoutRef.value?.contentHeight.value,
  (h) => console.log('content 高度变化:', h)
)
</script>
```

</template>
</DemoBlock>

## API

### Slots

| 名称    | 说明                                                              |
| ------- | ----------------------------------------------------------------- |
| header  | 顶部区域（`v-if="$slots.header"` 存在时才渲染，两端对齐、可换行） |
| content | 内容区域（弹性撑满剩余高度）                                      |
| footer  | 底部区域（存在时才渲染，右对齐）                                  |

### Exposed（通过 ref 访问）

| 名称          | 说明                                                         | 类型                  |
| ------------- | ------------------------------------------------------------ | --------------------- |
| contentHeight | content 区域当前高度（px）；不可见返回 `0`，≤10px 兜底 `100` | `ComputedRef<number>` |

## 使用须知

1. **高度约束**：组件根容器为 `h-[100%]`，使用时需保证父级有确定高度（如 `height: 100%` 或固定高度），否则 content 无法撑满；
2. **运行时依赖**：组件依赖 `@vueuse/core`（`useResizeObserver` / `useElementVisibility`），已声明为 `@cb-ui/components` 的运行时依赖，无需业务侧额外安装；
3. **实例类型**：`CbPageLayoutInstance` 已从包入口导出，业务侧可用 `ref<CbPageLayoutInstance>()` 获取类型提示。
