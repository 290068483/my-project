import request from "@/utils/request";

/**
 * 简单Mock测试示例
 * 演示基本的Mock使用方法
 */
export async function simpleMockTest() {
  try {
    // 测试GET请求
    const response = await request({
      url: "/getInfo",
      method: "get",
    });

    console.log("简单Mock测试响应:", response);
    return response;
  } catch (error) {
    console.error("简单Mock测试失败:", error);
    throw error;
  }
}

/**
 * 带参数的Mock测试
 */
export async function mockTestWithParams() {
  try {
    const response = await request({
      url: "/test/params",
      method: "get",
      params: {
        id: 1,
        name: "test",
      },
    });

    console.log("带参数Mock测试响应:", response);
    return response;
  } catch (error) {
    console.error("带参数Mock测试失败:", error);
    throw error;
  }
}
