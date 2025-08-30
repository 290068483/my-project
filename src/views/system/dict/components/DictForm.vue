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
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="字典类型" prop="dictType">
            <el-input v-model="formData.dictType" placeholder="请输入字典类型" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="0">正常</el-radio>
              <el-radio label="1">停用</el-radio>
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
import type { DictType } from '@/types/system/dict'

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
  dictData: {
    type: Object as () => Partial<DictType>,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<DictType>({
  dictId: undefined,
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
})

// 表单规则
const rules = reactive<FormRules>({
  dictName: [
    { required: true, message: '字典名称不能为空', trigger: 'blur' }
  ],
  dictType: [
    { required: true, message: '字典类型不能为空', trigger: 'blur' }
  ]
})

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听字典数据变化
watch(() => props.dictData, (newVal) => {
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
    dictId: undefined,
    dictName: '',
    dictType: '',
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