---
title: GridLayout 网格布局
description: 根据容器宽度自适应列数的响应式卡片网格
---

<script setup>
import { ref, onMounted, nextTick } from 'vue'
const cards = ref(Array.from({ length: 6 }, (_, i) => i + 1))
const ready = ref(false)
onMounted(() => { nextTick(() => { ready.value = true }) })
</script>

## GridLayout 网格布局

根据外层容器实际宽度与 `min-card-width` 自动计算一排展示多少列卡片，窗口缩放时实时重算，保证卡片不小于最小宽度且至少展示 `min-col` 列。

## 基础用法

`card-container` 传入外层容器选择器，组件挂载后会读取其 `clientWidth` 计算网格列模板。

<DemoBlock>
  <div ref="gridRef" class="grid-host" style="width: 100%; border: 1px dashed #d9d9d9; padding: 8px; box-sizing: border-box;">
    <CbGridLayout v-if="ready" card-container=".grid-host" :min-card-width="180" :gap="8" :min-col="2">
      <div v-for="c in cards" :key="c" style="background: var(--td-brand-color-1); height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
        卡片 {{ c }}
      </div>
    </CbGridLayout>
  </div>
</DemoBlock>

```vue
<template>
  <div ref="host" class="grid-host">
    <CbGridLayout card-container=".grid-host" :min-card-width="180" :gap="8" :min-col="2">
      <div v-for="c in 6" :key="c" class="card">卡片 {{ c }}</div>
    </CbGridLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
const ready = ref(false)
onMounted(() => { nextTick(() => { ready.value = true }) })
</script>

<style scoped>
.grid-host { width: 100%; }
.card { background: #e8f3ff; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
</style>
```

## 最小列数

容器过窄时通过 `min-col` 保证至少展示指定列数（不会低于该值）。

<DemoBlock>
  <div class="grid-host-2" style="width: 320px; border: 1px dashed #d9d9d9; padding: 8px; box-sizing: border-box;">
    <CbGridLayout v-if="ready" card-container=".grid-host-2" :min-card-width="200" :gap="8" :min-col="3">
      <div v-for="c in cards" :key="c" style="background: var(--td-success-color-1); height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
        {{ c }}
      </div>
    </CbGridLayout>
  </div>
</DemoBlock>

```vue
<template>
  <div class="grid-host-2">
    <CbGridLayout card-container=".grid-host-2" :min-card-width="200" :gap="8" :min-col="3">
      <div v-for="c in 6" :key="c" class="card">{{ c }}</div>
    </CbGridLayout>
  </div>
</template>
```

## 使用前提

1. **TailwindCSS**：组件根节点使用 Tailwind 工具类 `grid`、`gap-[8px]`、`h-full`，使用方需启用 TailwindCSS。
2. **外层容器**：`card-container` 必须指向已渲染的真实 DOM 选择器，否则列模板不会被计算。
3. 无 TDesign / CbIcon 依赖。

## API

### Props

| 属性             | 说明                   | 类型       | 默认值 |
| -------------- | -------------------- | -------- | --- |
| card-container | 外层盒子的元素选择器（用于读取容器宽度） | `string` | ''  |
| min-card-width | 单个卡片最小宽度（px）         | `number` | 375 |
| gap            | 卡片间距（px）             | `number` | 8   |
| min-col        | 最小列数                 | `number` | 3   |

### Slots

| 插槽名     | 说明         |
| ------- | ---------- |
| default | 网格中排列的卡片内容 |
