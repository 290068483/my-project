<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <img :src="logo" alt="logo"> Form Generator
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div class="components-title">
            <component-icon style="width: 1em; height: 1em;" />输入型组件
          </div>
          <draggable 
            class="components-draggable" 
            :list="inputComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }" 
            :clone="cloneComponent"
            draggable=".components-item" 
            :sort="false" 
            @end="onEnd">
            <template #item="{ element, index }">
              <div :key="index" class="components-item" @click="addComponent(element)">
                <div class="components-body">
                  <component-icon style="width: 1em; height: 1em;" />
                  {{ element.label }}
                </div>
              </div>
            </template>
          </draggable>
          <div class="components-title">
            <component-icon style="width: 1em; height: 1em;" />选择型组件
          </div>
          <draggable 
            class="components-draggable" 
            :list="selectComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }" 
            :clone="cloneComponent"
            draggable=".components-item" 
            :sort="false" 
            @end="onEnd">
            <template #item="{ element, index }">
              <div :key="index" class="components-item" @click="addComponent(element)">
                <div class="components-body">
                  <component-icon style="width: 1em; height: 1em;" />
                  {{ element.label }}
                </div>
              </div>
            </template>
          </draggable>
          <div class="components-title">
            <component-icon style="width: 1em; height: 1em;" /> 布局型组件
          </div>
          <draggable 
            class="components-draggable" 
            :list="layoutComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }" 
            :clone="cloneComponent"
            draggable=".components-item" 
            :sort="false" 
            @end="onEnd">
            <template #item="{ element, index }">
              <div :key="index" class="components-item" @click="addComponent(element)">
                <div class="components-body">
                  <component-icon style="width: 1em; height: 1em;" />
                  {{ element.label }}
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </el-scrollbar>
    </div>
    <div class="center-board">
      <div class="action-bar">
        <el-button type="primary" @click="download">
          <download style="width: 1em; height: 1em;" /> 导出vue文件
        </el-button>
        <el-button type="primary" @click="copy">
          <document-copy style="width: 1em; height: 1em;" /> 复制代码
        </el-button>
        <el-button type="danger" @click="empty">
          <delete style="width: 1em; height: 1em;" /> 清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form 
            :size="formConf.size" 
            :label-position="formConf.labelPosition" 
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'">
            <draggable 
              class="drawing-board" 
              :list="drawingList" 
              :animation="340" 
              group="componentsGroup">
              <template #item="{ element, index }">
                <draggable-item 
                  :key="element.renderKey" 
                  :drawing-list="drawingList" 
                  :element="element" 
                  :index="index"
                  :active-id="activeId" 
                  :form-conf="formConf" 
                  @activeItem="activeFormItem" 
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete" />
              </template>
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>
    <right-panel 
      :active-data="activeData" 
      :form-conf="formConf" 
      :show-field="!!drawingList.length"
      @tag-change="tagChange" />

    <code-type-dialog 
      v-model="dialogVisible" 
      title="选择生成类型" 
      :showFileName="showFileName" 
      @confirm="generate" />
    <input id="copyNode" type="hidden">
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// @ts-expect-error vuedraggable没有提供类型定义
import draggable from 'vuedraggable'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  DocumentCopy,
  Delete
} from '@element-plus/icons-vue'

// 定义引用
const activeId = ref<string>('')
const dialogVisible = ref<boolean>(false)
const showFileName = ref<boolean>(false)
const logo = ref<string>('') // 添加logo变量

// 表单配置
const formConf = reactive({
  gutter: 15,
  size: 'default',
  labelPosition: 'right',
  disabled: false,
  labelWidth: 100
})

interface ComponentItem {
  label: string
  tag: string
  tagIcon: string
  placeholder: string
  defaultValue: unknown
  span: number
  labelWidth: number | null
  style: Record<string, unknown>
  clearable: boolean
  prepend?: string
  append?: string
  'show-word-limit'?: boolean
  'show-password'?: boolean
  readonly?: boolean
  disabled: boolean
  required: boolean
  regList: unknown[]
  changeTag: boolean
  proCondition: string
  asVal: string
  renderKey: number
  [key: string]: unknown
}

interface LayoutComponent {
  layout: string
  tagIcon: string
  type: string
  justify: string
  align: string
  label: string
  layoutTree: boolean
  children: unknown[]
  renderKey: number
  [key: string]: unknown
}

// 组件列表
const inputComponents = ref<ComponentItem[]>([
  {
    label: '单行文本',
    tag: 'el-input',
    tagIcon: 'input',
    placeholder: '请输入',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'show-word-limit': false,
    'show-password': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    proCondition: 'value',
    asVal: 'value',
    renderKey: Date.now() + Math.ceil(Math.random() * 1000)
  }
])

const selectComponents = ref<ComponentItem[]>([
  {
    label: '下拉选择',
    tag: 'el-select',
    tagIcon: 'select',
    placeholder: '请选择',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    required: true,
    filterable: false,
    multiple: false,
    options: [
      {
        label: '选项1',
        value: 1
      },
      {
        label: '选项2',
        value: 2
      }
    ],
    regList: [],
    changeTag: true,
    proCondition: 'value',
    asVal: 'value',
    renderKey: Date.now() + Math.ceil(Math.random() * 1000)
  }
])

const layoutComponents = ref<LayoutComponent[]>([
  {
    layout: 'rowFormItem',
    tagIcon: 'row',
    type: 'default',
    justify: 'start',
    align: 'top',
    label: '行容器',
    layoutTree: true,
    children: [],
    renderKey: Date.now() + Math.ceil(Math.random() * 1000)
  }
])

const drawingList = ref<(ComponentItem | LayoutComponent)[]>([])
const activeData = ref<Record<string, unknown>>({})

// 生命周期钩子
onMounted(() => {
  // 初始化操作
})

// 克隆组件
function cloneComponent(origin: ComponentItem | LayoutComponent): ComponentItem | LayoutComponent {
  const clone = JSON.parse(JSON.stringify(origin))
  clone.renderKey = Date.now() + Math.ceil(Math.random() * 1000)
  return clone
}

// 拖拽结束事件
function onEnd() {
  // 拖拽结束处理
}

// 添加组件
function addComponent(item: ComponentItem | LayoutComponent) {
  const clone = cloneComponent(item)
  drawingList.value.push(clone)
  activeFormItem(drawingList.value.length - 1)
}

// 激活表单项
function activeFormItem(index: number) {
  activeId.value = String(drawingList.value[index].renderKey)
  activeData.value = drawingList.value[index]
}

// 复制表单项
function drawingItemCopy(index: number) {
  const clone = cloneComponent(drawingList.value[index])
  drawingList.value.splice(index + 1, 0, clone)
  activeFormItem(index + 1)
}

// 删除表单项
function drawingItemDelete(index: number) {
  ElMessageBox.confirm('确定要删除该组件吗？', '提示', {
    type: 'warning'
  }).then(() => {
    drawingList.value.splice(index, 1)
    if (drawingList.value.length === 0) {
      activeData.value = {}
    } else {
      const nextIndex = index === 0 ? 0 : index - 1
      activeFormItem(nextIndex)
    }
  }).catch(() => {})
}

// 标签变更
function tagChange() {
  // 标签变更处理
}

// 下载代码
function download() {
  dialogVisible.value = true
  showFileName.value = true
}

// 复制代码
function copy() {
  dialogVisible.value = true
  showFileName.value = false
}

// 清空表单
function empty() {
  ElMessageBox.confirm('确定要清空所有组件吗？', '提示', {
    type: 'warning'
  }).then(() => {
    drawingList.value = []
    activeData.value = {}
  }).catch(() => {})
}

// 生成代码
function generate(_data: unknown) {
  // 生成代码处理
  ElMessage.success('代码生成成功')
}
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.left-board {
  position: absolute;
  left: 0;
  top: 0;
  width: 260px;
  height: 100%;
  background: #f0f2f5;
}

.logo-wrapper {
  position: relative;
  height: 42px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  position: absolute;
  left: 12px;
  top: 6px;
  line-height: 30px;
  color: #00afff;
  font-weight: 600;
  font-size: 17px;
  white-space: nowrap;
}

.logo > img {
  width: 30px;
  height: 30px;
  vertical-align: top;
}

.left-scrollbar {
  height: calc(100% - 42px);
}

.components-list {
  padding: 8px;
}

.components-title {
  font-size: 14px;
  color: #222;
  margin: 6px 2px;
  font-weight: 500;
}

.components-draggable {
  padding-bottom: 20px;
}

.components-item {
  display: inline-block;
  width: 48%;
  margin: 1%;
  transition: transform 0ms !important;
}

.components-body {
  padding: 8px 10px;
  background: #fff;
  font-size: 12px;
  cursor: move;
  border: 1px dashed #ccc;
  border-radius: 3px;
  text-align: center;
}

.components-body:hover {
  border: 1px dashed #00afff;
  color: #00afff;
}

.center-board {
  position: absolute;
  left: 260px;
  right: 300px;
  top: 0;
  height: 100%;
}

.action-bar {
  position: relative;
  height: 42px;
  text-align: right;
  padding: 0 15px;
  box-sizing: border-box;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  background: #fff;
}

.center-scrollbar {
  height: calc(100% - 42px);
  overflow: hidden;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  background: #fafafa;
}

.center-board-row {
  padding: 12px 12px 15px 12px;
  box-sizing: border-box;
}

.drawing-board {
  min-height: 400px;
  padding: 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.empty-info {
  position: absolute;
  top: 46%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  color: #ccb1ea;
  letter-spacing: 4px;
}
</style>