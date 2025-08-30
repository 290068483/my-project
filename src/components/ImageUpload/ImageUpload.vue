<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      :disabled="disabled"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :data="data"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :before-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预览"
      width="800px"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
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
  // 图片数量限制
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
    default: () => ["png", "jpg", "jpeg"]
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 禁用组件（仅查看图片）
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const userStore = useUserStore()
const uploadList = ref<UploadFile[]>([])
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + props.action)
const headers = ref({ Authorization: "Bearer " + userStore.token })
const fileList = ref<UploadFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
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
      tempUrl = (val as Record<string, unknown>).toString()
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
function handleUploadError(err: Error) {
  ElMessage.error('上传失败')
  console.error('上传失败:', err)
}

// 上传成功
function handleUploadSuccess(res: { code: number; fileName: string; msg: string }, file: UploadFile) {
  uploadList.value.push(file)
  if (res.code === 200) {
    fileList.value.push({ name: res.fileName, url: res.fileName, uid: file.uid } as UploadFile)
    updateModelValue()
    emit('change', fileList.value)
  } else {
    ElMessage.error(res.msg)
    // 由于handleDelete需要两个参数，这里我们直接从fileList中移除最后一项
    if (fileList.value.length > 0) {
      fileList.value.splice(fileList.value.length - 1, 1)
    }
  }
}

// 删除文件
function handleDelete(uploadFile: UploadFile) {
  const index = fileList.value.findIndex(item => item.uid === uploadFile.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    updateModelValue()
    emit('change', fileList.value)
  }
  return false
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

// 预览图片
function handlePictureCardPreview(file: UploadFile) {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}

.hide .el-upload--picture-card {
  display: none;
}
</style>