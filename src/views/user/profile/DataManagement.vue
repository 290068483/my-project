<template>
  <div class="data-management p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">数据管理</h2>

      <!-- 数据导出 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">数据导出</span>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">您可以导出您的个人数据，包括个人资料、活动记录等。</p>

          <div class="space-y-3">
            <el-radio-group v-model="exportType">
              <div class="space-y-2">
                <el-radio value="profile">
                  <div class="ml-2">
                    <div class="font-medium">个人资料</div>
                    <div class="text-sm text-gray-500">包含基本信息、联系方式等</div>
                  </div>
                </el-radio>
                <el-radio value="activity">
                  <div class="ml-2">
                    <div class="font-medium">活动记录</div>
                    <div class="text-sm text-gray-500">包含登录日志、操作记录等</div>
                  </div>
                </el-radio>
                <el-radio value="all">
                  <div class="ml-2">
                    <div class="font-medium">全部数据</div>
                    <div class="text-sm text-gray-500">包含所有可导出的数据</div>
                  </div>
                </el-radio>
              </div>
            </el-radio-group>
          </div>

          <div class="flex items-center space-x-4">
            <el-button type="primary" @click="exportData" :loading="exporting"> 导出数据 </el-button>
            <div v-if="lastExportTime" class="text-sm text-gray-500">上次导出：{{ lastExportTime }}</div>
          </div>

          <!-- 导出历史 -->
          <div v-if="exportHistory.length > 0" class="mt-4">
            <el-divider>导出历史</el-divider>
            <div class="space-y-2">
              <div
                v-for="record in exportHistory"
                :key="record.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div class="font-medium">{{ record.type }}</div>
                  <div class="text-sm text-gray-500">{{ record.time }}</div>
                </div>
                <div class="space-x-2">
                  <el-tag :type="record.status === 'completed' ? 'success' : 'warning'" size="small">
                    {{ record.status === "completed" ? "已完成" : "处理中" }}
                  </el-tag>
                  <el-button
                    v-if="record.status === 'completed'"
                    size="small"
                    @click="downloadExport(record.downloadUrl)">
                    下载
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 隐私设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">隐私设置</span>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">个人资料可见性</p>
              <p class="text-sm text-gray-500">控制其他用户能看到您的哪些信息</p>
            </div>
            <el-select v-model="privacySettings.profileVisibility" @change="updatePrivacySettings">
              <el-option label="公开" value="public" />
              <el-option label="仅好友" value="friends" />
              <el-option label="私密" value="private" />
            </el-select>
          </div>

          <el-divider />

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span>显示邮箱地址</span>
              <el-switch v-model="privacySettings.showEmail" @change="updatePrivacySettings" />
            </div>
            <div class="flex items-center justify-between">
              <span>显示手机号码</span>
              <el-switch v-model="privacySettings.showPhone" @change="updatePrivacySettings" />
            </div>
            <div class="flex items-center justify-between">
              <span>显示生日信息</span>
              <el-switch v-model="privacySettings.showBirthday" @change="updatePrivacySettings" />
            </div>
            <div class="flex items-center justify-between">
              <span>显示住址信息</span>
              <el-switch v-model="privacySettings.showAddress" @change="updatePrivacySettings" />
            </div>
            <div class="flex items-center justify-between">
              <span>允许搜索查找</span>
              <el-switch v-model="privacySettings.allowSearch" @change="updatePrivacySettings" />
            </div>
            <div class="flex items-center justify-between">
              <span>允许数据收集用于改进服务</span>
              <el-switch v-model="privacySettings.dataCollection" @change="updatePrivacySettings" />
            </div>
          </div>
        </div>
      </el-card>

      <!-- 账户注销 -->
      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold text-red-600">危险操作</span>
        </template>
        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex">
              <el-icon class="text-red-500 mt-0.5 mr-2"><WarningFilled /></el-icon>
              <div>
                <h4 class="font-medium text-red-800">账户注销</h4>
                <p class="text-sm text-red-700 mt-1">
                  注销账户将永久删除您的所有数据，此操作不可恢复。请在操作前确保已导出需要保留的数据。
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h5 class="font-medium">注销账户将会：</h5>
            <ul class="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 永久删除您的个人资料和设置</li>
              <li>• 删除您的所有活动记录和日志</li>
              <li>• 取消所有正在进行的操作</li>
              <li>• 释放您的用户名和邮箱供他人使用</li>
            </ul>
          </div>

          <div class="flex items-center space-x-4">
            <el-button type="danger" @click="showDeleteConfirm = true"> 申请注销账户 </el-button>
            <div v-if="deletionRequest" class="text-sm">
              <el-tag type="warning"> 注销申请已提交，将在 {{ deletionRequest.scheduledDate }} 执行 </el-tag>
              <el-button type="primary" size="small" class="ml-2" @click="cancelDeletion"> 取消注销 </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 账户注销确认对话框 -->
    <el-dialog v-model="showDeleteConfirm" title="确认注销账户" width="500px">
      <div class="space-y-4">
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 font-medium">此操作将永久删除您的账户，无法恢复！</p>
        </div>

        <el-form ref="deleteFormRef" :model="deleteForm" :rules="deleteRules" label-width="120px">
          <el-form-item label="注销原因" prop="reason">
            <el-select v-model="deleteForm.reason" placeholder="请选择注销原因" style="width: 100%">
              <el-option label="不再需要此服务" value="no_longer_needed" />
              <el-option label="隐私考虑" value="privacy_concerns" />
              <el-option label="功能不满足需求" value="feature_issues" />
              <el-option label="其他原因" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="确认密码" prop="password">
            <el-input
              v-model="deleteForm.password"
              type="password"
              show-password
              placeholder="请输入账户密码以确认身份" />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="deleteForm.confirmed"> 我已阅读并理解注销后果，确认要注销此账户 </el-checkbox>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteConfirm = false">取消</el-button>
          <el-button type="danger" @click="confirmDeletion" :loading="deleting" :disabled="!deleteForm.confirmed">
            确认注销
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { WarningFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  exportUserData,
  getPrivacySettings,
  updatePrivacySettings as updatePrivacyAPI,
  requestAccountDeletion,
  cancelAccountDeletion,
  type PrivacySettings,
} from "@/api/userSettings";

// 数据导出
const exportType = ref<"profile" | "activity" | "all">("all");
const exporting = ref(false);
const lastExportTime = ref("2024-01-15 14:30:00");

// 导出历史
const exportHistory = ref([
  {
    id: 1,
    type: "全部数据",
    time: "2024-01-15 14:30:00",
    status: "completed",
    downloadUrl: "/downloads/user-data-20240115.zip",
  },
  {
    id: 2,
    type: "个人资料",
    time: "2024-01-10 09:15:00",
    status: "completed",
    downloadUrl: "/downloads/profile-20240110.json",
  },
]);

// 隐私设置
const privacySettings = reactive<PrivacySettings>({
  profileVisibility: "friends",
  showEmail: false,
  showPhone: false,
  showBirthday: true,
  showAddress: false,
  allowSearch: true,
  dataCollection: true,
});

// 账户注销
const showDeleteConfirm = ref(false);
const deleting = ref(false);
const deletionRequest = ref<{
  id: string;
  scheduledDate: string;
} | null>(null);

// 注销表单
const deleteFormRef = ref<FormInstance>();
const deleteForm = reactive({
  reason: "",
  password: "",
  confirmed: false,
});

// 表单验证规则
const deleteRules: FormRules = {
  reason: [{ required: true, message: "请选择注销原因", trigger: "change" }],
  password: [{ required: true, message: "请输入账户密码", trigger: "blur" }],
};

// 导出数据
const exportData = async () => {
  try {
    exporting.value = true;

    const response = await exportUserData(exportType.value);

    if (response.code === 200) {
      ElMessage.success("数据导出请求已提交，处理完成后将通知您下载");

      // 添加到导出历史
      exportHistory.value.unshift({
        id: Date.now(),
        type: exportType.value === "profile" ? "个人资料" : exportType.value === "activity" ? "活动记录" : "全部数据",
        time: new Date().toLocaleString(),
        status: "processing" as any,
        downloadUrl: "",
      });

      // 模拟处理完成
      setTimeout(() => {
        exportHistory.value[0].status = "completed";
        exportHistory.value[0].downloadUrl = response.data.downloadUrl;
        lastExportTime.value = new Date().toLocaleString();
        ElMessage.success("数据导出完成，可以下载了");
      }, 3000);
    } else {
      ElMessage.error(response.msg || "导出失败");
    }
  } catch (error) {
    console.error("导出数据失败:", error);
    ElMessage.error("导出失败");
  } finally {
    exporting.value = false;
  }
};

// 下载导出文件
const downloadExport = (url: string) => {
  window.open(url, "_blank");
};

// 更新隐私设置
const updatePrivacySettings = async () => {
  try {
    const response = await updatePrivacyAPI(privacySettings);

    if (response.code === 200) {
      ElMessage.success("隐私设置已保存");
    } else {
      ElMessage.error(response.msg || "保存失败");
    }
  } catch (error) {
    console.error("更新隐私设置失败:", error);
    ElMessage.error("保存失败");
  }
};

// 确认注销账户
const confirmDeletion = async () => {
  if (!deleteFormRef.value) return;

  try {
    await deleteFormRef.value.validate();
    deleting.value = true;

    const response = await requestAccountDeletion(deleteForm.reason, deleteForm.password);

    if (response.code === 200) {
      ElMessage.success("注销申请已提交");
      showDeleteConfirm.value = false;

      // 保存注销请求信息
      deletionRequest.value = {
        id: response.data?.deletionRequestId || "",
        scheduledDate: response.data?.scheduledDeletionDate || "",
      };

      // 重置表单
      deleteForm.reason = "";
      deleteForm.password = "";
      deleteForm.confirmed = false;
      deleteFormRef.value.resetFields();
    } else {
      ElMessage.error(response.msg || "注销申请失败");
    }
  } catch (error) {
    console.error("注销申请失败:", error);
    ElMessage.error("注销申请失败");
  } finally {
    deleting.value = false;
  }
};

// 取消注销
const cancelDeletion = async () => {
  if (!deletionRequest.value) return;

  try {
    await ElMessageBox.confirm("确定要取消账户注销申请吗？", "确认取消", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    });

    const response = await cancelAccountDeletion(deletionRequest.value.id);

    if (response.code === 200) {
      ElMessage.success("注销申请已取消");
      deletionRequest.value = null;
    } else {
      ElMessage.error(response.msg || "取消失败");
    }
  } catch {
    // 用户取消操作
  }
};

// 加载隐私设置
const loadPrivacySettings = async () => {
  try {
    const response = await getPrivacySettings();
    if (response.code === 200) {
      Object.assign(privacySettings, response.data);
    }
  } catch (error) {
    console.error("加载隐私设置失败:", error);
    // 使用默认设置
  }
};

// 页面挂载时加载数据
onMounted(() => {
  loadPrivacySettings();
});
</script>

<style scoped>
.data-management {
  min-height: 100vh;
}

.el-card {
  border-radius: 8px;
}

.el-card :deep(.el-card__header) {
  background-color: #f8f9fa;
  padding: 16px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
