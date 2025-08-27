# Lanan管理系统 API接口文档

## 1. 项目概述

本项目基于RuoYi-Vue架构开发，使用Spring Boot 2.5.15 + MyBatis + MySQL技术栈，实现了完整的后台管理系统API接口。

### 技术栈

- **后端框架**: Spring Boot 2.5.15
- **ORM框架**: MyBatis 2.2.2
- **数据库**: MySQL 8.0
- **连接池**: Druid 1.2.23
- **API文档**: Swagger3 3.0.0
- **认证方式**: JWT Token
- **权限控制**: Spring Security + RBAC

### 项目结构

```
lanan-admin/
├── lanan-admin-api/    # API接口层
├── lanan-framework/    # 框架核心层
├── lanan-system/       # 系统业务层
└── lanan-common/       # 通用工具层
```

## 2. 数据库设计

### 核心表结构

- **sys_user**: 用户信息表
- **sys_role**: 角色信息表
- **sys_menu**: 菜单权限表
- **sys_dept**: 部门信息表
- **sys_user_role**: 用户角色关联表
- **sys_role_menu**: 角色菜单关联表
- **sys_role_dept**: 角色部门关联表
- **sys_dict_data**: 字典数据表

## 3. API接口总览

### 3.1 认证授权模块 (Authentication & Authorization)

#### 3.1.1 用户登录

- **接口**: `POST /login`
- **描述**: 用户登录认证
- **请求参数**:
  -content-type: application/json

```json
{
  "username": "string", // 用户名
  "password": "string", // 密码
  "code": "string", // 验证码
  "uuid": "string" // 验证码唯一标识
}
```

- **响应**: 返回JWT Token

#### 3.1.2 获取用户信息

- **接口**: `GET /getInfo`
- **描述**: 获取当前登录用户信息
- **权限**: 需要Token认证
- **响应**: 用户基本信息和权限信息

#### 3.1.3 获取路由信息

- **接口**: `GET /getRouters`
- **描述**: 获取用户可访问的路由菜单
- **权限**: 需要Token认证
- **响应**: 用户权限范围内的菜单树

#### 3.1.4 用户退出

- **接口**: `POST /logout`
- **描述**: 用户退出登录
- **权限**: 需要Token认证

#### 3.1.5 获取验证码

- **接口**: `GET /captchaImage`
- **描述**: 获取登录验证码
- **响应**: 验证码图片和UUID

### 3.2 用户管理模块 (User Management)

#### 基础路径: `/system/user`

| 方法   | 路径                 | 功能             | 权限                 |
| ------ | -------------------- | ---------------- | -------------------- |
| GET    | `/list`              | 分页查询用户列表 | system:user:list     |
| POST   | `/`                  | 新增用户         | system:user:add      |
| PUT    | `/`                  | 修改用户         | system:user:edit     |
| DELETE | `/{userIds}`         | 删除用户         | system:user:remove   |
| GET    | `/{userId}`          | 用户详情         | system:user:query    |
| PUT    | `/resetPwd`          | 重置密码         | system:user:resetPwd |
| PUT    | `/changeStatus`      | 修改用户状态     | system:user:edit     |
| GET    | `/profile`           | 个人信息         | 无                   |
| PUT    | `/profile`           | 修改个人信息     | 无                   |
| PUT    | `/profile/updatePwd` | 修改个人密码     | 无                   |
| POST   | `/profile/avatar`    | 更新头像         | 无                   |
| GET    | `/deptTree`          | 部门树选择       | system:user:list     |
| GET    | `/list/allocated`    | 已分配用户角色   | system:user:list     |
| GET    | `/list/unallocated`  | 未分配用户角色   | system:user:list     |
| PUT    | `/authRole`          | 用户授权角色     | system:user:edit     |
| GET    | `/authRole/{userId}` | 查询用户授权角色 | system:user:query    |
| POST   | `/importData`        | 导入用户数据     | system:user:import   |

### 3.3 角色管理模块 (Role Management)

#### 基础路径: `/system/role`

| 方法   | 路径                  | 功能             | 权限               |
| ------ | --------------------- | ---------------- | ------------------ |
| GET    | `/list`               | 分页查询角色列表 | system:role:list   |
| POST   | `/`                   | 新增角色         | system:role:add    |
| PUT    | `/`                   | 修改角色         | system:role:edit   |
| DELETE | `/{roleIds}`          | 删除角色         | system:role:remove |
| GET    | `/{roleId}`           | 角色详情         | system:role:query  |
| PUT    | `/changeStatus`       | 修改角色状态     | system:role:edit   |
| PUT    | `/dataScope`          | 修改角色数据权限 | system:role:edit   |
| PUT    | `/authUser/cancel`    | 取消用户授权     | system:role:edit   |
| PUT    | `/authUser/cancelAll` | 批量取消用户授权 | system:role:edit   |
| PUT    | `/authUser/selectAll` | 批量选择用户授权 | system:role:edit   |
| GET    | `/deptTree/{roleId}`  | 角色部门树选择   | system:role:query  |
| GET    | `/optionselect`       | 角色选择框列表   | system:role:query  |

### 3.4 菜单管理模块 (Menu Management)

#### 基础路径: `/system/menu`

| 方法   | 路径                           | 功能                   | 权限               |
| ------ | ------------------------------ | ---------------------- | ------------------ |
| GET    | `/list`                        | 查询菜单列表           | system:menu:list   |
| POST   | `/`                            | 新增菜单               | system:menu:add    |
| PUT    | `/`                            | 修改菜单               | system:menu:edit   |
| DELETE | `/{menuId}`                    | 删除菜单               | system:menu:remove |
| GET    | `/{menuId}`                    | 菜单详情               | system:menu:query  |
| GET    | `/treeselect`                  | 菜单下拉树列表         | 无                 |
| GET    | `/roleMenuTreeselect/{roleId}` | 加载对应角色菜单列表树 | system:menu:query  |
| GET    | `/getRouters`                  | 获取路由信息           | 无                 |

### 3.5 部门管理模块 (Department Management)

#### 基础路径: `/system/dept`

| 方法   | 路径                           | 功能                   | 权限               |
| ------ | ------------------------------ | ---------------------- | ------------------ |
| GET    | `/list`                        | 查询部门列表           | system:dept:list   |
| POST   | `/`                            | 新增部门               | system:dept:add    |
| PUT    | `/`                            | 修改部门               | system:dept:edit   |
| DELETE | `/{deptId}`                    | 删除部门               | system:dept:remove |
| GET    | `/{deptId}`                    | 部门详情               | system:dept:query  |
| GET    | `/treeselect`                  | 部门树选择             | system:dept:query  |
| GET    | `/roleDeptTreeselect/{roleId}` | 加载对应角色部门列表树 | system:dept:query  |

### 3.6 系统监控模块 (System Monitor)

#### 基础路径: `/monitor`

| 方法 | 路径      | 功能       | 权限                |
| ---- | --------- | ---------- | ------------------- |
| GET  | `/server` | 服务器信息 | monitor:server:list |
| GET  | `/druid`  | 数据源监控 | monitor:druid:list  |

## 4. 统一响应格式

### 4.1 成功响应

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

### 4.2 错误响应

```json
{
  "code": 500,
  "msg": "操作失败",
  "data": null
}
```

### 4.3 分页响应 (TableDataInfo)

```json
{
  "code": 200,
  "msg": "查询成功",
  "rows": [],
  "total": 100
}
```

## 5. 认证与授权

### 5.1 JWT Token认证

- 登录成功后返回JWT Token
- 后续请求需在Header中携带: `Authorization: Bearer {token}`

### 5.2 权限控制

- 基于Spring Security + 注解实现
- 使用 `@PreAuthorize("@ss.hasPermi('权限标识')")` 进行权限验证
- 支持RBAC权限模型

## 6. 接口文档访问

项目启动后，可通过以下地址访问Swagger接口文档：

```
http://localhost:8080/swagger-ui/
```

## 7. 数据库初始化

执行 `sql/lanan_database_init.sql` 文件完成数据库初始化，包含：

- 创建数据库表结构
- 插入基础数据
- 默认管理员账号: admin/admin123

## 8. 配置说明

### 8.1 数据库配置

文件: `lanan-admin-api/src/main/resources/application-druid.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/lanan?useUnicode=true&characterEncoding=utf8
    username: root
    password: root
```

### 8.2 项目启动

```bash
# 1. 创建数据库并执行初始化脚本
# 2. 修改数据库连接配置
# 3. 编译项目
mvn clean compile
# 4. 启动项目
mvn spring-boot:run -pl lanan-admin-api
```

## 9. 扩展说明

### 9.1 新增模块步骤

1. 在 `lanan-system` 模块中添加Service接口和实现
2. 在 `lanan-admin-api` 模块中添加Controller
3. 配置权限标识
4. 添加Swagger注解

### 9.2 权限配置

权限标识格式: `模块:功能:操作`
例如: `system:user:list`, `system:role:add`

---

**文档更新时间**: 2025-08-27  
**版本**: v3.8.8  
**维护人员**: lanan
