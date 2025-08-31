import { defineStore } from "pinia";
import router, { constantRoutes } from "@/router";
import { getRouters } from "@/api/login";
import Layout from "@/components/Layout.vue";
import type { RouterInfo, RoutersResponse } from "@/types/auth";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../views/**/*.vue");

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [] as any[],
    addRoutes: [] as any[],
    defaultRoutes: [] as any[],
    topbarRouters: [] as any[],
    sidebarRouters: [] as any[],
  }),

  actions: {
    setRoutes(routes: any[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes: any[]) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes: any[]) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes: any[]) {
      this.sidebarRouters = routes;
    },
    generateRoutes() {
      return new Promise((resolve, reject) => {
        // 向后端请求路由数据
        getRouters()
          .then((res: any) => {
            // 修改类型为any
            // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
            const responseData = res.data || res; // 兼容两种格式

            console.log("获取路由数据响应:", responseData); // 添加调试日志

            if (responseData.code === 200) {
              // 检查是否有data字段
              const routerData = responseData.data || responseData;

              if (routerData && Array.isArray(routerData)) {
                // 在处理路由前，先检查和修复路径格式
                const fixedRouterData = fixRouterPaths(routerData);

                // 确保始终包含首页路由
                const hasHomeRoute = fixedRouterData.some(
                  (route) =>
                    route.path === "/home" ||
                    (route.children && route.children.some((child: any) => child.path === "home")),
                );

                if (!hasHomeRoute) {
                  console.log("后端未返回首页路由，添加默认首页路由");
                  // 添加默认首页路由
                  fixedRouterData.unshift({
                    path: "/home",
                    name: "Home",
                    component: "Layout",
                    meta: {
                      title: "首页",
                      icon: "home",
                      noCache: true,
                    },
                  });
                }

                const sdata = JSON.parse(JSON.stringify(fixedRouterData));
                const rdata = JSON.parse(JSON.stringify(fixedRouterData));
                const defaultData = JSON.parse(JSON.stringify(fixedRouterData));
                const sidebarRoutes = filterAsyncRouter(sdata);
                const rewriteRoutes = filterAsyncRouter(rdata, false, true);
                const defaultRoutes = filterAsyncRouter(defaultData);
                this.setRoutes(rewriteRoutes);
                this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
                this.setDefaultRoutes(sidebarRoutes);
                this.setTopbarRoutes(defaultRoutes);
                resolve(rewriteRoutes);
              } else {
                console.error("路由数据格式不正确:", routerData);
                // 即使没有路由数据，也要确保返回一个空数组而不是拒绝Promise
                resolve([]);
              }
            } else {
              // 处理获取路由失败的情况
              const errorMsg = responseData.msg || "获取路由数据失败";
              console.error(errorMsg, ":", responseData);
              // 即使获取路由失败，也要确保返回一个空数组而不是拒绝Promise
              resolve([]);
            }
          })
          .catch((error) => {
            // 处理网络错误或其他异常
            console.error("获取路由数据异常:", error);
            // 即使出现异常，也要确保返回一个空数组而不是拒绝Promise
            resolve([]);
          });
      });
    },
    // 根据父路径设置侧边栏路由
    setSidebarRoutersByParentPath(parentPath: string) {
      // 这里可以根据需要实现动态设置侧边栏路由的逻辑
      console.log("设置侧边栏路由，父路径:", parentPath);
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: RouterInfo[], lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    // 检查路由路径格式，确保以"/"开头，除非是http链接
    if (route.path && !route.path.startsWith("/") && !route.path.startsWith("http")) {
      console.warn("发现不规范的路由路径:", route.path, "已自动修复为 /" + route.path);
      route.path = "/" + route.path;
    }

    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, lastRouter, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap: RouterInfo[], lastRouter = false) {
  var children: RouterInfo[] = [];
  childrenMap.forEach((el) => {
    // 检查路由路径格式，确保以"/"开头，除非是http链接
    if (el.path && !el.path.startsWith("/") && !el.path.startsWith("http")) {
      console.warn("发现不规范的子路由路径:", el.path, "已自动修复为 /" + el.path);
      el.path = "/" + el.path;
    }

    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          // 确保子路由路径格式正确
          if (c.path && !c.path.startsWith("/") && !c.path.startsWith("http")) {
            c.path = el.path + "/" + c.path;
          } else if (c.path && c.path.startsWith("/")) {
            // 如果子路径已经是绝对路径，保持不变
            c.path = c.path;
          } else if (c.path && c.path.startsWith("http")) {
            // 如果是http链接，保持不变
            c.path = c.path;
          }

          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      // 确保子路由路径格式正确
      if (el.path && !el.path.startsWith("/") && !el.path.startsWith("http")) {
        el.path = lastRouter.path + "/" + el.path;
      } else if (el.path && el.path.startsWith("/")) {
        // 如果子路径已经是绝对路径，保持不变
        el.path = el.path;
      } else if (el.path && el.path.startsWith("http")) {
        // 如果是http链接，保持不变
        el.path = el.path;
      }

      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el));
        return;
      }
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view: string) => {
  let res: any;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

// 添加路由路径修复函数
function fixRouterPaths(routes: RouterInfo[]): RouterInfo[] {
  return routes.map((route) => {
    // 创建路由副本以避免修改原始数据
    const fixedRoute = { ...route };

    // 修复路径格式
    if (fixedRoute.path && !fixedRoute.path.startsWith("/") && !fixedRoute.path.startsWith("http")) {
      console.warn("修复路由路径:", fixedRoute.path, "->", "/" + fixedRoute.path);
      fixedRoute.path = "/" + fixedRoute.path;
    }

    // 修复子路由路径格式
    if (fixedRoute.children && Array.isArray(fixedRoute.children)) {
      fixedRoute.children = fixRouterPaths(fixedRoute.children);
    }

    return fixedRoute;
  });
}

export default usePermissionStore;
