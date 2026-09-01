---
title: Button 按钮
---

# Button 按钮

基于 **TDesign `t-button`** 二次开发的按钮组件，在原生能力基础上新增 CB UI 自定义主题，支持传入 iconfont 图标名作为图标。

> 依赖说明：CbButton 内部直接使用了 `<t-button>` 标签，业务项目中需要**全局注册 TDesign 组件库**（`app.use(TDesign)`），否则按钮无法渲染。

## 基础用法（TDesign 原生主题）

使用 `theme` 或兼容属性 `type` 设置 TDesign 内置的五种主题色按钮：`default` / `primary` / `warning` / `success` / `danger`。

<DemoBlock>
  <TButton theme="default">默认按钮</TButton>
  <TButton theme="primary">主要按钮</TButton>
  <TButton theme="warning">警告按钮</TButton>
  <TButton theme="success">成功按钮</TButton>
  <TButton theme="danger">危险按钮</TButton>

<template #code>

```vue
<template>
  <TButton theme="default">默认按钮</TButton>
  <TButton theme="primary">主要按钮</TButton>
  <TButton theme="warning">警告按钮</TButton>
  <TButton theme="success">成功按钮</TButton>
  <TButton theme="danger">危险按钮</TButton>
</template>
```

  </template>
</DemoBlock>

## 兼容旧写法（type 属性）

`type` 属性作为旧 API 兼容保留，**主题色值**写入 type 时会自动映射为 `theme`（type 优先级更高）。

- ✅ 主题色 style：`default` / `primary` / `warning` / `success` / `danger` / `cb-brand-default` / `cb-brand-gray`
  会被当作主题色并直接替代 `theme` 生效，不会透传给原生 `<button>`。
- ✅ 原生 HTML button type：`button` / `submit` / `reset`
  不会触发兼容映射，会原样透传给 `<t-button>` 作为表单提交/重置等原生行为使用。

<DemoBlock>
  <TButton type="primary">主要按钮</TButton>
  <TButton type="danger">危险按钮</TButton>

<template #code>

```vue
<template>
  <!-- 主题色写在 type 上（旧 API 兼容，自动转 theme） -->
  <TButton type="primary">主要按钮</TButton>
  <TButton type="danger">危险按钮</TButton>
  <!-- 原生 type：submit/reset/button 不受兼容影响，原样透传 -->
  <form @submit.prevent>
    <TButton type="submit" theme="primary">表单提交按钮</TButton>
    <TButton type="reset">重置按钮</TButton>
  </form>
</template>
```

  </template>
</DemoBlock>

## CB UI 自定义主题

除了 TDesign 原生主题，还额外提供三种轻量风格主题，通过自定义 class 实现样式覆盖：

- `cb-brand-default`：品牌色字 + 浅色品牌色背景
- `cb-brand-gray`：次级灰色字 + 浅色品牌色背景
- `cb-brand-error`：错误色字 + 浅色品牌色背景（需要在标签上额外写 class）

<DemoBlock>
  <TButton theme="cb-brand-default">品牌按钮</TButton>
  <TButton theme="cb-brand-gray">次要按钮</TButton>
  <TButton theme="default" class="cb-brand-error">错误状态按钮</TButton>

<template #code>

```vue
<template>
  <TButton theme="cb-brand-default">品牌按钮</TButton>
  <TButton theme="cb-brand-gray">次要按钮</TButton>
  <TButton theme="default" class="cb-brand-error">错误状态按钮</TButton>
</template>
```

  </template>
</DemoBlock>

## 图标按钮

`icon` 属性支持两种形式：

- **字符串**：作为 CbIcon 组件的 `name`，自动渲染 iconfont 对应 SVG 图标
- **TNode**（函数/VNode）：直接作为 t-button 的自定义 icon 渲染

<DemoBlock>
  <TButton theme="primary" icon="ruzhi">入职采集</TButton>
  <TButton theme="cb-brand-default" icon="jia">新增商品</TButton>
  <TButton icon="ruzhi" />
  <TButton icon="jia" />

<template #code>

```vue
<template>
  <TButton theme="primary" #icon>
    <CbIcon name="ruzhi" />
    入职采集
  </TButton>
  <TButton theme="cb-brand-default" #icon>
    <CbIcon name="jia" />
    新增商品
  </TButton>
  <!-- 仅图标（无文案） -->
  <TButton icon="ruzhi" />
  <TButton icon="jia" />
</template>
```

  </template>
</DemoBlock>

## 尺寸

通过 `size` 属性透传给 t-button，可选值与 TDesign 原生保持一致：`small` / `medium`（默认）/ `large`。

<DemoBlock>
  <TButton size="small" theme="primary">小按钮</TButton>
  <TButton size="medium" theme="primary">中等按钮</TButton>
  <TButton size="large" theme="primary">大按钮</TButton>

<template #code>

```vue
<template>
  <TButton size="small" theme="primary">小按钮</TButton>
  <TButton size="medium" theme="primary">中等按钮</TButton>
  <TButton size="large" theme="primary">大按钮</TButton>
</template>
```

  </template>
</DemoBlock>

## 状态：禁用 / 加载中

`disabled`、`loading` 等状态直接透传给 t-button，行为与 TDesign 一致。自定义主题下禁用态样式已适配。

<DemoBlock>
  <TButton disabled theme="primary">禁用按钮</TButton>
  <TButton disabled theme="cb-brand-default">禁用品牌按钮</TButton>
  <TButton loading theme="primary">加载中</TButton>
  <TButton theme="primary" loading />

<template #code>

```vue
<template>
  <TButton disabled theme="primary">禁用按钮</TButton>
  <TButton disabled theme="cb-brand-default">禁用品牌按钮</TButton>
  <TButton loading theme="primary">加载中</TButton>
  <TButton theme="primary" loading />
</template>
```

  </template>
</DemoBlock>

## 块级按钮

通过 `block` 属性让按钮占满父容器宽度，属性直接透传给 t-button。

<DemoBlock>
  <div style="max-width: 320px; display: flex; flex-direction: column; gap: 12px;">
    <TButton theme="primary" block>块级主要按钮</TButton>
    <TButton theme="cb-brand-default" block>块级品牌按钮</TButton>
  </div>

<template #code>

```vue
<template>
  <TButton theme="primary" block>块级主要按钮</TButton>
  <TButton theme="cb-brand-default" block>块级品牌按钮</TButton>
</template>
```

  </template>
</DemoBlock>

## 文本按钮（TDesign variant=text）

当透传 `variant="text"` 给 t-button 时，样式自动切换为文本按钮样式（内部已处理 padding / min-width）。

<DemoBlock>
  <TButton theme="primary" variant="text">文本按钮</TButton>
  <TButton theme="default" variant="text">次要文本按钮</TButton>

<template #code>

```vue
<template>
  <TButton theme="primary" variant="text">文本按钮</TButton>
  <TButton theme="default" variant="text">次要文本按钮</TButton>
</template>
```

  </template>
</DemoBlock>

## API

### Props

| 属性         | 说明                                                                                                                                                                                       | 类型              | 默认值      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ----------- |
| theme        | **按钮主题（推荐使用）**。TDesign 原生：`default` / `primary` / `warning` / `success` / `danger`；CB UI 自定义：`cb-brand-default` / `cb-brand-gray`；`cb-brand-error` 需要配合 class 使用 | `string`          | `'primary'` |
| type         | **兼容旧 API**：等同 theme，二者同时存在时 type 优先；注意不要用来写原生 button 的 submit/reset（原生属性请使用 attrs 的其他方式透传）                                                     | `string`          | `undefined` |
| icon         | 按钮图标。字符串按 CbIcon 名称渲染；TNode 类型直接作为 t-button 的自定义 icon                                                                                                              | `string \| TNode` | `undefined` |
| （其余属性） | 全部通过 `v-bind="$attrs"` 透传给 [TDesign Button](https://tdesign.tencent.com/vue-next/components/button)，例如 `size`、`disabled`、`loading`、`block`、`variant`、`shape`、`content` 等  | -                 | -           |

### Events

全部事件由 t-button 原生事件透传，包括 `click`、`mousedown`、`focus`、`blur` 等，最常用的：

| 事件名 | 说明                                                    | 回调参数     |
| ------ | ------------------------------------------------------- | ------------ |
| click  | 点击按钮时触发（禁用/加载态下 t-button 内部已阻止触发） | `MouseEvent` |

### Slots

| 插槽名           | 说明                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| default          | 按钮文案主体，直接写在 `<TButton>...</TButton>` 中即可                            |
| （其余具名插槽） | 全部透传给 t-button，例如 `icon` / `suffix`（具体支持取决于 TDesign Button 组件） |

## 使用须知

1. **前置依赖**：业务项目中必须 `app.use(TDesign)` 全局注册 TDesign，并引入 `tdesign-vue-next/dist/tdesign.css` 或 `es/style/index.css` 样式；
2. **图标**：`icon` 字符串模式依赖 CbIcon 与项目已有的 `iconfont.js` 资源，图标名即 iconfont 项目中的符号名（不含 `icon-` 前缀）。组件内部会自动将字符串图标转成 `CbIcon` 组件 VNode 渲染，无需手动全局注册 `CbIcon`（按需加载场景也能自动生效）；
3. **自定义主题样式生效范围**：`cb-brand-*` 是组件 scoped 样式，仅对 `TButton` 根节点有效，禁用态、文本按钮模式下均做了适配处理。其中 `cb-brand-error` 未纳入 theme 白名单，需要**以 class 的方式**额外追加到组件上（`<TButton class="cb-brand-error">`）；
4. **type 属性双通道**：
   - 值为主题色（`primary` / `default` 等）→ 自动映射为 theme，优先级高于显式 `theme` prop；
   - 值为 `submit` / `reset` / `button` → 原样透传为 HTML button 原生类型属性；
   - 混用示例：`<TButton type="submit" theme="primary">` 既做主题样式又具备表单提交行为。
5. **组件名约定**：`TButton` 内部二次封装基于 TDesign `t-button`（内部 `name: 'TButton'`），但对外统一注册名为 `TButton`。全局注册 `app.use(CBUI)` 后模板中写 `<TButton>`；按需加载场景配合 `CBUIResolver()` 自动解析，无需手动 import。
