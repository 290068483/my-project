// 导入用户数据
import { users } from '../auth';

// 模拟数据库存储重置密码令牌
const resetTokens = [];

// 生成重置密码令牌
function generateResetToken(userId) {
  const timestamp = Date.now();
  const token = `reset_token_${userId}_${timestamp}`;
  // 存储令牌，有效期1小时
  resetTokens.push({
    token,
    userId,
    expiresAt: timestamp + 3600000
  });
  return token;
}

// 处理忘记密码请求
function handleForgotPassword(req) {
  const { username } = req.body;

  // 查找用户
  const user = users.find((u) => u.username === username);

  if (!user) {
    return {
      success: false,
      code: 404,
      message: '用户不存在'
    };
  }

  // 生成重置令牌
  const resetToken = generateResetToken(user.id);

  // 在实际应用中，这里应该发送邮件或短信
  console.log(`重置密码链接: http://localhost:5173/static/reset-password?token=${resetToken}`);

  return {
    success: true,
    code: 200,
    message: '重置密码链接已发送到您的手机或邮箱',
    data: {
      resetToken // 实际应用中不应返回令牌，这里仅作演示
    }
  };
}

// 导出处理函数
export {
  handleForgotPassword
};