---
title: 常见问题
---

# 常见问题 FAQ

## Q1: 添加新组件感觉很麻烦？

现在只需一行命令：

```bash
pnpm gen modal 模态框
```

脚本会自动完成：创建组件文件、生成文档模板、更新 `index.ts`。**侧边栏也是自动扫描的，完全不用手动改 `config.ts`**。

如果不用脚本，也可以复制已有组件目录手动创建，然后运行 `pnpm gen:index` 自动更新入口。详见 [组件开发指南](/guide/component-guide)。

## Q2: 怎么配置前缀是 Cb？

前缀配置在 `packages/components/src/resolver.ts` 中，详细见 [组件开发指南 - 第六章](/guide/component-guide#六配置组件前缀cb)。

**简单记忆**：
- 想全局改前缀：编辑 `resolver.ts` 第 57 行 `const { prefix = 'Cb' } = options`
- 想单独某个项目用不同前缀：业务项目的 `vite.config.ts` 中传 `CBUIResolver({ prefix: 'My' })`

## Q3: docs/components/modal.md 必须自己写吗？

需要手动编写（详见 [组件开发指南 - 第三章](/guide/component-guide#三创建组件文档)）。

最简单的做法是复制已有文档的模板修改：

```bash
# 复制 button.md 作为模板
cp docs/components/button.md docs/components/modal.md
# 然后修改里面的内容
```

## Q4: 修改组件后没生效？

- 组件源码修改：刷新页面，VitePress HMR 会自动热更新
- 新增组件：必须重启 `pnpm dev`
- 修改了 `resolver.ts` 或 `index.ts`：必须重启 `pnpm dev`

## Q5: 文档站报错 "Element is missing end tag"？

文档的 markdown 代码块中如果包含 `<template>`、`<script>`、`<style>` 等 Vue 标签，需要转义为 `&lt;template&gt;` 等，否则 Vue 编译器会把它当作真实标签解析。

参考 [component-guide.md](file:///d:/domexiangm720/CBUi/docs/guide/component-guide.md) 中所有 Vue 代码示例都已转义。

## Q6: 文档站侧边栏如何新增组件？

**现在不需要手动添加了**。侧边栏已配置为自动扫描 `docs/components/` 目录下的所有 `.md` 文件，只要创建了 `docs/components/modal.md`，侧边栏会自动显示。

如果某个组件不想显示在侧边栏，可以将其文档放在其他目录。

## Q7: 样式不生效怎么办？

按以下顺序排查：

1. 检查 `packages/components/src/{component}/style.scss` 是否存在
2. 检查 `packages/components/src/index.ts` 是否导入了样式
3. 检查 `tailwind.config.ts` 的 `content` 是否包含组件路径
4. 浏览器控制台查看是否有 Sass 编译错误
