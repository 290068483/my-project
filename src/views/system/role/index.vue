<template>
  <div class="role-manage-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
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
          <el-button v-permission="'system:role:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button
            v-permission="'system:role:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>
          <el-button
            v-permission="'system:role:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
        </div>

        <div class="toolbar-right">
          <el-button circle icon="Refresh" @click="refreshData" />
        </div>
      </div>
    </el-card>

    <!-- 角色表格 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="roleList" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="角色编号" prop="roleId" width="80" align="center" />

        <el-table-column label="角色名称" prop="roleName" min-width="120" show-overflow-tooltip />

        <el-table-column label="权限字符" prop="roleKey" min-width="120" show-overflow-tooltip />

        <el-table-column label="显示顺序" prop="roleSort" width="100" align="center" />

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "正常" : "停用" }}
            </el-tag>
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
                v-permission="'system:role:edit'"
                type="primary"
                icon="Edit"
                size="small"
                link
                @click="handleUpdate(row)" />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:role:remove'"
                type="danger"
                icon="Delete"
                size="small"
                link
                @click="handleDelete(row)" />
            </el-tooltip>

            <el-tooltip content="数据权限" placement="top">
              <el-button
                v-permission="'system:role:edit'"
                type="warning"
                icon="CircleCheck"
                size="small"
                link
                @click="handleDataScope(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { formatDateTime } from "@/utils/dateUtils";

// 模拟角色数据接口
interface SystemRole {
  roleId?: number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  status: string;
  createTime?: string;
  remark?: string;
}

interface RoleQueryParams {
  pageNum: number;
  pageSize: number;
  roleName?: string;
  roleKey?: string;
  status?: string;
}

// 表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<RoleQueryParams>({
  pageNum: 1,
  pageSize: 10,
  roleName: "",
  roleKey: "",
  status: "",
});

// 数据状态
const loading = ref(false);
const roleList = ref<SystemRole[]>([]);
const total = ref(0);
const selectedRows = ref<SystemRole[]>([]);

// 计算属性
const isSingleSelection = computed(() => selectedRows.value.length === 1);
const isMultipleSelection = computed(() => selectedRows.value.length > 0);

/**
 * 查询角色列表
 */
const handleQuery = async () => {
  loading.value = true;
  try {
    // TODO: 调用角色查询API
    // const response = await listRole(queryParams);

    // 模拟数据
    roleList.value = [
      {
        roleId: 1,
        roleName: "超级管理员",
        roleKey: "admin",
        roleSort: 1,
        status: "0",
        createTime: "2024-01-01 00:00:00",
        remark: "超级管理员",
      },
      {
        roleId: 2,
        roleName: "普通角色",
        roleKey: "common",
        roleSort: 2,
        status: "0",
        createTime: "2024-01-01 00:00:00",
        remark: "普通角色",
      },
    ];
    total.value = 2;

    ElMessage.success("查询成功");
  } catch (error) {
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

/**
 * 重置查询
 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, {
    pageNum: 1,
    pageSize: 10,
    roleName: "",
    roleKey: "",
    status: "",
  });
  handleQuery();
};

/**
 * 刷新数据
 */
const refreshData = () => {
  handleQuery();
};

/**
 * 新增角色
 */
const handleAdd = () => {
  ElMessage.info("新增角色功能待开发");
};

/**
 * 修改角色
 */
const handleUpdate = (row?: SystemRole) => {
  const role = row || selectedRows.value[0];
  ElMessage.info(`修改角色：${role.roleName}`);
};

/**
 * 删除角色
 */
const handleDelete = async (row?: SystemRole) => {
  let roles: SystemRole[];

  if (row) {
    roles = [row];
  } else {
    roles = selectedRows.value;
  }

  const roleNames = roles.map((r) => r.roleName).join("、");

  try {
    await ElMessageBox.confirm(`确认删除角色"${roleNames}"吗？`, "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // TODO: 调用删除API
    ElMessage.success("删除成功");
    await handleQuery();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

/**
 * 数据权限设置
 */
const handleDataScope = (row: SystemRole) => {
  ElMessage.info(`设置数据权限：${row.roleName}`);
};

/**
 * 选择变化
 */
const handleSelectionChange = (selection: SystemRole[]) => {
  selectedRows.value = selection;
};

// 组件挂载时获取数据
onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.role-manage-container {
  padding: 20px;
}

.search-card,
.toolbar-card,
.table-card {
  margin-bottom: 20px;
}

.query-form {
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-table .el-table__cell) {
  padding: 8px 0;
}
</style>
