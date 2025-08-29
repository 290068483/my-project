/**
 * Mock 数据服务
 * 用于开发环境模拟后端API响应
 */

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    nickname: "系统管理员",
    avatar: "/assets/logo.svg",
    role: "admin",
    permissions: ["*:*:*"], // 超级管理员权限
    dept: { id: 1, name: "研发部门" },
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    nickname: "普通用户",
    avatar: "/assets/logo.svg",
    role: "user",
    permissions: ["system:user:list", "system:role:list"],
    dept: { id: 2, name: "测试部门" },
  },
];

// 生成Token
function generateToken(user) {
  const timestamp = Date.now();
  return `mock_token_${user.id}_${timestamp}`;
}

// 标准响应格式
function createResponse(data = null, code = 200, msg = "操作成功") {
  return {
    code,
    msg,
    data,
  };
}

// 分页响应格式
function createPageResponse(rows = [], total = 0, code = 200, msg = "查询成功") {
  return {
    code,
    msg,
    rows,
    total,
  };
}

// Mock API 处理器
export const mockHandlers = {
  // 登录
  "POST /api/login": (req) => {
    const { username, password } = req.body || {};

    const user = mockUsers.find((u) => u.username === username && u.password === password);

    if (!user) {
      return createResponse(null, 500, "用户名或密码错误");
    }

    const token = generateToken(user);

    return createResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    });
  },

  // 获取用户信息
  "GET /api/getInfo": () => {
    const user = mockUsers[0]; // 默认返回管理员信息
    return createResponse({
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        dept: user.dept,
      },
      roles: [user.role],
      permissions: user.permissions,
    });
  },

  // 获取路由信息
  "GET /api/getRouters": () => {
    const mockRouters = [
      {
        name: "System",
        path: "/system",
        component: "Layout",
        redirect: "/system/user",
        meta: { title: "系统管理", icon: "system" },
        children: [
          {
            name: "User",
            path: "/system/user",
            component: "system/user/index",
            meta: { title: "用户管理", icon: "user" },
          },
          {
            name: "Role",
            path: "/system/role",
            component: "system/role/index",
            meta: { title: "角色管理", icon: "role" },
          },
        ],
      },
    ];

    return createResponse(mockRouters);
  },

  // 退出登录
  "POST /api/logout": () => {
    return createResponse(null, 200, "退出成功");
  },

  // 获取验证码
  "GET /api/captchaImage": () => {
    return createResponse({
      uuid: "mock-uuid-" + Date.now(),
      img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    });
  },

  // 用户列表
  "GET /api/system/user/list": () => {
    return createPageResponse(mockUsers, mockUsers.length);
  },

  // 服务器信息
  "GET /api/monitor/server": () => {
    return createResponse({
      cpu: { cpuNum: 4, total: 25.5, sys: 10.2, used: 15.3, wait: 0.0, free: 74.5 },
      mem: { total: "8.00GB", used: "4.50GB", free: "3.50GB", usage: 56.25 },
      jvm: {
        name: "Java HotSpot(TM) 64-Bit Server VM",
        version: "11.0.12",
        startTime: "2025-08-27 14:30:00",
        runTime: "2小时15分钟",
        home: "/usr/java/jdk-11.0.12",
        max: "2.00GB",
        total: "1.50GB",
        used: "800MB",
        free: "700MB",
        usage: 53.33,
      },
      sys: {
        computerName: "DEV-SERVER",
        computerIp: "192.168.1.100",
        userDir: "/opt/lanan-admin",
        osName: "Linux",
        osArch: "amd64",
      },
      sysFiles: [
        {
          dirName: "/",
          sysTypeName: "ext4",
          typeName: "Local Disk",
          total: "100GB",
          free: "45GB",
          used: "55GB",
          usage: 55,
        },
      ],
    });
  },
};

export default mockHandlers;
