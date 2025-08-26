import "./assets/css/index.css";
import "element-plus/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import axios from "axios";
import config from "./config/index";
import PopconfirmDirective from "./utils/popconfirm";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// 配置Element Plus
app.use(ElementPlus);

// 配置全局指令
app.directive("popconfirm", PopconfirmDirective);

// 配置Pinia
app.use(createPinia());

// 配置路由
app.use(router);

// 配置Axios
axios.defaults.baseURL = config.baseUrl;
axios.defaults.timeout = config.timeout;

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem(`${config?.storagePrefix}token`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理401错误
    if (error.response && error.response.status === 401) {
      // 清除本地存储
      localStorage.removeItem(`${config.storagePrefix}token`);
      localStorage.removeItem(`${config.storagePrefix}userInfo`);
      localStorage.removeItem(`${config.storagePrefix}expiresAt`);
      // 跳转到登录页
      router.push("/login");
    }
    return Promise.reject(error);
  },
);

// 全局注册axios
app.config.globalProperties.$axios = axios;

// 开发环境下启用API测试工具
if (import.meta.env.DEV) {
  import("./utils/apiTester")
    .then((module) => {
      console.log("🔧 [开发模式] API测试工具已加载");
      console.log("💡 [提示] 在控制台中使用以下命令测试API:");
      console.log("   testLogin() - 测试登录接口");
      console.log("   testRegister() - 测试注册接口");
      console.log("   testAll() - 运行所有API测试");
      console.log('   quickLogin("admin", "admin123") - 快速测试登录');
      console.log('   quickRegister("newuser") - 快速测试注册');
    })
    .catch((error) => {
      console.warn("⚠️ [开发模式] API测试工具加载失败:", error);
    });
}

app.mount("#app");
