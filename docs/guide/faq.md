---
title: 常见问题
---

# 常见问题 FAQ

## Q1: 新增组件后侧边栏没有出现？

侧边栏会自动扫描 `docs/components/` 下的 `.md` 文件，但**分组归属**需要登记在 `docs/.vitepress/config.ts` 的三个集合中：

- `BASE_SUBGROUPS`：基础组件（含 4 个子分组）
- `MEDIA_TOOL_COMPONENTS`：媒体与工具
- `BUSINESS_COMPONENTS`：业务组件

新增组件按分类标准登记到对应集合后，**重启 `pnpm dev`** 才会生效。

## Q2: 组件源码能不能直接改？

**不能随意改。** 落地铁律是"源码一字不改、只做最小必要修正"——只修正让构建/类型/功能失败的问题，且每次修正都要在交付说明中逐条告知。常见修正类型见 [组件开发指南 - 方式二](/guide/component-guide#方式二沉淀业务源码cb-ui-的主要来源)。

## Q3: 如何最快添加一个全新组件？

```bash
pnpm gen modal 模态框
```

脚手架会自动创建目录/文件/文档并更新全量入口。之后仍需：补组件逻辑、写单测、侧边栏登记、走验证链。

## Q4: 文档页的表格（CbPublicTable）显示不出来？

表格区样式为 `height: 0; flex-grow: 1`，依赖**父容器有高度**才能撑开。文档演示需给容器显式高度：

```html
<div style="height: 320px; box-sizing: border-box;">
  <CbPublicTable ... />
</div>
```

业务页面中把它放进 `h-full` 或定高容器即可。

## Q5: build:docs 报 `document is not defined` 或构建异常？

`build:docs` 与 `pnpm dev` 共用 `docs/.vitepress/.temp` 目录，dev 运行中构建会读到半成品。**必须先停 dev 再构建**：

```bash
netstat -ano | findstr :5173 | findstr LISTENING   # 找到 PID
taskkill /PID <PID> /F                             # 停 dev
pnpm build:docs
```

## Q6: 控制台刷屏 `Deprecation Warning [legacy-js-api]`？

这是 Dart Sass 的 legacy JS API 弃用警告。本项目已在 `docs/.vitepress/config.ts` 配置 `api: 'modern-compiler'`（依赖 sass >= 1.79，当前 1.101.3），并注入 `@use "@cb-ui/theme/src/variables" as *;`。警告已清零，**不要回退该配置**。

## Q7: 复制组件到业务项目后样式/类型不生效？

按顺序排查：

1. 底层依赖：`pnpm add tdesign-vue-next@^1.16.1`
2. 样式：确认引入了 TDesign 样式和 `variables.scss` 主题变量
3. 类型：确认 `tsconfig` 的 `paths` 指向组件目录
4. 业务依赖：上传/文件预览/转写类组件依赖 `serviceManager`，需在业务项目提供真实实现并配置 `#` 别名（详见 [快速上手 - 方式一](/guide/quickstart#方式一复制组件源码推荐灵活)）

## Q8: 修改组件后没生效？

| 改动内容 | 处理方式 |
| --- | --- |
| 组件源码 / 样式 | dev 热更新即时生效，刷新页面 |
| 组件文档 md / 侧边栏登记 | **重启 `pnpm dev`** |
| `src/index.ts` / `resolver.ts` | **重启 `pnpm dev`** |

## Q9: markdown 文档里写 Vue 代码报 "Element is missing end tag"？

markdown 中展示 Vue 示例时，`<template>` / `<script>` / `<style>` 等标签在特定场景会被 Vue 编译器当作真实标签解析。需转义为 `&lt;template&gt;` 等，或放在 fenced code block 内。可参考 `docs/guide/component-guide.md` 中的写法。

## Q10: 单测里找不到 TDesign 组件？

TDesign 组件的运行时具名导出可能是 `undefined`，无法用 `findComponent(TCheckbox)` 定位。改用 name 选择器：

```typescript
wrapper.findAllComponents({ name: 'TCheckbox' })
```

另外组件内部 `immediate` watch 会吞掉首轮 emit，断言前先 `await nextTick()` 两次。

## Q11: 组件名冲突怎么办？

历史案例：`CbPublicTable` 的 `checkTag.vue` 内部 `defineOptions` name 为 `CbStatusTag`，与库内 `status-tag` 组件同名。当前以局部组件引入、未全局注册，实测无冲突；如需全局注册需改名。新增组件时注意避免与其他组件 `name` 重复。

## Q12: 为什么组件要分三类（基础/媒体工具/业务）？

因为组件依赖强度不同：基础组件是纯 UI 原子；媒体与工具是独立能力（播放、复制、动画）；业务组件依赖业务场景或数据服务（上传、临时 URL、转写）。分类后侧边栏不再是一锅粥，使用者和维护者都能快速定位。

## Q13: git 需要主动提交吗？

**不需要。** 组件库维护约定：交付即止，git 提交由你自行决定，助手不会主动 commit。

## Q14: Windows 下命令跑不通？

- PowerShell 对 `&&` 支持不稳定 → 用 `cmd /c "cd /d <路径> && <命令>"`
- `pnpm --filter` 报 No projects matched → 先 `cd packages/components` 再操作
- 后台启动 dev 需整条命令包成 `cmd /c "..."` 在后台任务运行
