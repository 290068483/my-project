/**
 * 系统用户管理状态管理
 * 基于 RuoYi 架构设计
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  listUser,
  getUser,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  listRole,
  listPost,
  listDept,
  checkUserNameUnique,
  checkPhoneUnique,
  checkEmailUnique,
  batchDelUser,
  batchChangeUserStatus,
} from "@/api/system/user";
import type {
  SystemUser,
  SystemRole,
  SystemPost,
  SystemDept,
  UserQueryParams,
  UserForm,
  UserPasswordForm,
} from "@/types/system/user";
import type { PageResponse } from "@/types/api";

export const useUserManageStore = defineStore("userManage", () => {
  // ==================== 状态定义 ====================

  // 用户列表数据
  const userList = ref<SystemUser[]>([]);
  const userTotal = ref<number>(0);
  const userLoading = ref<boolean>(false);

  // 当前操作的用户
  const currentUser = ref<SystemUser | null>(null);
  const userDetail = ref<SystemUser | null>(null);

  // 字典数据
  const roleList = ref<SystemRole[]>([]);
  const postList = ref<SystemPost[]>([]);
  const deptList = ref<SystemDept[]>([]);
  const deptTree = ref<SystemDept[]>([]);

  // 对话框状态
  const userDialogVisible = ref<boolean>(false);
  const userDialogTitle = ref<string>("");
  const userDialogType = ref<"add" | "edit">("add");

  // 查询参数
  const queryParams = ref<UserQueryParams>({
    pageNum: 1,
    pageSize: 10,
    userName: "",
    phonenumber: "",
    status: undefined,
    deptId: undefined,
  });

  // 选中的用户
  const selectedUsers = ref<SystemUser[]>([]);
  const selectedUserIds = ref<number[]>([]);

  // ==================== 计算属性 ====================

  const isMultipleSelection = computed(() => selectedUsers.value.length > 0);
  const isSingleSelection = computed(() => selectedUsers.value.length === 1);

  const deptTreeOptions = computed(() => {
    return buildDeptTree(deptList.value);
  });

  // ==================== 方法定义 ====================

  /**
   * 构建部门树结构
   */
  function buildDeptTree(depts: SystemDept[], parentId: number = 0): SystemDept[] {
    const tree: SystemDept[] = [];

    for (const dept of depts) {
      if (dept.parentId === parentId) {
        const children = buildDeptTree(depts, dept.deptId!);
        if (children.length > 0) {
          dept.children = children;
        }
        tree.push(dept);
      }
    }

    return tree;
  }

  /**
   * 获取用户列表
   */
  async function getUserList(params?: Partial<UserQueryParams>): Promise<void> {
    try {
      userLoading.value = true;

      const queryData = { ...queryParams.value, ...params };
      const response = await listUser(queryData);

      if (response.code === 200 && response.data) {
        userList.value = response.data.rows || response.data.list || [];
        userTotal.value = response.data.total || 0;
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
      ElMessage.error("获取用户列表失败");
    } finally {
      userLoading.value = false;
    }
  }

  /**
   * 获取用户详情
   */
  async function getUserDetail(userId: number): Promise<SystemUser | null> {
    try {
      const response = await getUser(userId);

      if (response.code === 200 && response.data) {
        userDetail.value = response.data.user || response.data;
        return response.data.user || response.data;
      }

      return null;
    } catch (error) {
      console.error("获取用户详情失败:", error);
      ElMessage.error("获取用户详情失败");
      return null;
    }
  }

  /**
   * 添加用户
   */
  async function addUserData(userData: UserForm): Promise<boolean> {
    try {
      const response = await addUser(userData);

      if (response.code === 200) {
        ElMessage.success("新增用户成功");
        await getUserList();
        return true;
      } else {
        ElMessage.error(response.msg || response.message || "新增用户失败");
        return false;
      }
    } catch (error) {
      console.error("新增用户失败:", error);
      ElMessage.error("新增用户失败");
      return false;
    }
  }

  /**
   * 更新用户
   */
  async function updateUserData(userData: UserForm): Promise<boolean> {
    try {
      const response = await updateUser(userData);

      if (response.code === 200) {
        ElMessage.success("修改用户成功");
        await getUserList();
        return true;
      } else {
        ElMessage.error(response.msg || response.message || "修改用户失败");
        return false;
      }
    } catch (error) {
      console.error("修改用户失败:", error);
      ElMessage.error("修改用户失败");
      return false;
    }
  }

  /**
   * 删除用户
   */
  async function deleteUser(userIds: number | number[]): Promise<boolean> {
    try {
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      const names = ids
        .map((id) => {
          const user = userList.value.find((u) => u.userId === id);
          return user?.userName || id;
        })
        .join(", ");

      await ElMessageBox.confirm(`是否确认删除用户编号为"${names}"的数据项？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      const response = await delUser(userIds);

      if (response.code === 200) {
        ElMessage.success("删除成功");
        await getUserList();
        // 清空选中状态
        selectedUsers.value = [];
        selectedUserIds.value = [];
        return true;
      } else {
        ElMessage.error(response.msg || response.message || "删除失败");
        return false;
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除用户失败:", error);
        ElMessage.error("删除失败");
      }
      return false;
    }
  }

  /**
   * 重置用户密码
   */
  async function resetPassword(userId: number, newPassword: string): Promise<boolean> {
    try {
      const user = userList.value.find((u) => u.userId === userId);
      const userName = user?.userName || userId;

      await ElMessageBox.confirm(`确认要重置用户"${userName}"的密码吗？`, "重置密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      const data: UserPasswordForm = {
        userId,
        password: newPassword,
      };

      const response = await resetUserPwd(data);

      if (response.code === 200) {
        ElMessage.success("重置密码成功");
        return true;
      } else {
        ElMessage.error(response.msg || response.message || "重置密码失败");
        return false;
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("重置密码失败:", error);
        ElMessage.error("重置密码失败");
      }
      return false;
    }
  }

  /**
   * 修改用户状态
   */
  async function toggleUserStatus(user: SystemUser): Promise<boolean> {
    try {
      const newStatus = user.status === "0" ? "1" : "0";
      const statusText = newStatus === "0" ? "启用" : "停用";

      await ElMessageBox.confirm(`确认要${statusText}用户"${user.userName}"吗？`, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      const response = await changeUserStatus(user.userId!, newStatus);

      if (response.code === 200) {
        user.status = newStatus as "0" | "1";
        ElMessage.success(`${statusText}成功`);
        return true;
      } else {
        ElMessage.error(response.msg || response.message || `${statusText}失败`);
        return false;
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("修改用户状态失败:", error);
        ElMessage.error("修改状态失败");
      }
      return false;
    }
  }

  /**
   * 批量删除用户
   */
  async function batchDeleteUsers(): Promise<boolean> {
    if (selectedUserIds.value.length === 0) {
      ElMessage.warning("请选择要删除的用户");
      return false;
    }

    return await deleteUser(selectedUserIds.value);
  }

  /**
   * 批量修改用户状态
   */
  async function batchToggleUserStatus(status: "0" | "1"): Promise<boolean> {
    if (selectedUserIds.value.length === 0) {
      ElMessage.warning("请选择要操作的用户");
      return false;
    }

    try {
      const statusText = status === "0" ? "启用" : "停用";

      await ElMessageBox.confirm(`确认要${statusText}选中的${selectedUserIds.value.length}个用户吗？`, "批量操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      const response = await batchChangeUserStatus(selectedUserIds.value, status);

      if (response.code === 200) {
        ElMessage.success(`批量${statusText}成功`);
        await getUserList();
        selectedUsers.value = [];
        selectedUserIds.value = [];
        return true;
      } else {
        ElMessage.error(response.msg || response.message || `批量${statusText}失败`);
        return false;
      }
    } catch (error) {
      if (error !== "cancel") {
        console.error("批量修改用户状态失败:", error);
        ElMessage.error("批量操作失败");
      }
      return false;
    }
  }

  /**
   * 获取字典数据
   */
  async function getDictData(): Promise<void> {
    try {
      const [roleRes, postRes, deptRes] = await Promise.all([listRole(), listPost(), listDept()]);

      if (roleRes.code === 200) {
        roleList.value = roleRes.data || [];
      }

      if (postRes.code === 200) {
        postList.value = postRes.data || [];
      }

      if (deptRes.code === 200) {
        deptList.value = deptRes.data || [];
      }
    } catch (error) {
      console.error("获取字典数据失败:", error);
    }
  }

  /**
   * 校验用户名唯一性
   */
  async function validateUserName(userName: string, userId?: number): Promise<boolean> {
    try {
      const response = await checkUserNameUnique(userName);

      if (response.code === 200) {
        return response.data ?? false;
      }

      return false;
    } catch (error) {
      console.error("校验用户名失败:", error);
      return false;
    }
  }

  /**
   * 校验手机号唯一性
   */
  async function validatePhone(phonenumber: string, userId?: number): Promise<boolean> {
    try {
      const response = await checkPhoneUnique(phonenumber);

      if (response.code === 200) {
        return response.data ?? false;
      }

      return false;
    } catch (error) {
      console.error("校验手机号失败:", error);
      return false;
    }
  }

  /**
   * 校验邮箱唯一性
   */
  async function validateEmail(email: string, userId?: number): Promise<boolean> {
    try {
      const response = await checkEmailUnique(email);

      if (response.code === 200) {
        return response.data ?? false;
      }

      return false;
    } catch (error) {
      console.error("校验邮箱失败:", error);
      return false;
    }
  }

  /**
   * 打开用户对话框
   */
  function openUserDialog(type: "add" | "edit", user?: SystemUser): void {
    userDialogType.value = type;
    userDialogTitle.value = type === "add" ? "添加用户" : "修改用户";
    userDialogVisible.value = true;

    if (type === "edit" && user) {
      currentUser.value = { ...user };
    } else {
      currentUser.value = null;
    }
  }

  /**
   * 关闭用户对话框
   */
  function closeUserDialog(): void {
    userDialogVisible.value = false;
    currentUser.value = null;
  }

  /**
   * 处理选择变化
   */
  function handleSelectionChange(selection: SystemUser[]): void {
    selectedUsers.value = selection;
    selectedUserIds.value = selection.map((user) => user.userId!).filter((id) => id !== undefined);
  }

  /**
   * 重置查询参数
   */
  function resetQuery(): void {
    queryParams.value = {
      pageNum: 1,
      pageSize: 10,
      userName: "",
      phonenumber: "",
      status: undefined,
      deptId: undefined,
    };
  }

  /**
   * 刷新数据
   */
  async function refreshData(): Promise<void> {
    await Promise.all([getUserList(), getDictData()]);
  }

  return {
    // 状态
    userList,
    userTotal,
    userLoading,
    currentUser,
    userDetail,
    roleList,
    postList,
    deptList,
    deptTree,
    userDialogVisible,
    userDialogTitle,
    userDialogType,
    queryParams,
    selectedUsers,
    selectedUserIds,

    // 计算属性
    isMultipleSelection,
    isSingleSelection,
    deptTreeOptions,

    // 方法
    getUserList,
    getUserDetail,
    addUserData,
    updateUserData,
    deleteUser,
    resetPassword,
    toggleUserStatus,
    batchDeleteUsers,
    batchToggleUserStatus,
    getDictData,
    validateUserName,
    validatePhone,
    validateEmail,
    openUserDialog,
    closeUserDialog,
    handleSelectionChange,
    resetQuery,
    refreshData,
  };
});
