# Lanan-managerment

这个模板可以帮助你开始使用Vue 3和Vite进行开发。

## 仓库地址

git clone -b dev https://github.com/290068483/my-project.git

## 确保 Vite 已正确安装

# 检查项目本地是否安装

npm list vite

# 如果未安装，执行安装命令

npm install vite --save-dev

## 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（并禁用Vetur）。

## TypeScript对.vue导入的类型支持

TypeScript默认无法处理.vue导入的类型信息，因此我们用`vue-tsc`替换`tsc`CLI进行类型检查。在编辑器中，我们需要[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)来让TypeScript语言服务识别.vue类型。

## 账号

- 账号 ：admin
  密码：admin123

## 自定义配置

查看[Vite配置参考](https://vite.dev/config/)。

## 项目结构

├── App.vue # 根组件
├── assets/ # 静态资源
│ ├── base.css # 基础样式
│ ├── logo.svg # 标志
│ └── main.css # 主样式
├── components/ # 可复用组件
│ ├── ElementLodashTest.vue # Element UI 和 Lodash 测试组件
│ └── icons/ # 图标组件
├── config/ # 配置文件
│ └── index.js # 主配置
├── main.ts # 入口点
├── router/ # 路由
│ └── index.ts # 路由配置
├── stores/ # 状态管理
│ ├── counter.ts # 计数器存储
│ └── user.ts # 用户存储
├── types/ # 类型定义
│ └── env.d.ts # 环境类型
├── utils/ # 工具函数
│ ├── Http.ts # HTTP客户端
│ ├── debounce.ts # 防抖函数
│ ├── env.ts # 环境工具
│ └── lodash.ts # Lodash工具
└── views/ # 视图/页面
├── AboutView.vue # 关于页面
├── Custom-manager/ # 自定义管理页面
├── HomeView.vue # 首页
├── LoginView.vue # 登录页面
├── NotFoundView.vue # 404页面
└── user-info/ # 用户信息页面

## 项目设置

```sh
pnpm install
```

### 开发环境编译和热重载

```sh
npm run dev
```

### 类型检查、编译和生产环境压缩

```sh
npm run build
```

### 使用[ESLint](https://eslint.org/)进行代码检查

```sh
npm run lint
```
