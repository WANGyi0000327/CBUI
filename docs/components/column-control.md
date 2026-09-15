---
title: CbColumnControl 列设置
---

<script setup>
import { ref, computed } from 'vue'

const allColumns = [
  { colKey: 'row-select', title: '多选' },
  { colKey: 'name', title: '姓名' },
  { colKey: 'age', title: '年龄' },
  { colKey: 'status', title: '状态', head_disabled: true },
  { colKey: 'operation', title: '操作', Coldisabled: true },
]
const columnConfig = ref({
  visibleColumns: ['row-select', 'name', 'age', 'status', 'operation'],
  columnOptions: [],
})
// 每个 demo 独立控制弹层显隐，避免共享 visible 时弹层互关
const controlVisible = ref(false)
const controlVisible2 = ref(false)
const showColumns = computed(() => columnConfig.value.visibleColumns.join('、'))
</script>

# CbColumnControl 列设置

原生 HTML5 拖拽版列设置控件：`head_disabled` 列（含 row-select）不可拖拽不可隐藏，其余列支持拖拽排序与显示开关，切换/排序后同步 `v-model:column-config` 并触发对应事件。操作列开关可通过 `closeoperation` 控制是否展示。

## 基础用法

受控打开弹层（`v-model:visible`），点击"列设置"按钮展示表头列管理：状态列为 `head_disabled` 置灰，姓名/年龄可拖拽排序、可开关，操作列开关默认禁用。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px;">
    <CbColumnControl
      v-model:column-config="columnConfig"
      v-model:visible="controlVisible"
      :all-columns="allColumns"
    />
    <p style="margin-top: 12px; font-size: 13px; color: #666;">
      当前展示列：{{ showColumns }}
    </p>
  </div>

<template #code>

```vue
<template>
  <CbColumnControl
    v-model:column-config="columnConfig"
    v-model:visible="controlVisible"
    :all-columns="allColumns"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const allColumns = [
  { colKey: 'row-select', title: '多选' },
  { colKey: 'name', title: '姓名' },
  { colKey: 'age', title: '年龄' },
  { colKey: 'status', title: '状态', head_disabled: true },
  { colKey: 'operation', title: '操作', Coldisabled: true },
]
const columnConfig = ref({
  visibleColumns: ['row-select', 'name', 'age', 'status', 'operation'],
  columnOptions: [],
})
const controlVisible = ref(false)
</script>
```

</template>
</DemoBlock>

## 关闭操作列开关

设置 `closeoperation="false"` 后，弹层底部不再展示"操作"列的开关行。

<DemoBlock>
  <div style="border: 1px solid var(--td-border-level-2-color); border-radius: 4px; padding: 16px;">
    <CbColumnControl
      v-model:column-config="columnConfig"
      v-model:visible="controlVisible2"
      :all-columns="allColumns"
      :closeoperation="false"
    />
  </div>

<template #code>

```vue
<template>
  <CbColumnControl
    v-model:column-config="columnConfig"
    v-model:visible="controlVisible"
    :all-columns="allColumns"
    :closeoperation="false"
  />
</template>
```

</template>
</DemoBlock>

## API

### Props

| 属性           | 说明                                                       | 类型                                | 默认值 |
| -------------- | ---------------------------------------------------------- | ----------------------------------- | ------ |
| allColumns     | 全部表头列配置（见下方列配置字段）                         | `TableColumn[]`                     | `[]`   |
| closeoperation | 是否在弹层底部展示"操作"列的开关行（该行开关始终禁用）     | boolean                             | `true` |
| onSave         | 保存列配置的回调（切换/排序后触发，`columnConfig` 已同步） | `(config) => Promise<void> \| void` | `-`    |

### v-model

| 值           | 说明                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| columnConfig | 列配置对象 `{ visibleColumns: string[], columnOptions: ColumnOption[] }`，切换显示/拖拽排序后同步更新 |
| visible      | 弹层显隐（受控，配合 `t-popup` 的 `visible-change`）                                                  |

### Emits

| 事件              | 说明                                        |
| ----------------- | ------------------------------------------- |
| columnToggle      | 切换列显示开关：`(colKey, checked, config)` |
| columnOrderChange | 拖拽排序完成：`(newOrder: ColumnOption[])`  |
| saveSuccess       | 保存成功                                    |
| saveError         | 保存失败：`(error)`                         |

### 列配置字段

| 字段                | 说明                                       |
| ------------------- | ------------------------------------------ |
| colKey              | 列唯一标识（必传）                         |
| title / displayName | 展示名称（依次取非空值）                   |
| head_disabled       | 置灰列：禁止切换显示、禁止拖拽（如"状态"） |
| Coldisabled         | 隐藏列：不在弹层中渲染                     |
| Prohibit_switch     | 禁止切换显示（可拖拽列生效）               |

### 拖拽行为

仅非 `head_disabled`、非 `row-select` 的列可拖拽排序（demo 中为"姓名/年龄"）。拖拽通过 Pointer Events 实现，兼容鼠标、触摸屏与内嵌 WebView，不依赖浏览器原生 HTML5 拖拽。拖起时源行半透明，悬停目标行显示品牌色插入指示线，松手完成排序并触发 `columnOrderChange`。
