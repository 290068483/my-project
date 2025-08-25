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
          <div class="text-sm text-gray-500 mb-1">所属部门</div>
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
        <el-button type="primary" @click="openEditInfo" size="default">
          编辑信息
        </el-button>
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
    <EditUserInfoModal
      v-model="editDialogVisible"
      :user-info="userInfo"
      @save="handleSaveUserInfo"
      @close="editDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/user";
import type { UploadFile, UploadRawFile } from "element-plus";
import { ElMessage } from "element-plus";
import EditUserInfoModal from "@/components/EditUserInfoModal.vue";

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

// 编辑表单数据
const editForm = reactive<UserInfo>({
  name: "",
  department: "",
  position: "",
  email: "",
});

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
  const isJPGorPNG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPGorPNG) {
    ElMessage.error('头像图片只能是 JPG 或 PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!');
  }
  return isJPGorPNG && isLt2M;
};

// 处理头像更改
const handleAvatarChange = (file: UploadFile) => {
  // 创建临时预览URL
  tempAvatar.value = URL.createObjectURL(file.raw!);
};

// 确认更新头像
const confirmUpdateAvatar = async () => {
  if (!tempAvatar.value) return;

  updatingAvatar.value = true;
    
  // 模拟上传过程
  setTimeout(() => {
    // 更新用户信息
    userInfo.value.avatar = tempAvatar.value;
      
    // 更新store中的用户信息
    if (userStore.userInfo) {
      userStore.userInfo.avatar = tempAvatar.value;
        
      // 保存到localStorage
      localStorage.setItem("user-info", JSON.stringify(userStore.userInfo));
    }
      
    updatingAvatar.value = false;
    avatarDialogVisible.value = false;
    tempAvatar.value = "";
    ElMessage.success("头像更新成功");
  }, 500);
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

// 保存用户信息
const handleSaveUserInfo = (updatedUserInfo: UserInfo) => {
  // 更新用户信息
  userInfo.value = { ...userInfo.value, ...updatedUserInfo };
  
  // 更新store中的用户信息
  if (userStore.userInfo) {
    userStore.userInfo.name = updatedUserInfo.name;
    userStore.userInfo.department = updatedUserInfo.department;
    userStore.userInfo.position = updatedUserInfo.position;
    userStore.userInfo.email = updatedUserInfo.email;
    
    // 保存到localStorage
    localStorage.setItem("user-info", JSON.stringify(userStore.userInfo));
  }
  
  ElMessage.success("用户信息更新成功");
};
</script>

<style scoped>
.user-info-item {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.user-info-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-preview {
  width: 80px;
  height: 80px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}
</style>
