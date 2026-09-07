---
title: MorePopup 更多弹层
---

# MorePopup 更多弹层

基于 **TDesign `t-popup`** 二次开发的更多操作弹层组件。支持**文字按钮**和**竖向三点图标**两种触发器，弹出层内容通过 `content` 插槽自定义。

> 核心特性：组件内部会通过隐藏探测器渲染 `content` 插槽并检测其可见性——当内容插槽没有任何可见子元素（如全部 `display: none`）时，**不渲染弹层**，避免出现空弹层。

## 基础用法（文字按钮触发）

默认使用文字按钮作为触发器，通过 `content` 插槽传入弹出层内容：

<DemoBlock>
  <CbMorePopup>
    <template #content>
      <t-button theme="text" variant="text">编辑</t-button>
      <t-button theme="text" variant="text" class="cb-brand-error">删除</t-button>
    </template>
  </CbMorePopup>

<template #code>

```vue
<template>
  <CbMorePopup>
    <template #content>
      <t-button theme="text" variant="text">编辑</t-button>
      <t-button theme="text" variant="text" class="cb-brand-error">删除</t-button>
    </template>
  </CbMorePopup>
</template>
```

</template>
</DemoBlock>

## 图标触发

设置 `type="icon"` 使用竖向三点图标作为触发器（点击图标展开）：

<DemoBlock>
  <CbMorePopup type="icon">
    <template #content>
      <t-button theme="text" variant="text">查看详情</t-button>
      <t-button theme="text" variant="text">复制链接</t-button>
    </template>
  </CbMorePopup>

<template #code>

```vue
<template>
  <CbMorePopup type="icon">
    <template #content>
      <t-button theme="text" variant="text">查看详情</t-button>
      <t-button theme="text" variant="text">复制链接</t-button>
    </template>
  </CbMorePopup>
</template>
```

</template>
</DemoBlock>

## 自定义文案

通过 `text` 属性或 `text` 插槽自定义按钮文案：

<DemoBlock>
  <CbMorePopup text="操作">
    <template #content>
      <t-button theme="text" variant="text">操作一</t-button>
    </template>
  </CbMorePopup>

<template #code>

```vue
<template>
  <CbMorePopup text="操作">
    <template #content>
      <t-button theme="text" variant="text">操作一</t-button>
    </template>
  </CbMorePopup>
</template>
```

</template>
</DemoBlock>

## 禁用

设置 `disabled` 后触发器不可点击，无法展开弹层：

<DemoBlock>
  <CbMorePopup disabled>
    <template #content>
      <t-button theme="text" variant="text">编辑</t-button>
    </template>
  </CbMorePopup>

<template #code>

```vue
<template>
  <CbMorePopup disabled>
    <template #content>
      <t-button theme="text" variant="text">编辑</t-button>
    </template>
  </CbMorePopup>
</template>
```

</template>
</DemoBlock>

## 点击内容后自动关闭

点击弹出层中的 `t-button` / `t-link` 元素时自动关闭弹层（内置处理），无需手动控制。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 触发器类型：`button`=文字按钮，`icon`=竖向三点图标 | `string` | `'button'` |
| text | 按钮触发器的文案（`type='button'` 时生效） | `string` | `'更多'` |
| triggerClass | 触发器附加 class（用于自定义按钮/图标样式） | `string` | `''` |
| disabled | 是否禁用（禁用时不可展开弹层） | `boolean` | `false` |
| （其余属性） | 全部通过 `v-bind="$attrs"` 透传给 [TDesign Popup](https://tdesign.tencent.com/vue-next/components/popup)，例如 `placement`、`overlayClassName` 等 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| triggle-text-click | 点击文字触发器时触发，可拿到 `close` 方法主动关闭弹层 | `{ e: Event, close: () => void }` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| content | 弹层内容。会被隐藏探测器渲染以检测可见性，无可见子元素时不渲染弹层 |
| text | 按钮触发器的文案插槽（覆盖 `text` 属性） |

### Expose

| 方法名 | 说明 |
| --- | --- |
| close | 主动关闭弹层（可在 `triggle-text-click` 回调中调用） |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign；组件模板内使用 `<cb-icon>`，需保证 `CbIcon` 已注册（全量 `app.use(CBUI)` 或按需加载时一并引入 `CbIcon`）；
2. **图标**：`jaintou_shang` / `jaintou_xia` / `gengduo_shu` 均为 iconfont 项目中的符号名，业务项目需引入对应 `iconfont.js` 资源；
3. **可见性检测**：组件通过隐藏容器检测 `content` 插槽子元素的 `display`，所有子元素 `display: none` 或未渲染时不显示触发器弹层；
4. **自动关闭**：点击弹层内 `t-button` / `t-link` 元素会自动关闭；其余内容需通过 `triggle-text-click` 的 `close` 方法或外部控制 `visible` 关闭。
