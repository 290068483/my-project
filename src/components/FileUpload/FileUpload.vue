<template>
  <div class="upload-file">
    <el-upload
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :data="data"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
      v-if="!disabled"
    >
      <!-- 上传按钮 -->
      <el-button type="primary">选取文件</el-button>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger" v-if="!disabled">&nbsp;删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import type { UploadFile, UploadRawFile } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: ''
  },
  // 上传接口地址
  action: {
    type: String,
    default: "/common/upload"
  },
  // 上传携带的参数
  data: {
    type: Object,
    default: () => ({})
  },
  // 数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array as () => string[],
    default: () => ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf"]
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 禁用组件（仅查看文件）
  disabled: {
    type: Boolean,
    default: false
  }
})

const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['update:modelValue', 'change'])
const number = ref(0)
const uploadList = ref<UploadFile[]>([])
const baseUrl = import.meta.env.VITE_APP_BASE_API
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action) // 上传文件服务器地址
const headers = ref({ Authorization: "Bearer " + getToken() })
const fileList = ref<UploadFile[]>([])
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
)

watch(() => props.modelValue, (val) => {
  if (val) {
    let tempUrl = ''
    if (typeof val === 'string') {
      tempUrl = val
    } else if (Array.isArray(val)) {
      tempUrl = val.join(',')
    } else {
      tempUrl = val as string
    }
    
    // 首先清空 fileList
    fileList.value = []
    
    // 然后添加文件
    tempUrl.split(',').forEach((url, index) => {
      if (url) {
        fileList.value.push({ 
          name: getFileName(url), 
          url: url,
          uid: index
        } as UploadFile)
      }
    })
  }
}, { immediate: true })

// 上传前校验
function handleBeforeUpload(file: UploadRawFile) {
  let isImg = false
  let isLt = false
  
  if (props.fileType && props.fileType.length > 0) {
    let fileExtension = ""
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1)
    }
    isImg = props.fileType.some(type => {
      if (file.type.indexOf(type) > -1) return true
      return fileExtension && fileExtension.indexOf(type) > -1
    })
  } else {
    isImg = true
  }
  
  if (!isImg) {
    ElMessage.error(`文件格式不正确, 请上传${props.fileType.join("/")}格式文件!`)
    return false
  }
  
  if (props.fileSize) {
    isLt = file.size / 1024 / 1024 < props.fileSize
  }
  
  if (!isLt) {
    ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
    return false
  }
  
  return true
}

// 文件个数超出
function handleExceed() {
  ElMessage.warning(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败
function handleUploadError(err: any) {
  ElMessage.error('上传失败')
  console.error('上传失败:', err)
}

// 上传成功
function handleUploadSuccess(res: any, file: UploadFile) {
  uploadList.value.push(file)
  if (res.code === 200) {
    fileList.value.push({ name: res.fileName, url: res.fileName, uid: file.uid } as UploadFile)
    updateModelValue()
    emit('change', fileList.value)
  } else {
    ElMessage.error(res.msg)
    handleDelete(fileList.value.length - 1)
  }
}

// 删除文件
function handleDelete(index: number) {
  fileList.value.splice(index, 1)
  updateModelValue()
  emit('change', fileList.value)
}

// 更新modelValue
function updateModelValue() {
  const values = fileList.value.map(item => item.url).filter(url => url) as string[]
  if (props.limit === 1) {
    emit('update:modelValue', values.join(''))
  } else {
    emit('update:modelValue', values)
  }
}

// 获取文件名
function getFileName(name: string) {
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1)
  } else {
    return name
  }
}
</script>

<style scoped>
.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .ele-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>