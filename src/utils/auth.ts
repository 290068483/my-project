import { useUserStore } from "@/stores/user";
import MessageUtils from "./message";
import router from "@/router";

/**
 * 通用认证工具类
 */
export class AuthUtils {
  /**
   * 退出登录
   * @param showMessage 是否显示退出成功消息
   * @param redirectPath 退出后重定向路径，默认为登录页
   */
  static logout(showMessage = true, redirectPath = "/login"): void {
    const userStore = useUserStore();
    userStore.logout();

    if (showMessage) {
      MessageUtils.success("退出登录成功");
    }

    router.push(redirectPath);
  }
}
