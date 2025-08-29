/**
 * Token设置功能测试
 */

// 模拟登录后设置token
export function testTokenSetting() {
  console.log("开始测试token设置功能...");

  // 模拟登录成功后设置token
  const mockToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  try {
    // 设置token到localStorage
    localStorage.setItem("token", mockToken);
    console.log("Token已设置到localStorage");

    // 验证token是否正确存储
    const storedToken = localStorage.getItem("token");
    console.log("从localStorage获取的token:", storedToken);

    if (storedToken === mockToken) {
      console.log("✅ Token设置和获取测试通过");
      return true;
    } else {
      console.error("❌ Token设置和获取测试失败");
      return false;
    }
  } catch (error) {
    console.error("Token测试过程中出现错误:", error);
    return false;
  }
}

// 测试从不同位置获取token
export function testGetToken() {
  console.log("开始测试getToken功能...");

  // 清除之前的token
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  // 测试从localStorage获取
  localStorage.setItem("token", "local_token_123");
  console.log("测试localStorage中的token获取");

  // 测试从sessionStorage获取
  sessionStorage.setItem("token", "session_token_456");
  console.log("测试sessionStorage中的token获取");

  console.log("Token获取测试完成");
}

// 默认导出
export default {
  testTokenSetting,
  testGetToken,
};
