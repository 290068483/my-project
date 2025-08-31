import request from "@/utils/request";

/**
 * Token和Header测试示例
 * 演示如何在请求中添加自定义Header和Token
 */
export async function tokenHeaderTest() {
  try {
    // 测试带自定义Header的请求
    const response = await request({
      url: "/test",
      method: "get",
      headers: {
        "Custom-Header": "test-value",
        "X-Request-From": "frontend",
      },
    });

    console.log("Token/Header测试响应:", response);
    return response;
  } catch (error) {
    console.error("Token/Header测试失败:", error);
    throw error;
  }
}

/**
 * 需要认证的请求测试
 */
export async function authenticatedRequestTest() {
  try {
    const response = await request({
      url: "/secure/data",
      method: "get",
      headers: {
        Authorization: "Bearer your-token-here",
      },
    });

    console.log("认证请求测试响应:", response);
    return response;
  } catch (error) {
    console.error("认证请求测试失败:", error);
    throw error;
  }
}
