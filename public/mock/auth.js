// 模拟用户数据
const users = [
  {
    id: 1,
    username: '13098770214',
    password: 'user123',
    nickname: '管理员',
    avatar: '/assets/logo.svg',
    role: 'admin',
    permissions: ['dashboard', 'users', 'settings'],
  },
  {
    id: 2,
    username: '13098770211',
    password: 'user123',
    nickname: '普通用户',
    avatar: '/assets/logo.svg',
    role: 'user',
    permissions: ['dashboard'],
  },
]

// 生成JWT令牌
function generateToken(user) {
  // 简化版的令牌生成，实际项目中应使用专门的JWT库
  const timestamp = Date.now()
  const expiresIn = 3600 // 1小时
  return `mock_token_${user.id}_${timestamp}_${expiresIn}`
}

// 处理登录请求
function handleLogin(req) {
  const { username, password } = req.body

  // 查找用户
  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return {
      success: false,
      code: 401,
      message: '用户名或密码错误',
    }
  }

  // 生成令牌
  const token = generateToken(user)

  return {
    success: true,
    code: 200,
    message: '登录成功',
    data: {
      token,
      userInfo: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        permissions: user.permissions,
      },
      expiresIn: 3600,
    },
  }
}

// 导入其他认证相关处理函数
import { handleForgotPassword } from './forgot-password';
import { handleResetPassword } from './reset-password';

// 导出处理函数
export {
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
  users // 导出用户数据供其他模块使用
}
