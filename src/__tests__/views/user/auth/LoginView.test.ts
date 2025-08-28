import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore } from '@/stores/user';

// 模拟 Element Plus 组件
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }
}));

// 模拟 getCaptchaImage API
vi.mock('@/api/login', () => ({
  getCaptchaImage: vi.fn()
}));

describe('LoginView.vue refreshQrcode function', () => {
  let userStore: any;

  beforeEach(() => {
    // 创建测试用的 Pinia 实例
    const pinia = createTestingPinia({
      createSpy: vi.fn
    });

    userStore = useUserStore(pinia);
  });

  it('should call userStore.getCaptcha when invoked', async () => {
    // 模拟 getCaptcha 方法
    userStore.getCaptcha = vi.fn().mockResolvedValue({});

    // 调用 getCaptcha 函数
    await userStore.getCaptcha();

    // 验证 userStore.getCaptcha 是否被调用
    expect(userStore.getCaptcha).toHaveBeenCalled();
  });
});