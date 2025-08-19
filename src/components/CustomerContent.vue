<template>
  <div class="customer-content" :style="{ backgroundColor: 'rgb(166, 166, 166)' }">
    <!-- 具名插槽：header -->
    <div class="content-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>

    <!-- 默认插槽 -->
    <div class="content-body" v-if="$slots.default">
      <slot></slot>
    </div>

    <!-- 具名插槽：footer -->
    <div class="content-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
.customer-content {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}

.content-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.content-body {
  padding: 1.5rem;
}

.content-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
