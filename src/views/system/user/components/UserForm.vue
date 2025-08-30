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
          <el-form-item label="用户昵称" prop="nickName">
            <el-input
              v-model="formData.nickName"
              placeholder="请输入用户昵称"
              maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              :data="deptOptions"
              :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
              value-key="deptId"
              placeholder="请选择归属部门"
              clearable
              check-strictly />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="formData.phonenumber"
              placeholder="请输入手机号码"
              maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item v-if="!formData.userId" label="用户名称" prop="userName">
            <el-input
              v-model="formData.userName"
              placeholder="请输入用户名称"
              maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="!formData.userId" label="用户密码" prop="password">
            <el-input
              v-model="formData.password"
              placeholder="请输入用户密码"
              type="password"
              maxlength="20"
              show-password />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="formData.sex" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select
              v-model="formData.postIds"
              multiple
              placeholder="请选择">
              <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
                :disabled="item.status == 1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select
              v-model="formData.roleIds"
              multiple
              placeholder="请选择">
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
                :disabled="item.status == 1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入内容" />
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
import type { UserForm, DeptInfo, RoleInfo, PostInfo } from '@/types/system/user'

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
  userData: {
    type: Object as () => Partial<UserForm>,
    default: () => ({})
  },
  deptTree: {
    type: Array as () => DeptInfo[],
    default: () => []
  },
  roleList: {
    type: Array as () => RoleInfo[],
    default: () => []
  },
  postList: {
    type: Array as () => PostInfo[],
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<UserForm>({
  userId: undefined,
  userName: '',
  nickName: '',
  deptId: undefined,
  phonenumber: '',
  email: '',
  password: '',
  sex: '0',
  status: '0',
  postIds: [],
  roleIds: [],
  remark: ''
})

// 表单规则
const rules = reactive<FormRules>({
  userName: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' }
  ],
  deptId: [
    { required: true, message: '归属部门不能为空', trigger: 'change' }
  ],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phonenumber: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

// 性别选项
const sexOptions = [
  { value: '0', label: '男' },
  { value: '1', label: '女' },
  { value: '2', label: '未知' }
]

// 状态选项
const statusOptions = [
  { value: '0', label: '正常' },
  { value: '1', label: '停用' }
]

// 部门选项
const deptOptions = computed(() => props.deptTree)

// 角色选项
const roleOptions = computed(() => props.roleList)

// 岗位选项
const postOptions = computed(() => props.postList)

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听用户数据变化
watch(() => props.userData, (newVal) => {
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
    userId: undefined,
    userName: '',
    nickName: '',
    deptId: undefined,
    phonenumber: '',
    email: '',
    password: '',
    sex: '0',
    status: '0',
    postIds: [],
    roleIds: [],
    remark: ''
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
