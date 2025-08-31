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
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res: RoutersResponse) => {
          if (res.code === 200 && res.data) {
            const sdata = JSON.parse(JSON.stringify(res.data));
            const rdata = JSON.parse(JSON.stringify(res.data));
            const defaultData = JSON.parse(JSON.stringify(res.data));
            const sidebarRoutes = filterAsyncRouter(sdata);
            const rewriteRoutes = filterAsyncRouter(rdata, false, true);
            const defaultRoutes = filterAsyncRouter(defaultData);
            this.setRoutes(rewriteRoutes);
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
            this.setDefaultRoutes(sidebarRoutes);
            this.setTopbarRoutes(defaultRoutes);
            resolve(rewriteRoutes);
          } else {
            resolve([]);
          }
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: RouterInfo[], lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
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
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
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
      el.path = lastRouter.path + "/" + el.path;
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

export default usePermissionStore;
