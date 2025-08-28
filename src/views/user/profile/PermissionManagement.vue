<template>
  <div class="permission-management p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">权限管理</h2>

      <!-- 当前角色信息 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">当前角色</span>
        </template>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div v-for="role in currentRoles" :key="role.id" class="flex items-center space-x-2">
              <el-tag :type="getRoleTagType(role.level)" size="large">
                {{ role.name }}
              </el-tag>
              <span class="text-sm text-gray-500">{{ role.description }}</span>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <p><strong>角色说明：</strong></p>
            <ul class="mt-2 space-y-1 ml-4">
              <li v-for="role in currentRoles" :key="role.id">• {{ role.name }}：{{ role.description }}</li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- 当前权限列表 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">当前权限</span>
            <el-button @click="refreshPermissions" :loading="loadingPermissions" size="small"> 刷新 </el-button>
          </div>
        </template>

        <div class="space-y-4">
          <!-- 权限搜索 -->
          <el-input
            v-model="permissionSearchKey"
            placeholder="搜索权限..."
            prefix-icon="Search"
            clearable
            class="w-64" />

          <!-- 权限分类tabs -->
          <el-tabs v-model="activeTab" @tab-change="handleTabChange">
            <el-tab-pane label="全部权限" name="all">
              <div class="permission-grid">
                <div
                  v-for="permission in filteredPermissions"
                  :key="permission.code"
                  class="permission-item p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <el-tag :type="getPermissionTagType(permission.type)" size="small">
                          {{ getPermissionTypeName(permission.type) }}
                        </el-tag>
                        <span class="font-medium">{{ permission.name }}</span>
                      </div>
                      <p class="text-sm text-gray-600 mb-2">{{ permission.description }}</p>
                      <div class="text-xs text-gray-500">权限代码：{{ permission.code }}</div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <el-tag :type="permission.granted ? 'success' : 'info'" size="small">
                        {{ permission.granted ? "已授权" : "未授权" }}
                      </el-tag>
                      <el-button
                        v-if="!permission.granted && permission.canApply"
                        size="small"
                        type="primary"
                        @click="applyPermission(permission)">
                        申请
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="菜单权限" name="menu">
              <el-tree
                :data="menuPermissions"
                show-checkbox
                :check-strictly="false"
                :default-checked-keys="grantedMenuIds"
                :props="{ label: 'name', children: 'children' }"
                class="permission-tree">
                <template #default="{ node, data }">
                  <div class="flex items-center space-x-2 w-full">
                    <el-icon v-if="data.icon" class="text-gray-500">
                      <component :is="data.icon" />
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <el-tag v-if="data.granted" type="success" size="small">已授权</el-tag>
                  </div>
                </template>
              </el-tree>
            </el-tab-pane>

            <el-tab-pane label="数据权限" name="data">
              <div class="space-y-4">
                <div
                  v-for="dataScope in dataPermissions"
                  :key="dataScope.id"
                  class="p-4 border border-gray-200 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">{{ dataScope.name }}</span>
                    <el-tag :type="dataScope.granted ? 'success' : 'info'" size="small">
                      {{ dataScope.granted ? "已授权" : "未授权" }}
                    </el-tag>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ dataScope.description }}</p>
                  <div class="text-xs text-gray-500">范围：{{ dataScope.scope }}</div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="API权限" name="api">
              <div class="space-y-3">
                <div
                  v-for="api in apiPermissions"
                  :key="api.id"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <el-tag :type="getMethodTagType(api.method)" size="small">
                        {{ api.method }}
                      </el-tag>
                      <code class="text-sm">{{ api.path }}</code>
                    </div>
                    <p class="text-sm text-gray-600">{{ api.description }}</p>
                  </div>
                  <el-tag :type="api.granted ? 'success' : 'info'" size="small">
                    {{ api.granted ? "已授权" : "未授权" }}
                  </el-tag>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>

      <!-- 权限申请历史 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">申请历史</span>
        </template>

        <el-table :data="applicationHistory" style="width: 100%" empty-text="暂无申请记录">
          <el-table-column prop="permissionName" label="权限名称" width="200" />
          <el-table-column prop="permissionCode" label="权限代码" width="150" />
          <el-table-column prop="reason" label="申请理由" />
          <el-table-column prop="applyTime" label="申请时间" width="160" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === 'pending'"
                size="small"
                type="danger"
                @click="cancelApplication(scope.row.id)">
                撤销
              </el-button>
              <span v-else class="text-gray-400">-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 权限说明 -->
      <el-card shadow="hover">
        <template #header>
          <span class="font-semibold">权限说明</span>
        </template>
        <div class="space-y-3">
          <div>
            <h5 class="font-medium mb-2">权限类型说明：</h5>
            <ul class="text-sm text-gray-600 space-y-1 ml-4">
              <li><el-tag type="primary" size="small">菜单</el-tag> - 控制页面和功能模块的访问权限</li>
              <li><el-tag type="success" size="small">按钮</el-tag> - 控制页面内操作按钮的显示和使用权限</li>
              <li><el-tag type="warning" size="small">数据</el-tag> - 控制数据的查看、编辑范围权限</li>
              <li><el-tag type="info" size="small">API</el-tag> - 控制后端接口的调用权限</li>
            </ul>
          </div>
          <div>
            <h5 class="font-medium mb-2">申请流程：</h5>
            <ul class="text-sm text-gray-600 space-y-1 ml-4">
              <li>1. 在权限列表中找到需要的权限，点击"申请"</li>
              <li>2. 填写申请理由，提交申请</li>
              <li>3. 等待管理员审核（通常1-3个工作日）</li>
              <li>4. 审核通过后，权限自动生效</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 权限申请对话框 -->
    <el-dialog v-model="showApplyDialog" title="申请权限" width="500px">
      <div class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="font-medium text-blue-800 mb-2">申请权限信息</h4>
          <p class="text-sm text-blue-700"><strong>权限名称：</strong>{{ currentApplyPermission?.name }}</p>
          <p class="text-sm text-blue-700"><strong>权限代码：</strong>{{ currentApplyPermission?.code }}</p>
          <p class="text-sm text-blue-700"><strong>权限描述：</strong>{{ currentApplyPermission?.description }}</p>
        </div>

        <el-form ref="applyFormRef" :model="applyForm" :rules="applyRules" label-width="100px">
          <el-form-item label="申请理由" prop="reason">
            <el-input
              v-model="applyForm.reason"
              type="textarea"
              :rows="4"
              placeholder="请详细说明申请该权限的理由..."
              maxlength="500"
              show-word-limit />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showApplyDialog = false">取消</el-button>
          <el-button type="primary" @click="submitApplication" :loading="applying"> 提交申请 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/user";

// 用户Store
const userStore = useUserStore();

// 响应式数据
const activeTab = ref("all");
const permissionSearchKey = ref("");
const loadingPermissions = ref(false);
const showApplyDialog = ref(false);
const applying = ref(false);
const currentApplyPermission = ref<any>(null);

// 当前角色
const currentRoles = ref([
  {
    id: 1,
    name: "普通用户",
    level: "normal",
    description: "系统基础用户，具有基本的查看和操作权限",
  },
  {
    id: 2,
    name: "部门成员",
    level: "department",
    description: "部门内部成员，可查看和编辑部门相关数据",
  },
]);

// 所有权限列表
const allPermissions = ref([
  {
    id: 1,
    name: "用户管理",
    code: "system:user:list",
    description: "查看用户列表和基本信息",
    type: "menu",
    granted: true,
    canApply: false,
  },
  {
    id: 2,
    name: "添加用户",
    code: "system:user:add",
    description: "创建新用户账户",
    type: "button",
    granted: false,
    canApply: true,
  },
  {
    id: 3,
    name: "编辑用户",
    code: "system:user:edit",
    description: "修改用户信息和设置",
    type: "button",
    granted: false,
    canApply: true,
  },
  {
    id: 4,
    name: "删除用户",
    code: "system:user:remove",
    description: "删除用户账户（危险操作）",
    type: "button",
    granted: false,
    canApply: true,
  },
  {
    id: 5,
    name: "系统设置",
    code: "system:config:view",
    description: "查看系统配置参数",
    type: "menu",
    granted: false,
    canApply: true,
  },
  {
    id: 6,
    name: "系统监控",
    code: "monitor:system:view",
    description: "查看系统运行状态和监控数据",
    type: "menu",
    granted: false,
    canApply: true,
  },
]);

// 菜单权限树
const menuPermissions = ref([
  {
    id: 1,
    name: "系统管理",
    icon: "Setting",
    granted: true,
    children: [
      { id: 2, name: "用户管理", granted: true },
      { id: 3, name: "角色管理", granted: false },
      { id: 4, name: "菜单管理", granted: false },
    ],
  },
  {
    id: 5,
    name: "系统监控",
    icon: "Monitor",
    granted: false,
    children: [
      { id: 6, name: "在线用户", granted: false },
      { id: 7, name: "数据监控", granted: false },
    ],
  },
]);

// 数据权限
const dataPermissions = ref([
  {
    id: 1,
    name: "本人数据",
    description: "只能查看和编辑自己的数据",
    scope: "个人范围",
    granted: true,
  },
  {
    id: 2,
    name: "部门数据",
    description: "可以查看和编辑所在部门的数据",
    scope: "部门范围",
    granted: true,
  },
  {
    id: 3,
    name: "全部数据",
    description: "可以查看和编辑所有数据",
    scope: "全局范围",
    granted: false,
  },
]);

// API权限
const apiPermissions = ref([
  {
    id: 1,
    method: "GET",
    path: "/api/user/profile",
    description: "获取个人资料",
    granted: true,
  },
  {
    id: 2,
    method: "PUT",
    path: "/api/user/profile",
    description: "更新个人资料",
    granted: true,
  },
  {
    id: 3,
    method: "GET",
    path: "/api/system/users",
    description: "获取用户列表",
    granted: false,
  },
  {
    id: 4,
    method: "POST",
    path: "/api/system/users",
    description: "创建用户",
    granted: false,
  },
]);

// 申请历史
const applicationHistory = ref([
  {
    id: 1,
    permissionName: "编辑用户",
    permissionCode: "system:user:edit",
    reason: "需要协助处理部门内用户账户问题",
    applyTime: "2024-01-18 10:30:00",
    status: "approved",
    approver: "系统管理员",
    approveTime: "2024-01-19 09:15:00",
  },
  {
    id: 2,
    permissionName: "系统监控",
    permissionCode: "monitor:system:view",
    reason: "需要监控系统运行状态，及时发现和处理问题",
    applyTime: "2024-01-20 14:20:00",
    status: "pending",
  },
]);

// 申请表单
const applyFormRef = ref<FormInstance>();
const applyForm = reactive({
  reason: "",
});

// 表单验证规则
const applyRules: FormRules = {
  reason: [
    { required: true, message: "请填写申请理由", trigger: "blur" },
    { min: 10, message: "申请理由至少10个字符", trigger: "blur" },
  ],
};

// 计算属性
const filteredPermissions = computed(() => {
  let permissions = allPermissions.value;

  if (permissionSearchKey.value) {
    permissions = permissions.filter(
      (p) =>
        p.name.includes(permissionSearchKey.value) ||
        p.code.includes(permissionSearchKey.value) ||
        p.description.includes(permissionSearchKey.value),
    );
  }

  if (activeTab.value !== "all") {
    permissions = permissions.filter((p) => p.type === activeTab.value);
  }

  return permissions;
});

const grantedMenuIds = computed(() => {
  const ids: number[] = [];
  const traverse = (menus: any[]) => {
    menus.forEach((menu) => {
      if (menu.granted) {
        ids.push(menu.id);
      }
      if (menu.children) {
        traverse(menu.children);
      }
    });
  };
  traverse(menuPermissions.value);
  return ids;
});

// 方法
const getRoleTagType = (level: string) => {
  const types: Record<string, any> = {
    admin: "danger",
    manager: "warning",
    department: "success",
    normal: "info",
  };
  return types[level] || "info";
};

const getPermissionTagType = (type: string) => {
  const types: Record<string, any> = {
    menu: "primary",
    button: "success",
    data: "warning",
    api: "info",
  };
  return types[type] || "info";
};

const getPermissionTypeName = (type: string) => {
  const names: Record<string, string> = {
    menu: "菜单",
    button: "按钮",
    data: "数据",
    api: "API",
  };
  return names[type] || type;
};

const getMethodTagType = (method: string) => {
  const types: Record<string, any> = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    DELETE: "danger",
  };
  return types[method] || "info";
};

const getStatusTagType = (status: string) => {
  const types: Record<string, any> = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  return types[status] || "info";
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
  };
  return texts[status] || status;
};

const handleTabChange = (tabName: string) => {
  activeTab.value = tabName;
};

const refreshPermissions = async () => {
  loadingPermissions.value = true;
  // 模拟API调用
  await new Promise((resolve) => setTimeout(resolve, 1000));
  loadingPermissions.value = false;
  ElMessage.success("权限信息已刷新");
};

const applyPermission = (permission: any) => {
  currentApplyPermission.value = permission;
  applyForm.reason = "";
  showApplyDialog.value = true;
};

const submitApplication = async () => {
  if (!applyFormRef.value || !currentApplyPermission.value) return;

  try {
    await applyFormRef.value.validate();
    applying.value = true;

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 添加到申请历史
    applicationHistory.value.unshift({
      id: Date.now(),
      permissionName: currentApplyPermission.value.name,
      permissionCode: currentApplyPermission.value.code,
      reason: applyForm.reason,
      applyTime: new Date().toLocaleString(),
      status: "pending",
    });

    ElMessage.success("权限申请已提交，请等待审核");
    showApplyDialog.value = false;

    // 重置表单
    applyForm.reason = "";
    applyFormRef.value.resetFields();
  } catch (error) {
    console.error("提交申请失败:", error);
    ElMessage.error("提交申请失败");
  } finally {
    applying.value = false;
  }
};

const cancelApplication = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要撤销此权限申请吗？", "确认撤销", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 从历史记录中移除
    const index = applicationHistory.value.findIndex((item) => item.id === id);
    if (index > -1) {
      applicationHistory.value.splice(index, 1);
      ElMessage.success("申请已撤销");
    }
  } catch {
    // 用户取消操作
  }
};

// 页面挂载时的初始化
onMounted(() => {
  // 这里可以加载用户的实际权限数据
  console.log("权限管理页面已加载");
});
</script>

<style scoped>
.permission-management {
  min-height: 100vh;
}

.el-card {
  border-radius: 8px;
}

.el-card :deep(.el-card__header) {
  background-color: #f8f9fa;
  padding: 16px 20px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.permission-item {
  transition: all 0.3s ease;
}

.permission-item:hover {
  border-color: #409eff;
}

.permission-tree :deep(.el-tree-node__content) {
  height: auto;
  padding: 8px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
