import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import Cookies from "js-cookie";
import LoginView from "./LoginView.vue";

// Mock Element Plus
vi.mock("element-plus", () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }
}));

// Mock vue-router
const mockRouter = {
  push: vi.fn(),
};

vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
  useRoute: vi.fn(),
}));

// Mock js-cookie
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  }
}));

// Mock jsencrypt utility
vi.mock("@/utils/jsencrypt", () => ({
  encrypt: vi.fn().mockImplementation((val) => `encrypted_${val}`),
  decrypt: vi.fn().mockImplementation((val) => val.replace("encrypted_", "")),
}));

// Mock user store
const mockUserStore = {
  getCaptcha: vi.fn(),
  login: vi.fn(),
};

vi.mock("@/stores/user", () => ({
  useUserStore: () => mockUserStore,
}));

describe("LoginView", () => {
  beforeEach(() => {
    // Create new Pinia instance
    setActivePinia(createPinia());
    
    // Setup route mock
    (useRoute as any).mockReturnValue({
      query: {}
    });
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("应该正确渲染登录表单", () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    expect(wrapper.find(".login-form")).toBeTruthy();
    expect(wrapper.find(".title").text()).toBe("蓝岸管理系统");
  });

  it("应该在挂载时获取验证码和Cookie", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    (Cookies.get as any).mockImplementation(() => undefined);
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    // 等待组件挂载和执行异步操作
    await wrapper.vm.$nextTick();
    
    expect(mockUserStore.getCaptcha).toHaveBeenCalled();
    expect(Cookies.get).toHaveBeenCalled();
  });

  it("应该正确处理验证码刷新", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // 重新mock返回值
    mockUserStore.getCaptcha.mockResolvedValueOnce({
      code: 200,
      msg: "操作成功",
      data: {
        img: "new_test_image_base64",
        uuid: "new_test_uuid"
      }
    });
    
    await vm.refreshQrcode();
    
    expect(mockUserStore.getCaptcha).toHaveBeenCalled();
    expect(vm.codeUrl).toBe("data:image/gif;base64,new_test_image_base64");
    expect(vm.loginForm.uuid).toBe("new_test_uuid");
    expect(vm.captchaEnabled).toBe(true);
  });

  it("应该在验证码获取失败时正确处理", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // Mock failure
    mockUserStore.getCaptcha.mockRejectedValueOnce(new Error("Network error"));
    
    await vm.refreshQrcode();
    
    expect(ElMessage.error).toHaveBeenCalledWith("验证码加载失败");
    expect(vm.captchaEnabled).toBe(true); // 默认启用
  });

  it("应该正确处理登录表单验证", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    mockUserStore.login.mockResolvedValue({});
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // Mock form validation
    const validateFn = vi.fn().mockImplementation((callback) => {
      callback(true);
    });
    
    vm.$refs = {
      loginFormRef: {
        validate: validateFn
      }
    };
    
    await vm.handleLogin();
    
    expect(validateFn).toHaveBeenCalled();
  });

  it("应该在登录成功后跳转路由", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    mockUserStore.login.mockResolvedValue({});
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // Mock form validation
    const validateFn = vi.fn().mockImplementation((callback) => {
      callback(true);
    });
    
    vm.$refs = {
      loginFormRef: {
        validate: validateFn
      }
    };
    
    await vm.handleLogin();
    
    expect(mockUserStore.login).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({ path: "/", query: {} });
  });

  it("应该正确处理记住密码功能", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    mockUserStore.login.mockResolvedValue({});
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // 设置记住密码为true
    vm.loginForm.rememberMe = true;
    vm.loginForm.username = "testuser";
    vm.loginForm.password = "testpass";
    
    // Mock form validation
    const validateFn = vi.fn().mockImplementation((callback) => {
      callback(true);
    });
    
    vm.$refs = {
      loginFormRef: {
        validate: validateFn
      }
    };
    
    await vm.handleLogin();
    
    expect(Cookies.set).toHaveBeenCalledWith("username", "testuser", { expires: 30 });
    expect(Cookies.set).toHaveBeenCalledWith("password", "encrypted_testpass", { expires: 30 });
    expect(Cookies.set).toHaveBeenCalledWith("rememberMe", "true", { expires: 30 });
  });

  it("应该在不记住密码时移除Cookie", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    mockUserStore.login.mockResolvedValue({});
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // 设置记住密码为false
    vm.loginForm.rememberMe = false;
    
    // Mock form validation
    const validateFn = vi.fn().mockImplementation((callback) => {
      callback(true);
    });
    
    vm.$refs = {
      loginFormRef: {
        validate: validateFn
      }
    };
    
    await vm.handleLogin();
    
    expect(Cookies.remove).toHaveBeenCalledWith("username");
    expect(Cookies.remove).toHaveBeenCalledWith("password");
    expect(Cookies.remove).toHaveBeenCalledWith("rememberMe");
  });

  it("应该在登录失败时刷新验证码", async () => {
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    
    // Mock login failure
    mockUserStore.login.mockRejectedValueOnce(new Error("Login failed"));
    
    // Mock form validation
    const validateFn = vi.fn().mockImplementation((callback) => {
      callback(true);
    });
    
    vm.$refs = {
      loginFormRef: {
        validate: validateFn
      }
    };
    
    await vm.handleLogin();
    
    expect(mockUserStore.getCaptcha).toHaveBeenCalled();
  });

  it("应该正确从Cookie获取保存的凭据", () => {
    // Mock cookie values
    (Cookies.get as any).mockImplementation((key: string) => {
      switch (key) {
        case "username": return "saved_user";
        case "password": return "encrypted_saved_pass";
        case "rememberMe": return "true";
        default: return undefined;
      }
    });
    
    mockUserStore.getCaptcha.mockResolvedValue({
      code: 200,
      msg: "操作成功",
      data: {
        img: "test_image_base64",
        uuid: "test_uuid"
      }
    });
    
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          "el-form": true,
          "el-form-item": true,
          "el-input": true,
          "el-button": true,
          "el-checkbox": true,
          "el-icon": true,
          "router-link": true,
        },
      },
    });
    
    const vm = wrapper.vm;
    expect(vm.loginForm.username).toBe("saved_user");
    expect(vm.loginForm.password).toBe("saved_pass"); // 解密后的值
    expect(vm.loginForm.rememberMe).toBe(true);
  });
});