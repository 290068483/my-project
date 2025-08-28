<template>
  <div class="reset-password-container">
    <el-card class="reset-password-card">
      <template #header>
        <div class="card-header">
          <span>重置密码</span>
        </div>
      </template>
      
      <el-form
        :model="resetForm"
        :rules="resetRules"
        ref="resetFormRef"
        label-width="80px"
        class="reset-password-form">
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="resetForm.newPassword" 
            type="password" 
            placeholder="请输入新密码"
            show-password />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="resetForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入新密码"
            show-password />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleResetPassword"
            :loading="loading"
            class="reset-button">
            重置密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElForm, ElInput, ElButton, ElCard } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 类型定义
interface ResetForm {
  newPassword: string
  confirmPassword: string
}

// 组件引用
const resetFormRef = ref<FormInstance>()

// 路由和状态管理
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单数据
const resetForm = reactive<ResetForm>({
  newPassword: '',
  confirmPassword: ''
})

// 验证规则
const resetRules = reactive<FormRules>({
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6到20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== resetForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 加载状态
const loading = ref(false)

// 重置密码处理函数
const handleResetPassword = async () => {
  if (!resetFormRef.value) return
  
  await resetFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 获取重置令牌
        const token = route.query.token as string
        
        if (!token) {
          ElMessage.error('重置令牌无效')
          return
        }
        
        // 调用重置密码接口
        const result = await userStore.resetPassword(token, resetForm.newPassword)
        
        if (result.success) {
          ElMessage.success('密码重置成功，请使用新密码登录')
          // 跳转到登录页
          router.push('/login')
        } else {
          ElMessage.error(result.message || '密码重置失败')
        }
      } catch (error) {
        ElMessage.error('密码重置失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.reset-password-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.reset-password-form {
  margin-top: 20px;
}

.reset-button {
  width: 100%;
}
</style>