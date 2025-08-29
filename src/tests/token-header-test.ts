import { request } from "@/utils/request/index";

/**
 * 测试token和请求头设置
 */
export async function testTokenAndHeaders() {
  try {
    console.log("开始测试token和请求头设置...");

    // 检查localStorage中的token
    const localStorageToken = localStorage.getItem("token");
    console.log("localStorage中的token:", localStorageToken);

    // 检查sessionStorage中的token
    const sessionStorageToken = sessionStorage.getItem("token");
    console.log("sessionStorage中的token:", sessionStorageToken);

    // 检查环境变量
    console.log("VITE_USE_MOCK:", import.meta.env.VITE_USE_MOCK);

    // 手动设置一个测试token
    const testToken = "test_token_12345";
    localStorage.setItem("token", testToken);
    console.log("设置测试token:", testToken);

    // 发起一个测试请求
    console.log("发起测试请求...");
    const response = await request.get("/test", undefined, {
      timeout: 5000,
    });

    console.log("测试请求响应:", response);
    return response;
  } catch (error) {
    console.error("测试失败:", error);

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

    // 清理测试token
    localStorage.removeItem("token");

    throw error;
  }
}

// 直接调用测试
if (typeof window !== "undefined") {
  // 在浏览器环境中运行测试
  (window as any).testTokenAndHeaders = testTokenAndHeaders;
}

// 默认导出测试函数
export default testTokenAndHeaders;
