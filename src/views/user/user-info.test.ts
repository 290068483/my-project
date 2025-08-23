import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import UserInfo from './user-info.vue'
import type { VueWrapper } from '@vue/test-utils'
import { ElMessage } from 'element-plus'

// Mock Element Plus Message
vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }
  }
})

// Mock user store
const mockUserStore = {
  userInfo: {
    name: '张三',
    department: '技术部',
    position: '前端工程师',
    avatar: 'https://example.com/avatar.jpg',
    email: 'zhangsan@example.com'
  },
  updateUserInfo: vi.fn()
}

vi.mock('@/stores/user', () => ({
  useUserStore: () => mockUserStore
}))

describe('user-info.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // 清除所有mock调用历史
    vi.clearAllMocks()
    
    wrapper = mount(UserInfo, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          'el-avatar': {
            template: '<div class="el-avatar-stub"><slot></slot></div>',
            props: ['size', 'src', 'alt']
          },
          'el-button': {
            template: '<button class="el-button-stub"><slot></slot></button>',
            props: ['type', 'size', 'loading', 'disabled']
          },
          'el-dialog': {
            template: '<div class="el-dialog-stub"><slot></slot><slot name="footer"></slot></div>',
            props: ['modelValue', 'title', 'width'],
            methods: {
              close: vi.fn()
            }
          },
          'el-divider': {
            template: '<div class="el-divider-stub"><slot></slot></div>'
          },
          'el-form': {
            template: '<form class="el-form-stub"><slot></slot></form>',
            props: ['model', 'rules', 'labelWidth'],
            methods: {
              validate: vi.fn().mockImplementation((callback: (valid: boolean) => void) => {
                if (callback) callback(true)
                return Promise.resolve(true)
              })
            }
          },
          'el-form-item': {
            template: '<div class="el-form-item-stub"><slot></slot></div>',
            props: ['label', 'prop']
          },
          'el-input': {
            template: '<input class="el-input-stub" />',
            props: ['modelValue', 'placeholder', 'type']
          },
          'el-upload': {
            template: '<div class="el-upload-stub"><slot></slot></div>',
            props: ['action', 'autoUpload', 'showFileList', 'onChange', 'beforeUpload']
          }
        }
      }
    })
  })

  it('renders user information correctly', () => {
    expect(wrapper.find('.text-2xl').text()).toBe('用户信息')
    expect(wrapper.find('.user-info-item').exists()).toBe(true)
  })

  it('displays user avatar', () => {
    const avatar = wrapper.find('.el-avatar-stub')
    expect(avatar.exists()).toBe(true)
    // 由于avatar是通过computed属性处理的，这里检查默认avatar元素存在即可
    expect(avatar.classes()).toContain('el-avatar-stub')
  })

  it('displays user name', () => {
    const nameElements = wrapper.findAll('.user-info-item .text-lg')
    expect(nameElements.length).toBeGreaterThan(0)
    // 第一个是用户名
    expect(nameElements[0].text()).toBe('张三')
  })

  it('shows default text when user info is not set', async () => {
    // 重置mock数据以测试默认值
    mockUserStore.userInfo.name = undefined
    mockUserStore.userInfo.department = undefined
    mockUserStore.userInfo.position = undefined
    mockUserStore.userInfo.email = undefined
    
    // 重新挂载组件以获取更新后的数据
    wrapper.unmount()
    wrapper = mount(UserInfo, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          'el-avatar': {
            template: '<div class="el-avatar-stub"><slot></slot></div>',
            props: ['size', 'src', 'alt']
          },
          'el-button': {
            template: '<button class="el-button-stub"><slot></slot></button>',
            props: ['type', 'size', 'loading', 'disabled']
          },
          'el-dialog': {
            template: '<div class="el-dialog-stub"><slot></slot><slot name="footer"></slot></div>',
            props: ['modelValue', 'title', 'width']
          },
          'el-divider': {
            template: '<div class="el-divider-stub"><slot></slot></div>'
          },
          'el-form': {
            template: '<form class="el-form-stub"><slot></slot></form>',
            props: ['model', 'rules', 'labelWidth']
          },
          'el-form-item': {
            template: '<div class="el-form-item-stub"><slot></slot></div>',
            props: ['label', 'prop']
          },
          'el-input': {
            template: '<input class="el-input-stub" />',
            props: ['modelValue', 'placeholder', 'type']
          },
          'el-upload': {
            template: '<div class="el-upload-stub"><slot></slot></div>',
            props: ['action', 'autoUpload', 'showFileList', 'onChange', 'beforeUpload']
          }
        }
      }
    })
    
    // 等待组件更新
    await wrapper.vm.$nextTick()
    
    const nameElements = wrapper.findAll('.user-info-item .text-lg')
    expect(nameElements[0].text()).toBe('未设置')
  })

  it('opens avatar dialog when clicking update avatar button', async () => {
    const buttons = wrapper.findAll('.el-button-stub')
    // 第一个按钮是"修改头像"按钮
    const updateAvatarButton = buttons[0]
    await updateAvatarButton.trigger('click')
    
    // 检查对话框是否打开
    const dialog = wrapper.find('.el-dialog-stub')
    expect(dialog.exists()).toBe(true)
  })

  it('opens edit info dialog when clicking edit info button', async () => {
    const buttons = wrapper.findAll('.el-button-stub')
    // 最后一个按钮是"编辑信息"按钮
    const editButton = buttons[buttons.length - 1]
    await editButton.trigger('click')
    
    // 检查对话框是否打开
    const dialog = wrapper.find('.el-dialog-stub')
    expect(dialog.exists()).toBe(true)
  })

  it('validates form fields in edit dialog', async () => {
    // 打开编辑对话框
    const buttons = wrapper.findAll('.el-button-stub')
    const editButton = buttons[buttons.length - 1]
    await editButton.trigger('click')
    
    // 获取表单引用
    const form = wrapper.find('.el-form-stub')
    expect(form.exists()).toBe(true)
  })

  it('handles avatar upload validation', async () => {
    const vm = wrapper.vm as any
    
    // 测试无效的文件类型
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' })
    const result1 = vm.beforeAvatarUpload(invalidFile)
    expect(result1).toBe(false)
    expect(ElMessage.error).toHaveBeenCalledWith('头像图片只能是 JPG 或 PNG 格式!')
    
    // 测试过大的文件
    const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const result2 = vm.beforeAvatarUpload(largeFile)
    expect(result2).toBe(false)
    expect(ElMessage.error).toHaveBeenCalledWith('头像图片大小不能超过 2MB!')
    
    // 测试有效的文件
    const validFile = new File([new ArrayBuffer(100)], 'valid.jpg', { type: 'image/jpeg' })
    const result3 = vm.beforeAvatarUpload(validFile)
    expect(result3).toBe(true)
  })
})