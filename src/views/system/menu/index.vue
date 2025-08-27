<template>
  <div class="menu-manage-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 120px">
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
          <el-button v-permission="'system:menu:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button type="info" icon="Sort" @click="toggleExpandAll">
            {{ isExpandAll ? "折叠" : "展开" }}全部
          </el-button>
        </div>

        <div class="toolbar-right">
          <el-button circle icon="Refresh" @click="refreshData" />
        </div>
      </div>
    </el-card>

    <!-- 菜单树形表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        stripe>
        <el-table-column label="菜单名称" prop="menuName" min-width="200">
          <template #default="{ row }">
            <el-icon v-if="row.icon" class="menu-icon">
              <component :is="row.icon" />
            </el-icon>
            <span class="menu-name">{{ row.menuName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="图标" prop="icon" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column label="排序" prop="orderNum" width="80" align="center" />

        <el-table-column label="权限标识" prop="perms" min-width="150" show-overflow-tooltip />

        <el-table-column label="组件路径" prop="component" min-width="150" show-overflow-tooltip />

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
            <el-tooltip content="新增" placement="top">
              <el-button
                v-permission="'system:menu:add'"
                type="primary"
                icon="Plus"
                size="small"
                link
                @click="handleAdd(row)" />
            </el-tooltip>

            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'system:menu:edit'"
                type="primary"
                icon="Edit"
                size="small"
                link
                @click="handleUpdate(row)" />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:menu:remove'"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { formatDateTime } from "@/utils/dateUtils";

// 模拟菜单数据接口
interface SystemMenu {
  menuId?: number;
  parentId?: number;
  menuName: string;
  orderNum: number;
  path?: string;
  component?: string;
  perms?: string;
  icon?: string;
  status: string;
  createTime?: string;
  children?: SystemMenu[];
  hasChildren?: boolean;
}

interface MenuQueryParams {
  menuName?: string;
  status?: string;
}

// 表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<MenuQueryParams>({
  menuName: "",
  status: "",
});

// 数据状态
const loading = ref(false);
const menuList = ref<SystemMenu[]>([]);
const isExpandAll = ref(false);

/**
 * 查询菜单列表
 */
const handleQuery = async () => {
  loading.value = true;
  try {
    // TODO: 调用菜单查询API
    // const response = await listMenu(queryParams);

    // 模拟树形数据
    menuList.value = [
      {
        menuId: 1,
        menuName: "系统管理",
        orderNum: 1,
        path: "/system",
        icon: "system",
        status: "0",
        createTime: "2024-01-01 00:00:00",
        hasChildren: true,
        children: [
          {
            menuId: 100,
            parentId: 1,
            menuName: "用户管理",
            orderNum: 1,
            path: "user",
            component: "system/user/index",
            perms: "system:user:list",
            icon: "user",
            status: "0",
            createTime: "2024-01-01 00:00:00",
          },
          {
            menuId: 101,
            parentId: 1,
            menuName: "角色管理",
            orderNum: 2,
            path: "role",
            component: "system/role/index",
            perms: "system:role:list",
            icon: "peoples",
            status: "0",
            createTime: "2024-01-01 00:00:00",
          },
          {
            menuId: 102,
            parentId: 1,
            menuName: "菜单管理",
            orderNum: 3,
            path: "menu",
            component: "system/menu/index",
            perms: "system:menu:list",
            icon: "tree-table",
            status: "0",
            createTime: "2024-01-01 00:00:00",
          },
          {
            menuId: 103,
            parentId: 1,
            menuName: "部门管理",
            orderNum: 4,
            path: "dept",
            component: "system/dept/index",
            perms: "system:dept:list",
            icon: "tree",
            status: "0",
            createTime: "2024-01-01 00:00:00",
          },
        ],
      },
    ];

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
    menuName: "",
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
 * 新增菜单
 */
const handleAdd = (row?: SystemMenu) => {
  const parentName = row ? row.menuName : "根菜单";
  ElMessage.info(`新增${parentName}的子菜单`);
};

/**
 * 修改菜单
 */
const handleUpdate = (row: SystemMenu) => {
  ElMessage.info(`修改菜单：${row.menuName}`);
};

/**
 * 删除菜单
 */
const handleDelete = async (row: SystemMenu) => {
  try {
    await ElMessageBox.confirm(`确认删除菜单"${row.menuName}"吗？`, "删除确认", {
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

// 组件挂载时获取数据
onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.menu-manage-container {
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

.menu-icon {
  margin-right: 8px;
  color: #409eff;
}

.menu-name {
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
