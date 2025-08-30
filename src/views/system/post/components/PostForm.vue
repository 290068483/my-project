<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    :before-close="handleClose">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input v-model="formData.postCode" placeholder="请输入岗位编码" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="postName">
            <el-input v-model="formData.postName" placeholder="请输入岗位名称" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="postSort">
            <el-input-number v-model="formData.postSort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="岗位状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容" />
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
import type { PostForm } from '@/types/system/post'

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
  postData: {
    type: Object as () => Partial<PostForm>,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<PostForm>({
  postId: undefined,
  postCode: '',
  postName: '',
  postSort: 0,
  status: '0',
  remark: ''
})

// 表单规则
const rules = reactive<FormRules>({
  postCode: [
    { required: true, message: '岗位编码不能为空', trigger: 'blur' }
  ],
  postName: [
    { required: true, message: '岗位名称不能为空', trigger: 'blur' }
  ],
  postSort: [
    { required: true, message: '岗位顺序不能为空', trigger: 'blur' }
  ]
})

// 状态选项
const statusOptions = [
  { value: '0', label: '正常' },
  { value: '1', label: '停用' }
]

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听岗位数据变化
watch(() => props.postData, (newVal) => {
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
    postId: undefined,
    postCode: '',
    postName: '',
    postSort: 0,
    status: '0',
    remark: ''
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>