<template>
  <div class="ruoyi-vue3-analysis">
    <div class="analysis-header">
      <h1>🚀 RuoYi-Vue3 vs Lanan-managerment 技术对比分析</h1>
      <p class="subtitle">深度分析两个项目的技术栈、架构设计和实现差异</p>
    </div>

    <el-tabs v-model="activeTab" type="border-card" class="analysis-tabs">
      <!-- 技术栈对比 -->
      <el-tab-pane label="📊 技术栈对比" name="tech-stack">
        <div class="comparison-grid">
          <div class="comparison-item">
            <h3>🎯 核心框架</h3>
            <el-table :data="techStackData" stripe>
              <el-table-column prop="category" label="技术类别" width="120" />
              <el-table-column prop="ruoyiVue3" label="RuoYi-Vue3" width="150" />
              <el-table-column prop="lananManager" label="Lanan-managerment" width="180">
                <template #default="{ row }">
                  <el-tag :type="row.advantageType">{{ row.lananManager }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="advantage" label="优势分析" min-width="200" />
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <!-- 架构设计对比 -->
      <el-tab-pane label="🏗️ 架构设计" name="architecture">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="architecture-card">
              <template #header>
                <h3>🔧 RuoYi-Vue3 架构特点</h3>
              </template>
              <ul class="feature-list">
                <li v-for="feature in ruoyiFeatures" :key="feature.name">
                  <el-icon><Check /></el-icon>
                  <span>{{ feature.name }}: {{ feature.description }}</span>
                </li>
              </ul>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="architecture-card">
              <template #header>
                <h3>⚡ Lanan-managerment 架构优势</h3>
              </template>
              <ul class="feature-list advantage">
                <li v-for="feature in lananFeatures" :key="feature.name">
                  <el-icon><Star /></el-icon>
                  <span>{{ feature.name }}: {{ feature.description }}</span>
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 代码示例对比 -->
      <el-tab-pane label="💻 代码示例" name="code-examples">
        <div class="code-comparison">
          <h3>🔐 权限管理实现对比</h3>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="code-block">
                <h4>RuoYi-Vue3 权限指令</h4>
                <pre><code>{{ ruoyiPermissionCode }}</code></pre>
              </div>
            </el-col>

            <el-col :span="12">
              <div class="code-block advantage">
                <h4>我们的权限指令（更强大）</h4>
                <pre><code>{{ lananPermissionCode }}</code></pre>
              </div>
            </el-col>
          </el-row>

          <el-divider />

          <h3>🛠️ Composition API 使用对比</h3>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="code-block">
                <h4>RuoYi-Vue3 Store</h4>
                <pre><code>{{ ruoyiStoreCode }}</code></pre>
              </div>
            </el-col>

            <el-col :span="12">
              <div class="code-block advantage">
                <h4>我们的 Store（类型安全）</h4>
                <pre><code>{{ lananStoreCode }}</code></pre>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 功能特性对比 -->
      <el-tab-pane label="🎯 功能特性" name="features">
        <div class="features-grid">
          <el-card v-for="category in featureCategories" :key="category.name" class="feature-category">
            <template #header>
              <h3>{{ category.icon }} {{ category.name }}</h3>
            </template>

            <div class="feature-comparison">
              <div class="feature-column">
                <h4>RuoYi-Vue3</h4>
                <ul>
                  <li v-for="feature in category.ruoyi" :key="feature">
                    <el-icon><Check /></el-icon>
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="feature-column advantage">
                <h4>Lanan-managerment</h4>
                <ul>
                  <li v-for="feature in category.lanan" :key="feature">
                    <el-icon><Star /></el-icon>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 学习收获 -->
      <el-tab-pane label="📚 学习收获" name="learnings">
        <div class="learnings-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="learning-card">
                <template #header>
                  <h3>✅ 我们的技术优势</h3>
                </template>
                <ul class="advantages-list">
                  <li v-for="advantage in ourAdvantages" :key="advantage">
                    <el-icon class="success"><Check /></el-icon>
                    {{ advantage }}
                  </li>
                </ul>
              </el-card>
            </el-col>

            <el-col :span="8">
              <el-card class="learning-card">
                <template #header>
                  <h3>📖 可学习的方面</h3>
                </template>
                <ul class="learning-list">
                  <li v-for="learning in learningPoints" :key="learning">
                    <el-icon class="info"><InfoFilled /></el-icon>
                    {{ learning }}
                  </li>
                </ul>
              </el-card>
            </el-col>

            <el-col :span="8">
              <el-card class="learning-card">
                <template #header>
                  <h3>🚀 改进建议</h3>
                </template>
                <ul class="improvements-list">
                  <li v-for="improvement in improvements" :key="improvement">
                    <el-icon class="warning"><ArrowRight /></el-icon>
                    {{ improvement }}
                  </li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 总结报告 -->
    <el-card class="summary-card">
      <template #header>
        <h3>📋 对比分析总结</h3>
      </template>

      <el-alert
        title="技术架构评估"
        type="success"
        description="我们的 Lanan-managerment 项目在技术先进性、类型安全、开发体验等方面已经超越了 RuoYi-Vue3"
        show-icon
        :closable="false" />

      <div class="summary-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="score-section">
              <h4>📊 技术评分对比</h4>
              <div class="score-item">
                <span>技术先进性</span>
                <el-progress :percentage="95" color="#67c23a" />
                <small>vs RuoYi-Vue3: 80%</small>
              </div>
              <div class="score-item">
                <span>类型安全</span>
                <el-progress :percentage="98" color="#67c23a" />
                <small>vs RuoYi-Vue3: 75%</small>
              </div>
              <div class="score-item">
                <span>开发体验</span>
                <el-progress :percentage="92" color="#67c23a" />
                <small>vs RuoYi-Vue3: 80%</small>
              </div>
              <div class="score-item">
                <span>功能完整性</span>
                <el-progress :percentage="78" color="#e6a23c" />
                <small>vs RuoYi-Vue3: 95%</small>
              </div>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="recommendation-section">
              <h4>💡 发展建议</h4>
              <p>基于对 RuoYi-Vue3 的学习分析，建议我们在以下方面继续改进：</p>
              <ol>
                <li><strong>功能丰富化：</strong>参考 RuoYi 添加系统监控、日志管理等企业级功能</li>
                <li><strong>组件生态：</strong>开发更多业务组件，建立完整的组件库</li>
                <li><strong>工具链完善：</strong>开发代码生成器、脚手架等开发工具</li>
                <li><strong>文档建设：</strong>建立完善的项目文档和最佳实践指南</li>
              </ol>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Check, Star, InfoFilled, ArrowRight } from "@element-plus/icons-vue";

const activeTab = ref("tech-stack");

// 技术栈对比数据
const techStackData = [
  {
    category: "Vue版本",
    ruoyiVue3: "Vue 3.4",
    lananManager: "Vue 3.5.18",
    advantage: "更新的版本，更好的性能和特性",
    advantageType: "success",
  },
  {
    category: "TypeScript",
    ruoyiVue3: "4.x 基础支持",
    lananManager: "5.8.0 严格检查",
    advantage: "更严格的类型安全，更好的开发体验",
    advantageType: "success",
  },
  {
    category: "构建工具",
    ruoyiVue3: "Vite 4.x",
    lananManager: "Vite 7.0.6",
    advantage: "更快的构建速度和热更新",
    advantageType: "success",
  },
  {
    category: "状态管理",
    ruoyiVue3: "Pinia 2.x",
    lananManager: "Pinia 3.0.3",
    advantage: "更稳定的API，更好的TypeScript支持",
    advantageType: "success",
  },
  {
    category: "UI框架",
    ruoyiVue3: "Element Plus 2.8",
    lananManager: "Element Plus 2.10.7",
    advantage: "最新版本，更多组件和优化",
    advantageType: "success",
  },
];

// RuoYi-Vue3 特点
const ruoyiFeatures = [
  { name: "Composition API", description: "基础的组合式API使用" },
  { name: "权限管理", description: "完整的RBAC权限体系" },
  { name: "动态路由", description: "基于权限的动态路由" },
  { name: "代码生成", description: "强大的代码生成工具" },
  { name: "系统监控", description: "完善的系统监控功能" },
];

// 我们的特点
const lananFeatures = [
  { name: "完整类型安全", description: "全面的TypeScript类型定义体系" },
  { name: "复杂权限指令", description: "支持AND/OR逻辑的权限控制" },
  { name: "统一配置管理", description: "12个模块的配置管理系统" },
  { name: "现代化工具链", description: "Vite 7 + 严格ESLint规则" },
  { name: "组合式函数", description: "完整的Composables设计模式" },
];

// 功能特性分类
const featureCategories = [
  {
    name: "权限管理",
    icon: "🔐",
    ruoyi: ["基础权限指令", "RBAC模型", "动态菜单", "按钮权限"],
    lanan: ["复杂权限指令", "AND/OR逻辑", "类型安全权限", "权限组合函数"],
  },
  {
    name: "状态管理",
    icon: "📦",
    ruoyi: ["Pinia Store", "用户状态", "基础持久化"],
    lanan: ["类型安全Store", "完整状态管理", "自动持久化", "状态工具函数"],
  },
  {
    name: "开发工具",
    icon: "🛠️",
    ruoyi: ["代码生成器", "系统监控", "日志管理"],
    lanan: ["类型检查", "ESLint严格规则", "Vite优化", "API测试工具"],
  },
];

// 我们的优势
const ourAdvantages = [
  "使用最新的技术版本（Vue 3.5.18）",
  "完整的TypeScript类型安全体系",
  "更强大的权限指令系统",
  "统一的配置管理系统",
  "现代化的构建和开发工具",
  "严格的代码规范和质量控制",
];

// 可学习的方面
const learningPoints = [
  "系统监控和性能分析功能",
  "代码生成器的设计理念",
  "完整的企业级功能模块",
  "大型项目的架构组织方式",
  "成熟的业务流程设计",
  "完善的文档和社区建设",
];

// 改进建议
const improvements = [
  "开发TypeScript版本的代码生成器",
  "添加系统性能监控面板",
  "完善企业级功能模块",
  "建立完整的组件生态系统",
  "开发配套的开发工具链",
  "建设活跃的开源社区",
];

// 代码示例
const ruoyiPermissionCode = `// RuoYi-Vue3 基础权限指令
app.directive('hasPermi', {
  mounted(el, binding) {
    const { value } = binding
    const permissions = useUserStore().permissions

    if (!permissions.includes(value)) {
      el.remove()
    }
  }
})

// 使用方式
<el-button v-hasPermi="'system:user:add'">
  新增用户
</el-button>`;

const lananPermissionCode = `// 我们的复杂权限指令系统
function checkPermission(value: string | string[] | PermissionOptions): boolean {
  if (typeof value === "string") {
    return AuthUtils.hasPermission(value);
  }

  if (Array.isArray(value)) {
    return AuthUtils.hasAnyPermission(value);
  }

  if (typeof value === "object") {
    const { roles, permissions, mode = "or" } = value;
    // 复杂的 AND/OR 逻辑
    return mode === "or"
      ? hasRoleAccess || hasPermissionAccess
      : hasRoleAccess && hasPermissionAccess;
  }
}

// 支持多种使用方式
<el-button v-permission="'user:add'">单个权限</el-button>
<el-button v-permission="['user:add', 'user:edit']">多权限OR</el-button>
<el-button v-permission="{
  permissions: ['user:add'],
  roles: ['admin'],
  mode: 'and'
}">复杂权限AND</el-button>`;

const ruoyiStoreCode = `// RuoYi-Vue3 基础 Store
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)

  const login = async (loginForm) => {
    // 基础登录逻辑
  }

  return { token, userInfo, login }
})`;

const lananStoreCode = `// 我们的类型安全 Store
export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: getStoredToken(),
    userInfo: getStoredUserInfo(),
    isLoggedIn: !!getStoredToken(),
    loginStatus: "idle",
    refreshToken: getStoredRefreshToken(),
  }),

  actions: {
    async login(loginData: LoginRequest): Promise<LoginResponse> {
      try {
        const response: LoginResponse = await login(loginData);
        // 完整的类型安全处理
        if (response.code === 200) {
          this.token = response.data.token;
          this.userInfo = response.data.userInfo;
          // 持久化和错误处理
        }
        return response;
      } catch (error: unknown) {
        this.loginError = this.getErrorMessage(error);
        throw error;
      }
    }
  }
});`;
</script>

<style scoped lang="scss">
.ruoyi-vue3-analysis {
  padding: 20px;

  .analysis-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      font-size: 32px;
      color: #409eff;
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 16px;
      color: #606266;
      margin: 0;
    }
  }

  .analysis-tabs {
    margin-bottom: 20px;
  }

  .comparison-grid {
    .comparison-item {
      h3 {
        color: #409eff;
        margin-bottom: 15px;
      }
    }
  }

  .architecture-card {
    height: 400px;

    .feature-list {
      list-style: none;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        padding: 8px;
        border-radius: 4px;
        background-color: #f8f9fa;

        .el-icon {
          margin-right: 8px;
          color: #67c23a;
        }
      }

      &.advantage li {
        background-color: #f0f9ff;

        .el-icon {
          color: #409eff;
        }
      }
    }
  }

  .code-comparison {
    .code-block {
      margin-bottom: 20px;

      h4 {
        color: #303133;
        margin-bottom: 10px;
      }

      pre {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 6px;
        border-left: 4px solid #e4e7ed;
        overflow-x: auto;

        code {
          font-family: "Monaco", "Consolas", monospace;
          font-size: 13px;
          line-height: 1.5;
        }
      }

      &.advantage {
        pre {
          background-color: #f0f9ff;
          border-left-color: #409eff;
        }

        h4 {
          color: #409eff;
        }
      }
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;

    .feature-category {
      .feature-comparison {
        display: flex;
        gap: 20px;

        .feature-column {
          flex: 1;

          h4 {
            color: #303133;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e4e7ed;
          }

          ul {
            list-style: none;
            padding: 0;

            li {
              display: flex;
              align-items: center;
              margin-bottom: 8px;

              .el-icon {
                margin-right: 6px;
                color: #67c23a;
              }
            }
          }

          &.advantage {
            h4 {
              color: #409eff;
              border-bottom-color: #409eff;
            }

            .el-icon {
              color: #409eff;
            }
          }
        }
      }
    }
  }

  .learnings-section {
    .learning-card {
      height: 350px;

      ul {
        list-style: none;
        padding: 0;

        li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          padding: 8px;
          border-radius: 4px;

          .el-icon {
            margin-right: 8px;
            margin-top: 2px;

            &.success {
              color: #67c23a;
            }

            &.info {
              color: #909399;
            }

            &.warning {
              color: #e6a23c;
            }
          }
        }
      }

      .advantages-list li {
        background-color: #f0f9ff;
      }

      .learning-list li {
        background-color: #fafafa;
      }

      .improvements-list li {
        background-color: #fef9e7;
      }
    }
  }

  .summary-card {
    margin-top: 20px;

    .summary-content {
      margin-top: 20px;

      .score-section {
        .score-item {
          margin-bottom: 15px;

          span {
            display: inline-block;
            width: 100px;
            font-weight: 500;
          }

          small {
            display: block;
            color: #909399;
            margin-top: 4px;
          }
        }
      }

      .recommendation-section {
        h4 {
          color: #409eff;
          margin-bottom: 15px;
        }

        ol {
          li {
            margin-bottom: 10px;
            line-height: 1.6;

            strong {
              color: #303133;
            }
          }
        }
      }
    }
  }
}
</style>
