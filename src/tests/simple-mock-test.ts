import { request } from "@/utils/request/index";

/**
 * 简单的Mock功能测试
 */
export async function simpleMockTest() {
  try {
    console.log("开始简单Mock测试...");

    // 检查环境配置
    console.log("环境模式:", import.meta.env.MODE);
    console.log("VITE_USE_MOCK:", import.meta.env.VITE_USE_MOCK);

    // 发起一个简单的测试请求
    console.log("发起简单测试请求...");
    const response = await request.get("/getInfo");

    console.log("简单测试请求响应:", response);
    return response;
  } catch (error) {
    console.error("简单测试失败:", error);
    throw error;
  }
}

// 如果在浏览器环境中，将函数添加到window对象
if (typeof window !== "undefined") {
  (window as any).simpleMockTest = simpleMockTest;
}

export default simpleMockTest;
