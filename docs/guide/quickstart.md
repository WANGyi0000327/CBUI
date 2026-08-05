---
title: 快速上手
---

# 快速上手

本节将介绍如何在项目中使用 CB UI 组件库。

::: tip 说明
CB UI 是基于 **TDesign** 二次开发的个人组件库，底层依赖 `tdesign-vue-next`。组件代码可直接复制到项目中使用，无需发布 npm 包。
:::

---

## 一、环境要求

- Node.js >= 18.0.0
- Vue 3.4+
- TDesign Vue Next 1.16+

---

## 二、安装依赖

由于 CB UI 基于 TDesign 开发，项目需要先安装 TDesign：

```bash
# pnpm
pnpm add tdesign-vue-next@^1.16.1

# npm
npm install tdesign-vue-next@^1.16.1
```

---

## 三、使用方式

### 方式一：复制组件代码（推荐）

CB UI 的组件可以直接复制到你的项目中使用。

#### 步骤 1：复制组件目录

从 CB UI 文档站查看需要的组件，复制对应的组件代码到你的项目：

```
your-project/
└── src/
    └── components/
        └── cb-ui/              # 创建 cb-ui 目录
            ├── button/
            │   ├── Button.vue
            │   ├── types.ts
            │   └── index.ts
            ├── input/
            │   ├── Input.vue
            │   ├── types.ts
            │   └── index.ts
            └── index.ts        # 组件库入口
```

#### 步骤 2：复制样式变量

复制主题变量到你的项目：

```scss
// src/styles/cb-variables.scss
$cb-color-primary: #4B3FE3;
$cb-color-text: #171717;
$cb-color-border: rgba(23, 23, 23, 0.12);

$cb-space-16: 16px;
$cb-space-20: 20px;

$cb-radius: 8px;
$cb-radius-lg: 12px;
```

#### 步骤 3：全局注册（可选）

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import CBUI from './components/cb-ui'

const app = createApp(App)
app.use(CBUI)
app.mount('#app')
```

#### 步骤 4：直接使用组件

```vue
&lt;template&gt;
  &lt;CbButton type="primary"&gt;主要按钮&lt;/CbButton&gt;
&lt;/template&gt;
```

---

### 方式二：直接引入单个组件

如果只需要单个组件，可以直接复制该组件的代码：

```vue
&lt;script setup lang="ts"&gt;
// 直接引入复制的组件
import { Button as CbButton } from '@/components/cb-ui/button'
&lt;/script&gt;

&lt;template&gt;
  &lt;CbButton type="primary"&gt;主要按钮&lt;/CbButton&gt;
&lt;/template&gt;
```

---

## 四、组件列表

| 组件 | 说明 | 基础组件 |
|---|---|---|
| Button | 按钮 | `t-button` |
| Input | 输入框 | `t-input` |
| Card | 卡片 | `t-card` |

---

## 五、本地开发

如果你想参与组件库开发：

```bash
# 克隆仓库
git clone https://github.com/your-org/cb-ui.git
cd cb-ui

# 安装依赖
pnpm install

# 启动文档站
pnpm dev

# 访问 http://localhost:5173
```

---

## 六、TypeScript 支持

CB UI 使用 TypeScript 编写，复制组件时会自动获得类型提示：

```ts
import type { ButtonProps, InputProps } from '@/components/cb-ui'
```

---

## 七、常见问题

### Q: 组件样式不生效？

确保已引入 TDesign 样式：

```ts
// main.ts
import 'tdesign-vue-next/es/style/index.css'
```

### Q: 组件类型提示不生效？

确保 TypeScript 配置中的 `paths` 指向正确：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Q: 如何自定义主题？

修改 `cb-variables.scss` 中的变量值，或直接修改组件的 `style.scss`。