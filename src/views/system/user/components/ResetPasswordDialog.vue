<template>
  <el-dialog v-model="dialogVisible" title="重置密码" width="500px" :close-on-click-modal="false">
    <el-form ref="passwordFormRef" :model="form" :rules="rules" label-width="100px" class="password-form">
      <el-form-item label="用户名称">
        <el-input :value="userData?.userName" disabled />
      </el-form-item>

      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入新密码" show-password maxlength="20" />
        <div class="password-tips">
          <small>密码长度为5-20个字符，支持字母、数字和特殊字符</small>
        </div>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请确认新密码"
          show-password
          maxlength="20" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确 定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useUserManageStore } from "@/stores/system/userManage";
import { PASSWORD_RULES } from "@/types/system/user";
import type { SystemUser } from "@/types/system/user";

// Props
interface Props {
  modelValue: boolean;
  userData?: SystemUser | null;
}

const props = withDefaults(defineProps<Props>(), {
  userData: null,
});

// Emits
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const emit = defineEmits<Emits>();

// Store
const userStore = useUserManageStore();

// 表单引用
const passwordFormRef = ref<FormInstance>();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 提交加载状态
const submitLoading = ref(false);

// 表单数据
const form = ref({
  password: "",
  confirmPassword: "",
});

// 表单验证规则
const rules = computed<FormRules>(() => ({
  password: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    {
      min: PASSWORD_RULES.MIN_LENGTH,
      max: PASSWORD_RULES.MAX_LENGTH,
      message: `密码长度必须介于 ${PASSWORD_RULES.MIN_LENGTH} 和 ${PASSWORD_RULES.MAX_LENGTH} 之间`,
      trigger: "blur",
    },
    {
      pattern: PASSWORD_RULES.PATTERN,
      message: "密码只能包含字母、数字和特殊字符",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
}));

// 监听对话框显示状态
watch(dialogVisible, (visible) => {
  if (visible) {
    resetForm();
  }
});

/**
 * 重置表单
 */
function resetForm() {
  form.value = {
    password: "",
    confirmPassword: "",
  };

  nextTick(() => {
    passwordFormRef.value?.clearValidate();
  });
}

/**
 * 提交表单
 */
async function handleSubmit() {
  try {
    const valid = await passwordFormRef.value?.validate();
    if (!valid) return;

    if (!props.userData?.userId) {
      ElMessage.error("用户信息不完整");
      return;
    }

    submitLoading.value = true;

    const success = await userStore.resetPassword(props.userData.userId, form.value.password);

    if (success) {
      emit("success");
    }
  } catch (error) {
    console.error("重置密码失败:", error);
  } finally {
    submitLoading.value = false;
  }
}

/**
 * 取消操作
 */
function handleCancel() {
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.password-form {
  padding: 20px 0;

  .el-form-item {
    margin-bottom: 25px;
  }

  .password-tips {
    margin-top: 8px;
    color: #909399;
    font-size: 12px;
  }
}

.dialog-footer {
  text-align: right;
}

// 表单样式优化
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;

  &:hover {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }
}
</style>
