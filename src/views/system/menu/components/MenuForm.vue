<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="680px"
    append-to-body
    :before-close="handleClose">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <el-tree-select
              v-model="formData.parentId"
              :data="menuOptions"
              :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
              value-key="menuId"
              placeholder="选择上级菜单"
              check-strictly />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="formData.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="显示状态" prop="visible">
            <el-radio-group v-model="formData.visible">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="formData.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="formData.menuType !== 'F'" label="菜单图标">
            <el-popover
              placement="bottom-start"
              :width="540"
              trigger="click"
              @show="showSelectIcon = true"
              @hide="showSelectIcon = false">
              <template #reference>
                <el-input
                  v-model="formData.icon"
                  placeholder="点击选择图标"
                  readonly>
                  <template #prefix>
                    <el-icon v-if="formData.icon">
                      <component :is="formData.icon" />
                    </el-icon>
                  </template>
                </el-input>
              </template>
              <icon-select v-if="showSelectIcon" @selected="selected" />
            </el-popover>
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
      
      <el-row v-if="formData.menuType !== 'F'">
        <el-col :span="12">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="formData.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item v-if="formData.menuType === 'C'" label="组件路径" prop="component">
            <el-input v-model="formData.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row v-if="formData.menuType !== 'F'">
        <el-col :span="12">
          <el-form-item label="路由参数">
            <el-input v-model="formData.query" placeholder="请输入路由参数" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row v-if="formData.menuType === 'C'">
        <el-col :span="12">
          <el-form-item label="是否缓存">
            <el-radio-group v-model="formData.isCache">
              <el-radio label="0">缓存</el-radio>
              <el-radio label="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row v-if="formData.menuType === 'F'">
        <el-col :span="12">
          <el-form-item label="权限标识" prop="perms">
            <el-input v-model="formData.perms" placeholder="请输入权限标识" maxlength="100" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="菜单编号">
            <el-input v-model="formData.menuId" :disabled="true" />
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
import type { MenuForm } from '@/types/system/menu'
import IconSelect from '@/components/IconSelect/index.vue'

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
  menuData: {
    type: Object as () => Partial<MenuForm>,
    default: () => ({})
  },
  menuTree: {
    type: Array as () => MenuForm[],
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'success'])

// 表单引用
const formRef = ref<FormInstance>()

// 图标选择器显示状态
const showSelectIcon = ref(false)

// 表单数据
const formData = reactive<MenuForm>({
  menuId: undefined,
  parentId: 0,
  menuName: '',
  icon: '',
  menuType: 'M',
  orderNum: 0,
  isCache: '0',
  visible: '0',
  status: '0',
  perms: '',
  path: '',
  component: '',
  query: ''
})

// 表单规则
const rules = reactive<FormRules>({
  menuName: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' }
  ],
  orderNum: [
    { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '路由地址不能为空', trigger: 'blur' }
  ]
})

// 状态选项
const statusOptions = [
  { value: '0', label: '正常' },
  { value: '1', label: '停用' }
]

// 菜单选项
const menuOptions = computed(() => {
  const menuTree = [...props.menuTree]
  const menu = { menuId: 0, menuName: '主类目', children: menuTree } as MenuForm
  return [menu]
})

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 监听菜单数据变化
watch(() => props.menuData, (newVal) => {
  if (newVal) {
    Object.assign(formData, newVal)
  }
}, { immediate: true, deep: true })

// 选择图标
const selected = (name: string) => {
  formData.icon = name
}

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
    menuId: undefined,
    parentId: 0,
    menuName: '',
    icon: '',
    menuType: 'M',
    orderNum: 0,
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0',
    perms: '',
    path: '',
    component: '',
    query: ''
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>