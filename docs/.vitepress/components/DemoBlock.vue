<template>
  <div class="cb-demo-block">
    <!-- 示例展示区 -->
    <div class="cb-demo-block__source">
      <slot />
    </div>

    <!-- 代码展示区 -->
    <div class="cb-demo-block__meta">
      <details>
        <summary>查看代码</summary>
        <div class="cb-demo-block__code">
          <slot name="code" />
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
// DemoBlock 组件
// 用于在文档中展示组件示例与对应代码
// 使用方式：
// <DemoBlock>
//   <CbButton>按钮</CbButton>
//   <template #code>
//     ```vue
//     <CbButton>按钮</CbButton>
//     ```
//   </template>
// </DemoBlock>
</script>
