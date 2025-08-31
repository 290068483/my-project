import type { App, Directive, DirectiveBinding } from "vue";
import hasPermi from "./permission/hasPermi";
import hasRole from "./permission/hasRole";

/**
 * 权限指令安装函数
 * @param app Vue应用实例
 */
export function setupPermissionDirective(app: App): void {
  // 注册RuoYi兼容指令
  app.directive("hasPermi", hasPermi);
  app.directive("hasRole", hasRole);
}

/**
 * 导出所有指令相关的内容
 */
export { hasPermi, hasRole };

/**
 * 权限指令使用说明：
 *
 * 1. 基础用法（单个权限）：
 *    <el-button v-permission="'user:add'">新增用户</el-button>
 *
 * 2. 多个权限（或关系）：
 *    <el-button v-permission="['user:add', 'user:edit']">操作按钮</el-button>
 *
 * 3. 复杂权限配置：
 *    <el-button v-permission="{ permissions: ['user:add'], roles: ['admin'], mode: 'and' }">
 *      管理员新增
 *    </el-button>
 *
 * 4. 角色检查：
 *    <div v-role="'admin'">管理员专用内容</div>
 *    <div v-role="['admin', 'manager']">管理员或经理可见</div>
 *
 * 5. RuoYi兼容指令：
 *    <el-button v-hasPermi="['system:user:add']">新增用户</el-button>
 *    <div v-hasRole="['admin']">管理员专用</div>
 */
