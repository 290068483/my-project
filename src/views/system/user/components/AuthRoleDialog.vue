<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="400px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose">
    <el-form
      ref="roleFormRef"
      :model="formData"
      label-width="80px"
      :disabled="formLoading">
      <el-form-item label="用户名称">
        <el-input v-model="userData.userName" disabled />
      </el-form-item>
      
      <el-form-item label="用户角色">
        <el-checkbox-group v-model="formData.roleIds">
          <el-checkbox
            v-for="role in roles"
            :key="role.roleId"
            :label="role.roleId!"
            :disabled="role.status === '1'">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
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
import { ref, computed, reactive, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { SystemUser, SystemRole } from "@/types/system/user";
import { getAuthRole, updateAuthRole } from "@/api/system/user";

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

// 表单引用
const roleFormRef = ref<FormInstance>();

// 表单加载状态
const formLoading = ref(false);

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 标题
const title = ref("分配角色");

// 角色列表
const roles = ref<SystemRole[]>([]);

// 表单数据
const formData = reactive({
  roleIds: [] as number[],
});

// 监听对话框显示状态变化
watch(dialogVisible, async (newVal) => {
  if (newVal) {
    // 打开时获取角色数据
    await getRoleData();
  } else {
    // 关闭时重置数据
    roles.value = [];
    formData.roleIds = [];
  }
});

/**
 * 获取角色数据
 */
async function getRoleData() {
  try {
    formLoading.value = true;
    const response = await getAuthRole(props.userData.userId!);

    if (response.code === 200) {
      const { roles, user } = response.data;
      roles.value = roles || [];
      
      // 设置当前用户的角色
      if (user && user.roles) {
        formData.roleIds = user.roles.map((role: SystemRole) => role.roleId!);
      }
    } else {
      ElMessage.error(response.msg || "获取角色数据失败");
    }
  } catch (error) {
    console.error("获取角色数据失败:", error);
    ElMessage.error("获取角色数据失败");
  } finally {
    formLoading.value = false;
  }
}

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
  try {
    formLoading.value = true;

    // 调用分配角色方法
    const data = {
      userId: props.userData.userId,
      roleIds: formData.roleIds,
    };
    
    const response = await updateAuthRole(data);

    if (response.code === 200) {
      ElMessage.success("分配角色成功");
      handleClose();
      emit("success");
    } else {
      ElMessage.error(response.msg || "分配角色失败");
    }
  } catch (error) {
    console.error("分配角色失败:", error);
    ElMessage.error("分配角色失败");
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

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.el-checkbox {
  margin-right: 0;
}
</style>
