import { request } from "@/utils/request/index";

/**
 * 测试Mock功能
 */
export async function testMock() {
  try {
    console.log("开始测试Mock功能...");

    // 检查环境配置
    console.log("环境模式:", import.meta.env.MODE);
    console.log("VITE_USE_MOCK:", import.meta.env.VITE_USE_MOCK);

    // 发起一个测试请求
    console.log("发起getInfo测试请求...");
    const response = await request.get("/getInfo", undefined, {
      timeout: 5000,
    });

    console.log("Mock测试请求响应:", response);
    return response;
  } catch (error) {
    console.error("Mock测试失败:", error);

    // 详细错误信息
    if (error instanceof Error) {
      console.error("错误名称:", error.name);
      console.error("错误消息:", error.message);
      console.error("错误堆栈:", error.stack);
    }

    // 检查是否有响应数据
    if ((error as any).response) {
      console.error("响应数据:", (error as any).response);
    }

    // 检查是否有请求数据
    if ((error as any).request) {
      console.error("请求数据:", (error as any).request);
    }

    throw error;
  }
}

// 直接调用测试
if (typeof window !== "undefined") {
  // 在浏览器环境中运行测试
  (window as any).testMock = testMock;
}

// 默认导出测试函数
export default testMock;
