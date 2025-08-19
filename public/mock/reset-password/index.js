// 导入用户数据和重置令牌
const users = require('../auth').users;
const resetTokens = require('../forgot-password').resetTokens;

// 处理重置密码请求
function handleResetPassword(req) {
  const { token, newPassword } = req.body;

  // 查找有效的重置令牌
  const resetToken = resetTokens.find(
    (t) => t.token === token && t.expiresAt > Date.now()
  );

  if (!resetToken) {
    return {
      success: false,
      code: 400,
      message: '无效或过期的重置令牌'
    };
  }

  // 查找用户
  const user = users.find((u) => u.id === resetToken.userId);

  if (!user) {
    return {
      success: false,
      code: 404,
      message: '用户不存在'
    };
  }

  // 更新密码
  user.password = newPassword;

  // 移除已使用的令牌
  const tokenIndex = resetTokens.indexOf(resetToken);
  if (tokenIndex !== -1) {
    resetTokens.splice(tokenIndex, 1);
  }

  return {
    success: true,
    code: 200,
    message: '密码重置成功，请使用新密码登录'
  };
}

// 导出处理函数
module.exports = {
  handleResetPassword
};