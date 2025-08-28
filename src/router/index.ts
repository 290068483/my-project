import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw, RouteLocationNormalized } from "vue-router";

// 简化用户信息类型接口
interface UserStoreType {
  token: string | null;
  userInfo: any;
  permissions: string[];
  roles: string[];
}
import HomeView from "@/views/HomeView.vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { AuthUtils } from "@/utils/auth";
import Layout from "@/components/Layout.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置NProgress
NProgress.configure({ showSpinner: false });

// 白名单路由（不需要登录即可访问）
const whiteList = ["/login", "/register", "/forgot-password", "/reset-password"];
// 路由定义
const routes: Array<RouteRecordRaw> = [
  // 登录
  {
    path: "/login",
    name: "LoginOld",
    component: () => import("@/views/user/auth/LoginView.vue"),
    meta: {
      requiresAuth: false,
      title: "登录(旧版)",
      hidden: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/user/auth/Register.vue"),
    meta: {
      requiresAuth: false,
      title: "注册",
      hidden: true,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/user/auth/ForgotPassword.vue"),
    meta: {
      requiresAuth: false,
      title: "忘记密码",
      hidden: true,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/user/auth/ResetPassword.vue"),
    meta: {
      requiresAuth: false,
      title: "重置密码",
      hidden: true,
    },
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    meta: {
      requiresAuth: false,
    },
    redirect: "/home",
    children: [
      {
        path: "custom-index",
        name: "CustomIndex",
        component: () => import("../views/task-progress/CustomIndex.vue"),
        meta: {
          requiresAuth: false,
        },
      },

      // 首页
      {
        path: "home",
        name: "Home",
        component: () => import("../views/HomeView.vue"),
        meta: {
          requiresAuth: false,
        },
      },

      // 用户中心
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/user/profile/UserProfile.vue"),
        meta: {
          requiresAuth: true,
          title: "个人信息",
        },
      },
      {
        path: "security-settings",
        name: "SecuritySettings",
        component: () => import("../views/user/profile/SecuritySettings.vue"),
        meta: {
          requiresAuth: true,
          title: "安全设置",
        },
      },
      {
        path: "notification-settings",
        name: "NotificationSettings",
        component: () => import("../views/user/profile/NotificationSettings.vue"),
        meta: {
          requiresAuth: true,
          title: "通知设置",
        },
      },
      {
        path: "data-management",
        name: "DataManagement",
        component: () => import("../views/user/profile/DataManagement.vue"),
        meta: {
          requiresAuth: true,
          title: "数据管理",
        },
      },
      {
        path: "permission-management",
        name: "PermissionManagement",
        component: () => import("../views/user/profile/PermissionManagement.vue"),
        meta: {
          requiresAuth: true,
          title: "权限管理",
        },
      },
      // 任务进度

      // 客户归档
      {
        path: "custom-doc",
        name: "全部档案",
        component: () => import("../views/task-progress/CustomDoc.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 客户详情进度
      {
        path: "custom-progress",
        name: "custom-progress",
        component: () => import("../views/task-progress/CustomProgress.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 客户定单详情
      {
        path: "custom-order-dts",
        name: "custom-order-dts",
        component: () => import("../views/task-progress/CustomOrderDts.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 客户详情收支明细
      {
        path: "income-issues",
        name: "income-issues",
        component: () => import("../views/task-progress/income-Issues.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 客户详情-产品详情
      {
        path: "product-details",
        name: "product-details",
        component: () => import("../views/task-progress/product-details.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 合同详情
      {
        path: "contract-details",
        name: "contract-details",
        component: () => import("../views/task-progress/contract-details.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 客户详情出货问题
      {
        path: "shapping-issues-detail",
        name: "shapping-issues-detail",
        component: () => import("../views/task-progress/shapping-issues-detail.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 客户定单
      {
        path: "order-pending",
        name: "order-pending",
        component: () => import("../views/custom-progress/PenddingOrder.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待预约
      {
        path: "pending-reservation",
        name: "PendingReservation",
        component: () => import("../views/custom-progress/PendingReservation.vue"),
        meta: {
          requiresAuth: false,
        },
      },

      // 待测量
      {
        path: "pending-measurement",
        name: "PendingMeasurement",
        component: () => import("../views/custom-progress/PendingMeasurement.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待合同
      {
        path: "pending-contracts",
        name: "pending-contracts",
        component: () => import("../views/custom-progress/PendingContracts.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待下单
      {
        path: "pending-orders",
        name: "pending-orders",
        component: () => import("../views/custom-progress/PenddingOrder.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待安装
      {
        path: "pending-installation",
        name: "pending-installation",
        component: () => import("../views/custom-progress/PendingInstallation.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待收尾
      {
        path: "pending-finalization",
        name: "pending-finalization",
        component: () => import("../views/custom-progress/PendingFinalization.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待归档
      {
        path: "pending-archiving",
        name: "pending-archiving",
        component: () => import("../views/custom-progress/PendingArchiving.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 出货总览
      {
        path: "shipping-overview",
        name: "shipping-overview",
        component: () => import("../views/shipping-issues/ShippingOverview.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 出货进度
      {
        path: "issue-details",
        name: "issue-details",
        component: () => import("../views/shipping-issues/IssueDetails.vue"),
        meta: {
          requiresAuth: false,
        },
      }, // 出货明细
      {
        path: "shipping-details",
        name: "shipping-details",
        component: () => import("../views/shipping-issues/ShippingDetails.vue"),
        meta: {
          requiresAuth: false,
        },
      },

      // 系统管理模块
      {
        path: "system",
        name: "System",
        meta: {
          requiresAuth: true,
          title: "系统管理",
          icon: "system",
          sort: 900,
        },
        children: [
          // 用户管理
          {
            path: "user",
            name: "SystemUser",
            component: () => import("../views/system/user/index.vue"),
            meta: {
              requiresAuth: true,
              permissions: ["system:user:list"],
              title: "用户管理",
              icon: "user",
              sort: 1,
            },
          },
          // 角色管理
          {
            path: "role",
            name: "SystemRole",
            component: () => import("../views/system/role/index.vue"),
            meta: {
              requiresAuth: true,
              permissions: ["system:role:list"],
              title: "角色管理",
              icon: "peoples",
              sort: 2,
            },
          },
          // 菜单管理
          {
            path: "menu",
            name: "SystemMenu",
            component: () => import("../views/system/menu/index.vue"),
            meta: {
              requiresAuth: true,
              permissions: ["system:menu:list"],
              title: "菜单管理",
              icon: "tree-table",
              sort: 3,
            },
          },
          // 部门管理
          {
            path: "dept",
            name: "SystemDept",
            component: () => import("../views/system/dept/index.vue"),
            meta: {
              requiresAuth: true,
              permissions: ["system:dept:list"],
              title: "部门管理",
              icon: "tree",
              sort: 4,
            },
          },
          // 岗位管理
          {
            path: "post",
            name: "SystemPost",
            component: () => import("../views/system/post/index.vue"),
            meta: {
              requiresAuth: true,
              permissions: ["system:post:list"],
              title: "岗位管理",
              icon: "post",
              sort: 5,
            },
          },
        ],
      },

      // 用户信息页面
      {
        path: "user-info",
        name: "UserInfo",
        component: () => import("../views/user/profile/UserProfile.vue"),
        meta: {
          requiresAuth: false,
        },
      },

      // 消息演示页面
      {
        path: "message-demo",
        name: "MessageDemo",
        component: () => import("../views/components/MessageDemo.vue"),
        meta: {
          requiresAuth: false,
          title: "消息演示",
        },
      },

      // 优化后的消息演示页面
      {
        path: "optimized-message-demo",
        name: "OptimizedMessageDemo",
        component: () => import("../views/components/OptimizedMessageDemo.vue"),
        meta: {
          requiresAuth: false,
          title: "优化消息演示",
        },
      },
    ],
  },
  //注册
  {
    path: "/register",
    name: "register",
    component: () => import("../views/user/auth/Register.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  // 登录
  {
    path: "/login",
    name: "login-inner",
    component: () => import("../views/user/auth/LoginView.vue"),
    meta: {
      requiresAuth: false,
    },
  },

  // 忘记密码
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../views/user/auth/ForgotPassword.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/static/home",
    name: "staticHome",
    component: HomeView,
    meta: {
      requiresAuth: false,
    },
  },
  // 404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ==================== 路由守卫（RuoYi标准） ====================

/**
 * 全局前置守卫
 * 基于RuoYi-Vue标准实现
 */
router.beforeEach((to, from, next) => {
  // 完全禁用权限检查
  next();
}); /* 原权限检查逻辑已注释
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 蓝岸管理系统`;
  }

  const userStore = useUserStore();
  const hasToken = userStore.token;

  if (hasToken) {
    // 已登录用户处理
    if (to.path === "/login") {
      // 已登录用户访问登录页，重定向到首页
      // 临时关闭路由权限校验，直接放行
      next();
      // next({ path: "/home" });
      NProgress.done();
    } else {
      // 检查用户信息是否存在
      const hasUserInfo = userStore?.userInfo && userStore.userInfo.id;

      if (hasUserInfo) {
        // 用户信息已存在，检查权限
        if (to.meta?.requiresAuth !== false) {
          // 需要认证的路由，检查权限
          const hasPermission = checkRoutePermission(to, userStore);
          if (hasPermission) {
            next();
          } else {
            ElMessage.error("您没有访问此页面的权限");
            next({ path: "/403" });
            NProgress.done();
          }
        } else {
          next();
        }
      } else {
        try {
          // 获取用户信息
          await userStore.fetchUserInfo();

          // 获取成功后检查权限
          if (to.meta?.requiresAuth !== false) {
            const hasPermission = checkRoutePermission(to, userStore);
            if (hasPermission) {
              next();
            } else {
              ElMessage.error("您没有访问此页面的权限");
              next({ path: "/403" });
              NProgress.done();
            }
          } else {
            next();
          }
        } catch (error) {
          console.error("获取用户信息失败:", error);

          // Token已过期或无效，清理状态并重定向到登录页
          userStore.logout();
          ElMessage.error("登录状态已过期，请重新登录");
          next({ path: "/login", query: { redirect: to.fullPath } });
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录用户处理
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接放行
      next();
    } else {
      // 不在白名单中，重定向到登录页
      next({ path: "/login", query: { redirect: to.fullPath } });
      NProgress.done();
    }
  }
});

/**
 * 全局后置守卫
 */
router.afterEach(() => {
  // 结束进度条
  NProgress.done();
});

/**
 * 检查路由权限
 * @param to 目标路由
 * @param userStore 用户Store
 * @returns boolean
 */
function checkRoutePermission(to: RouteLocationNormalized, userStore: UserStoreType): boolean {
  const { meta } = to;

  // 如果路由没有设置权限要求，则允许访问
  if (!meta?.permissions && !meta?.roles) {
    return true;
  }

  // 检查权限
  if (meta.permissions) {
    const permissions = Array.isArray(meta.permissions) ? meta.permissions : [meta.permissions];
    const hasPermission = permissions.some((permission: string) => userStore.permissions.includes(permission));
    if (!hasPermission) {
      return false;
    }
  }

  // 检查角色
  if (meta.roles) {
    const roles = Array.isArray(meta.roles) ? meta.roles : [meta.roles];
    const hasRole = roles.some((role: string) => userStore.roles.includes(role));
    if (!hasRole) {
      return false;
    }
  }

  return true;
}

/**
 * 重置路由
 * 用于刷新页面时重新加载路由
 */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 };
      }
    },
  });

  // 替换路由实例
  (router as typeof router).matcher = (newRouter as typeof newRouter).matcher;
}

export default router;
