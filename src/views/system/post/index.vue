<template>
  <div class="post-manage-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="岗位编码" prop="postCode">
          <el-input
            v-model="queryParams.postCode"
            placeholder="请输入岗位编码"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="queryParams.postName"
            placeholder="请输入岗位名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="岗位状态" clearable style="width: 120px">
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
          <el-button v-permission="'system:post:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button
            v-permission="'system:post:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>
          <el-button
            v-permission="'system:post:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button v-permission="'system:post:export'" type="warning" icon="Download" @click="handleExport">
            导出
          </el-button>
        </div>

        <div class="toolbar-right">
          <el-button circle icon="Refresh" @click="refreshData" />
        </div>
      </div>
    </el-card>

    <!-- 岗位表格 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="postList" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="岗位编号" prop="postId" width="80" align="center" />

        <el-table-column label="岗位编码" prop="postCode" min-width="120" show-overflow-tooltip />

        <el-table-column label="岗位名称" prop="postName" min-width="120" show-overflow-tooltip />

        <el-table-column label="岗位排序" prop="postSort" width="100" align="center" />

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

        <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'system:post:edit'"
                type="primary"
                icon="Edit"
                size="small"
                link
                @click="handleUpdate(row)" />
            </el-tooltip>

            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:post:remove'"
                type="danger"
                icon="Delete"
                size="small"
                link
                @click="handleDelete(row)" />
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

// 模拟岗位数据接口
interface SystemPost {
  postId?: number;
  postCode: string;
  postName: string;
  postSort: number;
  status: string;
  createTime?: string;
  remark?: string;
}

interface PostQueryParams {
  pageNum: number;
  pageSize: number;
  postCode?: string;
  postName?: string;
  status?: string;
}

// 表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<PostQueryParams>({
  pageNum: 1,
  pageSize: 10,
  postCode: "",
  postName: "",
  status: "",
});

// 数据状态
const loading = ref(false);
const postList = ref<SystemPost[]>([]);
const total = ref(0);
const selectedRows = ref<SystemPost[]>([]);

// 计算属性
const isSingleSelection = computed(() => selectedRows.value.length === 1);
const isMultipleSelection = computed(() => selectedRows.value.length > 0);

/**
 * 查询岗位列表
 */
const handleQuery = async () => {
  loading.value = true;
  try {
    // TODO: 调用岗位查询API
    // const response = await listPost(queryParams);

    // 模拟数据
    postList.value = [
      {
        postId: 1,
        postCode: "ceo",
        postName: "董事长",
        postSort: 1,
        status: "0",
        createTime: "2024-01-01 00:00:00",
        remark: "董事长",
      },
      {
        postId: 2,
        postCode: "se",
        postName: "项目经理",
        postSort: 2,
        status: "0",
        createTime: "2024-01-01 00:00:00",
        remark: "项目经理",
      },
      {
        postId: 3,
        postCode: "hr",
        postName: "人力资源",
        postSort: 3,
        status: "0",
        createTime: "2024-01-01 00:00:00",
        remark: "人力资源",
      },
      {
        postId: 4,
        postCode: "user",
        postName: "普通员工",
        postSort: 4,
        status: "0",
        createTime: "2024-01-01 00:00:00",
        remark: "普通员工",
      },
    ];
    total.value = 4;

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
    postCode: "",
    postName: "",
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
 * 新增岗位
 */
const handleAdd = () => {
  ElMessage.info("新增岗位功能待开发");
};

/**
 * 修改岗位
 */
const handleUpdate = (row?: SystemPost) => {
  const post = row || selectedRows.value[0];
  ElMessage.info(`修改岗位：${post.postName}`);
};

/**
 * 删除岗位
 */
const handleDelete = async (row?: SystemPost) => {
  let posts: SystemPost[];

  if (row) {
    posts = [row];
  } else {
    posts = selectedRows.value;
  }

  const postNames = posts.map((p) => p.postName).join("、");

  try {
    await ElMessageBox.confirm(`确认删除岗位"${postNames}"吗？`, "删除确认", {
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
 * 导出数据
 */
const handleExport = async () => {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    // TODO: 调用导出API
    ElMessage.success("导出成功");
  } catch {
    ElMessage.error("导出失败");
  }
};

/**
 * 选择变化
 */
const handleSelectionChange = (selection: SystemPost[]) => {
  selectedRows.value = selection;
};

// 组件挂载时获取数据
onMounted(() => {
  handleQuery();
});
</script>

<style scoped>
.post-manage-container {
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
