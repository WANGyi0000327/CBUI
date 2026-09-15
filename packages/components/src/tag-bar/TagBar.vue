<template>
  <div class="tabs-container">
    <t-tabs
      :value="activeTab"
      theme="card"
      :scroll-position="scrollPosition"
      class="tabs-container-content"
    >
      <t-tab-panel v-for="(tab, index) in tabs" :key="tab.path" :value="tab.path">
        <template #label>
          <div
            :class="['tab-item', { active: activeTab === tab.path }]"
            @click="switchTab(tab)"
            @contextmenu="(event: MouseEvent) => showContextMenu(event, tab)"
          >
            <span>{{ tab.meta.title }}</span>
            <span
              v-show="tabs && tabs.length > 1 && index !== 0"
              @click.stop="closeTab(tab.path as string)"
            >
              <cb-icon name="guanbi" class="close-icon" />
            </span>
          </div>
        </template>
      </t-tab-panel>
    </t-tabs>
    <ul
      v-show="showMenu"
      v-click-outside="hideContextMenu"
      class="context-menu"
      :style="{ left: menuX + 'px', top: menuY + 'px' }"
    >
      <li
        v-for="item in dropdownOptions"
        :key="item.value"
        class="menu-item"
        @click="handleMenuClick(item.value)"
      >
        {{ item.content }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, type PropType } from 'vue'
defineOptions({
  name: 'CbTagBar',
})
const props = defineProps({
  activeTab: {
    type: String,
    default: '',
  },
  tabs: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
})
// 当前激活的路由
const scrollPosition = ref('auto')
const showMenu = ref<boolean>(false)
const dropdownOptions = [
  { content: '关闭其他', value: 'closeOther' },
  { content: '刷新页面', value: 'refresh' },
]
const emits = defineEmits(['close', 'close-other', 'refresh', 'jump'])
const menuX = ref(0)
const menuY = ref(0)
const handleMenuClick = (type: string) => {
  switch (type) {
    case 'closeOther':
      emits('close-other')
      break
    case 'refresh':
      emits('refresh')
      break
  }
  hideContextMenu()
}
const hideContextMenu = () => {
  showMenu.value = false
}
const showContextMenu = (event: MouseEvent, tab: T) => {
  event.preventDefault()
  switchTab(tab)
  showMenu.value = true
  menuX.value = event.pageX
  menuY.value = event.pageY
}
const switchTab = (tab: T) => {
  if (tab.path) {
    emits('jump', tab)
  }
}
const closeTab = (path: string) => {
  if (props.tabs.length === 1) return
  emits('close', path)
}
</script>
<style lang="scss" scoped>
.tabs-container {
  min-width: 0;
  width: 100%;
  :deep(.t-tabs__btn) {
    height: 28px;
  }
  :deep(.t-tabs__nav-wrap) {
    gap: 8px;
  }
  :deep(.t-tabs__nav-item) {
    border: none !important;
    padding: 0;
    line-height: 28px;
    height: 28px;
    .t-tabs__nav-item-text-wrapper {
      line-height: 28px;
    }
    .tab-item {
      padding: 2px 8px;
      background-color: #fff;
      font-size: 12px;
      height: 28px;
      color: #666;
      display: flex;
      align-items: center;
      cursor: pointer;
      flex-shrink: 0;
      white-space: nowrap;
      position: relative;
      border-radius: var(--td-radius-default);
      border: 1px solid transparent;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      span:last-child {
        width: 0;
        overflow: hidden;
        transition: width 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .close-icon {
        font-size: 14px;
        border-radius: 50%;
        padding: 1px;
        transition: all 0.2s ease-in-out;
        margin-left: 4px;
        opacity: 0;
        transform: scale(0);
        transform-origin: center center;
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
          opacity: 1;
        }
      }
      // 悬浮状态
      &:hover {
        color: #fff;
        background-color: var(--td-brand-color);
        span:last-child {
          width: 16px;
        }
        .close-icon {
          opacity: 0.7;
          transform: scale(1);
        }
      }
      &.active {
        color: var(--td-brand-color);
        background-color: var(--td-brand-color-9);
        font-weight: 500;
        span:last-child {
          width: 16px;
        }
        .close-icon {
          color: var(--td-brand-color);
          opacity: 0.7;
          transform: scale(1);
        }
      }
    }
  }
}
.context-menu {
  position: fixed;
  padding: 0 6px;
  background: #fff;
  box-shadow: var(--td-shadow-1);
  z-index: 9999;
  border-radius: 4px; // 菜单也加一点圆角
  li {
    cursor: pointer;
    font-size: 12px;
    line-height: 30px;
    color: #666;
    padding: 0 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    &:hover {
      background-color: var(--td-bg-color-container-hover, #f3f3f3);
      color: var(--td-brand-color, #0052d9);
    }
  }
}
.tabs-wrapper {
  overflow-x: auto;
  padding-top: 8px;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
