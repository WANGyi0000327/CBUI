---
title: OverBtns 操作按钮组
---

<script setup>
const overBtnList = [
  {
    label: '编辑',
    type: 'edit',
    clickHandler: (type, row) => console.log('点击', type, row),
  },
  {
    label: '删除',
    type: 'delete',
    colorType: 1,
    clickHandler: (type, row) => console.log('点击', type, row),
  },
  {
    label: '复制链接',
    type: 'copy',
    clickHandler: (type, row) => console.log('点击', type, row),
  },
]
const permissionBtnList = [
  {
    label: '查看',
    type: 'view',
    clickHandler: (type, row) => {},
  },
  {
    label: '归档',
    type: 'archive',
    enablehide: (row) => row.status !== 1,
    clickHandler: (type, row) => {},
  },
  {
    label: '停用',
    type: 'stop',
    disabled: (row) => row.status === 1,
    clickHandler: (type, row) => {},
  },
]
</script>

# OverBtns 操作按钮组

基于 **TDesign `t-button` / `t-popup`** 封装的操作按钮组：前 `maxShownNum` 个按钮直接展示，超出部分折叠进"更多"弹出层，常用于表格行操作（编辑 / 删除 / 更多）。

> 特性说明：
> - **权限隐藏**：`enablehide` 支持布尔值或函数（接收 `row`），为 `true` 时该按钮不渲染。
> - **禁用控制**：`disabled` 支持布尔值或函数，禁用时按钮不可点且不应用自定义 `style`。
> - **动态文案**：`label` 支持字符串或函数（接收 `row` 返回文案）。
> - **自动关闭**：点击弹出层内的按钮后自动收起弹层。

## 基础用法

通过 `btnList` 配置操作按钮，`row` 传入当前行数据：

<DemoBlock>
  <CbOverBtns
    :btn-list="overBtnList"
    :row="{ id: 1, name: '示例行' }"
  />

<template #code>

```vue
<template>
  <CbOverBtns :btn-list="btnList" :row="row" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { OverBtn } from '@cb-ui/components'

const row = ref({ id: 1, name: '示例行' })

const btnList: OverBtn[] = [
  {
    label: '编辑',
    type: 'edit',
    clickHandler: (type, row) => console.log('点击', type, row),
  },
  {
    label: '删除',
    type: 'delete',
    colorType: 1, // 红色字体
    clickHandler: (type, row) => console.log('点击', type, row),
  },
  {
    label: '复制链接',
    type: 'copy',
    clickHandler: (type, row) => console.log('点击', type, row),
  },
]
</script>
```

</template>
</DemoBlock>

> 说明：默认 `maxShownNum` 为 2，第 3 个及以后的按钮会折叠进"更多"图标（竖向三点）弹出层。文档站演示区为静态展示。

## 权限与禁用

`enablehide` / `disabled` 均支持布尔值或函数：

<DemoBlock>
  <CbOverBtns
    :btn-list="permissionBtnList"
    :row="{ id: 2, status: 1 }"
  />

<template #code>

```vue
<script setup lang="ts">
import type { OverBtn } from '@cb-ui/components'

const permissionBtnList: OverBtn[] = [
  {
    label: '查看',
    type: 'view',
    clickHandler: (type, row) => {},
  },
  {
    label: '归档',
    type: 'archive',
    // 函数形式：根据行数据判断是否隐藏
    enablehide: (row) => row.status !== 1,
    clickHandler: (type, row) => {},
  },
  {
    label: '停用',
    type: 'stop',
    // 函数形式：根据行数据判断是否禁用
    disabled: (row) => row.status === 1,
    clickHandler: (type, row) => {},
  },
]
</script>
```

</template>
</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| btnList | 操作按钮配置列表 | `OverBtn[]` | `[]` |
| maxShownNum | 直接展示的按钮数量，超出折叠进弹出层 | `number` | `2` |
| row | 当前行数据（传给 label / disabled / clickHandler / enablehide 等） | `object` | `{}` |
| iconStyle | 折叠图标触发器样式 | `object` | `{ width: '30px' }` |

### OverBtn 配置项

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| label | 按钮文案，支持动态函数 | `string \| ((row) => string)` |
| type | 按钮类型标识 | `string` |
| clickHandler | 点击回调 | `(type: string, row) => void` |
| colorType | 是否红色字体（`1` = 红色） | `number` |
| disabled | 是否禁用，支持动态函数 | `boolean \| ((row) => boolean)` |
| enablehide | 是否隐藏（权限控制），支持动态函数 | `boolean \| ((row?) => boolean)` |
| enablehide_hide | 保留字段（权限控制） | `boolean \| ((row?) => boolean)` |
| style | 自定义按钮样式（禁用时不生效） | `Record<string, string>` |
| theme | 是否使用主题颜色（保留字段） | `boolean` |
| isPermission | 按钮权限（保留字段） | `boolean \| (() => boolean)` |
| class | 自定义类名（保留字段） | `Record<string, string>` |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign；
2. **图标**：折叠触发器使用 `<cb-icon name="gengduo_shu">`，需保证 `CbIcon` 已全局注册（全量 `app.use(CBUI)` 即可），并引入含 `gengduo_shu` 符号的 `iconfont.js` 资源；
3. **折叠条件**：`btnList`（过滤 `enablehide` 后）数量大于 `maxShownNum` 时才渲染"更多"触发器；
4. **禁用样式**：按钮禁用时不应用 `btn.style`（`getBtnStyle` 返回空对象），保证禁用态视觉统一。
