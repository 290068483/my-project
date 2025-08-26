import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import Userinfo from "./UserInfo.vue";
import type { VueWrapper } from "@vue/test-utils";
import { ElMessage } from "element-plus";
import type { ComponentPublicInstance } from "vue";

// Mock Element Plus Message
vi.mock("element-plus", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

// Mock user store
const mockUserStore = {
  getUserInfo: {
    name: "张三",
    department: "技术部",
    position: "前端工程师",
    avatar: "https://example.com/avatar.jpg",
    email: "zhangsan@example.com",
  },
  getUserName: "张三",
  getUserDepartment: "技术部",
  getUserPosition: "前端工程师",
  getUserAvatar: "https://example.com/avatar.jpg",
  getUserEmail: "zhangsan@example.com",
  updateUserInfo: vi.fn(),
  updateUserAvatar: vi.fn(),
  initUserInfo: vi.fn(),
};

vi.mock("@/stores/user", () => ({
  useUserStore: () => mockUserStore,
}));

describe("Userinfo.vue", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    // 清除所有mock调用历史
    vi.clearAllMocks();

    wrapper = mount(Userinfo, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          "el-avatar": {
            template: '<div class="el-avatar-stub"><slot></slot></div>',
            props: ["size", "src", "alt"],
          },
          "el-button": {
            template: '<button class="el-button-stub"><slot></slot></button>',
            props: ["type", "loading", "disabled"],
          },
          "el-dialog": {
            template: '<div class="el-dialog-stub"><slot></slot><slot name="footer"></slot></div>',
            props: ["modelValue", "title", "width"],
            methods: {
              close: vi.fn(),
            },
          },
          "el-divider": {
            template: '<div class="el-divider-stub"></div>',
          },
          "el-form": {
            template: '<form class="el-form-stub"><slot></slot></form>',
            props: ["model", "rules", "labelWidth", "ref"],
            methods: {
              validate: vi.fn().mockImplementation(() => Promise.resolve(true)),
            },
          },
          "el-form-item": {
            template: '<div class="el-form-item-stub"><slot></slot></div>',
            props: ["label", "prop"],
          },
          "el-input": {
            template: '<input class="el-input-stub" />',
            props: ["modelValue", "placeholder", "type", "disabled"],
          },
          "el-upload": {
            template: '<div class="el-upload-stub"><slot></slot></div>',
            props: ["action", "autoUpload", "showFileList", "onChange", "beforeUpload"],
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders user information correctly", () => {
    expect(wrapper.find(".text-2xl").text()).toBe("用户信息");
    expect(wrapper.find(".bg-gray-50").exists()).toBe(true);
    expect(wrapper.find(".user-info-item").exists()).toBe(true);
  });

  it("displays user avatar", () => {
    const avatar = wrapper.find(".el-avatar-stub");
    expect(avatar.exists()).toBe(true);
    expect(avatar.classes()).toContain("el-avatar-stub");
  });

  it("displays user name, position, department and email", () => {
    const infoItems = wrapper.findAll(".user-info-item");
    expect(infoItems.length).toBe(4);
    
    // 用户名
    expect(infoItems[0].find(".text-lg").text()).toBe("张三");
    // 职位
    expect(infoItems[1].find(".text-lg").text()).toBe("前端工程师");
    // 部门
    expect(infoItems[2].find(".text-lg").text()).toBe("技术部");
    // 邮箱
    expect(infoItems[3].find(".text-lg").text()).toBe("zhangsan@example.com");
  });

  it("opens avatar dialog when clicking update avatar button", async () => {
    const buttons = wrapper.findAll(".el-button-stub");
    const updateAvatarButton = buttons[1]; // 修改头像按钮
    await updateAvatarButton.trigger("click");
    
    // 由于avatarDialogVisible是私有属性，我们通过检查DOM来验证对话框是否打开
    expect(wrapper.find(".el-dialog-stub").exists()).toBe(true);
  });

  it("toggles edit mode when clicking edit/cancel buttons", async () => {
    // 初始状态下应该有"编辑"按钮 (在右侧面板中)
    const editButton = wrapper.find(".el-button-stub[type='primary']");
    expect(editButton.exists()).toBe(true);
    expect(editButton.text()).toBe("编辑");
    
    // 点击编辑按钮
    await editButton.trigger("click");
    
    // 等待DOM更新
    await wrapper.vm.$nextTick();
    
    // 现在应该有"取消"和"保存"按钮
    const cancelButton = wrapper.find(".el-button-stub");
    const saveButton = wrapper.find(".el-button-stub[type='primary']");
    expect(cancelButton.exists()).toBe(true);
    expect(saveButton.exists()).toBe(true);
    expect(cancelButton.text()).toBe("取消");
    expect(saveButton.text()).toBe("保存");
    
    // 点击取消按钮
    await cancelButton.trigger("click");
    // 等待DOM更新
    await wrapper.vm.$nextTick();
    // 应该回到初始状态，只有"编辑"按钮
    const editButtonAfterCancel = wrapper.find(".el-button-stub[type='primary']");
    expect(editButtonAfterCancel.exists()).toBe(true);
    expect(editButtonAfterCancel.text()).toBe("编辑");
  });

  it("validates form fields when saving user info", async () => {
    // 点击编辑按钮进入编辑模式
    const editButton = wrapper.find(".el-button-stub[type='primary']");
    await editButton.trigger("click");
    
    // 等待DOM更新
    await wrapper.vm.$nextTick();
    
    // 现在应该有保存按钮
    const saveButton = wrapper.find(".el-button-stub[type='primary']");
    
    // 点击保存按钮
    await saveButton.trigger("click");
    
    // 验证表单验证方法被调用
    const form = wrapper.findComponent({ name: "ElForm" });
    expect(form.vm.validate).toHaveBeenCalled();
  });

  it("handles avatar upload validation", async () => {
    const vm = wrapper.vm as ComponentPublicInstance & { 
      beforeAvatarUpload: (file: File) => boolean 
    };
    
    // 测试无效的文件类型
    const invalidFile = new File([""], "test.txt", { type: "text/plain" });
    const result1 = vm.beforeAvatarUpload(invalidFile);
    expect(result1).toBe(false);
    expect(ElMessage.error).toHaveBeenCalledWith("头像图片只能是 JPG 或 PNG 格式!");
    
    // 测试过大的文件
    const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
    const result2 = vm.beforeAvatarUpload(largeFile);
    expect(result2).toBe(false);
    expect(ElMessage.error).toHaveBeenCalledWith("头像图片大小不能超过 2MB!");
    
    // 测试有效的文件
    const validFile = new File([new ArrayBuffer(100)], "valid.jpg", { type: "image/jpeg" });
    const result3 = vm.beforeAvatarUpload(validFile);
    expect(result3).toBe(true);
  });

  it("updates user info when form is valid", async () => {
    // 点击编辑按钮进入编辑模式
    const editButton = wrapper.find(".el-button-stub[type='primary']");
    await editButton.trigger("click");
    
    // 等待DOM更新
    await wrapper.vm.$nextTick();
    
    // 现在应该有保存按钮
    const saveButton = wrapper.find(".el-button-stub[type='primary']");
    
    // 点击保存按钮
    await saveButton.trigger("click");
    
    // 验证更新用户信息的方法被调用
    expect(mockUserStore.updateUserInfo).toHaveBeenCalled();
    expect(ElMessage.success).toHaveBeenCalledWith("用户信息更新成功");
  });

  it("updates user avatar when confirmed", async () => {
    // 打开头像对话框
    const buttons = wrapper.findAll(".el-button-stub");
    const updateAvatarButton = buttons[1]; // 修改头像按钮
    await updateAvatarButton.trigger("click");
    
    // 等待DOM更新
    await wrapper.vm.$nextTick();
    
    // 设置临时头像URL
    const vm = wrapper.vm as ComponentPublicInstance & { 
      tempAvatar: string
    };
    vm.tempAvatar = "https://example.com/new-avatar.jpg";
    
    // 确认修改按钮应该存在
    const confirmButton = wrapper.find(".el-button-stub[type='primary']");
    
    // 点击确认修改按钮
    await confirmButton.trigger("click");
    
    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 验证更新用户头像的方法被调用
    expect(mockUserStore.updateUserAvatar).toHaveBeenCalledWith("https://example.com/new-avatar.jpg");
    expect(ElMessage.success).toHaveBeenCalledWith("头像更新成功");
  });
});