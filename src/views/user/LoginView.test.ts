import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ElMessage } from "element-plus";
import { createPinia, setActivePinia } from "pinia";
import LoginView from "./LoginView.vue";
import { useUserStore } from "@/stores/user";

// Mock Element Plus
vi.mock("element-plus", () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
  ElForm: vi.fn(),
  ElFormItem: vi.fn(),
  ElInput: vi.fn(),
  ElButton: vi.fn(),
  ElCard: vi.fn(),
  ElIcon: vi.fn(),
  ElRow: vi.fn(),
  ElCol: vi.fn(),
}));

// Mock 路由
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    currentRoute: {
      value: {
        query: {},
      },
    },
  }),
}));

// Mock 防抖函数
vi.mock("@/utils/debounce", () => ({
  debounce: (fn: Function) => fn,
}));

describe("LoginView 验证码功能测试", () => {
  let wrapper: any;
  let userStore: any;

  beforeEach(() => {
    // 创建新的 Pinia 实例
    setActivePinia(createPinia());
    userStore = useUserStore();

    // Mock store 方法
    userStore.getCaptcha = vi.fn().mockResolvedValue(undefined);
    userStore.login = vi.fn().mockResolvedValue({ code: 200 });
    userStore.captchaImage = "data:image/gif;base64,test";
    userStore.captchaUuid = "test-uuid";

    wrapper = mount(LoginView, {
      global: {
        stubs: {
          "el-card": true,
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-icon": true,
          "el-row": true,
          "el-col": true,
        },
      },
    });
  });

  it("应该在输入有效手机号后显示验证码", async () => {
    // 获取组件实例
    const vm = wrapper.vm;

    // 初始状态：验证码功能应该是禁用的
    expect(vm.captchaEnabled).toBe(false);
    expect(vm.showCaptcha).toBe(false);

    // 输入有效的手机号
    vm.loginForm.username = "13812345678";

    // 触发用户名验证
    await vm.validateUsername();

    // 验证码功能应该被启用并显示
    expect(vm.captchaEnabled).toBe(true);
    expect(vm.showCaptcha).toBe(true);

    // 应该自动调用获取验证码
    expect(userStore.getCaptcha).toHaveBeenCalled();
  });

  it("应该在输入无效用户名后隐藏验证码", async () => {
    const vm = wrapper.vm;

    // 先设置为启用状态
    vm.captchaEnabled = true;
    vm.showCaptcha = true;

    // 输入无效的用户名
    vm.loginForm.username = "invalid_username";

    // 触发用户名验证
    await vm.validateUsername();

    // 验证码功能应该被禁用并隐藏
    expect(vm.captchaEnabled).toBe(false);
    expect(vm.showCaptcha).toBe(false);

    // 验证码相关字段应该被清空
    expect(vm.loginForm.code).toBe("");
    expect(vm.loginForm.uuid).toBe("");
  });

  it("验证码按钮应该在正确的时机禁用", async () => {
    const vm = wrapper.vm;

    // 初始状态：按钮应该被禁用
    expect(vm.isCaptchaButtonDisabled).toBe(true);

    // 启用验证码功能
    vm.captchaEnabled = true;
    await wrapper.vm.$nextTick();

    // 按钮应该被启用
    expect(vm.isCaptchaButtonDisabled).toBe(false);

    // 设置加载状态
    vm.isCaptchaLoading = true;
    await wrapper.vm.$nextTick();

    // 按钮应该被禁用
    expect(vm.isCaptchaButtonDisabled).toBe(true);
  });

  it("应该正确处理验证码错误", async () => {
    const vm = wrapper.vm;

    // 模拟验证码错误
    const mockError = { code: 460, message: "验证码错误" };
    userStore.login = vi.fn().mockRejectedValue(mockError);

    // 设置初始状态
    vm.showCaptcha = true;
    vm.captchaEnabled = true;
    vm.loginForm.code = "wrong";

    // 尝试登录
    try {
      await vm.handleLogin();
    } catch {
      // 预期会抛出错误
    }

    // 验证码应该被清空
    expect(vm.loginForm.code).toBe("");

    // 验证码错误次数应该增加
    expect(vm.captchaCount).toBe(1);

    // 应该自动获取新的验证码
    expect(userStore.getCaptcha).toHaveBeenCalled();
  });

  it("验证码错误3次后应该禁用功能", async () => {
    const vm = wrapper.vm;

    // 设置验证码错误次数为3
    vm.captchaCount = 3;
    vm.showCaptcha = true;
    vm.captchaEnabled = true;

    // 模拟验证码错误
    const mockError = { code: 460, message: "验证码错误" };
    userStore.login = vi.fn().mockRejectedValue(mockError);

    // 尝试登录
    try {
      await vm.handleLogin();
    } catch {
      // 预期会抛出错误
    }

    // 验证码功能应该被禁用
    expect(vm.captchaEnabled).toBe(false);
    expect(vm.showCaptcha).toBe(false);

    // 用户名应该被清空
    expect(vm.loginForm.username).toBe("");

    // 应该显示错误消息
    expect(ElMessage.error).toHaveBeenCalledWith("验证码输入错误次数过多，请重新输入手机号");
  });

  it("手机号格式验证应该正确工作", () => {
    const vm = wrapper.vm;

    // 测试有效的手机号
    const validPhones = ["13812345678", "15987654321", "18612345678"];
    validPhones.forEach((phone) => {
      vm.loginForm.username = phone;
      vm.validateUsername();
      expect(vm.captchaEnabled).toBe(true);
      expect(vm.showCaptcha).toBe(true);
    });

    // 测试无效的手机号
    const invalidPhones = ["1234567890", "12812345678", "138123456789", "abcdefghij"];
    invalidPhones.forEach((phone) => {
      vm.loginForm.username = phone;
      vm.validateUsername();
      expect(vm.captchaEnabled).toBe(false);
      expect(vm.showCaptcha).toBe(false);
    });
  });
});
