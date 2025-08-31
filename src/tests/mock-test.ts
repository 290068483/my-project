import request from "@/utils/request";

/**
 * Mock测试示例
 * 演示如何使用Mock拦截器进行API测试
 */
export async function mockTest() {
  try {
    // 测试GET请求
    const response = await request({
      url: "/getInfo",
      method: "get",
    });

    console.log("Mock GET请求响应:", response);
    return response;
  } catch (error) {
    console.error("Mock测试失败:", error);
    throw error;
  }
}

/**
 * Mock POST测试示例
 */
export async function mockPostTest(data: any) {
  try {
    const response = await request({
      url: "/test/post",
      method: "post",
      data,
    });

    console.log("Mock POST请求响应:", response);
    return response;
  } catch (error) {
    console.error("Mock POST测试失败:", error);
    throw error;
  }
}

/**
 * Mock PUT测试示例
 */
export async function mockPutTest(data: any) {
  try {
    const response = await request({
      url: "/test/put",
      method: "put",
      data,
    });

    console.log("Mock PUT请求响应:", response);
    return response;
  } catch (error) {
    console.error("Mock PUT测试失败:", error);
    throw error;
  }
}

/**
 * Mock DELETE测试示例
 */
export async function mockDeleteTest(id: number) {
  try {
    const response = await request({
      url: `/test/delete/${id}`,
      method: "delete",
    });

    console.log("Mock DELETE请求响应:", response);
    return response;
  } catch (error) {
    console.error("Mock DELETE测试失败:", error);
    throw error;
  }
}
