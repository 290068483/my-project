<template>
  <el-dialog v-model="dialogVisible" title="分配角色" width="700px" :close-on-click-modal="false">
    <div class="auth-role-content">
      <div class="user-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名称">
            {{ userData?.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="用户昵称">
            {{ userData?.nickName }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="role-section">
        <h4>角色列表</h4>
        <div class="role-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="role-list-container">
                <div class="list-header">
                  <h5>未选中角色</h5>
                  <el-input v-model="unSelectedRoleFilter" placeholder="搜索角色" size="small" clearable />
                </div>
                <div class="role-list">
                  <el-checkbox-group v-model="selectedRoles" class="role-checkbox-group">
                    <div v-for="role in filteredUnSelectedRoles" :key="role.roleId" class="role-item">
                      <el-checkbox :label="role.roleId" :disabled="role.status === '1'">
                        <span class="role-name">{{ role.roleName }}</span>
                        <span class="role-key">{{ role.roleKey }}</span>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </el-col>

            <el-col :span="12">
              <div class="role-list-container">
                <div class="list-header">
                  <h5>已选中角色</h5>
                  <el-input v-model="selectedRoleFilter" placeholder="搜索角色" size="small" clearable />
                </div>
                <div class="role-list">
                  <div v-for="role in filteredSelectedRoles" :key="role.roleId" class="role-item selected">
                    <div class="role-info">
                      <span class="role-name">{{ role.roleName }}</span>
                      <span class="role-key">{{ role.roleKey }}</span>
                    </div>
                    <el-button type="danger" size="small" icon="Close" circle @click="removeRole(role.roleId!)" />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确 定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { updateAuthRole, getAuthRole } from "@/api/system/user";
import { useUserManageStore } from "@/stores/system/userManage";
import type { SystemUser, SystemRole } from "@/types/system/user";

// Props
interface Props {
  modelValue: boolean;
  userData?: SystemUser | null;
}

const props = withDefaults(defineProps<Props>(), {
  userData: null,
});

// Emits
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const emit = defineEmits<Emits>();

// Store
const userStore = useUserManageStore();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 提交加载状态
const submitLoading = ref(false);

// 角色数据
const allRoles = ref<SystemRole[]>([]);
const selectedRoles = ref<number[]>([]);

// 搜索过滤
const unSelectedRoleFilter = ref("");
const selectedRoleFilter = ref("");

// 未选中的角色列表
const unSelectedRoles = computed(() => {
  return allRoles.value.filter((role) => !selectedRoles.value.includes(role.roleId!));
});

// 已选中的角色列表
const selectedRolesList = computed(() => {
  return allRoles.value.filter((role) => selectedRoles.value.includes(role.roleId!));
});

// 过滤后的未选中角色
const filteredUnSelectedRoles = computed(() => {
  if (!unSelectedRoleFilter.value) return unSelectedRoles.value;

  const filter = unSelectedRoleFilter.value.toLowerCase();
  return unSelectedRoles.value.filter(
    (role) => role.roleName.toLowerCase().includes(filter) || role.roleKey.toLowerCase().includes(filter),
  );
});

// 过滤后的已选中角色
const filteredSelectedRoles = computed(() => {
  if (!selectedRoleFilter.value) return selectedRolesList.value;

  const filter = selectedRoleFilter.value.toLowerCase();
  return selectedRolesList.value.filter(
    (role) => role.roleName.toLowerCase().includes(filter) || role.roleKey.toLowerCase().includes(filter),
  );
});

// 监听对话框显示状态
watch(dialogVisible, async (visible) => {
  if (visible && props.userData?.userId) {
    await loadAuthRole();
  }
});

/**
 * 加载用户授权角色信息
 */
async function loadAuthRole() {
  try {
    if (!props.userData?.userId) return;

    const response = await getAuthRole(props.userData.userId);

    if (response.code === 200) {
      // 设置所有角色列表
      allRoles.value = userStore.roleList;

      // 设置用户已选择的角色
      selectedRoles.value = props.userData.roleIds || [];
    }
  } catch (error) {
    console.error("加载用户角色信息失败:", error);
    ElMessage.error("加载角色信息失败");
  }
}

/**
 * 移除角色
 */
function removeRole(roleId: number) {
  const index = selectedRoles.value.indexOf(roleId);
  if (index > -1) {
    selectedRoles.value.splice(index, 1);
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  try {
    if (!props.userData?.userId) {
      ElMessage.error("用户信息不完整");
      return;
    }

    submitLoading.value = true;

    const data = {
      userId: props.userData.userId,
      roleIds: selectedRoles.value.join(","),
    };

    const response = await updateAuthRole(data);

    if (response.code === 200) {
      ElMessage.success("分配角色成功");
      emit("success");
    } else {
      ElMessage.error(response.msg || "分配角色失败");
    }
  } catch (error) {
    console.error("分配角色失败:", error);
    ElMessage.error("分配角色失败");
  } finally {
    submitLoading.value = false;
  }
}

/**
 * 取消操作
 */
function handleCancel() {
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.auth-role-content {
  .user-info {
    margin-bottom: 20px;
  }

  .role-section {
    h4 {
      margin: 0 0 15px 0;
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }

    .role-content {
      .role-list-container {
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        height: 400px;
        display: flex;
        flex-direction: column;

        .list-header {
          padding: 10px 15px;
          background-color: #f5f7fa;
          border-bottom: 1px solid #e4e7ed;

          h5 {
            margin: 0 0 10px 0;
            color: #606266;
            font-size: 14px;
            font-weight: 500;
          }
        }

        .role-list {
          flex: 1;
          padding: 10px;
          overflow-y: auto;

          .role-checkbox-group {
            width: 100%;

            .role-item {
              display: flex;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid #f0f2f5;

              &:last-child {
                border-bottom: none;
              }

              :deep(.el-checkbox) {
                width: 100%;

                .el-checkbox__label {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  line-height: 1.4;

                  .role-name {
                    font-weight: 500;
                    color: #303133;
                  }

                  .role-key {
                    font-size: 12px;
                    color: #909399;
                    margin-top: 2px;
                  }
                }
              }
            }
          }

          .role-item.selected {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #f0f9ff;
            border: 1px solid #b3d8ff;
            border-radius: 4px;
            margin-bottom: 8px;

            &:last-child {
              margin-bottom: 0;
            }

            .role-info {
              flex: 1;
              display: flex;
              flex-direction: column;

              .role-name {
                font-weight: 500;
                color: #303133;
                line-height: 1.4;
              }

              .role-key {
                font-size: 12px;
                color: #909399;
                margin-top: 2px;
              }
            }
          }
        }

        // 滚动条样式
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;

          &:hover {
            background: #a8a8a8;
          }
        }
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>
