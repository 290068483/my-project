<template>
  <div class="dept-manage-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="部门状态" clearable style="width: 120px">
            <el-option v-for="dict in DEPT_STATUS_OPTIONS" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          <el-button v-permission="'system:dept:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button type="info" icon="Sort" @click="toggleExpandAll">
            {{ isExpandAll ? "折叠" : "展开" }}全部
          </el-button>
        </div>

        <div class="toolbar-right">
          <el-button circle icon="Refresh" @click="refreshData" />
        </div>
      </div>
    </el-card>

    <!-- 部门树形表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="deptLoading"
        :data="deptList"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        stripe>
        <el-table-column label="部门名称" prop="deptName" min-width="200">
          <template #default="{ row }">
            <span class="dept-name">{{ row.deptName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="排序" prop="orderNum" width="80" align="center" />

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "正常" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="负责人" prop="leader" width="120" align="center" show-overflow-tooltip />

        <el-table-column label="联系电话" prop="phone" width="140" align="center" show-overflow-tooltip />

        <el-table-column label="邮箱" prop="email" min-width="160" show-overflow-tooltip />

        <el-table-column label="创建时间" prop="createTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="新增" placement="top">
              <el-button
                v-permission="'system:dept:add'"
                type="primary"
                icon="Plus"
                size="small"
                link
                @click="handleAdd(row)" />
            </el-tooltip>

            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'system:dept:edit'"
                type="primary"
                icon="Edit"
                size="small"
                link
                @click="handleUpdate(row)" />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:dept:remove'"
                type="danger"
                icon="Delete"
                size="small"
                link
                @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 部门表单对话框 -->
    <DeptForm
      v-model="deptDialogVisible"
      :title="deptDialogTitle"
      :type="deptDialogType"
      :dept-data="currentDept"
      :dept-tree="deptTreeOptions"
      @success="handleFormSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { useDeptManageStore } from "@/stores/system/deptManage";
import { DEPT_STATUS_OPTIONS } from "@/types/system/dept";
import { formatDateTime } from "@/utils/dateUtils";
import type { SystemDept, DeptQueryParams } from "@/types/system/dept";
import DeptForm from "./components/DeptForm.vue";

// Store
const deptStore = useDeptManageStore();

// 表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<DeptQueryParams>({
  deptName: "",
  status: "",
});

// 数据状态
const deptLoading = ref(false);
const isExpandAll = ref(false);

// 对话框状态
const deptDialogVisible = ref(false);
const deptDialogTitle = ref("");
const deptDialogType = ref<"add" | "edit">("add");
const currentDept = ref<SystemDept | null>(null);

// 计算属性
const deptList = computed(() => deptStore.deptList);
const deptTreeOptions = computed(() => deptStore.deptTreeOptions);

/**
 * 查询部门列表
 */
const handleQuery = async () => {
  deptLoading.value = true;
  try {
    await deptStore.getDeptList(queryParams);
  } finally {
    deptLoading.value = false;
  }
};

/**
 * 重置查询
 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, {
    deptName: "",
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
 * 切换展开/折叠状态
 */
const toggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
};

/**
 * 新增部门
 */
const handleAdd = (row?: SystemDept) => {
  deptDialogTitle.value = "新增部门";
  deptDialogType.value = "add";
  currentDept.value = row ? { ...row } : null; // 如果有父部门，传递父部门信息
  deptDialogVisible.value = true;
};

/**
 * 编辑部门
 */
const handleUpdate = (row: SystemDept) => {
  deptDialogTitle.value = "修改部门";
  deptDialogType.value = "edit";
  currentDept.value = { ...row };
  deptDialogVisible.value = true;
};

/**
 * 删除部门
 */
const handleDelete = async (row: SystemDept) => {
  try {
    await ElMessageBox.confirm(`确认删除部门"${row.deptName}"吗？`, "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deptStore.deleteDept(row.deptId!);
    ElMessage.success("删除成功");
    await handleQuery();
  } catch (error) {
    // 用户取消操作或删除失败
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

/**
 * 表单操作成功回调
 */
const handleFormSuccess = () => {
  deptDialogVisible.value = false;
  handleQuery();
};

// 组件挂载时获取数据
onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.dept-manage-container {
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

.dept-name {
  font-weight: 500;
  color: #303133;
}

:deep(.el-table .el-table__cell) {
  padding: 8px 0;
}

:deep(.el-table__expand-icon) {
  color: #409eff;
}
</style>
