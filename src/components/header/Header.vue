<template name="AppHeader">
  <nav class="header-container bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
    <!-- 顶部导航栏 -->
    <div
      class="nav-bar flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md">
      <!-- 头部导航菜单 -->
      <div
        class="nav-menu flex space-x-1 gap-1 justify-start overflow-x-auto hide-scrollbar sm:space-x-4 lg:overflow-visible w-full sm:w-auto"
        role="navigation"
        aria-label="主导航">
        <el-button
          v-for="n in navData"
          :key="n.key"
          :type="parseInt(n.key) > 5 ? 'danger' : 'primary'"
          :class="[
            'nav-item',
            'min-w-[10px]',
            'font-semibold',
            'mb-2',
            'lg:px-4',
            'sm:px-4',
            'sm:py-2',
            'text-xs',
            'sm:text-sm',
            'text-white',
            'border-b-2',
            'transition-colors',
            'border-white',
            'bg-blue-500',
            'rounded-t-sm',
            'whitespace-nowrap',
            'w-full',
            'text-center',
            'sm:text-left',
            { active: activeNav === n.key },
          ]"
          :aria-current="activeNav === n.key ? 'page' : undefined"
          @click="() => handleNavClick(n)">
          {{ n.name }}
        </el-button>
      </div>

      <!-- 右侧搜索和用户区域 -->
      <div class="right-section flex items-center flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <div class="search-box relative w-full sm:w-64 mr-4">
          <el-input placeholder="请输入内容" class="h-10" v-model="inputSearch" @keyup.enter="handleSearch">
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </div>

        <div class="user-menu hidden md:flex items-center gap-2 mr-4">
          <el-button
            type="warning"
            class="text-[12px] transition-colors px-2 rounded-[2px] bg-amber-500 hover:bg-amber-600 text-white h-8 flex items-center justify-center"
            @click="() => handleQuickAccess('product')"
            >产品库</el-button
          >
          <el-button
            type="warning"
            class="text-[12px] transition-colors px-2 rounded-[2px] bg-amber-500 hover:bg-amber-600 text-white h-8 flex items-center justify-center"
            @click="() => handleQuickAccess('gallery')"
            >图库</el-button
          >
          <el-button
            type="warning"
            class="text-[12px] transition-colors px-2 rounded-[2px] bg-amber-500 hover:bg-amber-600 text-white h-8 flex items-center justify-center"
            @click="() => handleQuickAccess('knowledge')"
            >知识库</el-button
          >
          <el-button
            type="warning"
            class="text-[12px] transition-colors px-2 rounded-[2px] bg-amber-500 hover:bg-amber-600 text-white h-8 flex items-center justify-center"
            @click="() => handleQuickAccess('policy')"
            >制度</el-button
          >
          <el-button
            type="warning"
            class="text-[12px] transition-colors px-3 rounded-[2px] bg-amber-500 hover:bg-amber-600 text-white h-8 flex items-center justify-center"
            @click="() => handleQuickAccess('contacts')"
            >通讯录</el-button
          >
        </div>
        <!-- 登录状态 -->
        <div class="user-info flex items-center">
          <el-dropdown class="dropdown-container">
            <div class="flex items-center cursor-pointer">
              <el-avatar
                :size="40"
                :src="userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                class="border-2 border-blue-200"
                :alt="userInfo?.name ? userInfo.name + '的头像' : '用户头像'"></el-avatar>
              <div class="ml-3 hidden lg:block">
                <div class="text-sm font-medium text-white">
                  {{ userInfo?.name || "未登录" }}
                </div>
                <div class="text-xs text-blue-100">
                  {{ userInfo?.position || "暂无职位" }}
                </div>
              </div>
              <el-icon class="ml-1 text-blue-100 hidden lg:block">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToUserInfo">个人中心</el-dropdown-item>
                <!-- 横线 -->
                <el-divider />
                <el-dropdown-item @click="updatePwd" data-test="update-pwd">修改密码</el-dropdown-item>
                <el-divider></el-divider>
                <el-dropdown-item type="danger" @click="handleLogout" data-test="logout-button">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 用户信息 -->
      </div>
    </div>
  </nav>
  <div class="clearfix"></div>

  <!-- 修改密码对话框 -->
  <el-dialog v-model="pwdDialogVisible" title="修改密码" width="500px" :before-close="handlePwdDialogClose">
    <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdFormRules" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPwdForm" :loading="pwdFormLoading"> 确认修改 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import { ArrowDown } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { AuthUtils } from "@/utils/auth";

export interface UserInfo {
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
}

const userStore = useUserStore();

// 计算属性获取用户登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn);

// 计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo);

// 修改密码相关数据
const pwdDialogVisible = ref(false);
const pwdFormRef = ref<FormInstance>();
const pwdFormLoading = ref(false);

const pwdForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const pwdFormRules: FormRules = {
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应在6-20个字符之间", trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应在6-20个字符之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value === "") {
          callback(new Error("请再次输入新密码"));
        } else if (value !== pwdForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const navData = [
  { key: "1", name: "首页", path: "/home" },
  { key: "2", name: "客户进度", path: "/pending-reservation" },
  {
    key: "3",
    name: "出货",
    path: "/shipping-overview",
  },
  {
    key: "4",
    name: "数据库",
    path: "/home",
  },
  {
    key: "5",
    name: "财务表",
    path: "/home",
  },
  {
    key: "6",
    name: "出勤管理",
    path: "/home",
  },
  {
    key: "7",
    name: "消息演示",
    path: "/optimized-message-demo",
  },
  {
    key: "8",
    name: "财务管理1",
    path: "/home",
  },
  {
    key: "9",
    name: "财务管理2",
    path: "/home",
  },
];

// 计算属性获取用户信息
const inputSearch = ref("");
const activeNav = ref("1");

interface NavItem {
  key: string;
  name: string;
  path: string;
}

// 处理导航项点击
const handleNavClick = (navItem: NavItem) => {
  // 更新激活的导航项
  activeNav.value = navItem.key;

  // 导航路由
  router.push({ path: navItem.path });
};

// 处理搜索
const handleSearch = () => {
  if (inputSearch.value.trim()) {
    // 这里可以添加实际的搜索逻辑
    console.log("搜索内容:", inputSearch.value);
  }
};

// 处理快速访问按钮点击
const handleQuickAccess = (type: string) => {
  // 根据不同类型处理快速访问逻辑
  console.log("快速访问:", type);
};

// 跳转到个人中心
const goToUserInfo = () => {
  router.push("/user-info");
};

// 打开修改密码对话框
const updatePwd = () => {
  pwdDialogVisible.value = true;
  // 重置表单数据
  pwdForm.oldPassword = "";
  pwdForm.newPassword = "";
  pwdForm.confirmPassword = "";
};

// 提交密码修改表单
const submitPwdForm = async () => {
  if (!pwdFormRef.value) return;

  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      pwdFormLoading.value = true;
      try {
        // 模拟密码修改请求
        // 实际项目中这里应该调用修改密码的API接口
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 密码修改成功后退出登录
        userStore.logout();
        pwdDialogVisible.value = false;
        ElMessage.success("密码修改成功，即将退出登录");

        // 延迟跳转到登录页面，让用户看到成功消息
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (error: unknown) {
        ElMessage.error((error as Error).message || "密码修改失败");
      } finally {
        pwdFormLoading.value = false;
      }
    }
  });
};

// 处理密码对话框关闭
const handlePwdDialogClose = (done: () => void) => {
  ElMessageBox.confirm("确认关闭修改密码对话框吗？")
    .then(() => {
      // 重置表单
      if (pwdFormRef.value) {
        pwdFormRef.value.resetFields();
      }
      done();
    })
    .catch(() => {
      // 取消关闭
    });
};

const handleLogout = () => {
  // 退出登录逻辑
  AuthUtils.logout();
};

// 设置当前日期
onMounted(() => {
  // 初始化用户信息
});
</script>

<style scoped>
/* 自定义样式 */

/* 导航项激活状态样式 */
.nav-item {
  position: relative;
  transition: all 0.2s ease;
}

/* 导航项激活状态 - 白色背景，红色文字 */
.nav-item.active {
  background-color: white;
  color: #ef4444; /* 红色 */
}

/* 导航项激活状态的悬停效果 */
.nav-item.active:hover {
  background-color: #fef2f2;
}

/* 导航项悬停效果 */
.nav-item:hover {
  transform: translateY(-1px);
}

/* 隐藏滚动条 */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* 使用Element Plus样式变量修改下拉菜单项样式 */
.dropdown-container {
  --el-dropdown-item-height: 30px;
}

/* 在你的样式文件中添加 */
/* 基础高度设置 */
:deep(.el-dropdown-menu__item) {
  height: 40px; /* 自定义高度 */
  line-height: 40px; /* 与高度保持一致，确保文字垂直居中 */
  padding: 0 20px; /* 可根据需要调整内边距 */
}

/* hover状态下的高度保持一致 */
:deep(.el-dropdown-menu__item:hover) {
  height: 40px;
}

/* 禁用状态也保持统一高度 */
:deep(.el-dropdown-menu__item.is-disabled) {
  height: 40px;
  line-height: 40px;
}
</style>
