<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form ref="deptFormRef" :model="form" :rules="rules" label-width="100px" class="dept-form">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="deptTreeOptions"
              :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
              value-key="deptId"
              placeholder="请选择上级部门"
              check-strictly
              clearable
              :default-expanded-keys="expandedKeys">
              <template #default="{ data }">
                <span class="custom-tree-node">
                  <span>{{ data.deptName }}</span>
                  <span class="dept-level">[{{ getDeptLevel(data) }}]</span>
                </span>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入部门名称" maxlength="30" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number
              v-model="form.orderNum"
              :min="0"
              :max="999"
              controls-position="right"
              style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in DEPT_STATUS_OPTIONS" :key="dict.value" :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确 定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useDeptManageStore } from "@/stores/system/deptManage";
import { DEPT_STATUS_OPTIONS } from "@/types/system/dept";
import type { SystemDept, DeptForm } from "@/types/system/dept";

// Props
interface Props {
  modelValue: boolean;
  title: string;
  type: "add" | "edit";
  deptData?: SystemDept | null;
  deptTree: SystemDept[];
}

const props = withDefaults(defineProps<Props>(), {
  deptData: null,
});

// Emits
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const emit = defineEmits<Emits>();

// Store
const deptStore = useDeptManageStore();

// 表单引用
const deptFormRef = ref<FormInstance>();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 提交加载状态
const submitLoading = ref(false);

// 表单数据
const form = ref<DeptForm>({
  deptId: undefined,
  parentId: 0,
  deptName: "",
  orderNum: 1,
  leader: "",
  phone: "",
  email: "",
  status: "0",
});

// 展开的节点
const expandedKeys = ref<number[]>([]);

// 计算部门树选项（排除自身及其子部门）
const deptTreeOptions = computed(() => {
  if (props.type === "edit" && props.deptData?.deptId) {
    return filterDeptTree(props.deptTree, props.deptData.deptId);
  }
  return addRootOption([...props.deptTree]);
});

/**
 * 添加根部门选项
 */
const addRootOption = (tree: SystemDept[]): SystemDept[] => {
  return [
    {
      deptId: 0,
      deptName: "主类目",
      parentId: -1,
      children: tree,
    } as SystemDept,
  ];
};

/**
 * 过滤部门树（排除自身及其子部门）
 */
const filterDeptTree = (tree: SystemDept[], excludeId: number): SystemDept[] => {
  const result: SystemDept[] = [];

  const filterNode = (nodes: SystemDept[]): SystemDept[] => {
    return nodes
      .filter((node) => node.deptId !== excludeId)
      .map((node) => ({
        ...node,
        children: node.children ? filterNode(node.children) : undefined,
      }));
  };

  const filteredTree = filterNode(tree);
  return addRootOption(filteredTree);
};

/**
 * 获取部门层级标识
 */
const getDeptLevel = (dept: SystemDept): string => {
  if (dept.deptId === 0) return "根部门";

  const getLevel = (deptId: number, tree: SystemDept[], level = 1): number => {
    for (const node of tree) {
      if (node.deptId === deptId) {
        return level;
      }
      if (node.children) {
        const childLevel = getLevel(deptId, node.children, level + 1);
        if (childLevel > 0) return childLevel;
      }
    }
    return 0;
  };

  const level = getLevel(dept.deptId!, props.deptTree);
  return `第${level}级`;
};

// 表单验证规则
const rules = computed<FormRules>(() => ({
  deptName: [
    { required: true, message: "部门名称不能为空", trigger: "blur" },
    { min: 2, max: 30, message: "部门名称长度必须介于 2 和 30 之间", trigger: "blur" },
    {
      validator: async (rule, value) => {
        if (props.type === "edit" && props.deptData?.deptName === value) {
          return true;
        }

        if (value) {
          const isUnique = await deptStore.validateDeptName(value, form.value.deptId, form.value.parentId);
          if (!isUnique) {
            throw new Error("部门名称已存在");
          }
        }
        return true;
      },
      trigger: "blur",
    },
  ],
  orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
  leader: [{ max: 20, message: "负责人长度不能超过 20 个字符", trigger: "blur" }],
  phone: [
    { max: 11, message: "联系电话长度不能超过 11 个字符", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  email: [
    { max: 50, message: "邮箱长度不能超过 50 个字符", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  status: [{ required: true, message: "部门状态不能为空", trigger: "blur" }],
}));

/**
 * 重置表单
 */
const resetForm = () => {
  form.value = {
    deptId: undefined,
    parentId: 0,
    deptName: "",
    orderNum: 1,
    leader: "",
    phone: "",
    email: "",
    status: "0",
  };
};

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  if (!deptFormRef.value) return;

  try {
    await deptFormRef.value.validate();
    submitLoading.value = true;

    if (props.type === "add") {
      await deptStore.addDept(form.value);
      ElMessage.success("新增成功");
    } else {
      await deptStore.updateDept(form.value);
      ElMessage.success("修改成功");
    }

    emit("success");
  } catch (error) {
    console.error("部门操作失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

/**
 * 取消操作
 */
const handleCancel = () => {
  dialogVisible.value = false;
};

/**
 * 对话框关闭前处理
 */
const handleClose = (done: () => void) => {
  if (submitLoading.value) {
    ElMessage.warning("操作进行中，请稍候...");
    return;
  }
  done();
};

// 监听对话框显示状态
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      resetForm();
      nextTick(() => {
        if (props.type === "edit" && props.deptData) {
          // 编辑模式：填充表单数据
          Object.assign(form.value, {
            deptId: props.deptData.deptId,
            parentId: props.deptData.parentId || 0,
            deptName: props.deptData.deptName,
            orderNum: props.deptData.orderNum || 1,
            leader: props.deptData.leader || "",
            phone: props.deptData.phone || "",
            email: props.deptData.email || "",
            status: props.deptData.status || "0",
          });
        } else if (props.type === "add" && props.deptData) {
          // 新增子部门：设置父部门
          form.value.parentId = props.deptData.deptId || 0;
          expandedKeys.value = [props.deptData.deptId || 0];
        }
      });
    } else {
      // 对话框关闭时重置表单
      resetForm();
      expandedKeys.value = [];
    }
  },
);
</script>

<style scoped>
.dept-form {
  padding: 20px 20px 0;
}

.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dept-level {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

:deep(.el-tree-select .el-select__wrapper) {
  min-height: 32px;
}

:deep(.el-tree-node__content) {
  height: 32px;
  line-height: 32px;
}
</style>
