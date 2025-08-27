<template>
  <div class="settings-demo p-6">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>全局配置演示</span>
          <el-tag type="success">Settings.ts</el-tag>
        </div>
      </template>

      <!-- 应用信息 -->
      <div class="app-info mb-6">
        <h3>应用信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="应用名称">{{ envInfo.app }}</el-descriptions-item>
          <el-descriptions-item label="版本号">{{ envInfo.version }}</el-descriptions-item>
          <el-descriptions-item label="环境">
            <el-tag :type="envInfo.environment === 'development' ? 'warning' : 'success'">
              {{ envInfo.environment }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="构建时间">{{ envInfo.buildTime }}</el-descriptions-item>
          <el-descriptions-item label="调试模式">
            <el-tag :type="envInfo.debug ? 'danger' : 'info'">
              {{ envInfo.debug ? "开启" : "关闭" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="API地址">{{ envInfo.baseUrl }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 主题配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>主题配置</span>
          </template>

          <div class="theme-config">
            <div class="mb-4">
              <label class="config-label">当前主题：</label>
              <el-select v-model="currentTheme" @change="handleThemeChange" style="width: 200px">
                <el-option
                  v-for="theme in themeSettings.AVAILABLE_THEMES"
                  :key="theme"
                  :label="getThemeLabel(theme)"
                  :value="theme" />
              </el-select>
            </div>

            <div class="mb-4">
              <label class="config-label">主题颜色：</label>
              <div class="color-palette">
                <div v-for="(color, name) in themeSettings.THEME_COLORS" :key="name" class="color-item">
                  <div class="color-block" :style="{ backgroundColor: color }"></div>
                  <span class="color-name">{{ name }}</span>
                </div>
              </div>
            </div>

            <div class="layout-info">
              <h4>布局配置</h4>
              <el-descriptions size="small" :column="1">
                <el-descriptions-item label="侧边栏宽度">
                  {{ themeSettings.LAYOUT.SIDEBAR_WIDTH }}
                </el-descriptions-item>
                <el-descriptions-item label="头部高度">
                  {{ themeSettings.LAYOUT.HEADER_HEIGHT }}
                </el-descriptions-item>
                <el-descriptions-item label="内容边距">
                  {{ themeSettings.LAYOUT.CONTENT_PADDING }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 表格配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>表格配置演示</span>
          </template>

          <div class="table-config">
            <div class="mb-4">
              <label class="config-label">分页配置：</label>
              <el-descriptions size="small" :column="1">
                <el-descriptions-item label="每页条数">
                  {{ tableSettings.PAGINATION.PAGE_SIZE }}
                </el-descriptions-item>
                <el-descriptions-item label="可选条数">
                  {{ tableSettings.PAGINATION.PAGE_SIZES.join(", ") }}
                </el-descriptions-item>
                <el-descriptions-item label="布局">
                  {{ tableSettings.PAGINATION.LAYOUT }}
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 示例表格 -->
            <div class="demo-table">
              <h4>示例表格</h4>
              <el-table :data="tableData" v-bind="tableSettings.DEFAULT_PROPS" style="width: 100%">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="role" label="角色" />
                <el-table-column prop="status" label="状态">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                      {{ row.status === "active" ? "正常" : "禁用" }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="tableSettings.ACTION_COLUMN.LABEL"
                  :width="tableSettings.ACTION_COLUMN.WIDTH"
                  :fixed="tableSettings.ACTION_COLUMN.FIXED">
                  <template #default>
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页组件 -->
              <div class="mt-4">
                <el-pagination
                  v-model:current-page="pagination.currentPage"
                  v-model:page-size="pagination.pageSize"
                  :page-sizes="pagination.pageSizes"
                  :layout="pagination.layout"
                  :total="pagination.total"
                  background />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <!-- 文件上传配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>文件上传配置</span>
          </template>

          <div class="upload-config">
            <div class="mb-4">
              <h4>文件大小限制</h4>
              <el-descriptions size="small" :column="1">
                <el-descriptions-item v-for="(size, type) in uploadSettings.MAX_SIZE" :key="type" :label="type">
                  {{ formatFileSize(size) }}
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <div class="mb-4">
              <h4>允许的文件类型</h4>
              <div v-for="(types, category) in uploadSettings.ALLOWED_TYPES" :key="category" class="mb-2">
                <label class="config-label">{{ category }}：</label>
                <el-tag v-for="type in types" :key="type" size="small" class="mr-1"> .{{ type }} </el-tag>
              </div>
            </div>

            <!-- 文件上传测试 -->
            <div class="upload-test">
              <h4>文件验证测试</h4>
              <el-input v-model="testFileName" placeholder="输入文件名测试（如：test.jpg）" class="mb-2">
                <template #append>
                  <el-button @click="testFileValidation">验证</el-button>
                </template>
              </el-input>

              <div v-if="validationResult" class="validation-result">
                <el-alert :title="validationResult.message" :type="validationResult.type" show-icon :closable="false" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 请求配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>请求配置</span>
          </template>

          <div class="request-config">
            <el-descriptions size="small" :column="1">
              <el-descriptions-item label="基础URL">
                {{ requestSettings.BASE_URL }}
              </el-descriptions-item>
              <el-descriptions-item label="超时时间"> {{ requestSettings.TIMEOUT }}ms </el-descriptions-item>
              <el-descriptions-item label="重试次数">
                {{ requestSettings.RETRY.MAX_COUNT }}
              </el-descriptions-item>
              <el-descriptions-item label="重试延迟"> {{ requestSettings.RETRY.DELAY }}ms </el-descriptions-item>
              <el-descriptions-item label="缓存启用">
                <el-tag :type="requestSettings.CACHE.ENABLE ? 'success' : 'info'">
                  {{ requestSettings.CACHE.ENABLE ? "已启用" : "未启用" }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>

            <div class="mt-4">
              <h4>请求头配置</h4>
              <el-tag v-for="(value, key) in requestSettings.HEADERS" :key="key" class="mr-1 mb-1" size="small">
                {{ key }}: {{ value }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 权限配置 -->
    <el-card class="mt-4">
      <template #header>
        <span>权限与缓存配置</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <div class="permission-config">
            <h4>权限配置</h4>
            <el-descriptions size="small" :column="1">
              <el-descriptions-item label="权限模式">
                {{ permissionSettings.MODE }}
              </el-descriptions-item>
              <el-descriptions-item label="严格模式">
                <el-tag :type="permissionSettings.CHECK_MODE.STRICT ? 'warning' : 'info'">
                  {{ permissionSettings.CHECK_MODE.STRICT ? "已启用" : "未启用" }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="权限缓存">
                <el-tag :type="permissionSettings.CHECK_MODE.CACHE_PERMISSIONS ? 'success' : 'info'">
                  {{ permissionSettings.CHECK_MODE.CACHE_PERMISSIONS ? "已启用" : "未启用" }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="cache-config">
            <h4>缓存配置</h4>
            <el-descriptions size="small" :column="1">
              <el-descriptions-item label="存储前缀">
                {{ cacheSettings.STORAGE.PREFIX }}
              </el-descriptions-item>
              <el-descriptions-item label="过期时间">
                {{ Math.floor(cacheSettings.STORAGE.EXPIRE_TIME / (24 * 60 * 60 * 1000)) }}天
              </el-descriptions-item>
              <el-descriptions-item label="自动清理">
                <el-tag :type="cacheSettings.STORAGE.AUTO_CLEAR ? 'success' : 'info'">
                  {{ cacheSettings.STORAGE.AUTO_CLEAR ? "已启用" : "未启用" }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="路由缓存">
                <el-tag :type="cacheSettings.ROUTE_CACHE.ENABLE ? 'success' : 'info'">
                  {{ cacheSettings.ROUTE_CACHE.ENABLE ? "已启用" : "未启用" }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 配置说明 -->
    <el-card class="mt-4">
      <template #header>
        <span>配置使用说明</span>
      </template>

      <el-collapse>
        <el-collapse-item title="主题配置使用" name="1">
          <div class="code-example">
            <pre><code>import { getCurrentTheme, setCurrentTheme, THEME_SETTINGS } from '@/settings'

// 获取当前主题
const theme = getCurrentTheme()

// 设置主题
setCurrentTheme('dark')

// 使用主题颜色
const primaryColor = THEME_SETTINGS.THEME_COLORS.primary</code></pre>
          </div>
        </el-collapse-item>

        <el-collapse-item title="表格配置使用" name="2">
          <div class="code-example">
            <pre><code>import { TABLE_SETTINGS, getDefaultPagination } from '@/settings'

// 获取默认分页配置
const pagination = getDefaultPagination()

// 使用表格默认属性
&lt;el-table v-bind="TABLE_SETTINGS.DEFAULT_PROPS"&gt;
&lt;/el-table&gt;</code></pre>
          </div>
        </el-collapse-item>

        <el-collapse-item title="文件上传验证" name="3">
          <div class="code-example">
            <pre><code>import { isFileTypeAllowed, isFileSizeExceeded, formatFileSize } from '@/settings'

// 检查文件类型
if (isFileTypeAllowed(file.name, 'IMAGE')) {
  // 允许上传
}

// 检查文件大小
if (isFileSizeExceeded(file.size, 'IMAGE')) {
  // 文件过大
}

// 格式化文件大小
const sizeText = formatFileSize(file.size)</code></pre>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getEnvironmentInfo,
  getCurrentTheme,
  setCurrentTheme,
  getDefaultPagination,
  formatFileSize,
  isFileTypeAllowed,
  THEME_SETTINGS,
  TABLE_SETTINGS,
  UPLOAD_SETTINGS,
  REQUEST_SETTINGS,
  PERMISSION_SETTINGS,
  CACHE_SETTINGS,
} from "@/settings";

// 响应式数据
const currentTheme = ref(getCurrentTheme());
const testFileName = ref("");
const validationResult = ref<{ message: string; type: "success" | "warning" | "error" } | null>(null);

// 计算属性
const envInfo = computed(() => getEnvironmentInfo());
const themeSettings = computed(() => THEME_SETTINGS);
const tableSettings = computed(() => TABLE_SETTINGS);
const uploadSettings = computed(() => UPLOAD_SETTINGS);
const requestSettings = computed(() => REQUEST_SETTINGS);
const permissionSettings = computed(() => PERMISSION_SETTINGS);
const cacheSettings = computed(() => CACHE_SETTINGS);

// 分页数据
const pagination = ref(getDefaultPagination());

// 示例表格数据
const tableData = ref([
  { name: "张三", role: "管理员", status: "active" },
  { name: "李四", role: "用户", status: "active" },
  { name: "王五", role: "访客", status: "inactive" },
]);

/**
 * 获取主题标签
 */
function getThemeLabel(theme: string): string {
  const labels: Record<string, string> = {
    light: "浅色主题",
    dark: "深色主题",
    auto: "自动主题",
  };
  return labels[theme] || theme;
}

/**
 * 主题切换处理
 */
function handleThemeChange(newTheme: string) {
  setCurrentTheme(newTheme);
  // 这里可以添加实际的主题切换逻辑
  console.log("主题已切换为:", newTheme);
}

/**
 * 测试文件验证
 */
function testFileValidation() {
  if (!testFileName.value) {
    validationResult.value = {
      message: "请输入文件名",
      type: "warning",
    };
    return;
  }

  // 测试图片类型
  const isImageAllowed = isFileTypeAllowed(testFileName.value, "IMAGE");
  const isDocAllowed = isFileTypeAllowed(testFileName.value, "DOCUMENT");

  if (isImageAllowed) {
    validationResult.value = {
      message: "✅ 图片文件类型验证通过",
      type: "success",
    };
  } else if (isDocAllowed) {
    validationResult.value = {
      message: "✅ 文档文件类型验证通过",
      type: "success",
    };
  } else {
    validationResult.value = {
      message: "❌ 文件类型不被支持",
      type: "error",
    };
  }
}

onMounted(() => {
  // 更新分页总数
  pagination.value.total = tableData.value.length;
});
</script>

<style scoped>
.settings-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-label {
  font-weight: bold;
  color: #606266;
  margin-right: 8px;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-block {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.color-name {
  font-size: 12px;
  color: #909399;
}

.validation-result {
  margin-top: 12px;
}

.code-example {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
}

.code-example pre {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
  border: 1px solid #ebeef5;
  overflow-x: auto;
}

.code-example code {
  color: #e6a23c;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.5;
}
</style>
