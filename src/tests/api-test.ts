import { getInfo } from "@/api/login";
import { useUserStore } from "@/stores/user";

/**
 * 测试getInfo接口
 */
export async function testGetInfo() {
  try {
    console.log("开始测试getInfo接口...");

    // 检查用户store状�?    const userStore = useUserStore();
    console.log("当前token:", userStore.token);
    console.log("是否已登�?", userStore.isLoggedIn);

    // 调用getInfo接口
    const response = await getInfo();
    console.log("getInfo响应:", response);

    return response;
  } catch (error) {
    console.error("getInfo测试失败:", error);
    throw error;
  }
}

// 默认导出测试函数
export default testGetInfo;
