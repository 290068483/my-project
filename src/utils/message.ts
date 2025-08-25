import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import type { Action } from "element-plus";

/**
 * 消息提示工具类
 */
export default class MessageUtils {
  /**
   * 普通消息提示
   * @param message 消息内容
   * @param type 消息类型：'success' | 'warning' | 'info' | 'error'
   */
  static message(message: string, type: "success" | "warning" | "info" | "error" = "info") {
    ElMessage({
      message,
      type,
      duration: 3000, // 显示时间，单位毫秒
      showClose: true, // 是否显示关闭按钮
    });
  }

  /**
   * 成功消息提示
   * @param message 消息内容
   */
  static success(message: string) {
    this.message(message, "success");
  }

  /**
   * 警告消息提示
   * @param message 消息内容
   */
  static warning(message: string) {
    this.message(message, "warning");
  }

  /**
   * 错误消息提示
   * @param message 消息内容
   */
  static error(message: string) {
    this.message(message, "error");
  }

  /**
   * 信息消息提示
   * @param message 消息内容
   */
  static info(message: string) {
    this.message(message, "info");
  }

  /**
   * 通知提示
   * @param title 标题
   * @param message 消息内容
   * @param type 通知类型：'success' | 'warning' | 'info' | 'error'
   */
  static notification(title: string, message: string, type: "success" | "warning" | "info" | "error" = "info") {
    ElNotification({
      title,
      message,
      type,
      duration: 3000,
      showClose: true,
    });
  }

  /**
   * 确认对话框
   * @param message 提示内容
   * @param title 标题
   * @param confirmButtonText 确认按钮文字
   * @param cancelButtonText 取消按钮文字
   * @param type 类型：'success' | 'warning' | 'info' | 'error'
   * @returns Promise
   */
  static confirm(
    message: string,
    title = "提示",
    confirmButtonText = "确定",
    cancelButtonText = "取消",
    type: "success" | "warning" | "info" | "error" = "warning",
  ): Promise<Action> {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      draggable: true, // 是否可拖拽
      closeOnClickModal: false, // 是否可以通过点击遮罩层关闭
      closeOnPressEscape: true, // 是否可以通过按下ESC键关闭
    });
  }

  /**
   * 提示对话框
   * @param message 提示内容
   * @param title 标题
   * @param confirmButtonText 确认按钮文字
   * @param type 类型：'success' | 'warning' | 'info' | 'error'
   * @returns Promise
   */
  static alert(
    message: string,
    title = "提示",
    confirmButtonText = "确定",
    type: "success" | "warning" | "info" | "error" = "info",
  ): Promise<Action> {
    return ElMessageBox.alert(message, title, {
      confirmButtonText,
      type,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: true,
    });
  }

  /**
   * 输入对话框
   * @param message 提示内容
   * @param title 标题
   * @param defaultValue 默认值
   * @param confirmButtonText 确认按钮文字
   * @param cancelButtonText 取消按钮文字
   * @param inputPlaceholder 输入框占位符
   * @param inputType 输入框类型：'text' | 'textarea' | 'password'
   * @param inputValidator 输入验证函数
   * @returns Promise
   */
  static prompt(
    message: string,
    title = "提示",
    defaultValue = "",
    confirmButtonText = "确定",
    cancelButtonText = "取消",
    inputPlaceholder = "",
    inputType: "text" | "textarea" | "password" = "text",
    inputValidator?: (value: string) => boolean | string,
  ): Promise<{ value: string; action: Action }> {
    return ElMessageBox.prompt(message, title, {
      confirmButtonText,
      cancelButtonText,
      defaultValue,
      placeholder: inputPlaceholder,
      inputType,
      inputValidator,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: true,
    });
  }
}
