<template>
  <div class="advanced-table-container">
    <!-- 搜索和分页区域 -->
    <SearchAndPagination
      v-model:page="currentPage"
      v-model:size="pageSize"
      v-model:searchType="currentSearchType"
      v-model:searchValue="currentSearchValue"
      :total="total"
      :defaultSearchType="defaultSearchType"
      @search="handleSearch"
      @change="handleTableChange"
    />

    <!-- 表格区域 -->
    <div class="table-content">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <slot></slot>
      </el-table>
    </div>

    <!-- 无数据提示 -->
    <div v-if="!loading && tableData.length === 0" class="no-data text-center py-10 text-gray-500">
      <div class="empty-icon mb-4">📋</div>
      <p>暂无数据</p>
      <p class="text-sm mt-2">请尝试使用搜索框查询</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SearchAndPagination from '../SearchAndPagination/index.vue';

// 定义组件属性
const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 总数据量
  total: {
    type: Number,
    default: 0
  },
  // 当前页码
  page: {
    type: Number,
    default: 1
  },
  // 每页条数
  size: {
    type: Number,
    default: 10
  },
  // 搜索类型
  searchType: {
    type: String,
    default: 'id'
  },
  // 搜索值
  searchValue: {
    type: String,
    default: ''
  },
  // 默认搜索类型
  defaultSearchType: {
    type: String,
    default: 'id'
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  }
});

// 定义组件事件
const emit = defineEmits(['update:page', 'update:size', 'update:searchType', 'update:searchValue', 'search', 'change']);

// 当前页码
const currentPage = ref(props.page);

// 每页条数
const pageSize = ref(props.size);

// 搜索类型
const currentSearchType = ref(props.searchType);

// 搜索值
const currentSearchValue = ref(props.searchValue);

// 表格数据
const tableData = computed(() => {
  return props.data;
});

// 监听页码变化
watch(() => props.page, (newVal) => {
  if (newVal !== currentPage.value) {
    currentPage.value = newVal;
  }
});

// 监听每页条数变化
watch(() => props.size, (newVal) => {
  if (newVal !== pageSize.value) {
    pageSize.value = newVal;
  }
});

// 监听搜索类型变化
watch(() => props.searchType, (newVal) => {
  if (newVal !== currentSearchType.value) {
    currentSearchType.value = newVal;
  }
});

// 监听搜索值变化
watch(() => props.searchValue, (newVal) => {
  if (newVal !== currentSearchValue.value) {
    currentSearchValue.value = newVal;
  }
});

// 监听内部页码变化
watch(currentPage, (newVal) => {
  if (newVal !== props.page) {
    emit('update:page', newVal);
  }
});

// 监听内部每页条数变化
watch(pageSize, (newVal) => {
  if (newVal !== props.size) {
    emit('update:size', newVal);
  }
});

// 监听内部搜索类型变化
watch(currentSearchType, (newVal) => {
  if (newVal !== props.searchType) {
    emit('update:searchType', newVal);
  }
});

// 监听内部搜索值变化
watch(currentSearchValue, (newVal) => {
  if (newVal !== props.searchValue) {
    emit('update:searchValue', newVal);
  }
});

// 处理搜索
const handleSearch = (params: { type: string; value: string; page: number; size: number }) => {
  emit('search', params);
};

// 处理表格变化
const handleTableChange = (params: { page: number; size: number; searchType: string; searchValue: string }) => {
  emit('change', params);
};
</script>

<style scoped>
.advanced-table-container {
  width: 100%;
}

.table-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* 无数据提示 */
.no-data {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.6;
}
</style>
