import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Element Plus Message
vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    ElMessage: vi.fn()
  }
})

// 全局配置测试环境
config.global.mocks = {
  $t: (tKey: string) => tKey
}

config.global.provide = {
  ...config.global.provide
}

// 配置全局组件解析
config.global.stubs = {
  teleport: true,
  transition: false,
  'el-input': true,
  'el-form': true,
  'el-form-item': true,
  'el-button': true,
  'el-card': true
}