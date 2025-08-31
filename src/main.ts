import "./assets/css/index.css";
import "element-plus/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import PopconfirmDirective from "./utils/popconfirm";
import { setupDirectives } from "./directive";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// 配置Element Plus
app.use(ElementPlus);

// 配置全局指令
app.directive("popconfirm", PopconfirmDirective);

// 配置权限指令
setupDirectives(app);

// 配置Pinia
const pinia = createPinia();
app.use(pinia);

// 配置路由
app.use(router);

// 移除 axios 的全局配置和拦截器
// 项目中应使用封装的 request 模块处理 HTTP 请求
// 相关的请求拦截（如添加 token）和响应拦截（如处理 401 错误）已在 request 封装中实现

app.mount("#app");
