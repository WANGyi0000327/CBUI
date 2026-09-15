---
title: CbColControl 列设置
---

<script setup>
import { ref, computed } from 'vue'

const columns = ref([
  { colKey: 'row-select', title: '', type: 'multiple' },
  { colKey: 'name', title: '姓名', visible: true },
  { colKey: 'age', title: '年龄', visible: true },
  { colKey: 'department', title: '部门', visible: false },
  { colKey: 'status', title: '状态', fixed: 'left', visible: true },
  { colKey: 'operation', title: '操作', visible: true },
])
const visibleColumns = ref([])
const visibleKeys = computed(() => visibleColumns.value.map((item) => item.colKey))
</script>

# CbColControl 列设置

点击设置图标打开弹层，控制表头列展示：左侧固定列与操作列不可拖拽/不可隐藏，中间列支持拖拽排序与显示开关，切换后自动同步 v-model 并自动保存远程配置。

## 基础用法

点击右上角设置图标，打开列展示设置弹层。

<DemoBlock>
  <div style="width: 620px">
    <CbColControl
      label="列设置"
      :options="columns"
      app-code="demo-app"
      table-code="demo-table"
    />
  </div>

<template #code>

```vue
<template>
  <CbColControl label="列设置" :options="columns" app-code="demo-app" table-code="demo-table" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 系统列（row-select）不展示在弹层中；fixed: 'left' 左固定、operation 操作列不可拖拽不可隐藏
const columns = ref([
  { colKey: 'row-select', title: '', type: 'multiple' },
  { colKey: 'name', title: '姓名', visible: true },
  { colKey: 'age', title: '年龄', visible: true },
  { colKey: 'department', title: '部门', visible: false },
  { colKey: 'status', title: '状态', fixed: 'left', visible: true },
  { colKey: 'operation', title: '操作', visible: true },
])
</script>
```

</template>
</DemoBlock>

## 受控展示列

通过 `v-model` 获取当前展示列（可见列数组），用于控制表格列渲染。

<DemoBlock>
  <div style="width: 620px">
    <CbColControl
      v-model="visibleColumns"
      label="列设置"
      :options="columns"
      app-code="demo-app"
      table-code="demo-table"
    />
    <p style="margin-top: 12px; color: #666; font-size: 13px">
      当前展示列：{{ visibleKeys.join('、') }}
    </p>
  </div>

<template #code>

```vue
<template>
  <CbColControl
    v-model="visibleColumns"
    label="列设置"
    :options="columns"
    app-code="demo-app"
    table-code="demo-table"
  />
  <p>当前展示列：{{ visibleKeys.join('、') }}</p>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const columns = ref([
  { colKey: 'name', title: '姓名', visible: true },
  { colKey: 'age', title: '年龄', visible: true },
  { colKey: 'operation', title: '操作', visible: true },
])
const visibleColumns = ref([])
const visibleKeys = computed(() => visibleColumns.value.map((item) => item.colKey))
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性       | 说明                         | 类型                  | 默认值   |
| ---------- | ---------------------------- | --------------------- | -------- |
| label      | 左侧文案                     | string                | `'操作'` |
| options    | 列配置项（见下方列配置字段） | `ColControlColumn[]`  | `[]`     |
| appCode    | 应用编码（远程配置保存）     | string                | 必传     |
| tableCode  | 表格编码（远程配置保存）     | string                | 必传     |
| popupProps | 透传给 `t-popup` 的额外属性  | `Record<string, any>` | `{}`     |

### v-model

| 值         | 说明                                       |
| ---------- | ------------------------------------------ |
| modelValue | 当前展示列数组（`visible !== false` 的列） |

### 列配置字段

| 字段                               | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| colKey                             | 列唯一标识（必传）                                           |
| title / displayName / dispalyTitle | 展示名称（依次取非空值，缺省显示 colKey）                    |
| fixed                              | `'left'` 左固定 / `'right'` 右固定（`operation` 视为右固定） |
| visible                            | 是否默认展示（未配置时默认展示）                             |
| disabled                           | 是否禁止切换显示（可编辑列生效）                             |

### 远程配置

组件挂载时通过 `getHeaderColumnList` 拉取远程列配置，切换列展示/拖拽排序后 1 秒自动通过 `tableHeaderSave` 保存。组件库内置的 API 适配层优先使用业务注入的全局 `window.serviceManager` 与 `window.SaApiName` 发起请求；未注入时降级为本地模式（列配置不持久化，组件功能不受影响）。业务接入时在应用入口挂载上述全局即可。
