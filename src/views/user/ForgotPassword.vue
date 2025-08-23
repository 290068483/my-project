<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <div class="card-header">
        <h2>忘记密码</h2>
        <p>请输入您的邮箱地址，我们将发送重置密码的链接</p>
      </div>
      
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        class="forgot-password-form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱地址"
            type="email"
            size="large"
            prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="submit-btn"
            :loading="loading"
            @click="handleSubmit"
            native-type="submit"
          >
            发送重置链接
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="form-footer">
        <el-button type="info" link @click="goToLogin">
          返回登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElButton, ElInput, ElForm, ElFormItem } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const form = reactive({
  email: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
})

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟发送重置密码邮件
        // 实际项目中这里应该调用后端API发送重置密码邮件
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        ElMessage.success('重置密码链接已发送至您的邮箱，请注意查收')
        // 可以跳转到提示页面或者返回登录页
        router.push('/login')
      } catch (error) {
        console.error('发送重置密码邮件失败:', error)
        ElMessage.error('发送失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 返回登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px 30px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.card-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.card-header p {
  font-size: 14px;
  color: #666;
}

.forgot-password-form {
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: bold;
}

.form-footer {
  text-align: center;
}
</style>