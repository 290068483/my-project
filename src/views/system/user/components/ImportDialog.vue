<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="400px"
    append-to-body
    @close="handleClose">
    <el-upload
      ref="uploadRef"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      :auto-upload="false"
      drag>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="handleDownloadTemplate">
            下载模板
          </el-link>
        </div>
      </template>
    </el-upload>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFileForm"
          :loading="upload.isUploading">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { getToken } from "@/utils/auth";
import { importTemplate as importTemplateApi } from "@/api/system/user";
import type { ApiResponse } from "@/types/api";

// 定义组件属性
interface Props {
  modelValue: boolean;
}

// 定义事件
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<Emits>();

// 上传引用
const uploadRef = ref();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 标题
const title = ref("用户导入");

// 上传参数
const upload = reactive({
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: false,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData",
});

/**
 * 关闭对话框
 */
function handleClose() {
  dialogVisible.value = false;
  // 重置上传组件
  uploadRef.value?.clearFiles();
}

/**
 * 文件上传进度处理
 */
function handleFileUploadProgress() {
  upload.isUploading = true;
}

/**
 * 文件上传成功处理
 */
function handleFileSuccess(response: ApiResponse<any>) {
  upload.isUploading = false;
  uploadRef.value?.clearFiles();

  if (response.code === 200) {
    ElMessage.success(response.msg || "导入成功");
    handleClose();
    emit("success");
  } else {
    ElMessage.error(response.msg || "导入失败");
  }
}

/**
 * 文件上传失败处理
 */
function handleFileError(error: any) {
  upload.isUploading = false;
  ElMessage.error("上传失败");
  console.error("文件上传失败:", error);
}

/**
 * 提交文件表单
 */
function submitFileForm() {
  if (!uploadRef.value) {
    ElMessage.warning("请选择上传文件");
    return;
  }

  // 设置上传URL参数
  const updateSupport = upload.updateSupport ? 1 : 0;
  upload.url = import.meta.env.VITE_APP_BASE_API + "/system/user/importData?updateSupport=" + updateSupport;

  // 执行上传
  uploadRef.value.submit();
}

/**
 * 下载模板
 */
async function handleDownloadTemplate() {
  try {
    ElMessage.info("正在下载模板，请稍候...");
    const response = await importTemplateApi();
    
    if (response.code === 200) {
      // 创建下载链接
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "用户导入模板.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success("下载成功");
    } else {
      ElMessage.error(response.msg || "下载失败");
    }
  } catch (error) {
    console.error("下载模板失败:", error);
    ElMessage.error("下载失败");
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>