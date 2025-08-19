<template>
  <div class="data-table-container">
    <div class="table-header flex justify-between items-center mb-4">
      <h3 class="text-sm font-semibold text-gray-700">{{ title }}</h3>
      <div class="flex items-center space-x-2">
        <select
          class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>10条/页</option>
          <option>20条/页</option>
          <option>50条/页</option>
        </select>
        <div class="flex items-center space-x-1">
          <button class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50" :disabled="currentPage === 1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <span class="text-xs text-gray-600">{{ currentPage }}/{{ totalPages }}</span>
          <button class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            :disabled="currentPage === totalPages">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="column in columns" :key="column.key"
            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            @click="sortBy(column.key)">
            {{ column.title }}

            <span v-if="sortKey === column.key" class="ml-1">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50 cursor-pointer" @click="handleRowClick(item)">
          <td v-for="column in columns" :key="column.key"
            class="px-4 py-2 whitespace-nowrap text-sm {{ column.class || 'text-gray-500' }}">
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

defineProps({
  title: { type: String, required: true },
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  totalItems: { type: Number, default: 0 },
  itemsPerPage: { type: Number, default: 10 }
});

defineEmits(['rowClick']);

const currentPage = ref(1);
const sortKey = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');

const totalPages = computed(() => {
  return Math.ceil(Number(defineProps().totalItems) / Number(defineProps().itemsPerPage));
});

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  // 这里可以添加实际的排序逻辑
};

const handleRowClick = (item: any) => {
  const emit = defineEmits(['rowClick']);
  emit('rowClick', item);
};
</script>

<style scoped>
/* 表格样式 */
</style>
