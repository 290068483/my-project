# 🧪 API接口测试指南

## 📋 概览

本文档提供了登录和注册API接口的完整测试方案，包括手动测试和自动化测试。

## 🚀 快速开始

### 1. 启动项目

确保开发服务器正在运行：

```bash
npm run dev
```

### 2. 打开浏览器

访问：http://localhost:5175

### 3. 打开开发者工具

按 `F12` 打开控制台

## 🔧 测试工具

项目已集成API测试工具，在开发环境中自动加载。控制台中可使用以下命令：

### 🏃‍♂️ 快速测试命令

```javascript
// 快速测试登录 (推荐)
quickLogin("admin", "admin123");

// 快速测试注册
quickRegister("newuser123");

// 测试登录接口的所有用例
testLogin();

// 测试注册接口的所有用例
testRegister();

// 运行所有API测试
testAll();
```

## 📊 API接口详情

### 🔐 登录相关接口

#### 1. 基础登录接口

- **接口**: `POST /login`
- **参数**: `{ username, password, code, uuid }`
- **测试账号**: `admin` / `admin123`

#### 2. 手机号登录接口

- **接口**: `POST /login/phone`
- **参数**: `{ phone, code }`

#### 3. 邮箱登录接口

- **接口**: `POST /login/email`
- **参数**: `{ email, password, code?, uuid? }`

### 📝 注册相关接口

#### 1. 基础注册接口

- **接口**: `POST /register`
- **参数**: `{ username, password, nickname?, email?, phone?, code?, uuid? }`

#### 2. 手机号注册接口

- **接口**: `POST /register/phone`
- **参数**: `{ phone, password, code, nickname? }`

#### 3. 邮箱注册接口

- **接口**: `POST /register/email`
- **参数**: `{ email, password, code, nickname? }`

### ✅ 验证相关接口

#### 1. 用户名可用性检查

- **接口**: `POST /check-username`
- **参数**: `{ username }`

#### 2. 手机号可用性检查

- **接口**: `POST /check-phone`
- **参数**: `{ phone }`

#### 3. 邮箱可用性检查

- **接口**: `POST /check-email`
- **参数**: `{ email }`

### 📨 验证码相关接口

#### 1. 发送注册手机验证码

- **接口**: `POST /send-register-code`
- **参数**: `{ phone }`

#### 2. 发送注册邮箱验证码

- **接口**: `POST /send-register-email-code`
- **参数**: `{ email }`

## 🧪 测试用例

### 登录测试用例

| 用例名称   | 用户名      | 密码      | 预期结果 |
| ---------- | ----------- | --------- | -------- |
| 正常登录   | admin       | admin123  | 成功     |
| 错误密码   | admin       | wrongpass | 失败     |
| 不存在用户 | nonexistent | password  | 失败     |

### 注册测试用例

| 用例名称     | 用户名      | 密码        | 预期结果 |
| ------------ | ----------- | ----------- | -------- |
| 正常注册     | testuser123 | password123 | 成功     |
| 用户名已存在 | admin       | password123 | 失败     |

### 用户名检查测试用例

| 用例名称     | 用户名     | 预期结果 |
| ------------ | ---------- | -------- |
| 已存在用户名 | admin      | 不可用   |
| 新用户名     | newuser123 | 可用     |
| 格式错误     | ab         | 格式错误 |

## 📊 响应格式

### 成功响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    // 具体数据
  }
}
```

### 失败响应

```json
{
  "code": 400,
  "msg": "错误信息",
  "data": null
}
```

## 🔍 测试步骤

### 手动测试登录接口

1. **打开控制台**
2. **执行快速登录测试**:
   ```javascript
   quickLogin("admin", "admin123");
   ```
3. **观察控制台输出**，检查：
   - 请求参数是否正确
   - 响应状态是否为200
   - 返回的token是否存在
   - 用户信息是否完整

### 手动测试注册接口

1. **执行快速注册测试**:
   ```javascript
   quickRegister("testuser" + Date.now());
   ```
2. **观察控制台输出**，检查：
   - 请求参数是否正确
   - 响应状态
   - 注册结果

### 批量测试

1. **运行所有测试**:
   ```javascript
   testAll();
   ```
2. **查看完整测试报告**

## ⚠️ 注意事项

### 测试环境要求

- ✅ 开发服务器已启动 (npm run dev)
- ✅ 后端API服务已启动
- ✅ 网络连接正常
- ✅ 代理配置正确

### 测试数据

- 🔐 **登录测试账号**: admin / admin123
- 📧 **测试邮箱**: test@example.com
- 📱 **测试手机号**: 13800138000

### 常见问题

#### 1. 网络错误

**现象**: 接口调用失败，提示网络错误
**解决**: 检查后端服务是否启动，代理配置是否正确

#### 2. 401 未授权

**现象**: 返回401状态码
**解决**: 检查token是否有效，是否需要重新登录

#### 3. 参数错误

**现象**: 返回400状态码，参数错误
**解决**: 检查请求参数格式是否正确

## 📈 测试报告

每次测试完成后，控制台会显示详细的测试报告，包括：

- ✅ 成功的接口调用
- ❌ 失败的接口调用
- 📊 响应时间统计
- 🔍 错误详情分析

## 🛠️ 高级用法

### 自定义测试参数

```javascript
// 自定义登录测试
apiTester.quickTestLogin("customuser", "custompass");

// 自定义注册测试
apiTester.quickTestRegister("myuser123");
```

### 单独测试特定接口

```javascript
// 只测试用户名检查
apiTester.testUsernameCheck();

// 只测试验证码发送
apiTester.testSendCode();
```

---

**📞 技术支持**: 如果在测试过程中遇到问题，请查看控制台错误信息或联系开发团队。
