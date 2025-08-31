import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw, RouteLocationNormalized } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useUserStore } from "@/stores/user";
import { usePermissionStore } from "@/stores/permission"; // 添加权限Store导入
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置NProgress
NProgress.configure({ showSpinner: false });

// 白名单路由（不需要登录即可访问）
const whiteList = ["/login", "/register", "/forgot-password", "/reset-password"];

// 固定路由（无需权限）
export const constantRoutes: Array<RouteRecordRaw> = [
  // 登录
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/user/auth/LoginView.vue"),
    meta: {
      requiresAuth: false,
      title: "登录",
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
      // 首页
      {
        path: "home",
        name: "Home",
        component: HomeView, // 直接使用已导入的组件
        meta: {
          requiresAuth: false,
          title: "首页",
        },
      },
    ],
  },
  // 404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
    meta: {
      requiresAuth: false,
      title: "页面未找到",
    },
  },
];

// 动态路由（需要权限）
export const asyncRoutes: Array<RouteRecordRaw> = [
  // 系统管理模块
  {
    path: "/system",
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
    ],
  },
];

const routes: Array<RouteRecordRaw> = [...constantRoutes, ...asyncRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ==================== 路由守卫（RuoYi标准） ====================

/**
 * 全局前置守卫
 * 基于RuoYi-Vue标准实现
 */
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 蓝岸管理系统`;
  }

  const userStore = useUserStore();
  const permissionStore = usePermissionStore(); // 获取权限Store实例
  const hasToken = userStore.token;

  if (hasToken) {
    // 已登录用户处理
    if (to.path === "/login") {
      // 已登录用户访问登录页，重定向到首页
      next({ path: "/home" });
      NProgress.done();
    } else {
      // 检查用户信息是否存在
      const hasRoles = userStore.roles && userStore.roles.length > 0;

      if (hasRoles) {
        // 用户信息已存在，直接放行
        next();
      } else {
        try {
          // 获取用户信息
          const userInfo = await userStore.getInfo();
          console.log("获取用户信息成功:", userInfo);

          // 生成动态路由
          const accessRoutes = await permissionStore.generateRoutes();
          console.log("生成动态路由成功:", accessRoutes);

          // 确保首页路由始终存在
          const hasHomeRoute = accessRoutes.some(
            (route: any) =>
              route.path === "/home" || (route.children && route.children.some((child: any) => child.path === "home")),
          );

          // 如果动态路由中没有首页，确保常量路由中的首页可用
          if (!hasHomeRoute) {
            console.log("动态路由中未找到首页，使用常量路由中的首页");
          }

          // 动态添加可访问路由表
          accessRoutes.forEach((route: any) => {
            // 添加路由前检查路径格式
            if (route.path && !route.path.startsWith("/") && !route.path.startsWith("http")) {
              console.warn("修复不规范的路由路径:", route.path);
              route.path = "/" + route.path;
            }
            try {
              router.addRoute(route);
            } catch (error) {
              console.error("添加路由失败:", error, "路由信息:", route);
            }
          });

          // hack方法 确保addRoutes已完成
          next({ ...to, replace: true });
        } catch (error: any) {
          console.error("路由守卫中获取用户信息或生成路由失败:", error);
          // 检查错误信息，如果是"操作成功"或类似的成功消息则认为是成功的
          if (error.message && (error.message.includes("操作成功") || error.message.includes("成功"))) {
            console.log("忽略成功消息的错误:", error.message);
            // 继续执行路由跳转
            next();
          } else if (error.message && error.message.includes("无效的会话")) {
            // Token已过期或无效，清理状态并重定向到登录页
            await userStore.logout();
            ElMessage.error("登录状态已过期，请重新登录");
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          } else {
            // 其他错误情况，确保用户可以访问首页
            console.log("其他错误情况:", error.message);
            next();
          }
        }
      }
    }
  } else {
    // 未登录用户处理
    console.log("未检测到token，检查路由:", to.path); // 添加调试日志
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单中，直接放行
      next();
    } else {
      // 不在白名单中，重定向到登录页
      next(`/login?redirect=${to.path}`);
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

export default router;
