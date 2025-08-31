<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose">
    <el-form
      ref="userFormRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      :disabled="formLoading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="formData.nickName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptTree"
              :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
              value-key="deptId"
              placeholder="请选择归属部门"
              check-strictly
              style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="formData.phonenumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item v-if="type === 'add'" label="用户名称" prop="userName">
            <el-input v-model="formData.userName" placeholder="请输入用户名称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="type === 'add'" label="用户密码" prop="password">
            <el-input
              v-model="formData.password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="20"
              show-password />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="formData.sex" placeholder="请选择性别">
              <el-option
                v-for="item in USER_GENDER_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="item in USER_STATUS_OPTIONS"
                :key="item.value"
                :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="formData.postIds" multiple placeholder="请选择岗位" style="width: 100%">
              <el-option
                v-for="item in postList"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
                :disabled="item.status === '1'" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="formData.roleIds" multiple placeholder="请选择角色" style="width: 100%">
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

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入备注"
              :rows="3"
              maxlength="500"
              show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="formLoading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import type { SystemUser, UserForm } from "@/types/system/user";
import { USER_STATUS_OPTIONS, USER_GENDER_OPTIONS } from "@/types/system/user";
import { useUserManageStore } from "@/stores/system/userManage";

// 定义组件属性
interface Props {
  modelValue: boolean;
  title: string;
  type: "add" | "edit";
  userData?: SystemUser | null;
  roleList: SystemRole[];
  postList: SystemPost[];
  deptTree: SystemDept[];
}

// 定义事件
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: "操作用户",
  type: "add",
  userData: null,
  roleList: () => [],
  postList: () => [],
  deptTree: () => [],
});

const emit = defineEmits<Emits>();

// 使用 store
const userStore = useUserManageStore();

// 表单引用
const userFormRef = ref<FormInstance>();

// 表单加载状态
const formLoading = ref(false);

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 表单数据
const formData = ref<UserForm>({
  userId: undefined,
  deptId: undefined,
  userName: "",
  nickName: "",
  email: "",
  phonenumber: "",
  sex: "0",
  status: "0",
  roleIds: [],
  postIds: [],
  remark: "",
});

// 表单验证规则
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: "用户名称不能为空", trigger: "blur" },
    { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" },
  ],
  nickName: [
    { required: true, message: "用户昵称不能为空", trigger: "blur" },
    { min: 2, max: 30, message: "用户昵称长度必须介于 2 和 30 之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "用户密码不能为空", trigger: "blur" },
    { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" },
  ],
  email: [
    { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
  ],
  phonenumber: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" },
  ],
});

// 监听用户数据变化
watch(
  () => props.userData,
  (newVal) => {
    if (newVal && props.type === "edit") {
      // 编辑模式下，初始化表单数据
      formData.value = {
        userId: newVal.userId,
        deptId: newVal.deptId,
        userName: newVal.userName,
        nickName: newVal.nickName,
        email: newVal.email || "",
        phonenumber: newVal.phonenumber || "",
        sex: newVal.sex || "0",
        status: newVal.status,
        roleIds: newVal.roleIds || [],
        postIds: newVal.postIds || [],
        remark: newVal.remark || "",
      };
    } else if (props.type === "add") {
      // 新增模式下，重置表单数据
      formData.value = {
        userId: undefined,
        deptId: undefined,
        userName: "",
        nickName: "",
        email: "",
        phonenumber: "",
        sex: "0",
        status: "0",
        roleIds: [],
        postIds: [],
        remark: "",
      };
    }
  },
  { immediate: true },
);

/**
 * 关闭对话框
 */
function handleClose() {
  dialogVisible.value = false;
  // 重置表单
  userFormRef.value?.resetFields();
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!userFormRef.value) return;

  try {
    // 表单验证
    await userFormRef.value.validate();

    formLoading.value = true;

    // 根据操作类型调用不同方法
    let success = false;
    if (props.type === "add") {
      success = await userStore.addUserData(formData.value);
    } else {
      success = await userStore.updateUserData(formData.value);
    }

    if (success) {
      ElMessage.success(props.type === "add" ? "新增用户成功" : "修改用户成功");
      handleClose();
      emit("success");
    }
  } catch (error) {
    console.error("表单提交失败:", error);
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