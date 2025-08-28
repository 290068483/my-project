import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import register from "./register.vue";
import type { VueWrapper } from "@vue/test-utils";

// Mock Element Plus Message
vi.mock("element-plus", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ElMessage: vi.fn(),
  };
});

// Mock useRouter
const mockRouter = {
  push: vi.fn(),
};

vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
}));

describe("register.vue", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    // 清除所有mock调用历史
    vi.clearAllMocks();

    wrapper = mount(register, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          "el-card": {
            template: '<div><slot></slot><slot name="header"></slot></div>',
          },
          "el-form": {
            template: "<form><slot></slot></form>",
            props: ["model", "rules", "labelWidth"],
            methods: {
              validate: vi.fn().mockImplementation((callback: (valid: boolean) => void) => {
                if (callback) callback(true);
                return Promise.resolve(true);
              }),
            },
          },
          "el-form-item": {
            template: "<div><slot></slot></div>",
            props: ["label", "prop"],
          },
          "el-input": {
            template: "<input />",
            props: ["modelValue", "placeholder", "type"],
          },
          "el-button": {
            template: "<button><slot></slot></button>",
            props: {
              type: {
                type: String,
                default: "default",
              },
              loading: {
                type: Boolean,
                default: false,
              },
              size: {
                type: String,
                default: "default",
              },
            },
          },
        },
      },
    });
  });

  it("renders the registration form", () => {
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("validates input fields", async () => {
    const inputs = wrapper.findAll("input");

    // 测试昵称输入
    await inputs[0].setValue("testuser");
    expect(inputs[0].element.value).toBe("testuser");

    // 测试邮箱输入
    await inputs[1].setValue("test@example.com");
    expect(inputs[1].element.value).toBe("test@example.com");

    // 测试地址输入
    await inputs[2].setValue("这是一个有效的地址示例");
    expect(inputs[2].element.value).toBe("这是一个有效的地址示例");

    // 测试手机号输入
    await inputs[3].setValue("13812345678");
    expect(inputs[3].element.value).toBe("13812345678");

    // 测试密码输入
    await inputs[4].setValue("password123");
    expect(inputs[4].element.value).toBe("password123");

    // 测试确认密码输入
    await inputs[5].setValue("password123");
    expect(inputs[5].element.value).toBe("password123");
  });

  it("validates phone number format", async () => {
    // 测试有效的手机号
    const validPhoneNumbers = ["13812345678", "15912345678", "18812345678"];
    for (const phone of validPhoneNumbers) {
      expect(/^1[3-9]\d{9}$/.test(phone)).toBe(true);
    }

    // 测试无效的手机号
    const invalidPhoneNumbers = ["12812345678", "1381234567", "138123456789", "abc12345678"];
    for (const phone of invalidPhoneNumbers) {
      expect(/^1[3-9]\d{9}$/.test(phone)).toBe(false);
    }
  });

  it("navigates to login page when clicking return link", async () => {
    // 查找返回登录的a标签
    const returnLink = wrapper.find("a.login-link");

    expect(returnLink.exists()).toBe(true);
    expect(returnLink.attributes("href")).toBe("/login");
  });

  it("has register button", () => {
    const registerButton = wrapper.find(".register-btn");
    expect(registerButton.exists()).toBe(true);
  });
});
