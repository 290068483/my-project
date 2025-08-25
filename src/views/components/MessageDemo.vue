<template>
  <div class="message-demo">
    <h2 class="mb-4">消息提示和气泡确认框示例</h2>

    <div class="demo-section mb-6">
      <h3 class="mb-3">消息提示</h3>
      <el-space>
        <el-button type="success" @click="showSuccessMessage">成功消息</el-button>
        <el-button type="warning" @click="showWarningMessage">警告消息</el-button>
        <el-button type="danger" @click="showErrorMessage">错误消息</el-button>
        <el-button type="info" @click="showInfoMessage">信息消息</el-button>
      </el-space>
    </div>

    <div class="demo-section mb-6">
      <h3 class="mb-3">通知提示</h3>
      <el-space>
        <el-button type="success" @click="showSuccessNotification">成功通知</el-button>
        <el-button type="warning" @click="showWarningNotification">警告通知</el-button>
        <el-button type="danger" @click="showErrorNotification">错误通知</el-button>
        <el-button type="info" @click="showInfoNotification">信息通知</el-button>
      </el-space>
    </div>

    <div class="demo-section mb-6">
      <h3 class="mb-3">确认对话框</h3>
      <el-button type="primary" @click="showConfirmDialog">确认对话框</el-button>
    </div>

    <div class="demo-section mb-6">
      <h3 class="mb-3">提示对话框</h3>
      <el-button type="primary" @click="showAlertDialog">提示对话框</el-button>
    </div>

    <div class="demo-section mb-6">
      <h3 class="mb-3">输入对话框</h3>
      <el-button type="primary" @click="showPromptDialog">输入对话框</el-button>
    </div>

    <div class="demo-section mb-6">
      <h3 class="mb-3">气泡确认框示例</h3>
      <el-space>
        <el-button
          type="danger"
          v-popconfirm="{
            title: '确认删除吗？',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
            onConfirm: () => handleDelete('项目1'),
            onCancel: () => console.log('取消删除'),
          }">
          删除项目1
        </el-button>

        <el-button
          type="danger"
          v-popconfirm="{
            title: '确认删除吗？',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
            onConfirm: () => handleDelete('项目2'),
            onCancel: () => console.log('取消删除'),
          }">
          删除项目2
        </el-button>

        <el-button
          type="primary"
          v-popconfirm="{
            title: '确认提交吗？',
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'info',
            onConfirm: () => handleSubmit(),
            onCancel: () => console.log('取消提交'),
          }">
          提交表单
        </el-button>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageUtils from "@/utils/message";

// 显示成功消息
const showSuccessMessage = () => {
  MessageUtils.success("操作成功！");
};

// 显示警告消息
const showWarningMessage = () => {
  MessageUtils.warning("警告信息！");
};

// 显示错误消息
const showErrorMessage = () => {
  MessageUtils.error("操作失败！");
};

// 显示信息消息
const showInfoMessage = () => {
  MessageUtils.info("这是一条信息提示。");
};

// 显示成功通知
const showSuccessNotification = () => {
  MessageUtils.notification("成功", "操作已成功完成！", "success");
};

// 显示警告通知
const showWarningNotification = () => {
  MessageUtils.notification("警告", "请注意检查您的输入！", "warning");
};

// 显示错误通知
const showErrorNotification = () => {
  MessageUtils.notification("错误", "操作失败，请重试！", "error");
};

// 显示信息通知
const showInfoNotification = () => {
  MessageUtils.notification("提示", "这是一条信息通知。", "info");
};

// 显示确认对话框
const showConfirmDialog = () => {
  MessageUtils.confirm("您确定要执行此操作吗？")
    .then(() => {
      MessageUtils.success("您点击了确定按钮");
    })
    .catch(() => {
      MessageUtils.info("您点击了取消按钮");
    });
};

// 显示提示对话框
const showAlertDialog = () => {
  MessageUtils.alert("这是一个重要的提示信息！", "重要提示").then(() => {
    MessageUtils.success("您已确认提示");
  });
};

// 显示输入对话框
const showPromptDialog = () => {
  MessageUtils.prompt("请输入您的姓名：", "输入信息", "", "确定", "取消", "请输入姓名", "text", (value) => {
    if (!value) {
      return "姓名不能为空";
    }
    return true;
  })
    .then(({ value }) => {
      MessageUtils.success(`您输入的姓名是：${value}`);
    })
    .catch(() => {
      MessageUtils.info("您取消了输入");
    });
};

// 处理删除操作
const handleDelete = (itemName: string) => {
  MessageUtils.success(`已删除 ${itemName}`);
};

// 处理提交操作
const handleSubmit = () => {
  MessageUtils.success("表单已成功提交！");
};
</script>

<style scoped>
.message-demo {
  padding: 20px;
}

.demo-section {
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
</style>
