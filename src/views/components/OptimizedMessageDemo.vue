<template>
  <div class="optimized-message-demo">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>优化后的消息提示系统演示</span>
          <el-tag type="success">单例模式 + 队列管理</el-tag>
        </div>
      </template>

      <div class="demo-section mb-6">
        <h3 class="mb-3">🔥 特性说明</h3>
        <ul class="feature-list">
          <li><strong>单例模式：</strong>同一时间只显示一个消息提示，避免消息叠加</li>
          <li><strong>智能队列：</strong>多个消息会排队显示，最多保存5个</li>
          <li><strong>优先级处理：</strong>错误消息会立即显示，打断当前消息</li>
          <li><strong>自动清理：</strong>消息关闭后自动处理队列中的下一个消息</li>
        </ul>
      </div>

      <div class="demo-section mb-6">
        <h3 class="mb-3">📢 普通消息提示（会排队）</h3>
        <el-space wrap>
          <el-button type="success" @click="showSuccessMessage">成功消息</el-button>
          <el-button type="warning" @click="showWarningMessage">警告消息</el-button>
          <el-button type="info" @click="showInfoMessage">信息消息</el-button>
          <el-button type="danger" @click="showErrorMessage">错误消息（优先）</el-button>
        </el-space>
      </div>

      <div class="demo-section mb-6">
        <h3 class="mb-3">⚡ 立即消息提示（打断当前）</h3>
        <el-space wrap>
          <el-button type="success" plain @click="showImmediateSuccess">立即成功</el-button>
          <el-button type="warning" plain @click="showImmediateWarning">立即警告</el-button>
          <el-button type="info" plain @click="showImmediateInfo">立即信息</el-button>
          <el-button type="danger" plain @click="showImmediateError">立即错误</el-button>
        </el-space>
      </div>

      <div class="demo-section mb-6">
        <h3 class="mb-3">📬 通知提示（右上角）</h3>
        <el-space wrap>
          <el-button type="success" @click="showSuccessNotification">成功通知</el-button>
          <el-button type="warning" @click="showWarningNotification">警告通知</el-button>
          <el-button type="danger" @click="showErrorNotification">错误通知</el-button>
          <el-button type="info" @click="showInfoNotification">信息通知</el-button>
        </el-space>
      </div>

      <div class="demo-section mb-6">
        <h3 class="mb-3">🧪 批量测试</h3>
        <el-space wrap>
          <el-button @click="testBatchMessages">连续发送5个消息（测试队列）</el-button>
          <el-button @click="testMixedMessages">混合消息测试</el-button>
          <el-button type="danger" @click="clearAllMessages">清空所有消息</el-button>
        </el-space>
      </div>

      <div class="demo-section mb-6">
        <h3 class="mb-3">💬 对话框</h3>
        <el-space wrap>
          <el-button type="primary" @click="showConfirmDialog">确认对话框</el-button>
          <el-button type="primary" @click="showAlertDialog">提示对话框</el-button>
          <el-button type="primary" @click="showPromptDialog">输入对话框</el-button>
        </el-space>
      </div>

      <div class="demo-section">
        <h3 class="mb-3">📊 统计信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="成功消息">{{ statistics.success }}</el-descriptions-item>
          <el-descriptions-item label="警告消息">{{ statistics.warning }}</el-descriptions-item>
          <el-descriptions-item label="错误消息">{{ statistics.error }}</el-descriptions-item>
          <el-descriptions-item label="信息消息">{{ statistics.info }}</el-descriptions-item>
          <el-descriptions-item label="通知消息">{{ statistics.notification }}</el-descriptions-item>
          <el-descriptions-item label="对话框">{{ statistics.dialog }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import MessageUtils from "@/utils/message";

// 统计信息
const statistics = reactive({
  success: 0,
  warning: 0,
  error: 0,
  info: 0,
  notification: 0,
  dialog: 0,
});

// 普通消息提示
const showSuccessMessage = () => {
  MessageUtils.success("操作成功！这是一条成功消息");
  statistics.success++;
};

const showWarningMessage = () => {
  MessageUtils.warning("请注意！这是一条警告消息");
  statistics.warning++;
};

const showErrorMessage = () => {
  MessageUtils.error("操作失败！这是一条错误消息（会立即显示）");
  statistics.error++;
};

const showInfoMessage = () => {
  MessageUtils.info("这是一条信息提示消息");
  statistics.info++;
};

// 立即消息提示
const showImmediateSuccess = () => {
  MessageUtils.success("立即显示的成功消息！", 3000, true);
  statistics.success++;
};

const showImmediateWarning = () => {
  MessageUtils.warning("立即显示的警告消息！", 3000, true);
  statistics.warning++;
};

const showImmediateInfo = () => {
  MessageUtils.info("立即显示的信息消息！", 3000, true);
  statistics.info++;
};

const showImmediateError = () => {
  MessageUtils.error("立即显示的错误消息！", 3000, true);
  statistics.error++;
};

// 通知提示
const showSuccessNotification = () => {
  MessageUtils.notification("成功", "操作已成功完成！", "success");
  statistics.notification++;
};

const showWarningNotification = () => {
  MessageUtils.notification("警告", "请注意检查您的输入！", "warning");
  statistics.notification++;
};

const showErrorNotification = () => {
  MessageUtils.notification("错误", "操作失败，请重试！", "error");
  statistics.notification++;
};

const showInfoNotification = () => {
  MessageUtils.notification("提示", "这是一条信息通知。", "info");
  statistics.notification++;
};

// 批量测试
const testBatchMessages = () => {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      MessageUtils.info(`这是第 ${i} 条消息 - 测试队列功能`);
      statistics.info++;
    }, i * 100);
  }
};

const testMixedMessages = () => {
  MessageUtils.info("第一条消息");
  MessageUtils.success("第二条消息");
  MessageUtils.warning("第三条消息");
  MessageUtils.error("紧急错误消息（会立即显示）");
  MessageUtils.info("第四条消息");
  statistics.info += 2;
  statistics.success++;
  statistics.warning++;
  statistics.error++;
};

const clearAllMessages = () => {
  MessageUtils.closeAll();
};

// 对话框
const showConfirmDialog = () => {
  MessageUtils.confirm("您确定要执行此操作吗？")
    .then(() => {
      MessageUtils.success("您点击了确定按钮");
      statistics.success++;
    })
    .catch(() => {
      MessageUtils.info("您点击了取消按钮");
      statistics.info++;
    });
  statistics.dialog++;
};

const showAlertDialog = () => {
  MessageUtils.alert("这是一个重要的提示信息！", "重要提示").then(() => {
    MessageUtils.success("您已确认提示");
    statistics.success++;
  });
  statistics.dialog++;
};

const showPromptDialog = () => {
  MessageUtils.prompt("请输入您的姓名：", "输入信息", "", "确定", "取消", "请输入姓名", "text", (value) => {
    if (!value) {
      return "姓名不能为空";
    }
    return true;
  })
    .then(({ value }) => {
      MessageUtils.success(`您输入的姓名是：${value}`);
      statistics.success++;
    })
    .catch(() => {
      MessageUtils.info("您取消了输入");
      statistics.info++;
    });
  statistics.dialog++;
};
</script>

<style scoped>
.optimized-message-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-section {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background-color: #fafafa;
}

.demo-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.feature-list {
  margin: 0;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #606266;
}

.feature-list strong {
  color: #409eff;
}

:deep(.el-space) {
  flex-wrap: wrap;
}

:deep(.el-descriptions) {
  margin-top: 10px;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}

@media (max-width: 768px) {
  .optimized-message-demo {
    padding: 10px;
  }

  .demo-section {
    padding: 15px;
  }

  :deep(.el-descriptions) {
    --el-descriptions-item-bordered-label-background: #f5f7fa;
  }
}
</style>
