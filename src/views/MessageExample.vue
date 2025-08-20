<template>
  <div class="message-example">
    <h2>消息提示和气泡确认框使用示例</h2>

    <div class="operation-section">
      <h3>操作按钮</h3>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="danger" @click="handleDelete">删除</el-button>
      <el-button type="warning" @click="handleApprove">审批</el-button>
    </div>

    <div class="operation-section">
      <h3>带气泡确认框的操作按钮</h3>
      <el-button type="danger" v-popconfirm="{
        title: '确认删除吗？删除后无法恢复',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        onConfirm: confirmDelete,
        onCancel: cancelDelete
      }">
        删除（带确认框）
      </el-button>

      <el-button type="primary" v-popconfirm="{
        title: '确认提交吗？',
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        type: 'info',
        onConfirm: confirmSubmit,
        onCancel: cancelSubmit
      }">
        提交（带确认框）
      </el-button>

      <el-button type="success" v-popconfirm="{
        title: '确认审批吗？',
        confirmButtonText: '审批',
        cancelButtonText: '取消',
        type: 'success',
        onConfirm: confirmApprove,
        onCancel: cancelApprove
      }">
        审批（带确认框）
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageUtils from '@/utils/message';

// 保存操作
const handleSave = () => {
  MessageUtils.success('保存成功！');
};

// 删除操作
const handleDelete = () => {
  MessageUtils.warning('请使用带确认框的删除按钮');
};

// 审批操作
const handleApprove = () => {
  MessageUtils.warning('请使用带确认框的审批按钮');
};

// 确认删除
const confirmDelete = () => {
  MessageUtils.success('删除成功！');
};

// 取消删除
const cancelDelete = () => {
  MessageUtils.info('已取消删除操作');
};

// 确认提交
const confirmSubmit = () => {
  MessageUtils.success('提交成功！');
};

// 取消提交
const cancelSubmit = () => {
  MessageUtils.info('已取消提交操作');
};

// 确认审批
const confirmApprove = () => {
  MessageUtils.success('审批成功！');
};

// 取消审批
const cancelApprove = () => {
  MessageUtils.info('已取消审批操作');
};
</script>

<style scoped>
.message-example {
  padding: 20px;
}

.operation-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f5f7fa;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}

.el-button {
  margin-right: 10px;
}
</style>
