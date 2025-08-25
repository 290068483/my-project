<template>
  <div class="component-user-info p-6 max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">用户信息</h2>

      <div class="flex flex-col items-center mb-8">
        <el-avatar
          :size="80"
          :src="userAvatar"
          class="border-2 border-blue-200 mb-4"
          :alt="userName + '的头像'"></el-avatar>
        <el-button type="primary" @click="updateAvatar" class="mb-2"> 修改头像 </el-button>
      </div>

      <el-divider></el-divider>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="user-info-item">
          <div class="text-sm text-gray-500 mb-1">用户名</div>
          <div class="text-lg font-medium text-gray-800">
            {{ userName }}
          </div>
        </div>

        <div class="user-info-item">
          <div class="text-sm text-gray-500 mb-1">职位</div>
          <div class="text-lg font-medium text-gray-800">
            {{ userPosition }}
          </div>
        </div>

        <div class="user-info-item">
          <div class="text-sm text-gray-500 mb-1">部门</div>
          <div class="text-lg font-medium text-gray-800">
            {{ userDepartment }}
          </div>
        </div>

        <div class="user-info-item">
          <div class="text-sm text-gray-500 mb-1">邮箱</div>
          <div class="text-lg font-medium text-gray-800">
            {{ userEmail }}
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <el-button type="primary" @click="openEditInfo" size="default"> 编辑信息 </el-button>
      </div>
    </div>

    <!-- 修改头像对话框 -->
    <el-dialog v-model="avatarDialogVisible" title="修改头像" width="500px" @close="handleAvatarDialogClose">
      <div class="flex flex-col items-center">
        <el-upload
          class="avatar-uploader mb-4"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :before-upload="beforeAvatarUpload">
          <img v-if="tempAvatar" :src="tempAvatar" class="avatar-preview" />
          <el-avatar v-else :size="80" :src="userAvatar"></el-avatar>
        </el-upload>
        <p class="text-sm text-gray-500 mt-2">点击上传新头像</p>
        <p class="text-xs text-gray-400 mt-1">支持JPG/PNG格式，大小不超过2MB</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="avatarDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUpdateAvatar" :loading="updatingAvatar" :disabled="!tempAvatar">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑信息对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="500px">
      <el-form :model="editForm" label-width="80px" ref="editFormRef" @submit.prevent :rules="editFormRules">
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
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEditInfo" :loading="updatingInfo"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import type { UploadFile, UploadRawFile } from "element-plus";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";

// 定义常量
const DEFAULT_AVATAR = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

export interface UserInfo {
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
  email?: string;
}

// 使用用户存储
const userStore = useUserStore();

// 响应式数据
const userInfo = ref<UserInfo>({
  name: "",
  department: "",
  position: "",
  avatar: "",
  email: "",
});

const avatarDialogVisible = ref(false);
const editDialogVisible = ref(false);
const tempAvatar = ref("");
const updatingAvatar = ref(false);
const updatingInfo = ref(false);

// 计算属性
const userAvatar = computed(() => {
  return userInfo.value.avatar || DEFAULT_AVATAR;
});

const userName = computed(() => {
  return userInfo.value.name || "未设置";
});

const userPosition = computed(() => {
  return userInfo.value.position || "未设置";
});

const userDepartment = computed(() => {
  return userInfo.value.department || "未设置";
});

const userEmail = computed(() => {
  return userInfo.value.email || "未设置";
});

// 编辑表单引用和数据
const editFormRef = ref();
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

// 处理页面挂载
onMounted(() => {
  loadUserInfo();
});

// 加载用户信息
const loadUserInfo = () => {
  // 从用户存储中获取信息
  if (userStore.userInfo) {
    const { name, department, position, avatar, email } = userStore.userInfo;
    userInfo.value = { name, department, position, avatar, email };
  } else {
    // 如果用户信息不存在，设置默认值
    userInfo.value = {
      name: "",
      department: "",
      position: "",
      avatar: "",
      email: "",
    };
  }
};

// 修改头像
const updateAvatar = () => {
  avatarDialogVisible.value = true;
  tempAvatar.value = userInfo.value.avatar || "";
};

// 头像上传前的验证
const beforeAvatarUpload = (rawFile: UploadRawFile) => {
  const isJPGorPNG = rawFile.type === "image/jpeg" || rawFile.type === "image/png";
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPGorPNG) {
    ElMessage.error("头像图片只能是 JPG 或 PNG 格式!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("头像图片大小不能超过 2MB!");
    return false;
  }
  return true;
};

// 处理头像更改
const handleAvatarChange = (file: UploadFile) => {
  if (!beforeAvatarUpload(file.raw as UploadRawFile)) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    // 简单的 XSS 防护，确保是有效的图片数据
    if (result && (result.startsWith("data:image/jpeg;base64,") || result.startsWith("data:image/png;base64,"))) {
      tempAvatar.value = result;
    } else {
      ElMessage.error("无效的图片文件");
    }
  };
  reader.onerror = () => {
    ElMessage.error("读取文件时发生错误");
  };
  reader.readAsDataURL(file.raw!);
};

// 确认更新头像
const confirmUpdateAvatar = async () => {
  if (!tempAvatar.value) {
    ElMessage.warning("请先选择头像文件");
    return;
  }

  updatingAvatar.value = true;

  try {
    // 模拟上传头像到服务器
    // 实际项目中这里应该调用上传接口
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 更新用户存储中的头像
    if (userStore.userInfo) {
      userStore.updateUserInfo({
        ...userStore.userInfo,
        avatar: tempAvatar.value,
      });
    }

    // 更新本地用户信息
    userInfo.value.avatar = tempAvatar.value;

    ElMessage.success("头像修改成功");
    avatarDialogVisible.value = false;
  } catch (error) {
    ElMessage.error((error as Error).message || "头像修改失败");
  } finally {
    updatingAvatar.value = false;
  }
};

// 处理头像对话框关闭
const handleAvatarDialogClose = () => {
  tempAvatar.value = "";
};

// 打开编辑信息弹窗
const openEditInfo = () => {
  // 初始化表单数据
  editForm.name = userInfo.value.name || "";
  editForm.department = userInfo.value.department || "";
  editForm.position = userInfo.value.position || "";
  editForm.email = userInfo.value.email || "";

  editDialogVisible.value = true;
};

// 确认编辑信息
const confirmEditInfo = async () => {
  if (!editFormRef.value) return;

  await editFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    updatingInfo.value = true;

    try {
      // 模拟更新用户信息
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 更新用户存储中的信息
      if (userStore.userInfo) {
        userStore.updateUserInfo({
          ...userStore.userInfo,
          name: editForm.name,
          department: editForm.department,
          position: editForm.position,
          email: editForm.email,
        });
      }

      // 更新本地用户信息
      userInfo.value.name = editForm.name;
      userInfo.value.department = editForm.department;
      userInfo.value.position = editForm.position;
      userInfo.value.email = editForm.email;

      ElMessage.success("用户信息更新成功");
      editDialogVisible.value = false;
    } catch (error) {
      ElMessage.error((error as Error).message || "用户信息更新失败");
    } finally {
      updatingInfo.value = false;
    }
  });
};
</script>

<style scoped>
.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-item {
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.user-info-item:hover {
  background-color: #f9fafb;
}
</style>
