<template>
  <div class="search-box" v-if="showSearch">
    <div class="search-options">
      <el-radio-group
        v-model="searchType"
        size="small"
        class="search-type-group"
      >
        <el-radio-button label="id">ID</el-radio-button>
        <el-radio-button label="time">时间</el-radio-button>
        <el-radio-button label="user">用户名称</el-radio-button>
      </el-radio-group>

      <div class="search-input-container">
        <el-input
          v-model="searchValue"
          placeholder="请输入搜索内容"
          clearable
          @keyup.enter="handleSearch"
          class="search-input"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MessageUtils from "@/utils/message";

// 定义组件属性
const props = defineProps({
  // 是否显示搜索框
  show: {
    type: Boolean,
    default: false,
  },
  // 搜索类型
  type: {
    type: String,
    default: "id",
  },
});

// 定义组件事件
const emit = defineEmits(["search"]);

// 搜索类型
const searchType = ref(props.type);

// 搜索值
const searchValue = ref("");

// 是否显示搜索框
const showSearch = ref(props.show);

// 监听show属性变化
watch(
  () => props.show,
  (newValue) => {
    showSearch.value = newValue;
  }
);

// 监听type属性变化
watch(
  () => props.type,
  (newValue) => {
    searchType.value = newValue;
  }
);

// 搜索方法
const handleSearch = () => {
  if (!searchValue.value.trim()) {
    MessageUtils.warning("请输入搜索内容");
    return;
  }

  // 触发搜索事件
  emit("search", {
    type: searchType.value,
    value: searchValue.value,
  });

  // 显示搜索成功消息
  MessageUtils.success("搜索成功");
};
</script>

<style scoped>
.search-box {
  padding: 0 0 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 4px;
  height: 100%;
}

.search-options {
  display: flex;
  align-items: center;
  width: auto;
  justify-content: flex-end; /* 使搜索选项靠右对齐 */
}

.search-type-group {
  margin-right: 10px;
  flex-shrink: 0;
  margin-left: 0; /* 移除与左边的间距 */
}

.search-input-container {
  flex: none;
  max-width: 300px; /* 设置最大宽度 */
  width: 250px; /* 固定宽度，类似于两个按钮的宽度 */
  margin-right: 0; /* 移除与右边的间距 */
}

.search-input {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
    padding: 15px;
  }

  .search-options {
    flex-direction: column;
    width: 100%;
  }

  .search-type-group {
    margin-bottom: 15px;
    margin-right: 0;
    width: 100%;
  }

  .search-input-container {
    width: 100%;
    max-width: none;
  }
}
</style>
