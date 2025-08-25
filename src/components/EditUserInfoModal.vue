<template>
  <el-dialog
    v-model="visible"
    title="编辑用户信息"
    width="500px"
    @update:modelValue="handleClose"
  >
    <el-form
      :model="editForm"
      label-width="80px"
      ref="editFormRef"
      @submit.prevent
      :rules="editFormRules"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>

      <el-form-item label="职位" prop="position">
        <el-input v-model="editForm.position" />
      </el-form-item>

      <el-form-item label="部门" prop="department">
        <el-input v-model="editForm.department" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" type="email" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="confirmEditInfo"
          :loading="updatingInfo"
        >
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, defineProps, defineEmits } from "vue";
import type { FormRules, FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

export interface UserInfo {
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
  email?: string;
}

const props = defineProps<{
  modelValue: boolean;
  userInfo: UserInfo;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", userInfo: UserInfo): void;
  (e: "close"): void;
}>();

// 响应式数据
const editFormRef = ref<FormInstance>();
const updatingInfo = ref(false);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const editForm = reactive<UserInfo>({
  name: "",
  department: "",
  position: "",
  email: "",
});

// 表单验证规则
const editFormRules: FormRules = {
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度应在2-20个字符之间", trigger: "blur" },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
  position: [{ required: false, message: "请输入职位", trigger: "blur" }],
  department: [{ required: false, message: "请输入部门", trigger: "blur" }],
};

// 监听userInfo变化，更新表单数据
watch(
  () => props.userInfo,
  (newUserInfo) => {
    if (newUserInfo) {
      editForm.name = newUserInfo.name || "";
      editForm.department = newUserInfo.department || "";
      editForm.position = newUserInfo.position || "";
      editForm.email = newUserInfo.email || "";
    }
  },
  { immediate: true }
);

// 处理关闭
const handleClose = () => {
  visible.value = false;
  emit("close");
};

// 确认编辑信息
const confirmEditInfo = async () => {
  if (!editFormRef.value) return;

  try {
    await editFormRef.value.validate();
    updatingInfo.value = true;

    // 模拟保存过程
    setTimeout(() => {
      updatingInfo.value = false;
      emit("save", { ...editForm });
      handleClose();
      ElMessage.success("用户信息更新成功");
    }, 500);
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>