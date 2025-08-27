# 代理配置修改说明

## 🔧 已完成的修改

### 1. **环境变量配置**

在 `.env.development` 文件中添加了新的API服务器地址：

```env
# API服务器地址
VITE_API_BASE_URL = 'http://localhost:8080'
```

### 2. **Vite代理配置**

修改了 `vite.config.ts` 中的代理配置，使其符合您提供的格式：

```typescript
// 开发服务器配置
server: {
  proxy: isDev
    ? {
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_API_BASE_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        },
        // Mock服务配置
        "/mock": {
          target: "http://localhost:" + (Number(env.VITE_PORT) || 5173),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mock/, "/public/mock"),
        },
      }
    : undefined,
}
```

## 📋 配置说明

### 代理规则

- **代理路径**: `VITE_APP_BASE_API` (开发环境为 `/dev-api`)
- **目标服务器**: `VITE_API_BASE_URL` (默认 `http://localhost:8080`)
- **跨域设置**: `changeOrigin: true`
- **路径重写**: 移除API前缀

### 工作原理

1. 前端请求 `http://localhost:5174/dev-api/user/login`
2. 代理服务器将请求转发到 `http://localhost:8080/user/login`
3. 移除 `/dev-api` 前缀，保留实际API路径

## 🧪 测试方法

### 1. **在浏览器控制台测试**

```javascript
// 测试API请求
fetch("/dev-api/test")
  .then((response) => response.text())
  .then((data) => console.log("代理测试结果:", data))
  .catch((error) => console.error("代理测试失败:", error));
```

### 2. **在Vue组件中使用**

```typescript
import { request } from "@/utils/request";

// 发送请求到代理API
const testProxy = async () => {
  try {
    const response = await request.get("/user/info");
    console.log("API响应:", response);
  } catch (error) {
    console.error("API请求失败:", error);
  }
};
```

## 🔄 Vite vs Vue CLI 差异

### Vue CLI 格式 (您提供的)

```javascript
proxy: {
  [process.env.VUE_APP_BASE_API]: {
    target: baseUrl,
    changeOrigin: true,
    pathRewrite: {
      ['^' + process.env.VUE_APP_BASE_API]: ''
    }
  }
}
```

### Vite 格式 (已实现)

```typescript
proxy: {
  [env.VITE_APP_BASE_API]: {
    target: env.VITE_API_BASE_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
  }
}
```

### 主要差异

1. **环境变量前缀**: `VUE_APP_` → `VITE_APP_`
2. **路径重写语法**: `pathRewrite` 对象 → `rewrite` 函数
3. **环境变量获取**: `process.env` → `loadEnv()` 函数

## 🎯 环境配置

### 开发环境 (`.env.development`)

```env
VITE_APP_BASE_API = '/dev-api'
VITE_API_BASE_URL = 'http://localhost:8080'
```

### 生产环境 (`.env.production`)

```env
VITE_APP_BASE_API = '/prod-api'
# 生产环境通常不需要代理，直接使用相对路径
```

## 🔧 注意事项

1. **开发环境专用**: 代理配置仅在开发环境生效
2. **服务器重启**: 修改配置后需要重启开发服务器
3. **路径匹配**: 确保API路径以配置的前缀开头
4. **CORS处理**: `changeOrigin: true` 解决跨域问题

## 🚀 验证状态

- ✅ 环境变量配置完成
- ✅ Vite代理配置完成
- ✅ 开发服务器自动重启
- ✅ 配置语法检查通过

代理配置已按照您的要求完成修改，现在可以正常代理API请求到后端服务器！
