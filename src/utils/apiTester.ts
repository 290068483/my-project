import { login } from "@/api/login";
import { register } from "@/api/register";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

/**
 * API 测试工具类
 * 用于测试登录和注册相关的API接口
 */
export class ApiTester {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    console.log("🔧 [API测试工具] 初始化完成，API基础URL:", this.baseUrl);
  }

  /**
   * 测试登录接口
   */
  async testLogin() {
    console.log("\n🧪 [登录接口测试] 开始测试登录相关接口...");

    const testCases = [
      {
        name: "正常登录",
        data: { username: "admin", password: "admin123", code: "test", uuid: "test-uuid" },
      },
      {
        name: "错误密码",
        data: { username: "admin", password: "wrongpass", code: "test", uuid: "test-uuid" },
      },
      {
        name: "不存在用户",
        data: { username: "nonexistent", password: "password", code: "test", uuid: "test-uuid" },
      },
    ];

    for (const testCase of testCases) {
      try {
        console.log(`\n📝 [登录测试] 测试用例: ${testCase.name}`);
        console.log(`📤 [登录测试] 请求数据:`, testCase.data);

        const result = await login(testCase.data as LoginRequest);
        console.log(`✅ [登录测试] 响应成功:`, result);
      } catch (error: any) {
        console.log(`❌ [登录测试] 响应失败:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  }

  /**
   * 测试注册接口
   */
  async testRegister() {
    console.log("\n🧪 [注册接口测试] 开始测试注册相关接口...");

    const testCases = [
      {
        name: "正常注册",
        data: {
          username: "testuser123",
          password: "password123",
          nickname: "测试用户",
          email: "test@example.com",
          phone: "13800138000",
          code: "test123",
          uuid: "test-uuid",
        },
      },
      {
        name: "用户名已存在",
        data: {
          username: "admin",
          password: "password123",
          nickname: "管理员2",
          email: "admin2@example.com",
          phone: "13800138001",
          code: "test123",
          uuid: "test-uuid",
        },
      },
    ];

    for (const testCase of testCases) {
      try {
        console.log(`\n📝 [注册测试] 测试用例: ${testCase.name}`);
        console.log(`📤 [注册测试] 请求数据:`, testCase.data);

        const result = await register(testCase.data as RegisterRequest);
        console.log(`✅ [注册测试] 响应成功:`, result);
      } catch (error: any) {
        console.log(`❌ [注册测试] 响应失败:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  }

  /**
   * 测试用户名可用性检查
   * 注意：用户名检查功能已在API简化过程中移除
   */
  async testUsernameCheck() {
    console.log("\n🧪 [用户名检查测试] 用户名检查功能已简化，跳过此测试");
    console.log("💡 [提示] 用户名重复检查现在由后端在注册时统一处理");
  }

  /**
   * 测试手机号可用性检查
   * 注意：手机号检查功能已在API简化过程中移除
   */
  async testPhoneCheck() {
    console.log("\n🧪 [手机号检查测试] 手机号检查功能已简化，跳过此测试");
    console.log("💡 [提示] 手机号重复检查现在由后端在注册时统一处理");
  }

  /**
   * 测试验证码发送
   * 注意：验证码发送功能已在API简化过程中移除
   */
  async testSendCode() {
    console.log("\n🧪 [验证码发送测试] 验证码发送功能已简化，跳过此测试");
    console.log("💡 [提示] 验证码发送现在集成在登录/注册流程中统一处理");
  }

  /**
   * 运行所有测试
   */
  async runAllTests() {
    console.log("🚀 [API测试工具] 开始运行所有API测试...");
    console.log("=".repeat(60));

    try {
      await this.testUsernameCheck();
      await this.testPhoneCheck();
      await this.testSendCode();
      await this.testLogin();
      await this.testRegister();

      console.log("\n🎉 [API测试工具] 所有测试完成！");
      console.log("=".repeat(60));
    } catch (error) {
      console.error("💥 [API测试工具] 测试过程中发生错误:", error);
    }
  }

  /**
   * 快速测试登录
   */
  async quickTestLogin(username: string = "admin", password: string = "admin123") {
    console.log(`\n⚡ [快速登录测试] 测试 ${username}/${password}`);

    try {
      const loginData: LoginRequest = {
        username,
        password,
        code: "test",
        uuid: "test-uuid",
      };

      const result = await login(loginData);
      console.log(`✅ [快速登录测试] 登录成功:`, result);
      return result;
    } catch (error: any) {
      console.log(`❌ [快速登录测试] 登录失败:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * 快速测试注册
   */
  async quickTestRegister(username: string = "testuser" + Date.now()) {
    console.log(`\n⚡ [快速注册测试] 测试注册用户: ${username}`);

    try {
      const registerData: RegisterRequest = {
        username,
        password: "password123",
        nickname: "测试用户",
        email: `${username}@example.com`,
        phone:
          "13800" +
          Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, "0"),
        code: "test123",
        uuid: "test-uuid",
      };

      const result = await register(registerData);
      console.log(`✅ [快速注册测试] 注册成功:`, result);
      return result;
    } catch (error: any) {
      console.log(`❌ [快速注册测试] 注册失败:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }
}

// 创建全局实例
export const apiTester = new ApiTester();

// 在window对象上添加测试函数，方便在控制台调用
declare global {
  interface Window {
    apiTester: ApiTester;
    testLogin: () => Promise<void>;
    testRegister: () => Promise<void>;
    testAll: () => Promise<void>;
    quickLogin: (username?: string, password?: string) => Promise<any>;
    quickRegister: (username?: string) => Promise<any>;
  }
}

// 在浏览器环境中添加到window对象
if (typeof window !== "undefined") {
  window.apiTester = apiTester;
  window.testLogin = () => apiTester.testLogin();
  window.testRegister = () => apiTester.testRegister();
  window.testAll = () => apiTester.runAllTests();
  window.quickLogin = (username?: string, password?: string) => apiTester.quickTestLogin(username, password);
  window.quickRegister = (username?: string) => apiTester.quickTestRegister(username);

  console.log("🔧 [API测试工具] 全局测试函数已注册:");
  console.log("   window.testLogin() - 测试登录接口");
  console.log("   window.testRegister() - 测试注册接口");
  console.log("   window.testAll() - 运行所有测试");
  console.log('   window.quickLogin("admin", "admin123") - 快速测试登录');
  console.log('   window.quickRegister("newuser") - 快速测试注册');
}
