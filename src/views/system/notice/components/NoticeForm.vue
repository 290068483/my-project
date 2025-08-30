<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="800px"
    append-to-body
    :before-close="handleClose">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公告标题" prop="noticeTitle">
            <el-input v-model="formData.noticeTitle" placeholder="请输入公告标题" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="公告类型" prop="noticeType">
            <el-radio-group v-model="formData.noticeType">
              <el-radio label="1">通知</el-radio>
              <el-radio label="2">公告</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="内容" prop="noticeContent">
            <el-input 
              v-model="formData.noticeContent" 
              placeholder="请输入公告内容" 
              type="textarea" 
              :rows="6" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, defineEmits, defineProps } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 定义属性
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String as () => 'add' | 'edit',
    required: true
  },
  noticeData: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  noticeId: undefined,
  noticeTitle: '',
  noticeType: '1',
  status: '0',
  noticeContent: '',
  createBy: '',
  remark: ''
})

// 表单规则
const rules = reactive<FormRules>({
  noticeTitle: [
    { required: true, message: '公告标题不能为空', trigger: 'blur' }
  ],
  noticeType: [
    { required: true, message: '公告类型不能为空', trigger: 'blur' }
  ],
  noticeContent: [
    { required: true, message: '公告内容不能为空', trigger: 'blur' }
  ]
})

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听通知公告数据变化
watch(() => props.noticeData, (newVal) => {
  if (newVal) {
    Object.assign(formData, newVal)
  }
}, { immediate: true, deep: true })

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('success', formData)
      ElMessage.success(`${props.title}成功`)
      dialogVisible.value = false
    }
  })
}

// 取消操作
const cancel = () => {
  dialogVisible.value = false
  resetForm()
}

// 关闭对话框前的处理
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    noticeId: undefined,
    noticeTitle: '',
    noticeType: '1',
    status: '0',
    noticeContent: '',
    createBy: '',
    remark: ''
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>