/**
 * 菜单配置文件
 * 根据若依系统架构设计，定义顶部导航菜单结构
 */

// 顶部导航菜单配置
export const TOP_MENU_CONFIG = [
  {
    path: "/home",
    name: "Home",
    component: "Layout",
    meta: {
      title: "首页",
      icon: "home",
      noCache: true,
    },
  },
  {
    path: "/customer",
    name: "Customer",
    component: "Layout",
    meta: {
      title: "客户管理",
      icon: "user",
    },
    children: [
      {
        path: "list",
        name: "CustomerList",
        component: "views/customer/list.vue",
        meta: {
          title: "客户列表",
          icon: "list",
        },
      },
      {
        path: "detail",
        name: "CustomerDetail",
        component: "views/customer/detail.vue",
        meta: {
          title: "客户详情",
          icon: "detail",
        },
      },
    ],
  },
  {
    path: "/order",
    name: "Order",
    component: "Layout",
    meta: {
      title: "订单管理",
      icon: "order",
    },
    children: [
      {
        path: "list",
        name: "OrderList",
        component: "views/order/list.vue",
        meta: {
          title: "订单列表",
          icon: "list",
        },
      },
      {
        path: "create",
        name: "OrderCreate",
        component: "views/order/create.vue",
        meta: {
          title: "创建订单",
          icon: "plus",
        },
      },
    ],
  },
  {
    path: "/product",
    name: "Product",
    component: "Layout",
    meta: {
      title: "产品管理",
      icon: "product",
    },
    children: [
      {
        path: "list",
        name: "ProductList",
        component: "views/product/list.vue",
        meta: {
          title: "产品列表",
          icon: "list",
        },
      },
      {
        path: "category",
        name: "ProductCategory",
        component: "views/product/category.vue",
        meta: {
          title: "产品分类",
          icon: "category",
        },
      },
    ],
  },
  {
    path: "/system",
    name: "System",
    component: "Layout",
    meta: {
      title: "系统管理",
      icon: "system",
    },
    children: [
      {
        path: "user",
        name: "SystemUser",
        component: "views/system/user/index.vue",
        meta: {
          title: "用户管理",
          icon: "user",
          permissions: ["system:user:list"],
        },
      },
      {
        path: "role",
        name: "SystemRole",
        component: "views/system/role/index.vue",
        meta: {
          title: "角色管理",
          icon: "role",
          permissions: ["system:role:list"],
        },
      },
      {
        path: "menu",
        name: "SystemMenu",
        component: "views/system/menu/index.vue",
        meta: {
          title: "菜单管理",
          icon: "menu",
          permissions: ["system:menu:list"],
        },
      },
    ],
  },
];

// 侧边栏菜单配置（当顶部导航激活某个主菜单时显示）
export const SIDEBAR_MENU_CONFIG = {
  "/customer": [
    {
      path: "/customer/list",
      name: "CustomerList",
      meta: {
        title: "客户列表",
        icon: "list",
      },
    },
    {
      path: "/customer/detail",
      name: "CustomerDetail",
      meta: {
        title: "客户详情",
        icon: "detail",
      },
    },
  ],
  "/order": [
    {
      path: "/order/list",
      name: "OrderList",
      meta: {
        title: "订单列表",
        icon: "list",
      },
    },
    {
      path: "/order/create",
      name: "OrderCreate",
      meta: {
        title: "创建订单",
        icon: "plus",
      },
    },
  ],
  "/product": [
    {
      path: "/product/list",
      name: "ProductList",
      meta: {
        title: "产品列表",
        icon: "list",
      },
    },
    {
      path: "/product/category",
      name: "ProductCategory",
      meta: {
        title: "产品分类",
        icon: "category",
      },
    },
  ],
  "/system": [
    {
      path: "/system/user",
      name: "SystemUser",
      meta: {
        title: "用户管理",
        icon: "user",
        permissions: ["system:user:list"],
      },
    },
    {
      path: "/system/role",
      name: "SystemRole",
      meta: {
        title: "角色管理",
        icon: "role",
        permissions: ["system:role:list"],
      },
    },
    {
      path: "/system/menu",
      name: "SystemMenu",
      meta: {
        title: "菜单管理",
        icon: "menu",
        permissions: ["system:menu:list"],
      },
    },
  ],
};

export default {
  TOP_MENU_CONFIG,
  SIDEBAR_MENU_CONFIG,
};
