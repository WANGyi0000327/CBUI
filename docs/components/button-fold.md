---
title: ButtonFold 折叠按钮
description: 按数量折叠操作按钮，超出部分收进弹出层
---

# ButtonFold 折叠按钮

把多个操作按钮按 `expend-num` 数量折叠展示，超出部分收进 Popup 弹出层，常用于操作列空间有限的场景。

## 基础用法

默认 `type="icon"`，超出 `expend-num` 的操作收进「更多」图标弹出层。

<DemoBlock>
  <CbButtonFold :expend-num="1">
    <TButton>编辑</TButton>
    <TButton>复制</TButton>
    <TButton>删除</TButton>
  </CbButtonFold>

<template #code>

```vue
<template>
  <CbButtonFold :expend-num="1">
    <TButton>编辑</TButton>
    <TButton>复制</TButton>
    <TButton>删除</TButton>
  </CbButtonFold>
</template>
```

  </template>
</DemoBlock>

## 文字更多按钮

`type="moreBtn"` 时展示为文字按钮 + 箭头图标，`operation-name` 自定义文案。

<DemoBlock>
  <CbButtonFold type="moreBtn" operation-name="更多操作" :expend-num="1">
    <TButton>编辑</TButton>
    <TButton>复制</TButton>
    <TButton>删除</TButton>
  </CbButtonFold>

<template #code>

```vue
<template>
  <CbButtonFold type="moreBtn" operation-name="更多操作" :expend-num="1">
    <TButton>编辑</TButton>
    <TButton>复制</TButton>
    <TButton>删除</TButton>
  </CbButtonFold>
</template>
```

  </template>
</DemoBlock>

## 禁用全部

`disabled-all` 会禁用所有操作（含折叠展开的按钮）。

<DemoBlock>
  <CbButtonFold :disabled-all="true" :expend-num="1">
    <TButton>编辑</TButton>
    <TButton>删除</TButton>
  </CbButtonFold>

<template #code>

```vue
<template>
  <CbButtonFold :disabled-all="true" :expend-num="1">
    <TButton>编辑</TButton>
    <TButton>删除</TButton>
  </CbButtonFold>
</template>
```

  </template>
</DemoBlock>

## 使用前提

1. **CbIcon**：组件内部用 `CbIcon` 渲染图标（更多图标 `gengduo_shu`、箭头 `jaintou_shang` / `jaintou_xia`）。全量引入自动注册，按需加载时 HOC 自动注入。
2. **iconfont symbol**：需包含 `icon-gengduo_shu`、`icon-jaintou_shang`、`icon-jaintou_xia` 图标。
3. **TDesign**：组件内部用 `t-popup`、`t-button`，需注册 TDesign（`app.use(TDesign)`）。

## API

### Props

| 属性               | 说明                            | 类型                  | 默认值  |
| ------------------ | ------------------------------- | --------------------- | ------- |
| operation-name     | 更多按钮文案（type='moreBtn'） | `string`              | '更多'  |
| expend-num         | 直接展示的操作数量              | `number`              | 1       |
| disabled-all       | 是否禁用全部操作                | `boolean`             | false   |
| overlay-class-name | 弹出层自定义 class              | `string`              | ''      |
| type               | 展示类型：icon / moreBtn        | `'icon' \| 'moreBtn'` | 'icon'  |

### Slots

| 插槽名  | 说明                          |
| ------- | ----------------------------- |
| default | 操作按钮（按 expend-num 折叠） |
