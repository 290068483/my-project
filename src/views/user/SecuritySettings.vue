<template>
  <div class="user-security-settings p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">安全设置</h2>

      <!-- 密码设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">密码设置</span>
            <el-button type="primary" @click="showPasswordDialog = true">修改密码</el-button>
          </div>
        </template>
        <div class="space-y-4">
          <div class="text-gray-600">
            <p>上次修改时间：{{ lastPasswordChangeTime || "未知" }}</p>
            <p class="text-sm text-gray-500 mt-2">建议定期更换密码以保证账户安全</p>
          </div>

          <!-- 密码强度状态 -->
          <div class="password-status">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm font-medium">当前密码强度：</span>
              <el-tag :type="passwordStrengthType" size="small">
                {{ passwordStrengthText }}
              </el-tag>
            </div>
            <div v-if="passwordExpiryDays !== null" class="text-sm">
              <span :class="passwordExpiryDays <= 7 ? 'text-red-500' : 'text-gray-500'">
                密码将在 {{ passwordExpiryDays }} 天后过期
              </span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 密保问题设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">密保问题</span>
            <el-button type="primary" @click="showSecurityQuestionsDialog = true">
              {{ hasSecurityQuestions ? "管理问题" : "设置问题" }}
            </el-button>
          </div>
        </template>
        <div class="space-y-4">
          <div v-if="hasSecurityQuestions" class="text-gray-600">
            <p>已设置 {{ securityQuestionsCount }} 个密保问题</p>
            <p class="text-sm text-gray-500 mt-2">密保问题用于账户找回和重要操作验证</p>
          </div>
          <div v-else class="text-gray-600">
            <p class="text-orange-600">尚未设置密保问题</p>
            <p class="text-sm text-gray-500 mt-2">设置密保问题可以提高账户安全性，建议及时设置</p>
          </div>
        </div>
      </el-card>

      <!-- 双重认证 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">双重认证</span>
            <el-tag :type="twoFactorEnabled ? 'success' : 'warning'">
              {{ twoFactorEnabled ? "已启用" : "未启用" }}
            </el-tag>
          </div>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">短信验证</p>
              <p class="text-sm text-gray-500">通过短信接收验证码</p>
            </div>
            <el-switch
              v-model="twoFactorSettings.sms"
              @change="updateTwoFactorAuth('sms', $event)"
              :loading="updating.sms" />
          </div>

          <el-divider />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">邮箱验证</p>
              <p class="text-sm text-gray-500">通过邮箱接收验证码</p>
            </div>
            <el-switch
              v-model="twoFactorSettings.email"
              @change="updateTwoFactorAuth('email', $event)"
              :loading="updating.email" />
          </div>

          <el-divider />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">身份验证器应用</p>
              <p class="text-sm text-gray-500">使用Google Authenticator等应用</p>
            </div>
            <el-switch
              v-model="twoFactorSettings.app"
              @change="updateTwoFactorAuth('app', $event)"
              :loading="updating.app" />
          </div>
        </div>
      </el-card>

      <!-- 登录日志 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">登录日志</span>
            <el-button @click="loadLoginLogs" :loading="loadingLogs">刷新</el-button>
          </div>
        </template>
        <el-table :data="loginLogs" style="width: 100%" max-height="300" empty-text="暂无登录记录">
          <el-table-column prop="loginTime" label="登录时间" width="160" />
          <el-table-column prop="loginIp" label="IP地址" width="120" />
          <el-table-column prop="loginLocation" label="登录地点" width="120" />
          <el-table-column prop="browser" label="浏览器" width="100" />
          <el-table-column prop="os" label="操作系统" width="100" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'" size="small">
                {{ scope.row.status === "success" ? "成功" : "失败" }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex justify-center mt-4">
          <el-pagination
            v-model:current-page="logsPagination.current"
            v-model:page-size="logsPagination.size"
            :page-sizes="[10, 20, 50]"
            :total="logsPagination.total"
            layout="total, sizes, prev, pager, next"
            @size-change="loadLoginLogs"
            @current-change="loadLoginLogs"
            small />
        </div>
      </el-card>

      <!-- 账户安全建议 -->
      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold">安全建议</span>
        </template>
        <div class="space-y-3">
          <div class="flex items-center">
            <el-icon class="text-green-500 mr-2"><SuccessFilled /></el-icon>
            <span class="text-sm">使用强密码</span>
          </div>
          <div class="flex items-center">
            <el-icon :class="twoFactorEnabled ? 'text-green-500' : 'text-orange-500'" class="mr-2">
              <component :is="twoFactorEnabled ? 'SuccessFilled' : 'WarningFilled'" />
            </el-icon>
            <span class="text-sm">启用双重认证</span>
          </div>
          <div class="flex items-center">
            <el-icon class="text-green-500 mr-2"><SuccessFilled /></el-icon>
            <span class="text-sm">定期检查登录活动</span>
          </div>
          <div class="flex items-center">
            <el-icon class="text-orange-500 mr-2"><WarningFilled /></el-icon>
            <span class="text-sm">不要在公共设备上保存密码</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="600px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
            @input="onPasswordInput" />
          <!-- 密码强度检查器 -->
          <PasswordStrengthChecker
            :password="passwordForm.newPassword"
            :show-requirements="true"
            @strength-change="onPasswordStrengthChange" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="updatePassword"
            :loading="updatingPassword"
            :disabled="!passwordStrengthValid">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 密保问题设置对话框 -->
    <el-dialog v-model="showSecurityQuestionsDialog" title="密保问题设置" width="800px">
      <SecurityQuestionsSetup
        :min-questions="2"
        :max-questions="5"
        @saved="onSecurityQuestionsSaved"
        @cancel="showSecurityQuestionsDialog = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { SuccessFilled, WarningFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { getUserLoginLogs, setupTwoFactorAuth, verifyCurrentPassword, type LoginLog } from "@/api/userSettings";
import { changePassword } from "@/api/user";
import { getAccountSecurityStatus } from "@/api/authSecurity";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker.vue";
import SecurityQuestionsSetup from "@/components/SecurityQuestionsSetup.vue";

// 响应式数据
const showPasswordDialog = ref(false);
const showSecurityQuestionsDialog = ref(false);
const loadingLogs = ref(false);
const updatingPassword = ref(false);
const lastPasswordChangeTime = ref("2024-01-15 10:30:00");

// 密码强度相关
const passwordStrengthScore = ref(0);
const passwordStrengthLevel = ref("weak");
const passwordStrengthValid = ref(false);
const passwordExpiryDays = ref<number | null>(null);

// 密保问题状态
const hasSecurityQuestions = ref(false);
const securityQuestionsCount = ref(0);

// 双重认证设置
const twoFactorSettings = reactive({
  sms: false,
  email: false,
  app: false,
});

// 更新状态
const updating = reactive({
  sms: false,
  email: false,
  app: false,
});

// 登录日志
const loginLogs = ref<LoginLog[]>([]);
const logsPagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 密码表单
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 表单验证规则
const passwordRules: FormRules = {
  currentPassword: [{ required: true, message: "请输入当前密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应在6-20个字符之间", trigger: "blur" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
      message: "密码必须包含大小写字母和数字",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 计算属性
const twoFactorEnabled = computed(() => {
  return twoFactorSettings.sms || twoFactorSettings.email || twoFactorSettings.app;
});

// 密码强度显示
const passwordStrengthType = computed(() => {
  const types: Record<string, "danger" | "warning" | "success" | "info"> = {
    weak: "danger",
    medium: "warning",
    strong: "success",
    very_strong: "success",
  };
  return types[passwordStrengthLevel.value] || "info";
});

const passwordStrengthText = computed(() => {
  const texts: Record<string, string> = {
    weak: "弱",
    medium: "中等",
    strong: "强",
    very_strong: "非常强",
  };
  return texts[passwordStrengthLevel.value] || "未知";
});

// 加载登录日志
const loadLoginLogs = async () => {
  try {
    loadingLogs.value = true;
    const response = await getUserLoginLogs(logsPagination.current, logsPagination.size);

    if (response.code === 200) {
      loginLogs.value = response.data.list;
      logsPagination.total = response.data.total;
    } else {
      ElMessage.error(response.msg || "获取登录日志失败");
    }
  } catch (error) {
    console.error("获取登录日志失败:", error);
    ElMessage.error("获取登录日志失败");
  } finally {
    loadingLogs.value = false;
  }
};

// 更新双重认证
const updateTwoFactorAuth = async (method: "sms" | "email" | "app", enable: boolean) => {
  try {
    updating[method] = true;

    const response = await setupTwoFactorAuth(method, enable);

    if (response.code === 200) {
      ElMessage.success(
        `${enable ? "启用" : "禁用"}${method === "sms" ? "短信" : method === "email" ? "邮箱" : "APP"}认证成功`,
      );

      // 如果是APP认证且启用，显示二维码
      if (method === "app" && enable && response.data?.qrCode) {
        ElMessageBox.alert(
          `<img src="${response.data.qrCode}" alt="二维码" style="max-width: 200px;">`,
          "请扫描二维码",
          {
            dangerouslyUseHTMLString: true,
          },
        );
      }
    } else {
      twoFactorSettings[method] = !enable; // 恢复原状态
      ElMessage.error(response.msg || "操作失败");
    }
  } catch (error) {
    console.error("更新双重认证失败:", error);
    twoFactorSettings[method] = !enable; // 恢复原状态
    ElMessage.error("操作失败");
  } finally {
    updating[method] = false;
  }
};

// 修改密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return;

  try {
    await passwordFormRef.value.validate();

    // 检查密码强度
    if (!passwordStrengthValid.value) {
      ElMessage.error("密码强度不符合要求，请使用更强的密码");
      return;
    }

    updatingPassword.value = true;

    // 先验证当前密码
    const verifyResponse = await verifyCurrentPassword(passwordForm.currentPassword);
    if (verifyResponse.code !== 200 || !verifyResponse.data.verified) {
      ElMessage.error("当前密码错误");
      return;
    }

    // 修改密码
    const response = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

    if (response.code === 200) {
      ElMessage.success("密码修改成功");
      showPasswordDialog.value = false;
      // 重置表单
      passwordForm.currentPassword = "";
      passwordForm.newPassword = "";
      passwordForm.confirmPassword = "";
      passwordFormRef.value.resetFields();
      // 更新最后修改时间
      lastPasswordChangeTime.value = new Date().toLocaleString();

      // 重新加载安全状态
      loadAccountSecurityStatus();
    } else {
      ElMessage.error(response.msg || "密码修改失败");
    }
  } catch (error) {
    console.error("密码修改失败:", error);
    ElMessage.error("密码修改失败");
  } finally {
    updatingPassword.value = false;
  }
};

// 密码输入时的处理
const onPasswordInput = () => {
  // 可以在这里添加额外的密码检查逻辑
};

// 密码强度变化回调
const onPasswordStrengthChange = (score: number, level: string, isValid: boolean) => {
  passwordStrengthScore.value = score;
  passwordStrengthLevel.value = level;
  passwordStrengthValid.value = isValid;
};

// 密保问题保存回调
const onSecurityQuestionsSaved = (questions: Array<{ question: string; answer: string }>) => {
  hasSecurityQuestions.value = true;
  securityQuestionsCount.value = questions.length;
  showSecurityQuestionsDialog.value = false;
  ElMessage.success("密保问题设置成功");
};

// 加载账户安全状态
const loadAccountSecurityStatus = async () => {
  try {
    const response = await getAccountSecurityStatus();
    if (response.code === 200) {
      const status = response.data;
      passwordExpiryDays.value = status.passwordExpired ? 0 : null;
      // 这里可以根据实际返回的数据设置密码过期天数
    }
  } catch (error) {
    console.error("加载安全状态失败:", error);
  }
};

// 页面挂载时加载数据
onMounted(() => {
  loadLoginLogs();
  loadAccountSecurityStatus();

  // 模拟加载双重认证设置
  twoFactorSettings.sms = false;
  twoFactorSettings.email = false;
  twoFactorSettings.app = false;

  // 模拟密保问题状态
  hasSecurityQuestions.value = false;
  securityQuestionsCount.value = 0;

  // 模拟密码强度状态（正常情况下应该从后端获取）
  passwordStrengthLevel.value = "medium";
  passwordStrengthScore.value = 65;
  passwordExpiryDays.value = 45;
});
</script>

<style scoped>
.user-security-settings {
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

.password-status {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.password-status .text-red-500 {
  color: #f56565;
  font-weight: 500;
}

.password-status .text-gray-500 {
  color: #909399;
}
</style>
