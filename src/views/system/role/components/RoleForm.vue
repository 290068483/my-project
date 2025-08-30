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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="权限字符" prop="roleKey">
            <el-input v-model="formData.roleKey" placeholder="请输入权限字符" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input-number v-model="formData.roleSort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="状态">
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
        <el-col :span="12">
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree
              ref="menuTreeRef"
              class="tree-border"
              :data="menuOptions"
              :props="{ label: 'label', children: 'children' }"
              :check-strictly="!form.menuCheckStrictly"
              node-key="id"
              :default-checked-keys="menuCheckedKeys"
              show-checkbox
              highlight-current />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="部门权限">
            <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
            <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
            <el-tree
              ref="deptTreeRef"
              class="tree-border"
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :check-strictly="!form.deptCheckStrictly"
              node-key="id"
              :default-checked-keys="deptCheckedKeys"
              show-checkbox
              highlight-current />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注">
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
import { ref, reactive, computed, watch, defineEmits, defineProps, nextTick } from 'vue'
import { ElMessage, ElForm, ElTree } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { RoleForm } from '@/types/system/role'

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
  roleData: {
    type: Object as () => Partial<RoleForm>,
    default: () => ({})
  },
  menuTree: {
    type: Array as () => any[],
    default: () => []
  },
  deptTree: {
    type: Array as () => any[],
    default: () => []
  },
  menuCheckedKeys: {
    type: Array as () => number[],
    default: () => []
  },
  deptCheckedKeys: {
    type: Array as () => number[],
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const deptTreeRef = ref<InstanceType<typeof ElTree>>()

// 表单数据
const formData = reactive<RoleForm>({
  roleId: undefined,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  menuIds: [],
  deptIds: [],
  menuCheckStrictly: true,
  deptCheckStrictly: true,
  remark: ''
})

// 菜单展开状态
const menuExpand = ref(false)

// 菜单全选状态
const menuNodeAll = ref(false)

// 部门展开状态
const deptExpand = ref(false)

// 部门全选状态
const deptNodeAll = ref(false)

// 表单规则
const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ],
  roleKey: [
    { required: true, message: '权限字符不能为空', trigger: 'blur' }
  ],
  roleSort: [
    { required: true, message: '角色顺序不能为空', trigger: 'blur' }
  ]
})

// 状态选项
const statusOptions = [
  { value: '0', label: '正常' },
  { value: '1', label: '停用' }
]

// 菜单选项
const menuOptions = computed(() => props.menuTree)

// 部门选项
const deptOptions = computed(() => props.deptTree)

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听角色数据变化
watch(() => props.roleData, (newVal) => {
  if (newVal) {
    Object.assign(formData, newVal)
  }
}, { immediate: true, deep: true })

// 树节点展开/折叠
const handleCheckedTreeExpand = (value: boolean, type: string) => {
  if (type === 'menu') {
    const treeList = menuOptions.value
    for (let i = 0; i < treeList.length; i++) {
      menuTreeRef.value?.setChecked(treeList[i].id, value, true)
    }
  } else if (type === 'dept') {
    const treeList = deptOptions.value
    for (let i = 0; i < treeList.length; i++) {
      deptTreeRef.value?.setChecked(treeList[i].id, value, true)
    }
  }
}

// 树节点全选/全不选
const handleCheckedTreeNodeAll = (value: boolean, type: string) => {
  if (type === 'menu') {
    menuTreeRef.value?.setCheckedNodes(value ? menuOptions.value : [])
  } else if (type === 'dept') {
    deptTreeRef.value?.setCheckedNodes(value ? deptOptions.value : [])
  }
}

// 树节点父子联动
const handleCheckedTreeConnect = (value: boolean, type: string) => {
  if (type === 'menu') {
    nextTick(() => {
      const treeList = menuOptions.value
      for (let i = 0; i < treeList.length; i++) {
        menuTreeRef.value?.setChecked(treeList[i].id, false, true)
      }
      for (let i = 0; i < props.menuCheckedKeys.length; i++) {
        menuTreeRef.value?.setChecked(props.menuCheckedKeys[i], true, true)
      }
    })
  } else if (type === 'dept') {
    nextTick(() => {
      const treeList = deptOptions.value
      for (let i = 0; i < treeList.length; i++) {
        deptTreeRef.value?.setChecked(treeList[i].id, false, true)
      }
      for (let i = 0; i < props.deptCheckedKeys.length; i++) {
        deptTreeRef.value?.setChecked(props.deptCheckedKeys[i], true, true)
      }
    })
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 获取选中的菜单和部门
      const menuIds = menuTreeRef.value?.getCheckedKeys(true) as number[] || []
      const deptIds = deptTreeRef.value?.getCheckedKeys(true) as number[] || []
      
      const data = {
        ...formData,
        menuIds,
        deptIds
      }
      
      emit('success', data)
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
    roleId: undefined,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0',
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: ''
  })
  
  // 重置树状态
  menuExpand.value = false
  menuNodeAll.value = false
  deptExpand.value = false
  deptNodeAll.value = false
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.tree-border {
  margin-top: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}
</style>