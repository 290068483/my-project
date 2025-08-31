<template>
  <div class="user-manage-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 120px">
            <el-option v-for="dict in USER_STATUS_OPTIONS" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="queryParams.deptId"
            :data="deptTreeOptions"
            :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
            value-key="deptId"
            placeholder="请选择部门"
            check-strictly
            clearable
            style="width: 200px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery"> 搜索 </el-button>
          <el-button icon="Refresh" @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作工具栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button v-permission="'system:user:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>

          <el-button
            v-permission="'system:user:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>

          <el-button
            v-permission="'system:user:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>

          <el-dropdown v-permission="'system:user:import'" @command="handleCommand">
            <el-button type="info">
              更多操作
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="import" icon="Upload"> 数据导入 </el-dropdown-item>
                <el-dropdown-item command="export" icon="Download"> 数据导出 </el-dropdown-item>
                <el-dropdown-item command="template" icon="Document"> 下载模板 </el-dropdown-item>
                <el-dropdown-item command="batchEnable" icon="Check" :disabled="!isMultipleSelection">
                  批量启用
                </el-dropdown-item>
                <el-dropdown-item command="batchDisable" icon="Close" :disabled="!isMultipleSelection">
                  批量停用
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="toolbar-right">
          <el-button circle icon="Refresh" @click="refreshData" />
        </div>
      </div>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card">
      <el-table v-loading="userLoading" :data="userList" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />

        <el-table-column label="用户编号" prop="userId" width="80" align="center" />

        <el-table-column label="用户名称" prop="userName" min-width="120" show-overflow-tooltip />

        <el-table-column label="用户昵称" prop="nickName" min-width="120" show-overflow-tooltip />

        <el-table-column label="部门" prop="dept.deptName" min-width="120" show-overflow-tooltip />

        <el-table-column label="手机号码" prop="phonenumber" width="120" align="center" />

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)" />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'system:user:edit'"
                type="primary"
                icon="Edit"
                size="small"
                link
                @click="handleUpdate(row)" />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:user:remove'"
                type="danger"
                icon="Delete"
                size="small"
                link
                @click="handleDelete(row)" />
            </el-tooltip>

            <el-dropdown @command="(command: string) => handleRowCommand(command, row)">
              <el-button type="primary" size="small" link>
                更多
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-permission="'system:user:resetPwd'" command="resetPwd" icon="Key">
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item v-permission="'system:user:edit'" command="authRole" icon="User">
                    分配角色
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="userTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery" />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <UserForm
      v-model="userDialogVisible"
      :title="userDialogTitle"
      :type="userDialogType"
      :user-data="currentUser"
      :role-list="roleList"
      :post-list="postList"
      :dept-tree="deptTreeOptions"
      @success="handleFormSuccess" />

    <!-- 重置密码对话框 -->
    <ResetPasswordDialog v-model="resetPwdVisible" :user-data="currentUser" @success="handleResetPwdSuccess" />

    <!-- 分配角色对话框 -->
    <AuthRoleDialog v-model="authRoleVisible" :user-data="currentUser" @success="handleAuthRoleSuccess" />

    <!-- 导入对话框 -->
    <ImportDialog v-model="importVisible" @success="handleImportSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { useUserManageStore } from "@/stores/system/userManage";
import { USER_STATUS_OPTIONS } from "@/types/system/user";
import type { SystemUser } from "@/types/system/user";
import { formatDateTime } from "@/utils/dateUtils";
import UserForm from "./components/UserForm.vue";
import ResetPasswordDialog from "./components/ResetPasswordDialog.vue";
import AuthRoleDialog from "./components/AuthRoleDialog.vue";
import ImportDialog from "./components/ImportDialog.vue";

// 使用 store
const userStore = useUserManageStore();

// 响应式解构
const {
  userList,
  userTotal,
  userLoading,
  currentUser,
  roleList,
  postList,
  deptTreeOptions,
  userDialogVisible,
  userDialogTitle,
  userDialogType,
  queryParams,
  isMultipleSelection,
  isSingleSelection,
} = userStore;

// 对话框显示状态
const resetPwdVisible = ref(false);
const authRoleVisible = ref(false);
const importVisible = ref(false);

// 表单引用
const queryFormRef = ref();

// ==================== 生命周期 ====================

onMounted(async () => {
  await userStore.refreshData();
});

// ==================== 查询操作 ====================

/**
 * 查询用户列表
 */
function handleQuery() {
  queryParams.pageNum = 1;
  userStore.getUserList();
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value?.resetFields();
  userStore.resetQuery();
  userStore.getUserList();
}

/**
 * 刷新数据
 */
function refreshData() {
  userStore.refreshData();
}

// ==================== 增删改操作 ====================

/**
 * 新增用户
 */
function handleAdd() {
  userStore.openUserDialog("add");
}

/**
 * 修改用户
 */
function handleUpdate(row?: SystemUser) {
  let user: SystemUser;

  if (row) {
    user = row;
  } else if (userStore.selectedUsers.length === 1) {
    user = userStore.selectedUsers[0];
  } else {
    ElMessage.warning("请选择一条记录进行修改");
    return;
  }

  userStore.openUserDialog("edit", user);
}

/**
 * 删除用户
 */
function handleDelete(row?: SystemUser) {
  let userIds: number[];

  if (row) {
    userIds = [row.userId!];
  } else if (userStore.selectedUserIds.length > 0) {
    userIds = userStore.selectedUserIds;
  } else {
    ElMessage.warning("请选择要删除的记录");
    return;
  }

  userStore.deleteUser(userIds);
}

/**
 * 状态切换
 */
async function handleStatusChange(row: SystemUser) {
  row.statusLoading = true;

  try {
    await userStore.toggleUserStatus(row);
  } catch {
    // 恢复原状态
    row.status = row.status === "0" ? "1" : "0";
  } finally {
    row.statusLoading = false;
  }
}

/**
 * 表单提交成功
 */
function handleFormSuccess() {
  userStore.closeUserDialog();
  userStore.getUserList();
}

// ==================== 选择操作 ====================

/**
 * 选择变化
 */
function handleSelectionChange(selection: SystemUser[]) {
  userStore.handleSelectionChange(selection);
}

// ==================== 下拉菜单操作 ====================

/**
 * 工具栏下拉菜单命令
 */
async function handleCommand(command: string) {
  switch (command) {
    case "import":
      importVisible.value = true;
      break;
    case "export":
      await handleExport();
      break;
    case "template":
      await handleDownloadTemplate();
      break;
    case "batchEnable":
      await userStore.batchToggleUserStatus("0");
      break;
    case "batchDisable":
      await userStore.batchToggleUserStatus("1");
      break;
  }
}

/**
 * 行操作下拉菜单命令
 */
function handleRowCommand(command: string, row: SystemUser) {
  switch (command) {
    case "resetPwd":
      userStore.currentUser = row;
      resetPwdVisible.value = true;
      break;
    case "authRole":
      userStore.currentUser = row;
      authRoleVisible.value = true;
      break;
  }
}

// ==================== 导入导出操作 ====================

/**
 * 导出数据
 */
async function handleExport() {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    // 实现导出功能
    const response = await userStore.exportUser(queryParams.value);

    if (response.code === 200) {
      // 创建下载链接
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "用户数据.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success("导出成功");
    } else {
      ElMessage.error(response.msg || "导出失败");
    }
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
}

/**
 * 下载模板
 */
async function handleDownloadTemplate() {
  try {
    ElMessage.info("正在下载模板，请稍候...");
    // 实现下载模板功能
    const response = await userStore.importTemplate();

    if (response.code === 200) {
      // 创建下载链接
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "用户导入模板.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success("下载成功");
    } else {
      ElMessage.error(response.msg || "下载失败");
    }
  } catch (error) {
    console.error("下载模板失败:", error);
    ElMessage.error("下载失败");
  }
}

/**
 * 导入成功
 */
function handleImportSuccess() {
  importVisible.value = false;
  userStore.getUserList();
}

// ==================== 其他操作 ====================

/**
 * 重置密码成功
 */
function handleResetPwdSuccess() {
  resetPwdVisible.value = false;
  ElMessage.success("重置密码成功");
}

/**
 * 分配角色成功
 */
function handleAuthRoleSuccess() {
  authRoleVisible.value = false;
  userStore.getUserList();
}
</script>

<style scoped lang="scss">
.user-manage-container {
  padding: 20px;

  .search-card,
  .toolbar-card,
  .table-card {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .query-form {
    .el-form-item {
      margin-bottom: 15px;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toolbar-left {
      display: flex;
      gap: 10px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  // 表格样式优化
  :deep(.el-table) {
    .el-button + .el-button {
      margin-left: 5px;
    }

    .small-padding {
      padding-left: 5px;
      padding-right: 5px;
    }

    .fixed-width {
      .cell {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }

  // 状态开关样式
  :deep(.el-switch) {
    .el-switch__core {
      min-width: 40px;
      height: 20px;

      .el-switch__action {
        height: 16px;
        width: 16px;
        top: 2px;
      }
    }
  }
}
</style>
