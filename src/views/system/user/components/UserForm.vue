<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form ref="userFormRef" :model="form" :rules="rules" label-width="100px" class="user-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select
              v-model="form.deptId"
              :data="deptTree"
              :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
              value-key="deptId"
              placeholder="请选择归属部门"
              check-strictly
              clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" :disabled="type === 'edit'" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="用户性别" prop="sex">
            <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option
                v-for="dict in USER_GENDER_OPTIONS"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in USER_STATUS_OPTIONS" :key="dict.value" :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="岗位" prop="postIds">
            <el-select v-model="form.postIds" placeholder="请选择岗位" multiple>
              <el-option
                v-for="item in postList"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
                :disabled="item.status === '1'" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="form.roleIds" placeholder="请选择角色" multiple>
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
                :disabled="item.status === '1'" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
              :autosize="{ minRows: 3, maxRows: 6 }"
              maxlength="500" />
          </el-form-item>
        </el-col>
      </el-row>
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
import { USER_STATUS_OPTIONS, USER_GENDER_OPTIONS } from "@/types/system/user";
import type { SystemUser, SystemRole, SystemPost, SystemDept, UserForm } from "@/types/system/user";

// Props
interface Props {
  modelValue: boolean;
  title: string;
  type: "add" | "edit";
  userData?: SystemUser | null;
  roleList: SystemRole[];
  postList: SystemPost[];
  deptTree: SystemDept[];
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
const userFormRef = ref<FormInstance>();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 提交加载状态
const submitLoading = ref(false);

// 表单数据
const form = ref<UserForm>({
  userId: undefined,
  deptId: undefined,
  userName: "",
  nickName: "",
  email: "",
  phonenumber: "",
  sex: "2",
  status: "0",
  roleIds: [],
  postIds: [],
  remark: "",
});

// 表单验证规则
const rules = computed<FormRules>(() => ({
  userName: [
    { required: true, message: "用户名称不能为空", trigger: "blur" },
    { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
      message: "用户名称只能包含中文、英文、数字",
      trigger: "blur",
    },
    {
      validator: async (rule, value) => {
        if (props.type === "edit" && props.userData?.userName === value) {
          return true;
        }

        if (value) {
          const isUnique = await userStore.validateUserName(value, form.value.userId);
          if (!isUnique) {
            throw new Error("用户名称已存在");
          }
        }
        return true;
      },
      trigger: "blur",
    },
  ],
  nickName: [
    { required: true, message: "用户昵称不能为空", trigger: "blur" },
    { min: 2, max: 20, message: "用户昵称长度必须介于 2 和 20 之间", trigger: "blur" },
  ],
  deptId: [{ required: true, message: "归属部门不能为空", trigger: "change" }],
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
    {
      validator: async (rule, value) => {
        if (props.type === "edit" && props.userData?.email === value) {
          return true;
        }

        if (value) {
          const isUnique = await userStore.validateEmail(value, form.value.userId);
          if (!isUnique) {
            throw new Error("邮箱地址已存在");
          }
        }
        return true;
      },
      trigger: "blur",
    },
  ],
  phonenumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
    {
      validator: async (rule, value) => {
        if (props.type === "edit" && props.userData?.phonenumber === value) {
          return true;
        }

        if (value) {
          const isUnique = await userStore.validatePhone(value, form.value.userId);
          if (!isUnique) {
            throw new Error("手机号码已存在");
          }
        }
        return true;
      },
      trigger: "blur",
    },
  ],
  status: [{ required: true, message: "用户状态不能为空", trigger: "change" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "change" }],
}));

// 监听用户数据变化
watch(
  () => props.userData,
  (userData) => {
    if (userData && props.type === "edit") {
      // 编辑模式，填充表单数据
      form.value = {
        userId: userData.userId,
        deptId: userData.deptId,
        userName: userData.userName,
        nickName: userData.nickName,
        email: userData.email || "",
        phonenumber: userData.phonenumber || "",
        sex: userData.sex || "2",
        status: userData.status,
        roleIds: userData.roleIds || [],
        postIds: userData.postIds || [],
        remark: userData.remark || "",
      };
    } else if (props.type === "add") {
      // 新增模式，重置表单
      resetForm();
    }
  },
  { immediate: true },
);

// 监听对话框显示状态
watch(dialogVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      userFormRef.value?.clearValidate();
    });
  }
});

/**
 * 重置表单
 */
function resetForm() {
  form.value = {
    userId: undefined,
    deptId: undefined,
    userName: "",
    nickName: "",
    email: "",
    phonenumber: "",
    sex: "2",
    status: "0",
    roleIds: [],
    postIds: [],
    remark: "",
  };

  nextTick(() => {
    userFormRef.value?.clearValidate();
  });
}

/**
 * 提交表单
 */
async function handleSubmit() {
  try {
    const valid = await userFormRef.value?.validate();
    if (!valid) return;

    submitLoading.value = true;

    let success = false;
    if (props.type === "add") {
      success = await userStore.addUserData(form.value);
    } else {
      success = await userStore.updateUserData(form.value);
    }

    if (success) {
      emit("success");
    }
  } catch (error) {
    console.error("提交用户表单失败:", error);
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

/**
 * 关闭对话框
 */
function handleClose(done: () => void) {
  userFormRef.value?.clearValidate();
  resetForm();
  done();
}
</script>

<style scoped lang="scss">
.user-form {
  padding: 20px;

  .el-form-item {
    margin-bottom: 20px;
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

:deep(.el-select) {
  width: 100%;
}

:deep(.el-tree-select) {
  width: 100%;
}
</style>
