import { defineStore } from "pinia";

// 默认设置配置
const defaultSettings = {
  /**
   * 网页标题
   */
  title: "Lanan Management",

  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: "theme-dark",

  /**
   * 是否系统布局配置
   */
  showSettings: true,

  /**
   * 是否显示顶部导航
   */
  topNav: true, // 默认开启顶部导航

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,
};

// 从本地存储获取设置
const storageSetting = JSON.parse(localStorage.getItem("layout-setting") || "{}");

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    title: "",
    theme: storageSetting.theme || "#409EFF",
    sideTheme: storageSetting.sideTheme || defaultSettings.sideTheme,
    showSettings: defaultSettings.showSettings,
    topNav: storageSetting.topNav === undefined ? defaultSettings.topNav : storageSetting.topNav,
    tagsView: storageSetting.tagsView === undefined ? defaultSettings.tagsView : storageSetting.tagsView,
    fixedHeader: storageSetting.fixedHeader === undefined ? defaultSettings.fixedHeader : storageSetting.fixedHeader,
    sidebarLogo: storageSetting.sidebarLogo === undefined ? defaultSettings.sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined ? defaultSettings.dynamicTitle : storageSetting.dynamicTitle,
  }),

  actions: {
    // 修改布局设置
    changeSetting(data: { key: string; value: any }) {
      const { key, value } = data;
      if (this.hasOwnProperty(key)) {
        (this as any)[key] = value;
      }
    },

    // 设置网页标题
    setTitle(title: string) {
      this.title = title;
    },

    // 切换顶部导航显示状态
    toggleTopNav() {
      this.topNav = !this.topNav;
      // 保存到本地存储
      this.saveSettings();
    },

    // 保存设置到本地存储
    saveSettings() {
      const layoutSetting = {
        topNav: this.topNav,
        tagsView: this.tagsView,
        fixedHeader: this.fixedHeader,
        sidebarLogo: this.sidebarLogo,
        dynamicTitle: this.dynamicTitle,
        sideTheme: this.sideTheme,
        theme: this.theme,
      };
      localStorage.setItem("layout-setting", JSON.stringify(layoutSetting));
    },
  },
});

export default useSettingsStore;
