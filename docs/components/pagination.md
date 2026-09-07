---
title: Pagination 分页
---

# Pagination 分页

基于 **TDesign `t-pagination`** 二次开发的分页组件：内置每页条数选择（30 / 50 / 100 条）、快速跳页、最多 7 个页码按钮；`total` 为 0 时不渲染分页条。

> 特性说明：
> - **内置条数选择**：默认 30 / 50 / 100 条每页，可通过 `page-size-options` 自定义。
> - **快捷跳页**：内置 `show-jumper` 跳页输入框。
> - **空态隐藏**：`total <= 0` 时整个分页条不渲染。
> - **受控透传**：`current` / `pageSize` 通过 `v-bind="$attrs"` 透传，业务侧使用 `v-model:current` / `v-model:pageSize`。

## 基础用法

<DemoBlock>
  <CbPagination :total="356" style="justify-content: flex-end;" />

<template #code>

```vue
<template>
  <CbPagination
    v-model:current="current"
    v-model:pageSize="pageSize"
    :total="total"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(1)
const pageSize = ref(30)
const total = 356
</script>
```

</template>
</DemoBlock>

## 自定义每页条数选项

通过 `page-size-options` 覆盖内置的条数选项：

<DemoBlock>
  <CbPagination
    :total="1200"
    :page-size-options="[
      { label: '20 条/页', value: 20 },
      { label: '50 条/页', value: 50 },
      { label: '200 条/页', value: 200 },
    ]"
    style="justify-content: flex-end;"
  />

<template #code>

```vue
<template>
  <CbPagination
    v-model:current="current"
    v-model:pageSize="pageSize"
    :total="1200"
    :page-size-options="[
      { label: '20 条/页', value: 20 },
      { label: '50 条/页', value: 50 },
      { label: '200 条/页', value: 200 },
    ]"
  />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 数据总条数（`<= 0` 时不渲染分页条） | `number` | - |
| pageSizeOptions | 每页条数可选项 | `{ label: string; value: number }[]` | `[30, 50, 100]` 条/页 |
| （其余属性） | 通过 `v-bind="$attrs"` 透传给 [TDesign Pagination](https://tdesign.tencent.com/vue-next/components/pagination)，如 `v-model:current`、`v-model:pageSize`、`disabled` 等 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| （透传） | 通过 `v-bind="$attrs"` 透传 `t-pagination` 的事件，如 `change`、`current-change`、`page-size-change` 等 | - |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign；
2. **受控方式**：分页当前页 / 每页条数建议使用 `v-model:current` / `v-model:pageSize` 控制；不传时使用 TDesign 内部默认值；
3. **空态处理**：`total` 为 0 时组件自动隐藏（避免展示空分页条），无需业务侧额外 `v-if`。
