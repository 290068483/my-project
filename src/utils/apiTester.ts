import { loginWithData, loginWithPhone, loginWithEmail, sendLoginSms } from "@/api/login";
import {
  register,
  registerWithPhone,
  registerWithEmail,
  checkUsername,
  checkPhone,
  checkEmail,
  sendRegisterCode,
  sendRegisterEmailCode,
} from "@/api/register";
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

        const result = await loginWithData(testCase.data as LoginRequest);
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
   */
  async testUsernameCheck() {
    console.log("\n🧪 [用户名检查测试] 开始测试用户名可用性检查...");

    const testUsernames = ["admin", "newuser123", "testuser456", ""];

    for (const username of testUsernames) {
      try {
        console.log(`\n📝 [用户名检查] 检查用户名: "${username}"`);

        if (!username) {
          console.log(`⚠️ [用户名检查] 用户名为空，跳过测试`);
          continue;
        }

        const result = await checkUsername(username);
        console.log(`✅ [用户名检查] 检查结果:`, result);
      } catch (error: any) {
        console.log(`❌ [用户名检查] 检查失败:`, {
          username,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  }

  /**
   * 测试手机号可用性检查
   */
  async testPhoneCheck() {
    console.log("\n🧪 [手机号检查测试] 开始测试手机号可用性检查...");

    const testPhones = ["13800138000", "13900139000", "1234567890"];

    for (const phone of testPhones) {
      try {
        console.log(`\n📝 [手机号检查] 检查手机号: "${phone}"`);

        const result = await checkPhone(phone);
        console.log(`✅ [手机号检查] 检查结果:`, result);
      } catch (error: any) {
        console.log(`❌ [手机号检查] 检查失败:`, {
          phone,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }
  }

  /**
   * 测试验证码发送
   */
  async testSendCode() {
    console.log("\n🧪 [验证码发送测试] 开始测试验证码发送接口...");

    const testPhone = "13800138000";
    const testEmail = "test@example.com";

    // 测试注册验证码
    try {
      console.log(`\n📝 [注册验证码] 发送短信验证码到: ${testPhone}`);
      const result = await sendRegisterCode(testPhone);
      console.log(`✅ [注册验证码] 发送成功:`, result);
    } catch (error: any) {
      console.log(`❌ [注册验证码] 发送失败:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // 测试邮箱验证码
    try {
      console.log(`\n📝 [邮箱验证码] 发送邮箱验证码到: ${testEmail}`);
      const result = await sendRegisterEmailCode(testEmail);
      console.log(`✅ [邮箱验证码] 发送成功:`, result);
    } catch (error: any) {
      console.log(`❌ [邮箱验证码] 发送失败:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
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

      const result = await loginWithData(loginData);
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
