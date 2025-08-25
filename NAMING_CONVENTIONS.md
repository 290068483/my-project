# 项目命名规范

## 1. 文件命名规范

### 1.1 Vue组件文件
- 使用 PascalCase 命名法（大驼峰命名法）
- 组件文件名应能清晰表达组件功能
- 例如：`UserInfo.vue`, `EditModal.vue`, `DataTable.vue`

### 1.2 TypeScript/JavaScript 文件
- 使用 camelCase 命名法（小驼峰命名法）
- 文件名应能清晰表达文件功能
- 例如：`userUtils.ts`, `apiService.ts`, `authHelper.ts`

### 1.3 样式文件
- 使用 kebab-case 命名法（短横线分隔命名法）
- 例如：`user-profile.css`, `data-table.less`

### 1.4 配置文件
- 使用 kebab-case 命名法
- 例如：`vite.config.ts`, `tailwind.config.js`

## 2. 目录结构命名规范

### 2.1 功能模块目录
- 使用 kebab-case 命名法
- 目录名应能清晰表达模块功能
- 例如：`user-management`, `data-table`, `form-components`

### 2.2 组件目录
- 使用 PascalCase 命名法
- 与组件文件名保持一致
- 例如：`UserInfo/`, `DataTable/`

## 3. 路径别名

项目已配置以下路径别名，便于导入模块：

| 别名 | 对应路径 | 用途 |
|------|---------|------|
| `@` | `src/` | 根目录 |
| `@components` | `src/components/` | 公共组件 |
| `@views` | `src/views/` | 页面视图 |
| `@stores` | `src/stores/` | 状态管理 |
| `@utils` | `src/utils/` | 工具函数 |
| `@router` | `src/router/` | 路由配置 |
| `@assets` | `src/assets/` | 静态资源 |
| `@types` | `src/types/` | 类型定义 |
| `@config` | `src/config/` | 配置文件 |

## 4. 使用示例

### 4.1 导入组件
```typescript
// 使用路径别名导入组件
import UserInfo from '@components/UserInfo.vue'
import DataTable from '@components/DataTable.vue'

// 导入视图组件
import HomeView from '@views/HomeView.vue'
import UserView from '@views/user/UserView.vue'
```

### 4.2 导入工具函数
```typescript
// 导入工具函数
import { formatDate } from '@utils/dateUtils'
import { http } from '@utils/request'
```

### 4.3 导入状态管理
```typescript
// 导入状态管理
import { useUserStore } from '@stores/user'
import { useHomeStore } from '@stores/home'
```

## 5. 重构建议

为了更好地支持路径自动匹配和重构，建议：

1. **统一使用路径别名**：避免使用相对路径导入，全部改用路径别名
2. **规范目录结构**：按照功能模块组织目录结构
3. **组件命名一致性**：确保组件文件名与组件内的 name 属性一致
4. **定期重构**：当目录结构调整时，利用IDE的重构功能自动更新所有引用

## 6. IDE 配置建议

### 6.1 VS Code
确保安装以下插件以获得最佳开发体验：
- Volar - Vue官方插件
- TypeScript Vue Plugin
- Path Intellisense - 路径自动补全
- Auto Rename Tag - 标签自动重命名

### 6.2 WebStorm
- 启用 TypeScript 支持
- 配置路径别名映射
- 启用 Vue.js 支持

通过遵循这些命名规范和路径配置，当项目结构发生变化时，IDE可以自动匹配和更新路径引用，提高开发效率和代码维护性。