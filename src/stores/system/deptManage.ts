import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import * as deptApi from "@/api/system/dept";
import type { SystemDept, DeptQueryParams, DeptForm, DeptListResponse } from "@/types/system/dept";

/**
 * 部门管理 Store
 */
export const useDeptManageStore = defineStore("deptManage", () => {
  // ==================== 状态定义 ====================

  /** 部门列表 */
  const deptList = ref<SystemDept[]>([]);

  /** 部门树结构 */
  const deptTree = ref<SystemDept[]>([]);

  /** 加载状态 */
  const loading = ref(false);

  // ==================== 计算属性 ====================

  /**
   * 部门树选项（用于下拉选择）
   */
  const deptTreeOptions = computed(() => {
    return buildTreeOptions(deptTree.value);
  });

  /**
   * 部门映射表（ID -> 部门信息）
   */
  const deptMap = computed(() => {
    const map = new Map<number, SystemDept>();

    const addToMap = (depts: SystemDept[]) => {
      depts.forEach((dept) => {
        if (dept.deptId) {
          map.set(dept.deptId, dept);
        }
        if (dept.children) {
          addToMap(dept.children);
        }
      });
    };

    addToMap(deptTree.value);
    return map;
  });

  // ==================== 内部方法 ====================

  /**
   * 构建树形选项
   */
  function buildTreeOptions(depts: SystemDept[]): SystemDept[] {
    return depts.map((dept) => ({
      ...dept,
      children: dept.children ? buildTreeOptions(dept.children) : undefined,
    }));
  }

  /**
   * 构建部门树结构
   */
  function buildDeptTree(depts: SystemDept[]): SystemDept[] {
    const deptMap = new Map<number, SystemDept>();
    const rootDepts: SystemDept[] = [];

    // 创建部门映射
    depts.forEach((dept) => {
      if (dept.deptId) {
        deptMap.set(dept.deptId, {
          ...dept,
          children: [],
        });
      }
    });

    // 构建树结构
    depts.forEach((dept) => {
      const deptNode = deptMap.get(dept.deptId!);
      if (!deptNode) return;

      if (dept.parentId && dept.parentId !== 0) {
        const parent = deptMap.get(dept.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(deptNode);
          parent.hasChildren = true;
        }
      } else {
        rootDepts.push(deptNode);
      }
    });

    return rootDepts;
  }

  // ==================== API 方法 ====================

  /**
   * 获取部门列表
   */
  async function getDeptList(params?: DeptQueryParams): Promise<void> {
    try {
      loading.value = true;
      const response: DeptListResponse = await deptApi.listDept(params);

      if (response.code === 200 && response.data) {
        deptList.value = response.data;
        deptTree.value = buildDeptTree(response.data);
      }
    } catch (error) {
      console.error("获取部门列表失败:", error);
      ElMessage.error("获取部门列表失败");
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取部门详情
   */
  async function getDeptDetail(deptId: number): Promise<SystemDept | null> {
    try {
      const response = await deptApi.getDept(deptId);

      if (response.code === 200 && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("获取部门详情失败:", error);
      ElMessage.error("获取部门详情失败");
      return null;
    }
  }

  /**
   * 新增部门
   */
  async function addDept(deptData: DeptForm): Promise<boolean> {
    try {
      const response = await deptApi.addDept(deptData);

      if (response.code === 200) {
        return true;
      } else {
        ElMessage.error(response.msg || "新增部门失败");
        return false;
      }
    } catch (error) {
      console.error("新增部门失败:", error);
      ElMessage.error("新增部门失败");
      return false;
    }
  }

  /**
   * 更新部门
   */
  async function updateDept(deptData: DeptForm): Promise<boolean> {
    try {
      const response = await deptApi.updateDept(deptData);

      if (response.code === 200) {
        return true;
      } else {
        ElMessage.error(response.msg || "修改部门失败");
        return false;
      }
    } catch (error) {
      console.error("修改部门失败:", error);
      ElMessage.error("修改部门失败");
      return false;
    }
  }

  /**
   * 删除部门
   */
  async function deleteDept(deptId: number): Promise<boolean> {
    try {
      const response = await deptApi.delDept(deptId);

      if (response.code === 200) {
        return true;
      } else {
        ElMessage.error(response.msg || "删除部门失败");
        return false;
      }
    } catch (error) {
      console.error("删除部门失败:", error);
      ElMessage.error("删除部门失败");
      return false;
    }
  }

  // ==================== 验证方法 ====================

  /**
   * 验证部门名称唯一性
   */
  async function validateDeptName(deptName: string, deptId?: number, parentId?: number): Promise<boolean> {
    try {
      const response = await deptApi.checkDeptNameUnique({
        deptName,
        deptId,
        parentId,
      });

      return response.code === 200 && response.data === true;
    } catch (error) {
      console.error("验证部门名称失败:", error);
      return false;
    }
  }

  // ==================== 工具方法 ====================

  /**
   * 根据部门ID获取部门信息
   */
  function getDeptById(deptId: number): SystemDept | undefined {
    return deptMap.value.get(deptId);
  }

  /**
   * 获取部门完整路径
   */
  function getDeptPath(deptId: number): string {
    const dept = getDeptById(deptId);
    if (!dept) return "";

    const path: string[] = [];
    let current: SystemDept | undefined = dept;

    while (current) {
      path.unshift(current.deptName);
      current = current.parentId ? getDeptById(current.parentId) : undefined;
    }

    return path.join(" / ");
  }

  /**
   * 获取部门子级ID列表
   */
  function getDeptChildrenIds(deptId: number): number[] {
    const children: number[] = [];

    const collectChildren = (dept: SystemDept) => {
      if (dept.children) {
        dept.children.forEach((child) => {
          if (child.deptId) {
            children.push(child.deptId);
            collectChildren(child);
          }
        });
      }
    };

    const dept = getDeptById(deptId);
    if (dept) {
      collectChildren(dept);
    }

    return children;
  }

  /**
   * 重置状态
   */
  function resetState(): void {
    deptList.value = [];
    deptTree.value = [];
    loading.value = false;
  }

  return {
    // 状态
    deptList,
    deptTree,
    loading,

    // 计算属性
    deptTreeOptions,
    deptMap,

    // 方法
    getDeptList,
    getDeptDetail,
    addDept,
    updateDept,
    deleteDept,
    validateDeptName,
    getDeptById,
    getDeptPath,
    getDeptChildrenIds,
    resetState,
  };
});
