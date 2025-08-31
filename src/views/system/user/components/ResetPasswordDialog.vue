<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="400px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose">
    <el-form
      ref="pwdFormRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      :disabled="formLoading">
      <el-form-item label="用户名称">
        <el-input v-model="userData.userName" disabled />
      </el-form-item>
      
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="请输入新密码"
          type="password"
          maxlength="20"
          show-password />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="formData.confirmPassword"
          placeholder="请再次输入新密码"
          type="password"
          maxlength="20"
          show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="formLoading">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import type { SystemUser } from "@/types/system/user";
import { useUserManageStore } from "@/stores/system/userManage";

// 定义组件属性
interface Props {
  modelValue: boolean;
  userData: SystemUser;
}

// 定义事件
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  userData: () => ({} as SystemUser),
});

const emit = defineEmits<Emits>();

// 使用 store
const userStore = useUserManageStore();

// 表单引用
const pwdFormRef = ref<FormInstance>();

// 表单加载状态
const formLoading = ref(false);

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 标题
const title = ref("重置密码");

// 表单数据
const formData = reactive({
  password: "",
  confirmPassword: "",
});

// 表单验证规则
const rules = reactive<FormRules>({
  password: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    { min: 5, max: 20, message: "密码长度必须介于 5 和 20 之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value === "") {
          callback(new Error("请再次输入新密码"));
        } else if (value !== formData.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

// 监听对话框显示状态变化
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    // 关闭时重置表单
    pwdFormRef.value?.resetFields();
    formData.password = "";
    formData.confirmPassword = "";
  }
});

/**
 * 关闭对话框
 */
function handleClose() {
  dialogVisible.value = false;
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!pwdFormRef.value) return;

  try {
    // 表单验证
    await pwdFormRef.value.validate();

    formLoading.value = true;

    // 调用重置密码方法
    const success = await userStore.resetPassword(props.userData.userId!, formData.password);

    if (success) {
      ElMessage.success("重置密码成功");
      handleClose();
      emit("success");
    }
  } catch (error) {
    console.error("重置密码失败:", error);
  } finally {
    formLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>