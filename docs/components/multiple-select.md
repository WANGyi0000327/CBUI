---
title: MultipleSelect 多选下拉
---

<script setup>
// 文档站 markdown 的 script setup 对 const ref 的 v-model 绑定分析不完整，
// 因此演示区使用只读绑定（不挂 v-model），选项与全选交互均正常
const multipleSelectOptions = [
  { value: 1, label: '选项一' },
  { value: 2, label: '选项二' },
  { value: 3, label: '选项三' },
  { value: 4, label: '选项四（禁用）', disabled: true },
]
const mappedOptions = [
  { id: 1, name: '商品一' },
  { id: 2, name: '商品二' },
  { id: 3, name: '商品三', forbidden: true },
]
</script>

# MultipleSelect 多选下拉

基于 **TDesign `t-select`** 二次开发的多选下拉组件，在原生多选能力基础上，于面板顶部内置**全选 / 半选**复选框（全选逻辑自动跳过 `disabled` 的选项），并支持通过 `keys` 自定义选项字段映射。

> 特性说明：
> - 全选状态为**受控推导**：全选 → 复选框勾选；部分选中 → 半选态（indeterminate）；清空 → 未勾选。
> - 通过 `defineModel` 实现 `v-model` 双向绑定，默认值为空数组。

## 基础用法

`v-model` 绑定已选值数组，`list` 传入选项数据（默认读取 `value` / `label` / `disabled` 字段）：

<DemoBlock>
  <CbMultipleSelect
    :list="multipleSelectOptions"
    placeholder="请选择"
  />

<template #code>

```vue
<template>
  <CbMultipleSelect
    v-model="multipleSelectValue"
    :list="multipleSelectOptions"
    placeholder="请选择"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const multipleSelectValue = ref<Array<string | number>>([])
const multipleSelectOptions = [
  { value: 1, label: '选项一' },
  { value: 2, label: '选项二' },
  { value: 3, label: '选项三' },
  { value: 4, label: '选项四（禁用）', disabled: true },
]
</script>
```

</template>
</DemoBlock>

> 说明：示例中的 `multipleSelectOptions` 含一个禁用项（`disabled: true`），全选时会被自动跳过。文档站演示可直接交互。

## 自定义字段映射

数据字段与 `value` / `label` / `disabled` 不一致时，通过 `keys` 指定映射：

<DemoBlock>
  <CbMultipleSelect
    :list="mappedOptions"
    :keys="{ value: 'id', label: 'name', disabled: 'forbidden' }"
    placeholder="请选择"
  />

<template #code>

```vue
<template>
  <CbMultipleSelect
    v-model="multipleSelectValue"
    :list="mappedOptions"
    :keys="{ value: 'id', label: 'name', disabled: 'forbidden' }"
    placeholder="请选择"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const multipleSelectValue = ref<Array<string | number>>([])
const mappedOptions = [
  { id: 1, name: '商品一' },
  { id: 2, name: '商品二' },
  { id: 3, name: '商品三', forbidden: true },
]
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 已选值数组（`defineModel`） | `Array<string \| number>` | `[]` |
| list | 选项数据列表（泛型 `T`） | `T[]` | `undefined` |
| keys | 选项字段映射：`value` / `label` / `disabled` | `KeysType` | `{ value: 'value', label: 'label', disabled: 'disabled' }` |
| multiple | 多选模式（组件固定开启） | `boolean` | `true` |
| clearable | 是否可清空 | `boolean` | `true` |
| （其余属性） | 全部通过 `v-bind="$attrs"` 透传给 [TDesign Select](https://tdesign.tencent.com/vue-next/components/select)，如 `placeholder`、`disabled`、`size` 等 | - | - |

### Expose

| 方法名 | 说明 |
| --- | --- |
| handleToggleAll | 手动触发全选切换，参数 `val: boolean`（`true`=全选，`false`=清空） |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign，否则 `t-select` / `t-checkbox` 无法渲染；
2. **全选逻辑**：全选时只选中**未禁用**的选项，禁用项保持不选中；
3. **类型提示**：组件为泛型组件（`generic="T extends Record<string, any>"`），`list` 传入的数据类型会联动到 `keys` 字段的类型推断，业务侧可显式传入泛型获得更精确提示。
