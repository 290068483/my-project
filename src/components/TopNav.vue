<template>
  <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" :ellipsis="false" class="top-nav-menu">
    <template v-for="(item, index) in topMenus" :key="index">
      <!-- 如果有子菜单，显示为下拉菜单 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 0 && index < visibleNumber"
        :index="item.path"
        :key="`sub-${index}`">
        <template #title>
          <svg-icon
            v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
            :key="item.meta.icon"
            :icon-class="item.meta.icon" />
          {{ item.meta.title }}
        </template>
        <!-- 子菜单项 -->
        <el-menu-item
          v-for="(child, childIndex) in item.children"
          :key="`child-${index}-${childIndex}`"
          :index="child.path"
          v-show="!child.hidden">
          <svg-icon v-if="child.meta && child.meta.icon && child.meta.icon !== '#'" :icon-class="child.meta.icon" />
          {{ child.meta.title }}
        </el-menu-item>
      </el-sub-menu>

      <!-- 如果没有子菜单，显示为普通菜单项 -->
      <el-menu-item
        v-else-if="index < visibleNumber"
        :style="{ '--theme': theme }"
        :index="item.path"
        :key="`item-${index}`">
        <svg-icon v-if="item.meta && item.meta.icon && item.meta.icon !== '#'" :icon-class="item.meta.icon" />
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu :style="{ '--theme': theme }" index="more" v-if="topMenus.length > visibleNumber" key="more-sub-menu">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus" :key="`more-${index}`">
        <!-- 如果有子菜单，显示为下拉菜单 -->
        <el-sub-menu
          v-if="item.children && item.children.length > 0 && index >= visibleNumber"
          :index="item.path"
          :key="`more-sub-${index}`">
          <template #title>
            <svg-icon v-if="item.meta && item.meta.icon && item.meta.icon !== '#'" :icon-class="item.meta.icon" />
            {{ item.meta.title }}
          </template>
          <!-- 子菜单项 -->
          <el-menu-item
            v-for="(child, childIndex) in item.children"
            :key="`more-child-${index}-${childIndex}`"
            :index="child.path"
            v-show="!child.hidden">
            <svg-icon v-if="child.meta && child.meta.icon && child.meta.icon !== '#'" :icon-class="child.meta.icon" />
            {{ child.meta.title }}
          </el-menu-item>
        </el-sub-menu>

        <!-- 如果没有子菜单，显示为普通菜单项 -->
        <el-menu-item v-else-if="index >= visibleNumber" :index="item.path" :key="`more-item-${index}`">
          <svg-icon v-if="item.meta && item.meta.icon && item.meta.icon !== '#'" :icon-class="item.meta.icon" />
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { constantRoutes } from "@/router";
import { isHttp } from "@/utils/validate";
import { usePermissionStore } from "@/stores/permission";
import { useSettingsStore } from "@/stores/settings";
import type { RouterInfo } from "@/types/auth";

// 顶部栏初始数
const visibleNumber = ref(5);
// 当前激活菜单的 index
const currentIndex = ref("");
// 隐藏侧边栏路由
const hideList = ["/index", "/user/profile"];

const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);

// 顶部显示菜单
const topMenus = computed(() => {
  const topMenus: RouterInfo[] = [];
  // 确保 routers.value 是数组
  if (Array.isArray(routers.value)) {
    routers.value.map((menu: RouterInfo) => {
      // 确保菜单项存在且未隐藏
      if (menu && menu.hidden !== true) {
        // 兼容顶部栏一级菜单内部跳转
        if (menu.path === "/") {
          // 如果是根路径且有子菜单，使用第一个子菜单
          if (menu.children && menu.children.length > 0) {
            topMenus.push(menu.children[0]);
          }
        } else {
          // 否则直接添加菜单项
          topMenus.push(menu);
        }
      }
    });
  }
  return topMenus;
});

// 设置子路由
const childrenMenus = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenMenus: any[] = [];
  // 确保 routers.value 是数组
  if (Array.isArray(routers.value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routers.value.map((routerItem: any) => {
      // 确保有子菜单
      if (routerItem.children) {
        for (const item in routerItem.children) {
          const child = routerItem.children[item];
          // 确保子菜单项存在
          if (child) {
            // 如果还没有设置 parentPath
            if (child.parentPath === undefined) {
              if (routerItem.path === "/") {
                child.path = "/" + child.path;
              } else {
                if (!isHttp(child.path)) {
                  child.path = routerItem.path + "/" + child.path;
                }
              }
              child.parentPath = routerItem.path;
            }
            childrenMenus.push(child);
          }
        }
      }
    });
  }
  return constantRoutes.concat(childrenMenus);
});

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = path;

  // 如果路径存在且不是根路径
  if (path && path !== "/" && path.lastIndexOf("/") > 0) {
    // 检查是否在隐藏列表中
    if (hideList.indexOf(path) === -1) {
      // 提取第一级路径作为激活菜单
      const tmpPath = path.substring(1, path.length);
      const firstLevelPath = tmpPath.substring(0, tmpPath.indexOf("/"));
      if (firstLevelPath) {
        activePath = "/" + firstLevelPath;
      }
    }
  }

  // 激活对应的子菜单
  activeRoutes(activePath);
  return activePath;
});

function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt((width / 85).toString()) || 5;
}

function handleSelect(key: string) {
  currentIndex.value = key;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeItem = routers.value.find((item: any) => item.path === key);

  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, "_blank");
  } else if (!routeItem || !routeItem.children) {
    // 没有子路由路径内部打开
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routeMenu = childrenMenus.value.find((item: any) => item.path === key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (routeMenu && (routeMenu as any).query) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query = JSON.parse((routeMenu as any).query);
        router.push({ path: key, query: query });
      } catch (_error) {
        router.push({ path: key });
      }
    } else {
      router.push({ path: key });
    }
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
  }
}

function activeRoutes(key: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: any[] = [];
  // 确保 childrenMenus.value 是数组
  if (Array.isArray(childrenMenus.value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    childrenMenus.value.map((item: any) => {
      // 确保菜单项存在
      if (item) {
        if (key == item.parentPath || (key == "index" && "" == item.path)) {
          routes.push(item);
        }
      }
    });
  }

  // 如果有匹配的子路由，设置侧边栏路由
  if (routes.length > 0) {
    permissionStore.setSidebarRouters(routes);
  }
  return routes;
}

onMounted(() => {
  window.addEventListener("resize", setVisibleNumber);
  setVisibleNumber();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setVisibleNumber);
});
</script>

<style lang="scss" scoped>
.top-nav-menu {
  border: none;
  height: 50px;
  line-height: 50px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  margin: 5px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0 10px;

  :deep(.el-menu-item) {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: rgba(255, 255, 255, 0.85) !important;
    padding: 0 15px !important;
    margin: 0 5px !important;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      color: #ffffff !important;
      transform: translateY(-2px);
    }

    &.is-active {
      background: rgba(255, 255, 255, 0.3) !important;
      color: #ffffff !important;
      font-weight: 600;
    }

    &.is-active::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      background: #ffffff;
      border-radius: 3px;
    }
  }

  :deep(.el-sub-menu) {
    float: left;

    .el-sub-menu__title {
      height: 50px !important;
      line-height: 50px !important;
      color: rgba(255, 255, 255, 0.85) !important;
      padding: 0 15px !important;
      margin: 0 5px !important;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        color: #ffffff !important;
        transform: translateY(-2px);
      }
    }

    &.is-active {
      .el-sub-menu__title {
        background: rgba(255, 255, 255, 0.3) !important;
        color: #ffffff !important;
        font-weight: 600;
      }
    }

    &.is-active .el-sub-menu__title::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      background: #ffffff;
      border-radius: 3px;
    }
  }

  /* 图标右间距 */
  :deep(.svg-icon) {
    margin-right: 8px;
  }

  /* topmenu more arrow */
  :deep(.el-sub-menu .el-sub-menu__icon-arrow) {
    position: static;
    vertical-align: middle;
    margin-left: 8px;
    margin-top: 0px;
    color: rgba(255, 255, 255, 0.85);
  }

  /* 下拉菜单样式 */
  :deep(.el-dropdown-menu) {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    overflow: hidden;
    border: none;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-dropdown-menu__item) {
    color: #333333;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(26, 115, 232, 0.1);
      color: #1a73e8;
    }
  }
}
</style>
