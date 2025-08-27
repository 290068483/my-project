import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { AuthUtils } from "@/utils/auth";
import Layout from "@/components/Layout.vue";
// 路由定义
const routes: Array<RouteRecordRaw> = [
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
        component: () => import("../views/user/Userinfo.vue"),
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
    component: () => import("../views/user/register.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  // 登录
  {
    path: "/login",
    name: "login-inner",
    component: () => import("../views/user/LoginView.vue"),
    meta: {
      requiresAuth: false,
    },
  },

  // 忘记密码
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../views/user/ForgotPassword.vue"),
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

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ name: "login-inner", query: { redirect: to.fullPath } });
  }

  // 检查权限
  if (to.meta.requiresAuth && to.meta.permissions && Array.isArray(to.meta.permissions)) {
    const hasPermission = to.meta.permissions.some((permission: string) => {
      return AuthUtils.hasPermission(permission);
    });

    if (!hasPermission) {
      ElMessage.error("没有权限访问此页面");
      return next({ name: "home" });
    }
  }

  // 管理员角色检查
  if (to.meta.requiresAuth && AuthUtils.getUserRole() === "admin") {
    // 管理员可以访问所有页面
    return next();
  }

  next();
});

export default router;
