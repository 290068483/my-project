import { getInfo } from "@/api/login";
import { useUserStore } from "@/stores/user";

/**
 * 测试getInfo接口
 */
export async function testGetInfo() {
  try {
    console.log("开始测试getInfo接口...");

    // 检查用户store状态
    const userStore = useUserStore();
    console.log("当前token:", userStore.token);
    console.log("是否已登录:", userStore.isLoggedIn);

    // 检查localStorage中的token
    const localStorageToken = localStorage.getItem("token");
    console.log("localStorage中的token:", localStorageToken);

    // 检查sessionStorage中的token
    const sessionStorageToken = sessionStorage.getItem("token");
    console.log("sessionStorage中的token:", sessionStorageToken);

    // 检查环境变量
    console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
    console.log("VITE_USE_MOCK:", import.meta.env.VITE_USE_MOCK);

    // 调用getInfo接口
    console.log("调用getInfo接口...");
    const response = await getInfo();
    console.log("getInfo响应:", response);

    return response;
  } catch (error) {
    console.error("getInfo测试失败:", error);

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
  window.testGetInfo = testGetInfo;

  // 添加到全局作用域以便在控制台中调用
  (window as any).testGetInfo = testGetInfo;
}

// 默认导出测试函数
export default testGetInfo;
