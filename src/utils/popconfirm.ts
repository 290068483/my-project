import type { Directive, DirectiveBinding } from "vue";
import type { PopconfirmProps } from "element-plus";

/**
 * 气泡确认框指令
 * 使用方式：v-popconfirm="{ title: '确认删除吗？', onConfirm: handleConfirm, onCancel: handleCancel }"
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<PopconfirmProps>) {
    const { value } = binding;

    if (!value) {
      console.warn("v-popconfirm 指令需要传入配置对象");
      return;
    }

    // 创建气泡确认框内容
    const popconfirmContent = document.createElement("div");
    popconfirmContent.className = "popconfirm-content";
    popconfirmContent.innerHTML = `
      <el-popconfirm
        title="${value.title || "确认执行此操作吗？"}"
        confirm-button-text="${value.confirmButtonText || "确定"}"
        cancel-button-text="${value.cancelButtonText || "取消"}"
        type="${value.type || "warning"}"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        ${value.icon ? `icon="${value.icon}"` : ""}
        ${value.hideIcon ? "hide-icon" : ""}
        ${value.showArrow ? "show-arrow" : ""}
        ${value.teleported ? "teleported" : ""}
        ${value.popperClass ? `popper-class="${value.popperClass}"` : ""}
        ${value.popperOffset ? `popper-offset="${value.popperOffset}"` : ""}
        ${value.popperAppendToBody ? "popper-append-to-body" : ""}
        ${value.showAfter ? `show-after="${value.showAfter}"` : ""}
        ${value.hideAfter ? `hide-after="${value.hideAfter}"` : ""}
        ${value.stopPropagation ? "stop-propagation" : ""}
        ${value.enterable ? "enterable" : ""}
      >
        <template #reference>
          <slot></slot>
        </template>
      </el-popconfirm>
    `;

    // 将内容添加到元素中
    el.appendChild(popconfirmContent);

    // 创建全局处理函数
    const handleConfirm = () => {
      if (value.onConfirm) {
        value.onConfirm();
      }
    };

    const handleCancel = () => {
      if (value.onCancel) {
        value.onCancel();
      }
    };

    // 将处理函数添加到全局作用域
    (window as any).handleConfirm = handleConfirm;
    (window as any).handleCancel = handleCancel;
  },

  updated(el: HTMLElement, binding: DirectiveBinding<PopconfirmProps>) {
    // 当指令值更新时，重新创建气泡确认框
    this.mounted(el, binding);
  },

  unmounted(el: HTMLElement) {
    // 移除气泡确认框
    const popconfirmContent = el.querySelector(".popconfirm-content");
    if (popconfirmContent) {
      el.removeChild(popconfirmContent);
    }

    // 清理全局处理函数
    delete (window as any).handleConfirm;
    delete (window as any).handleCancel;
  },
} as Directive;
