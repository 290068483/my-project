import { config } from '@vue/test-utils'

// 模拟 Element Plus 组件
config.global.stubs = {
  'el-card': {
    template: '<div><slot></slot><slot name="header"></slot></div>'
  },
  'el-form': {
    template: '<form><slot></slot></form>',
    props: ['model', 'rules', 'labelWidth'],
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
  },
  'el-row': {
    template: '<div><slot></slot></div>',
    props: ['gutter']
  },
  'el-col': {
    template: '<div><slot></slot></div>',
    props: ['span']
  }
}