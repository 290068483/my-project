<template>
  <div class="permission-demo p-6">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>权限指令演示</span>
          <el-tag :type="isLoggedIn ? 'success' : 'danger'" class="ml-2">
            {{ isLoggedIn ? "已登录" : "未登录" }}
          </el-tag>
        </div>
      </template>

      <!-- 当前用户信息 -->
      <div class="user-info mb-6" v-if="userInfo">
        <h3>当前用户信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag v-for="role in userRoles" :key="role" class="mr-1">{{ role }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="权限">
            <el-tag
              v-for="permission in userInfo.permissions"
              :key="permission"
              type="success"
              size="small"
              class="mr-1 mb-1">
              {{ permission }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模拟用户切换 -->
      <div class="role-switch mb-6">
        <h3>模拟用户切换（测试权限）</h3>
        <el-space>
          <el-button @click="simulateUser('admin')" type="primary"> 切换为管理员 </el-button>
          <el-button @click="simulateUser('manager')" type="success"> 切换为经理 </el-button>
          <el-button @click="simulateUser('user')" type="info"> 切换为普通用户 </el-button>
          <el-button @click="simulateUser('guest')" type="warning"> 切换为访客 </el-button>
          <el-button @click="logout" type="danger"> 退出登录 </el-button>
        </el-space>
      </div>
    </el-card>

    <!-- 权限指令演示 -->
    <el-row :gutter="20">
      <!-- 基础权限指令 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>基础权限指令 (v-permission)</span>
          </template>

          <div class="demo-section">
            <h4>用户管理按钮</h4>
            <el-space wrap>
              <el-button v-permission="USER_PERMISSIONS.VIEW" type="info"> 查看用户 </el-button>
              <el-button v-permission="USER_PERMISSIONS.ADD" type="primary"> 新增用户 </el-button>
              <el-button v-permission="USER_PERMISSIONS.EDIT" type="success"> 编辑用户 </el-button>
              <el-button v-permission="USER_PERMISSIONS.DELETE" type="danger"> 删除用户 </el-button>
            </el-space>
          </div>

          <el-divider />

          <div class="demo-section">
            <h4>业务管理按钮</h4>
            <el-space wrap>
              <el-button v-permission="BUSINESS_PERMISSIONS.ORDER_VIEW" type="info"> 查看订单 </el-button>
              <el-button v-permission="BUSINESS_PERMISSIONS.ORDER_ADD" type="primary"> 新增订单 </el-button>
              <el-button v-permission="BUSINESS_PERMISSIONS.CONTRACT_EDIT" type="success"> 编辑合同 </el-button>
              <el-button v-permission="BUSINESS_PERMISSIONS.INSTALL_DELETE" type="danger"> 删除安装记录 </el-button>
            </el-space>
          </div>
        </el-card>
      </el-col>

      <!-- 角色指令演示 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>角色指令 (v-role)</span>
          </template>

          <div class="demo-section">
            <h4>角色专用内容</h4>

            <el-alert v-role="SYSTEM_ROLES.SUPER_ADMIN" title="超级管理员专用提示" type="error" class="mb-2" />

            <el-alert v-role="SYSTEM_ROLES.ADMIN" title="管理员专用提示" type="warning" class="mb-2" />

            <el-alert v-role="SYSTEM_ROLES.MANAGER" title="经理专用提示" type="success" class="mb-2" />

            <el-alert
              v-role="[SYSTEM_ROLES.USER, SYSTEM_ROLES.GUEST]"
              title="普通用户和访客可见"
              type="info"
              class="mb-2" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <!-- 复杂权限配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>复杂权限配置</span>
          </template>

          <div class="demo-section">
            <h4>组合权限检查（AND 关系）</h4>
            <el-button
              v-permission="{
                permissions: [USER_PERMISSIONS.VIEW, USER_PERMISSIONS.EDIT],
                mode: 'and',
              }"
              type="primary">
              查看且编辑用户
            </el-button>
          </div>

          <el-divider />

          <div class="demo-section">
            <h4>角色和权限组合（OR 关系）</h4>
            <el-button
              v-permission="{
                roles: [SYSTEM_ROLES.ADMIN],
                permissions: [USER_PERMISSIONS.DELETE],
                mode: 'or',
              }"
              type="danger">
              管理员或有删除权限
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 显示/隐藏指令 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>显示/隐藏指令 (v-permission-show)</span>
          </template>

          <div class="demo-section">
            <h4>控制显示而不移除DOM</h4>
            <p>以下内容根据权限显示/隐藏，但不会从DOM中移除：</p>

            <div v-permission-show="USER_PERMISSIONS.VIEW" class="permission-content">
              <el-tag type="success">用户查看权限内容</el-tag>
            </div>

            <div v-permission-show="USER_PERMISSIONS.DELETE" class="permission-content">
              <el-tag type="danger">用户删除权限内容</el-tag>
            </div>

            <div v-permission-show="SYSTEM_PERMISSIONS.CONFIG_EDIT" class="permission-content">
              <el-tag type="warning">系统配置编辑权限内容</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 权限说明 -->
    <el-card class="mt-4">
      <template #header>
        <span>权限指令使用说明</span>
      </template>

      <el-collapse>
        <el-collapse-item title="v-permission - 权限控制指令" name="1">
          <div class="code-example">
            <h5>基础用法：</h5>
            <pre><code>&lt;el-button v-permission="'user:add'"&gt;新增用户&lt;/el-button&gt;</code></pre>

            <h5>多权限（OR关系）：</h5>
            <pre><code>&lt;el-button v-permission="['user:add', 'user:edit']"&gt;操作按钮&lt;/el-button&gt;</code></pre>

            <h5>复杂配置：</h5>
            <pre><code>&lt;el-button v-permission="{
  permissions: ['user:add'],
  roles: ['admin'],
  mode: 'and'
}"&gt;管理员新增&lt;/el-button&gt;</code></pre>
          </div>
        </el-collapse-item>

        <el-collapse-item title="v-role - 角色控制指令" name="2">
          <div class="code-example">
            <h5>单个角色：</h5>
            <pre><code>&lt;div v-role="'admin'"&gt;管理员专用内容&lt;/div&gt;</code></pre>

            <h5>多个角色：</h5>
            <pre><code>&lt;div v-role="['admin', 'manager']"&gt;管理员或经理可见&lt;/div&gt;</code></pre>
          </div>
        </el-collapse-item>

        <el-collapse-item title="v-permission-show - 显示/隐藏指令" name="3">
          <div class="code-example">
            <h5>控制显示隐藏（不移除DOM）：</h5>
            <pre><code>&lt;div v-permission-show="'user:view'"&gt;用户信息&lt;/div&gt;</code></pre>
            <p class="note">注意：v-permission 会移除DOM元素，v-permission-show 只控制显示/隐藏</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { AuthUtils } from "@/utils/auth";
import {
  USER_PERMISSIONS,
  BUSINESS_PERMISSIONS,
  SYSTEM_PERMISSIONS,
  SYSTEM_ROLES,
  getPermissionsByRole,
} from "@/config/permissions";

const userStore = useUserStore();

// 计算属性
const isLoggedIn = computed(() => AuthUtils.isLoggedIn());
const userInfo = computed(() => AuthUtils.getCurrentUser());
const userRoles = computed(() => {
  const user = userInfo.value;
  return user ? (user.roles || [user.role]).filter(Boolean) : [];
});

/**
 * 模拟用户登录（用于演示权限效果）
 */
function simulateUser(role: string) {
  const mockUsers = {
    admin: {
      id: 1,
      username: "admin",
      nickname: "系统管理员",
      role: SYSTEM_ROLES.ADMIN,
      roles: [SYSTEM_ROLES.ADMIN],
      permissions: getPermissionsByRole(SYSTEM_ROLES.ADMIN),
      status: "active" as const,
    },
    manager: {
      id: 2,
      username: "manager",
      nickname: "业务经理",
      role: SYSTEM_ROLES.MANAGER,
      roles: [SYSTEM_ROLES.MANAGER],
      permissions: getPermissionsByRole(SYSTEM_ROLES.MANAGER),
      status: "active" as const,
    },
    user: {
      id: 3,
      username: "user",
      nickname: "普通用户",
      role: SYSTEM_ROLES.USER,
      roles: [SYSTEM_ROLES.USER],
      permissions: getPermissionsByRole(SYSTEM_ROLES.USER),
      status: "active" as const,
    },
    guest: {
      id: 4,
      username: "guest",
      nickname: "访客",
      role: SYSTEM_ROLES.GUEST,
      roles: [SYSTEM_ROLES.GUEST],
      permissions: getPermissionsByRole(SYSTEM_ROLES.GUEST),
      status: "active" as const,
    },
  };

  const mockUser = mockUsers[role as keyof typeof mockUsers];
  if (mockUser) {
    // 模拟登录成功
    userStore.$patch({
      token: `mock-token-${role}`,
      userInfo: mockUser,
      isLoggedIn: true,
    });

    // 存储到 localStorage
    localStorage.setItem("token", `mock-token-${role}`);
    localStorage.setItem("user-info", JSON.stringify(mockUser));
  }
}

/**
 * 退出登录
 */
function logout() {
  AuthUtils.logout(false);
}
</script>

<style scoped>
.permission-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-section {
  margin-bottom: 16px;
}

.demo-section h4 {
  margin-bottom: 12px;
  color: #303133;
}

.permission-content {
  margin: 8px 0;
}

.code-example {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
}

.code-example h5 {
  margin: 12px 0 8px 0;
  color: #606266;
}

.code-example pre {
  background: #fff;
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  border: 1px solid #ebeef5;
}

.code-example code {
  color: #e6a23c;
}

.note {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}
</style>
