import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
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
    redirect: "/Home",
    children: [
      {
        path: "custom-index",
        name: "CustomIndex",
        component: () => import("../views/CustomIndex.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "Home",
        name: "Home",
        component: () => import("../views/HomeView.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "custom-doc",
        name: "客户归档",
        component: () => import("../views/CustomDoc.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 添加新路由
      {
        path: "custom-progress",
        name: "客户进度",
        component: () => import("../views/CustomerProgress.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "custom-dts",
        name: "客户定单详情",
        component: () => import("../views/CustomOrderDts.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "order-pending",
        name: "客户定单",
        component: () => import("../views/custom-progress/PenddingOrder.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待预约
      {
        path: "pending-reservation",
        name: "PendingReservation",
        component: () =>
          import("../views/custom-progress/PendingReservation.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待预约
      {
        path: "pending-reservation",
        name: "PendingReservation",
        component: () =>
          import("../views/custom-progress/PendingReservation.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待测量
      {
        path: "pending-measurement",
        name: "PendingMeasurement",
        component: () =>
          import("../views/custom-progress/PendingMeasurement.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待合同
      {
        path: "pending-contracts",
        name: "PendingContracts",
        component: () =>
          import("../views/custom-progress/PendingContracts.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待下单
      {
        path: "pending-orders",
        name: "PendingOrders",
        component: () => import("../views/custom-progress/PenddingOrder.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 待安装
      {
        path: "pending-installation",
        name: "PendingInstallation",
        component: () =>
          import("../views/custom-progress/PendingInstallation.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 出货总览
      {
        path: "shipping-overview",
        name: "ShippingOverview",
        component: () =>
          import("../views/shipping-issues/ShippingOverview.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      // 出货进度
      {
        path: "issue-details",
        name: "出貨問題明顯",
        component: () => import("../views/shipping-issues/IssueDetails.vue"),
        meta: {
          requiresAuth: false,
        },
      }, // 出货明细
      {
        path: "shipping-details",
        name: "ShippingDetails",
        component: () => import("../views/shipping-issues/ShippingDetails.vue"),
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },

  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/static/login",
    name: "staticLogin",
    component: LoginView,
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

  // 检查登录是否过期
  if (userStore.isLoggedIn && Date.now() >= (userStore.expiresAt || 0)) {
    userStore.logout();
    ElMessage.warning("登录已过期，请重新登录");
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // 检查权限
  if (
    to.meta.requiresAuth &&
    to.meta.permissions &&
    Array.isArray(to.meta.permissions)
  ) {
    const hasPermission = to.meta.permissions.some((permission: string) => {
      return userStore.hasPermission(permission);
    });

    if (!hasPermission) {
      ElMessage.error("没有权限访问此页面");
      return next({ name: "home" });
    }
  }

  // 管理员角色检查
  if (to.meta.requiresAuth && userStore.userRole === "admin") {
    // 管理员可以访问所有页面
    return next();
  }

  next();
});

export default router;
