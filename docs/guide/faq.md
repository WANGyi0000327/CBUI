---
title: 常见问题
---

# 常见问题 FAQ

## Q1: 添加新组件感觉很麻烦？

确实，添加一个组件要改 4 个地方：

1. `packages/components/src/modal/` 三个文件
2. `packages/components/src/index.ts` 加 3 行
3. `docs/components/modal.md` 新建文档
4. `docs/.vitepress/config.ts` 加侧边栏

**简化方案**：参考 `docs/guide/component-guide.md` 第二节"快速添加组件"中的脚手架脚本部分，可以用 `pnpm gen modal` 一键生成基础模板。

## Q2: 怎么配置前缀是 Cb？

前缀配置在 `packages/components/src/resolver.ts` 中，详细见 [组件开发指南 - 第六章](/guide/component-guide#六配置组件前缀cb)。

**简单记忆**：
- 想全局改前缀：编辑 `resolver.ts` 第 57 行 `const { prefix = 'Cb' } = options`
- 想单独某个项目用不同前缀：业务项目的 `vite.config.ts` 中传 `CBUIResolver({ prefix: 'My' })`

## Q3: docs/components/modal.md 必须自己写吗？

可以手写，也可以用自动生成（详见 [组件开发指南 - 第三章](/guide/component-guide#三自动生成组件文档进阶)）。

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

编辑 `docs/.vitepress/config.ts`，在 `'/components/':` 数组中添加：

```typescript
'/components/': [
  {
    text: '基础组件',
    items: [
      { text: 'Button 按钮', link: '/components/button' },
      { text: 'Modal 模态框', link: '/components/modal' },  // 新增
    ],
  },
],
```

## Q7: 样式不生效怎么办？

按以下顺序排查：

1. 检查 `packages/components/src/{component}/style.scss` 是否存在
2. 检查 `packages/components/src/index.ts` 是否导入了样式
3. 检查 `tailwind.config.ts` 的 `content` 是否包含组件路径
4. 浏览器控制台查看是否有 Sass 编译错误
