<template>
  <el-dialog v-model="dialogVisible" title="用户导入" width="600px" :close-on-click-modal="false">
    <div class="import-content">
      <!-- 导入说明 -->
      <el-alert title="导入说明" type="info" :closable="false" class="import-tips">
        <template #default>
          <ol>
            <li>导入的用户数据将直接添加到系统中，请确保数据的准确性</li>
            <li>支持 .xlsx、.xls 格式的Excel文件</li>
            <li>文件大小不能超过 10MB</li>
            <li>建议先下载模板，按照模板格式填写数据</li>
            <li>如果用户已存在，可以选择是否更新数据</li>
          </ol>
        </template>
      </el-alert>

      <!-- 文件上传 -->
      <div class="upload-section">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传 xlsx/xls 文件，且不超过 10MB</div>
          </template>
        </el-upload>
      </div>

      <!-- 导入选项 -->
      <div class="import-options">
        <el-checkbox v-model="updateSupport"> 是否更新已经存在的用户数据 </el-checkbox>
      </div>

      <!-- 导入进度 -->
      <div v-if="importing" class="import-progress">
        <el-progress :percentage="importProgress" :status="importStatus" :stroke-width="8" />
        <p class="progress-text">{{ importProgressText }}</p>
      </div>

      <!-- 导入结果 -->
      <div v-if="importResult" class="import-result">
        <el-alert :title="importResult.title" :type="importResult.type" :closable="false">
          <template #default>
            <div v-if="importResult.details">
              <p>{{ importResult.message }}</p>
              <ul v-if="importResult.details.length > 0">
                <li v-for="(detail, index) in importResult.details" :key="index">
                  {{ detail }}
                </li>
              </ul>
            </div>
          </template>
        </el-alert>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleDownloadTemplate">
          <el-icon><Download /></el-icon>
          下载模板
        </el-button>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="importing" :disabled="!selectedFile" @click="handleSubmit">
          {{ importing ? "导入中..." : "确认导入" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { UploadFilled, Download } from "@element-plus/icons-vue";
import type { UploadInstance, UploadFile } from "element-plus";
import { importUser, importTemplate } from "@/api/system/user";
import type { UserImportResponse } from "@/types/system/user";

// Props
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

// Emits
interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const emit = defineEmits<Emits>();

// 上传组件引用
const uploadRef = ref<UploadInstance>();

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 文件相关
const fileList = ref<UploadFile[]>([]);
const selectedFile = ref<File | null>(null);

// 导入选项
const updateSupport = ref(false);

// 导入进度
const importing = ref(false);
const importProgress = ref(0);
const importStatus = ref<"success" | "exception" | undefined>(undefined);
const importProgressText = ref("");

// 导入结果
const importResult = ref<{
  title: string;
  type: "success" | "warning" | "error";
  message: string;
  details?: string[];
} | null>(null);

/**
 * 文件变化处理
 */
function handleFileChange(file: UploadFile) {
  // 检查文件类型
  const isExcel = /\.(xlsx|xls)$/i.test(file.name || "");
  if (!isExcel) {
    ElMessage.error("只能上传 Excel 格式的文件!");
    uploadRef.value?.clearFiles();
    selectedFile.value = null;
    return;
  }

  // 检查文件大小（10MB）
  const isLt10M = (file.size || 0) / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("上传文件大小不能超过 10MB!");
    uploadRef.value?.clearFiles();
    selectedFile.value = null;
    return;
  }

  selectedFile.value = file.raw || null;
  fileList.value = [file];

  // 清空之前的结果
  importResult.value = null;
}

/**
 * 文件数量超出限制
 */
function handleExceed() {
  ElMessage.warning("只能上传一个文件，请先删除已上传的文件再重新选择!");
}

/**
 * 下载模板
 */
async function handleDownloadTemplate() {
  try {
    ElMessage.info("正在下载模板，请稍候...");
    await importTemplate();
    ElMessage.success("模板下载成功");
  } catch (error) {
    console.error("下载模板失败:", error);
    ElMessage.error("下载模板失败");
  }
}

/**
 * 提交导入
 */
async function handleSubmit() {
  if (!selectedFile.value) {
    ElMessage.warning("请选择要导入的文件");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确认导入选择的文件吗？${updateSupport.value ? "已存在的用户数据将会被更新。" : ""}`,
      "确认导入",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    importing.value = true;
    importProgress.value = 0;
    importStatus.value = undefined;
    importProgressText.value = "正在上传文件...";
    importResult.value = null;

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      if (importProgress.value < 90) {
        importProgress.value += Math.random() * 20;
        if (importProgress.value > 90) {
          importProgress.value = 90;
        }
      }
    }, 200);

    const response: UserImportResponse = await importUser(selectedFile.value, updateSupport.value);

    clearInterval(progressInterval);
    importProgress.value = 100;

    if (response.code === 200) {
      importStatus.value = "success";
      importProgressText.value = "导入完成";

      importResult.value = {
        title: "导入成功",
        type: "success",
        message: response.msg || "用户数据导入成功",
        details: response.data
          ? [
              `成功导入 ${response.data.successCount || 0} 条记录`,
              response.data.failureCount ? `失败 ${response.data.failureCount} 条记录` : "",
              response.data.updateCount ? `更新 ${response.data.updateCount} 条记录` : "",
            ].filter(Boolean)
          : [],
      };

      // 延迟关闭对话框并触发成功事件
      setTimeout(() => {
        emit("success");
      }, 2000);
    } else {
      importStatus.value = "exception";
      importProgressText.value = "导入失败";

      importResult.value = {
        title: "导入失败",
        type: "error",
        message: response.msg || "用户数据导入失败",
        details: response.data?.errors || [],
      };
    }
  } catch (error: unknown) {
    console.error("导入失败:", error);

    importing.value = false;
    importProgress.value = 0;
    importStatus.value = "exception";

    if (error !== "cancel") {
      importResult.value = {
        title: "导入失败",
        type: "error",
        message: "文件导入过程中发生错误，请检查文件格式和网络连接",
        details: [error instanceof Error ? error.message : "未知错误"],
      };
    }
  } finally {
    setTimeout(() => {
      importing.value = false;
    }, 1000);
  }
}

/**
 * 取消操作
 */
function handleCancel() {
  if (importing.value) {
    ElMessageBox.confirm("导入正在进行中，确认要取消吗？", "确认取消", {
      confirmButtonText: "确认",
      cancelButtonText: "继续导入",
      type: "warning",
    })
      .then(() => {
        dialogVisible.value = false;
      })
      .catch(() => {
        // 用户选择继续导入，不做任何操作
      });
  } else {
    dialogVisible.value = false;
  }
}

// 监听对话框关闭，重置状态
function resetState() {
  fileList.value = [];
  selectedFile.value = null;
  updateSupport.value = false;
  importing.value = false;
  importProgress.value = 0;
  importStatus.value = undefined;
  importProgressText.value = "";
  importResult.value = null;
  uploadRef.value?.clearFiles();
}

// 监听对话框显示状态变化
watch(dialogVisible, (visible) => {
  if (!visible) {
    resetState();
  }
});
</script>

<style scoped lang="scss">
.import-content {
  .import-tips {
    margin-bottom: 20px;

    ol {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 5px;
        line-height: 1.5;
      }
    }
  }

  .upload-section {
    margin-bottom: 20px;

    :deep(.el-upload-dragger) {
      width: 100%;
      height: 180px;
      border: 2px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: #409eff;
      }

      .el-icon--upload {
        font-size: 67px;
        color: #c0c4cc;
        margin: 40px 0 16px;
      }

      .el-upload__text {
        color: #606266;
        font-size: 14px;
        text-align: center;

        em {
          color: #409eff;
          font-style: normal;
        }
      }
    }

    :deep(.el-upload__tip) {
      color: #909399;
      font-size: 12px;
      line-height: 1.5;
      margin-top: 7px;
      text-align: center;
    }
  }

  .import-options {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;

    :deep(.el-checkbox) {
      .el-checkbox__label {
        color: #606266;
        font-size: 14px;
      }
    }
  }

  .import-progress {
    margin-bottom: 20px;

    .progress-text {
      text-align: center;
      color: #606266;
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 0;
    }
  }

  .import-result {
    :deep(.el-alert__content) {
      ul {
        margin: 10px 0 0 0;
        padding-left: 20px;

        li {
          margin-bottom: 5px;
          line-height: 1.5;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-button:first-child {
    margin-right: auto;
  }
}
</style>
