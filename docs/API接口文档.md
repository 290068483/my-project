# Lanan管理系统 API接口文档

## 📖 项目概述

基于RuoYi-Vue架构的企业级管理系统，提供完整的用户权限管理、系统监控等功能的RESTful API接口。

### 🏗️ 技术架构
- **后端框架**: Spring Boot 2.5.15
- **API文档**: Swagger3 3.0.0
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **安全框架**: Spring Security 5.7.12
- **ORM框架**: MyBatis 2.2.2

## 📋 接口模块

### 1. 认证授权模块 `/login`
- **POST** `/login` - 用户登录
- **GET** `/getInfo` - 获取用户信息
- **GET** `/getRouters` - 获取路由信息
- **POST** `/logout` - 退出登录

### 2. 用户管理模块 `/system/user`
- **GET** `/list` - 获取用户列表
- **POST** `/export` - 导出用户列表
- **POST** `/importData` - 导入用户数据
- **GET** `/{userId}` - 根据用户编号获取详细信息
- **POST** `/` - 新增用户
- **PUT** `/` - 修改用户
- **DELETE** `/{userIds}` - 删除用户
- **PUT** `/resetPwd` - 重置密码
- **PUT** `/changeStatus` - 修改用户状态
- **GET** `/authRole/{userId}` - 根据用户编号获取授权角色
- **PUT** `/authRole` - 用户授权角色
- **GET** `/profile` - 获取个人信息
- **PUT** `/profile` - 修改个人信息
- **PUT** `/profile/updatePwd` - 修改密码
- **POST** `/profile/avatar` - 头像上传

### 3. 角色管理模块 `/system/role`
- **GET** `/list` - 获取角色列表
- **POST** `/export` - 导出角色列表
- **GET** `/{roleId}` - 根据角色编号获取详细信息
- **POST** `/` - 新增角色
- **PUT** `/` - 修改角色
- **PUT** `/dataScope` - 修改数据权限
- **PUT** `/changeStatus` - 修改角色状态
- **DELETE** `/{roleIds}` - 删除角色
- **GET** `/optionselect` - 获取角色选择框列表
- **GET** `/authUser/allocatedList` - 查询已分配用户角色列表
- **GET** `/authUser/unallocatedList` - 查询未分配用户角色列表
- **PUT** `/authUser/cancel` - 取消授权用户
- **PUT** `/authUser/cancelAll` - 批量取消授权用户
- **PUT** `/authUser/selectAll` - 批量选择用户授权

### 4. 菜单管理模块 `/system/menu`
- **GET** `/list` - 获取菜单列表
- **GET** `/{menuId}` - 根据菜单编号获取详细信息
- **GET** `/treeselect` - 获取菜单下拉树列表
- **GET** `/roleMenuTreeselect/{roleId}` - 加载对应角色菜单列表树
- **POST** `/` - 新增菜单
- **PUT** `/` - 修改菜单
- **DELETE** `/{menuId}` - 删除菜单
- **GET** `/getRouters` - 获取路由信息

### 5. 部门管理模块 `/system/dept`
- **GET** `/list` - 获取部门列表
- **GET** `/list/exclude/{deptId}` - 查询部门列表（排除节点）
- **GET** `/{deptId}` - 根据部门编号获取详细信息
- **GET** `/treeselect` - 获取部门下拉树列表
- **GET** `/roleDeptTreeselect/{roleId}` - 加载对应角色部门列表树
- **POST** `/` - 新增部门
- **PUT** `/` - 修改部门
- **DELETE** `/{deptId}` - 删除部门

### 6. 系统监控模块
#### 6.1 服务器监控 `/monitor/server`
- **GET** `/` - 获取服务器信息

#### 6.2 操作日志 `/monitor/operlog`
- **GET** `/list` - 获取操作日志列表
- **POST** `/export` - 导出操作日志列表
- **DELETE** `/{operIds}` - 批量删除操作日志
- **GET** `/{operId}` - 根据操作日志编号获取详细信息
- **DELETE** `/clean` - 清空操作日志

## 🔐 权限说明

### 权限标识格式
- 模块:功能:操作 (如: `system:user:list`)

### 主要权限标识
- **用户管理**: `system:user:*`
- **角色管理**: `system:role:*`
- **菜单管理**: `system:menu:*`
- **部门管理**: `system:dept:*`
- **系统监控**: `monitor:*:*`

## 📝 请求响应格式

### 统一响应格式 (AjaxResult)
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

### 分页响应格式 (TableDataInfo)
```json
{
  "code": 200,
  "msg": "查询成功",
  "total": 100,
  "rows": []
}
```

## 🔑 认证方式

### JWT Token认证
- **Header**: `Authorization: Bearer {token}`
- **获取**: 通过登录接口获取token
- **有效期**: 30分钟（可配置）

## 📚 接口文档访问

### Swagger UI
- **开发环境**: `http://localhost:8080/swagger-ui/index.html`
- **API前缀**: `/dev-api`

## 🗄️ 数据库设计

### 核心表结构
- **sys_user** - 用户信息表
- **sys_role** - 角色信息表
- **sys_menu** - 菜单权限表
- **sys_dept** - 部门表
- **sys_user_role** - 用户角色关联表
- **sys_role_menu** - 角色菜单关联表
- **sys_role_dept** - 角色部门关联表
- **sys_oper_log** - 操作日志记录表

## 🚀 快速开始

### 1. 启动项目
```bash
mvn clean package
java -jar lanan-admin-api.jar
```

### 2. 访问接口文档
```
http://localhost:8080/swagger-ui/index.html
```

### 3. 默认管理员账号
- **用户名**: admin
- **密码**: admin123

## 📞 联系方式

- **开发者**: Lanan
- **邮箱**: lanan@163.com
- **版本**: 3.8.8

---

> 注意：本文档基于RuoYi-Vue架构设计，遵循RESTful API设计规范，所有接口均支持权限验证。