<template>
  <div class="component-user-info p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">用户信息</h2>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧：用户信息展示 -->
        <div class="lg:w-1/2">
          <div class="bg-gray-50 rounded-lg p-6">
            <div class="flex flex-col items-center mb-6">
              <el-avatar
                :size="80"
                :src="editForm.avatar"
                class="border-2 border-blue-200 mb-4"
                :alt="editForm.name + '的头像'"></el-avatar>
              <el-button type="primary" @click="updateAvatar"> 修改头像 </el-button>
            </div>

            <el-divider></el-divider>

            <div class="space-y-4">
              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">用户名</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.name }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">职位</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.position }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">所属部门</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.department }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">邮箱</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.email }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">手机号</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.phone || "未填写" }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">性别</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.sex === "0" ? "男" : editForm.sex === "1" ? "女" : "未设置" }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">生日</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.birthday || "未填写" }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">员工编号</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.employeeId || "未填写" }}
                </div>
              </div>

              <div class="user-info-item">
                <div class="text-sm text-gray-500 mb-1">入职日期</div>
                <div class="text-lg font-medium text-gray-800">
                  {{ editForm.joinDate || "未填写" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：编辑信息 -->
        <div class="lg:w-1/2">
          <div class="bg-gray-50 rounded-lg p-6 h-full">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">编辑信息</h3>

            <el-form
              :model="editForm"
              label-width="100px"
              ref="editFormRef"
              @submit.prevent
              :rules="editFormRules"
              class="space-y-4">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="editForm.name" :disabled="!isEditing" placeholder="请输入用户名" />
              </el-form-item>

              <el-form-item label="职位" prop="position">
                <el-input v-model="editForm.position" :disabled="!isEditing" placeholder="请输入职位" />
              </el-form-item>

              <el-form-item label="部门" prop="department">
                <el-input v-model="editForm.department" :disabled="!isEditing" placeholder="请输入部门" />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" type="email" :disabled="!isEditing" placeholder="请输入邮箱地址" />
              </el-form-item>

              <el-form-item label="手机号" prop="phone">
                <el-input v-model="editForm.phone" :disabled="!isEditing" placeholder="请输入手机号" />
              </el-form-item>

              <el-form-item label="性别" prop="sex">
                <el-select v-model="editForm.sex" :disabled="!isEditing" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="0" />
                  <el-option label="女" value="1" />
                </el-select>
              </el-form-item>

              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="editForm.birthday"
                  type="date"
                  placeholder="请选择生日"
                  :disabled="!isEditing"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </el-form-item>

              <el-form-item label="员工编号" prop="employeeId">
                <el-input v-model="editForm.employeeId" :disabled="!isEditing" placeholder="请输入员工编号" />
              </el-form-item>

              <el-form-item label="入职日期" prop="joinDate">
                <el-date-picker
                  v-model="editForm.joinDate"
                  type="date"
                  placeholder="请选择入职日期"
                  :disabled="!isEditing"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </el-form-item>

              <el-form-item label="住址" prop="address">
                <el-input
                  v-model="editForm.address"
                  type="textarea"
                  :rows="2"
                  :disabled="!isEditing"
                  placeholder="请输入家庭住址"
                  maxlength="200"
                  show-word-limit />
              </el-form-item>

              <el-form-item label="个人签名" prop="personalSignature">
                <el-input
                  v-model="editForm.personalSignature"
                  type="textarea"
                  :rows="2"
                  :disabled="!isEditing"
                  placeholder="请输入个人签名"
                  maxlength="100"
                  show-word-limit />
              </el-form-item>

              <el-form-item label="紧急联系人" prop="emergencyContact">
                <el-input
                  v-model="editForm.emergencyContact"
                  :disabled="!isEditing"
                  placeholder="请输入紧急联系人姓名" />
              </el-form-item>

              <el-form-item label="紧急联系电话" prop="emergencyContactPhone">
                <el-input
                  v-model="editForm.emergencyContactPhone"
                  :disabled="!isEditing"
                  placeholder="请输入紧急联系人手机号" />
              </el-form-item>
            </el-form>

            <div class="flex justify-end mt-8 space-x-4">
              <el-button v-if="!isEditing" type="primary" @click="startEdit"> 编辑 </el-button>
              <template v-else>
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="saveEditInfo" :loading="updatingInfo"> 保存 </el-button>
              </template>
            </div>
          </div>
        </div>
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
          <el-avatar v-else :size="80" :src="userStore.getUserAvatar"></el-avatar>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { uploadAvatar } from "@/api/user";
import { useUserStore } from "@/stores/user";
import type { UploadFile, UploadRawFile } from "element-plus";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { updateUserInfo } from "@/api/user";
export interface UserInfo {
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  sex?: string;
  birthday?: string;
  address?: string;
  personalSignature?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  joinDate?: string;
  employeeId?: string;
}

// 使用用户存储
const userStore = useUserStore();

// 响应式数据
const isEditing = ref(false);
const avatarDialogVisible = ref(false);
const tempAvatar = ref("");
const tempAvatarFile = ref<File | null>(null); // 存储选中的头像文件
const tempAvatarUrl = ref(""); // 用于存储创建的ObjectURL
const updatingAvatar = ref(false);
const updatingInfo = ref(false);
const editFormRef = ref<FormInstance>();

// 编辑表单数据
const editForm = reactive<UserInfo>({
  name: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  sex: "",
  birthday: "",
  address: "",
  personalSignature: "",
  emergencyContact: "",
  emergencyContactPhone: "",
  joinDate: "",
  employeeId: "",
});

// 表单验证规则
const editFormRules: FormRules = {
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度应在2-20个字符之间", trigger: "blur" },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
  phone: [
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  position: [{ required: false, message: "请输入职位", trigger: "blur" }],
  department: [{ required: false, message: "请输入部门", trigger: "blur" }],
  emergencyContactPhone: [
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的紧急联系人手机号",
      trigger: "blur",
    },
  ],
  employeeId: [{ min: 3, max: 20, message: "员工编号长度应在3-20个字符之间", trigger: "blur" }],
};

// 处理页面挂载
onMounted(() => {
  // 确保用户信息已初始化
  if (!userStore.getUserInfo) {
    userStore.initUserInfo();
  }
  // 初始化表单数据
  initEditForm();
});

// 初始化编辑表单
const initEditForm = () => {
  const userInfo = userStore.getUserInfo;
  if (userInfo) {
    editForm.name = userInfo.name || userInfo.nickname || "";
    editForm.department = userInfo.department || "";
    editForm.position = userInfo.position || "";
    editForm.email = userInfo.email || "";
    editForm.phone = userInfo.phone || userInfo.phonenumber || "";
    editForm.sex = userInfo.sex || "";
    editForm.birthday = userInfo.birthday || "";
    editForm.address = userInfo.address || "";
    editForm.personalSignature = userInfo.personalSignature || "";
    editForm.emergencyContact = userInfo.emergencyContact || "";
    editForm.emergencyContactPhone = userInfo.emergencyContactPhone || "";
    editForm.joinDate = userInfo.joinDate || "";
    editForm.employeeId = userInfo.employeeId || userInfo.userId?.toString() || "";
  }
};

// 修改头像
const updateAvatar = () => {
  avatarDialogVisible.value = true;
  tempAvatar.value = userStore.getUserAvatar || "";
};

// 头像上传前的验证
const beforeAvatarUpload = (rawFile: UploadRawFile) => {
  const isJPGorPNG = rawFile.type === "image/jpeg" || rawFile.type === "image/png";
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPGorPNG) {
    ElMessage.error("头像图片只能是 JPG 或 PNG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("头像图片大小不能超过 2MB!");
  }
  return isJPGorPNG && isLt2M;
};

// 处理头像更改
const handleAvatarChange = (file: UploadFile) => {
  // 释放之前创建的URL
  if (tempAvatarUrl.value) {
    URL.revokeObjectURL(tempAvatarUrl.value);
  }
  // 保存文件对象并创建临时预览URL
  tempAvatarFile.value = file.raw!;
  tempAvatarUrl.value = URL.createObjectURL(file.raw!);
  tempAvatar.value = tempAvatarUrl.value;
};

// 确认更新头像
const confirmUpdateAvatar = async () => {
  if (!tempAvatar.value) return;

  updatingAvatar.value = true;

  try {
    // 使用el-upload组件中的文件
    const response = await uploadAvatar(tempAvatarFile.value);
    if (response.code === 200) {
      // 更新store中的用户头像
      userStore.updateUserAvatar(response.data.url);
      updatingAvatar.value = false;
      avatarDialogVisible.value = false;
      ElMessage.success("头像更新成功");
    } else {
      updatingAvatar.value = false;
      ElMessage.error(response.msg || "头像上传失败");
    }
  } catch (error) {
    updatingAvatar.value = false;
    console.error("头像上传失败:", error);
    ElMessage.error("头像上传失败，请重试");
  }

  // 释放URL并清空引用
  if (tempAvatarUrl.value) {
    URL.revokeObjectURL(tempAvatarUrl.value);
  }
  tempAvatar.value = "";
  tempAvatarUrl.value = "";
};

// 处理头像对话框关闭
const handleAvatarDialogClose = () => {
  // 释放创建的URL
  if (tempAvatarUrl.value) {
    URL.revokeObjectURL(tempAvatarUrl.value);
  }
  tempAvatar.value = "";
  tempAvatarUrl.value = "";
};

// 开始编辑
const startEdit = () => {
  isEditing.value = true;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
  // 恢复表单数据
  initEditForm();
};

// 保存用户信息
const saveEditInfo = async () => {
  if (!editFormRef.value) return;

  try {
    await editFormRef.value.validate();
    updatingInfo.value = true;

    // 实际API调用保存用户信息
    try {
      const response = await updateUserInfo(editForm);
      if (response.code === 200) {
        // 更新store中的用户信息
        userStore.updateUserInfo({ ...editForm });
        updatingInfo.value = false;
        isEditing.value = false;
        ElMessage.success("用户信息更新成功");
      } else {
        ElMessage.error(response.msg || "用户信息更新失败");
      }
    } catch (error) {
      console.error("用户信息更新失败:", error);
      ElMessage.error("用户信息更新失败，请重试");
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};
</script>

<style scoped>
.user-info-item {
  padding: 0.75rem;
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
