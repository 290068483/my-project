# 模拟接口说明

本目录包含项目中使用的模拟接口数据和处理逻辑，用于在开发环境中模拟后端API响应。

## 目录结构

- `login.json`: 登录成功的模拟响应数据
- `auth.js`: 模拟用户数据和登录处理逻辑
- `README.md`: 模拟接口使用说明

## 模拟接口列表

### 用户登录

- **接口路径**: `/mock/login`
- **请求方法**: POST
- **请求参数**:
  ```json
  {
    "username": "string", // 用户名
    "password": "string" // 密码
  }
  ```
- **响应示例**:
  - 成功响应 (200):
    ```json
    {
      "success": true,
      "code": 200,
      "message": "登录成功",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "userInfo": {
          "id": 1,
          "username": "admin",
          "nickname": "管理员",
          "avatar": "/assets/logo.svg",
          "role": "admin",
          "permissions": ["dashboard", "users", "settings"]
        },
        "expiresIn": 3600
      }
    }
    ```
  - 失败响应 (401):
    ```json
    {
      "success": false,
      "code": 401,
      "message": "用户名或密码错误"
    }
    ```

## 预设用户

- 管理员: `username: admin`, `password: 13098770214`
- 普通用户: `username: user`, `password: user123`

## 使用方法

1. 确保开发服务器已启动
2. 在前端代码中，将API请求地址指向`/mock/login`
3. 使用预设的用户名和密码进行登录测试

## 注意事项

- 本模拟接口仅用于开发环境测试，生产环境请使用真实后端API
- 若需要添加更多模拟接口，请按照相同的格式创建相应的JSON数据和处理逻辑文件
- 如需修改用户数据或权限，请编辑`auth.js`文件中的`users`数组
