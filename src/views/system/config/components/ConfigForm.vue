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
          <el-form-item label="参数名称" prop="configName">
            <el-input v-model="formData.configName" placeholder="请输入参数名称" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="参数键名" prop="configKey">
            <el-input v-model="formData.configKey" placeholder="请输入参数键名" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="参数键值" prop="configValue">
            <el-input v-model="formData.configValue" placeholder="请输入参数键值" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="系统内置" prop="configType">
            <el-radio-group v-model="formData.configType">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
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
import type { ConfigForm } from '@/types/system/config'

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
  configData: {
    type: Object as () => Partial<ConfigForm>,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<ConfigForm>({
  configId: undefined,
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'Y',
  remark: ''
})

// 表单规则
const rules = reactive<FormRules>({
  configName: [
    { required: true, message: '参数名称不能为空', trigger: 'blur' }
  ],
  configKey: [
    { required: true, message: '参数键名不能为空', trigger: 'blur' }
  ],
  configValue: [
    { required: true, message: '参数键值不能为空', trigger: 'blur' }
  ]
})

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听参数数据变化
watch(() => props.configData, (newVal) => {
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
    configId: undefined,
    configName: '',
    configKey: '',
    configValue: '',
    configType: 'Y',
    remark: ''
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>