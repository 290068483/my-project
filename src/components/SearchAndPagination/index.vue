<template>
  <div class="search-pagination-container">
    <!-- 搜索区域 -->
    <div class="search-content">
      <SearchBox
        v-model:type="searchType"
        v-model:value="searchValue"
        :type="defaultSearchType"
        @search="handleSearch"
      />
    </div>

    <!-- 分页区域 -->
    <div class="pagination-content">
      <Pagination
        v-model:page="currentPage"
        v-model:size="pageSize"
        :total="total"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SearchBox from '../SearchBox/index.vue';
import Pagination from '../Pagination/index.vue';

// 定义组件属性
const props = defineProps({
  // 搜索类型
  type: {
    type: String,
    default: 'id'
  },
  // 搜索值
  value: {
    type: String,
    default: ''
  },
  // 默认搜索类型
  defaultSearchType: {
    type: String,
    default: 'id'
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
  // 总数据量
  total: {
    type: Number,
    default: 0
  }
});

// 定义组件事件
const emit = defineEmits(['update:type', 'update:value', 'update:page', 'update:size', 'search', 'change']);

// 搜索类型
const searchType = ref(props.type);

// 搜索值
const searchValue = ref(props.value);

// 当前页码
const currentPage = ref(props.page);

// 每页条数
const pageSize = ref(props.size);

// 监听搜索类型变化
watch(() => props.type, (newVal) => {
  if (newVal !== searchType.value) {
    searchType.value = newVal;
  }
});

// 监听搜索值变化
watch(() => props.value, (newVal) => {
  if (newVal !== searchValue.value) {
    searchValue.value = newVal;
  }
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

// 监听内部搜索类型变化
watch(searchType, (newVal) => {
  if (newVal !== props.type) {
    emit('update:type', newVal);
  }
});

// 监听内部搜索值变化
watch(searchValue, (newVal) => {
  if (newVal !== props.value) {
    emit('update:value', newVal);
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

// 处理搜索
const handleSearch = () => {
  // 重置页码为1
  currentPage.value = 1;

  // 发送搜索事件
  emit('search', { 
    type: searchType.value, 
    value: searchValue.value,
    page: currentPage.value,
    size: pageSize.value
  });

  // 发送变化事件
  emit('change', { 
    page: currentPage.value,
    size: pageSize.value,
    searchType: searchType.value,
    searchValue: searchValue.value
  });
};

// 处理分页变化
const handlePageChange = (params: { page: number; size: number }) => {
  emit('change', {
    ...params,
    searchType: searchType.value,
    searchValue: searchValue.value
  });
};
</script>

<style scoped>
.search-pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-content {
  flex: 1;
}

.pagination-content {
  flex-shrink: 0;
}
</style>
