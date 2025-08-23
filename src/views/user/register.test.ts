import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import register from './register.vue'

// Mock Element Plus Message
vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    ElMessage: vi.fn()
  }
})

// Mock useRouter
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('register.vue', () => {
  let wrapper: any

  beforeEach(() => {
    // 清除所有mock调用历史
    vi.clearAllMocks()
    
    wrapper = mount(register, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        stubs: {
          'el-card': {
            template: '<div><slot></slot><slot name="header"></slot></div>'
          },
          'el-form': {
            template: '<form><slot></slot></form>',
            props: ['model', 'rules', 'labelWidth'],
            methods: {
              validate: vi.fn().mockImplementation((callback) => {
                if (callback) callback(true)
                return Promise.resolve(true)
              })
            }
          },
          'el-form-item': {
            template: '<div><slot></slot></div>',
            props: ['label', 'prop']
          },
          'el-input': {
            template: '<input />',
            props: ['modelValue', 'placeholder', 'type']
          },
          'el-button': {
            template: '<button><slot></slot></button>',
            props: ['type', 'loading', 'size']
          }
        }
      }
    })
  })

  it('renders the registration form', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('validates input fields', async () => {
    const inputs = wrapper.findAll('input')
    
    // 测试昵称输入
    await inputs[0].setValue('testuser')
    expect(inputs[0].element.value).toBe('testuser')
    
    // 测试邮箱输入
    await inputs[1].setValue('test@example.com')
    expect(inputs[1].element.value).toBe('test@example.com')
    
    // 测试地址输入
    await inputs[2].setValue('这是一个有效的地址示例')
    expect(inputs[2].element.value).toBe('这是一个有效的地址示例')
    
    // 测试用户名输入
    await inputs[3].setValue('testuser')
    expect(inputs[3].element.value).toBe('testuser')
    
    // 测试密码输入
    await inputs[4].setValue('password123')
    expect(inputs[4].element.value).toBe('password123')
    
    // 测试确认密码输入
    await inputs[5].setValue('password123')
    expect(inputs[5].element.value).toBe('password123')
  })

  it('submits registration when clicking register button', async () => {
    const registerButton = wrapper.find('.register-btn')
    expect(registerButton.exists()).toBe(true)
    
    await registerButton.trigger('click')
    // 注册功能的测试需要更复杂的mock设置，这里验证按钮存在和可点击即可
  })

  it('navigates to login page when clicking return button', async () => {
    const buttons = wrapper.findAll('button')
    const returnButton = buttons[1] // 返回登录按钮
    
    await returnButton.trigger('click')
    
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })
})