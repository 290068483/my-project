<template>
  <div class="custom-header mb-10 mt-10">
    <div class="titleBox mt-5 flex align-center justify-between px-6 mb-3">
      <h1
        class="text-2xl text-center pl-[20%] min-w-[80%] font-bold text-gray-800"
      >
        {{ title }}
      </h1>
      <el-button type="primary" class="text-white" @click="handleProfileClick"
        >进入客户档案</el-button
      >
    </div>
    <el-breadcrumb
      separator="/"
      :default-active="activeIndex"
      class="el-menu-demo active:text-red active:bg-white"
      mode="horizontal"
      @select="handleSelect"
      :ellipsis="false"
    >
      <el-breadcrumb-item
        :to="{ path: '/' }"
        v-for="(item, index) in props.items"
        :key="index"
        :index="item.index"
        class="!bg-[rgb(60,60,77)] !text-white py-1 px-4"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

// 定义组件的属性
const props = defineProps({
  // 菜单项数组
  items: {
    type: Array as () => Array<{ title: string; index: string }>,
    default: () => [],
  },
  // 默认激活的菜单项索引
  defaultActive: {
    type: String,
    default: "",
  },
  // 标题
  title: {
    type: String,
    default: "",
  },
});

// 定义组件的事件
const emit = defineEmits(["select", "profile-click"]);

// 当前激活的菜单项
const activeIndex = ref(
  props.defaultActive || (props.items.length > 0 ? props.items[0].index : "")
);

// 处理菜单选择事件
const handleSelect = (key: string) => {
  activeIndex.value = key;
  emit("select", key);
};

// 处理客户档案按钮点击
const handleProfileClick = () => {
  emit("profile-click");
};
</script>

<style scoped>
.titleBox {
  margin-bottom: 15px;
}
.custom-header {
  width: 100%;
  background-color: #f3f4f6; /* 灰色背景，与原来一致 */
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-sm */
  margin-top: 2.5rem; /* mt-10 */
  margin-bottom: 2.5rem; /* mb-10 */
}

.el-menu-demo {
  border-bottom: none;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 40px; /* 与原来按钮高度一致 */
  line-height: 40px; /* 与原来按钮高度一致 */
  font-size: 14px; /* 与原来按钮文字大小一致 */
  color: #374151; /* text-gray-700 */
  border-bottom: 2px solid transparent;
  margin-right: 0.5rem; /* space-x-6 大约对应 mr-1.5 */
  padding: 0 0.75rem; /* px-3 */
  border-radius: 0.375rem; /* rounded */
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms; /* transition-colors */
}

:deep(.el-menu--horizontal > .el-menu-item:hover) {
  background-color: #e5e7eb; /* hover:bg-gray-300 */
  color: #374151;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  color: white; /* text-white */
  background-color: #3b82f6; /* bg-blue-500 */
}
</style>
