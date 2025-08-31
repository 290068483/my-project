import { defineStore } from "pinia";
import type { Notification } from "@/types/notification";

export interface Item {
  name: string;
  count: number;
}

export interface DataItem {
  id: number;
  name: string;
  count: string;
  details: string;
}

export interface Announcement {
  title: string;
  content: string;
}

export const useHomeStore = defineStore("home", {
  // ========== State ==========
  state: () => ({
    notifications: [
      {
        id: 1,
        title: "活动通知",
        content: "6月12日项目评审会议，请准时参加。",
        time: "上午9:00",
        iconColor: "text-yellow-500",
        iconPath:
          "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        type: "warning",
      },
      {
        id: 2,
        title: "系统消息",
        content: "请及时录入工作进度。",
        time: "上午10:30",
        iconColor: "text-blue-500",
        iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        type: "info",
      },
      {
        id: 3,
        title: "重要提醒",
        content: "系统将在今晚10点进行维护，请提前保存工作。",
        time: "下午2:15",
        iconColor: "text-red-500",
        iconPath:
          "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        type: "critical",
      },
      {
        id: 4,
        title: "新功能上线",
        content: "客户管理系统新增报表功能，欢迎试用。",
        time: "昨天",
        iconColor: "text-green-500",
        iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        type: "success",
      },
      {
        id: 5,
        title: "培训通知",
        content: "新员工入职培训将于周五下午举行。",
        time: "6月5日",
        iconColor: "text-purple-500",
        iconPath:
          "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        type: "info",
      },
    ] as Notification[],
    dateData: {
      // 日期
      date: "2023-03-24",
      // 时间
      time: "10:30:00",
      //农历
      lunarDate: "三月廿四",
      // 星期
      weekdays: "星期一",
    },
    // 快捷统计数据
    quickStats: {
      pendingTasks: 4,
      unreadMessages: 3,
      ongoingClients: 28,
    },

    // 待处理事项
    pendingItems: [
      { name: "待合同", count: 2 },
      { name: "待回复", count: 1 },
      { name: "待处理", count: 4 },
      { name: "待跟踪", count: 3 },
    ] as Item[],
    // table1数据
    data1: {
      title: "本人待处理的所有事项",
      data: [
        {
          id: 1,
          name: "待处理任务1",
          count: "任务描述1",
          details: "2023-03-24",
        },
        {
          id: 2,
          name: "待处理任务2",
          count: "任务描述2",
          details: "详细信息",
        },
      ],
    },
    data2: {
      title: "与本人关联的所有事项",
      data: [
        {
          id: 1,
          name: "关联任务1",
          count: "关联描述1",
          details: "2023-03-24",
        },
        {
          id: 2,
          name: "关联任务2",
          count: "关联描述2",
          details: "详细信息",
        },
      ],
    },
    // 关联事项
    relatedItems: [
      { name: "待合同", count: 3 },
      { name: "待回复", count: 2 },
      { name: "待处理", count: 5 },
      { name: "待跟踪", count: 3 },
    ] as Item[],

    // 公告信息
    announcements: [
      {
        title: "3月24日会议通知：",
        content: "3月24日合同，谢永辉合同，合同款32465元，有2000元尾款，请送货时切记收取。",
      },
      {
        title: "3月24日合同：",
        content: "谢永辉合同，合同款32465元，有2000元尾款，请及时下单。",
      },
      {
        title: "3月24日通知：",
        content: "潘道国已完成客户测量，明天上午上门测量，请及时与客户联系，约定具体时间。",
      },
    ] as Announcement[],
  }),

  // ========== Getters ==========
  getters: {
    getNotifications: (state) => state.notifications,
    getQuickStats: (state) => state.quickStats,
    getPendingItems: (state) => state.pendingItems,
    getRelatedItems: (state) => state.relatedItems,
    getAnnouncements: (state) => state.announcements,
    getData1: (state): { title: string; data: DataItem[] } => state.data1,
    getData2: (state): { title: string; data: DataItem[] } => state.data2,
    getDate: (state) => state.dateData.date,
    getTime: (state) => state.dateData.time,
    getLunarDate: (state) => state.dateData.lunarDate,
    getWeekdays: (state) => state.dateData.weekdays,
  },

  // ========== Actions ==========
  actions: {
    // 更新日期
    updateDate(date: string) {
      this.dateData.date = date;
    },
    // 更新时间
    updateTime(time: string) {
      this.dateData.time = time;
    },
    // 更新农历
    updateLunarDate(lunarDate: string) {
      this.dateData.lunarDate = lunarDate;
    },
    // 更新星期
    updateWeekdays(weekdays: string) {
      this.dateData.weekdays = weekdays;
    },
    // 更新快捷统计数据
    updateQuickStats(stats: { pendingTasks: number; unreadMessages: number; ongoingClients: number }) {
      this.quickStats = stats;
    },

    // 更新待处理事项
    updatePendingItems(items: Item[]) {
      this.pendingItems = items;
    },

    // 更新关联事项
    updateRelatedItems(items: Item[]) {
      this.relatedItems = items;
    },

    // 添加新的通知
    addNotification(notification: Omit<Notification, "id">) {
      const newId = Math.max(0, ...this.notifications.map((n: Notification) => n.id)) + 1;
      this.notifications.unshift({ ...notification, id: newId });
    },

    // 添加新的公告
    addAnnouncement(announcement: Announcement) {
      this.announcements.unshift(announcement);
    },

    // 查看事项详情
    showItemDetails(name: string) {
      console.log("查看详情:", name);
      // 这里可以添加查看详情的逻辑
    },

    // 查看公告
    viewAnnouncement(announcement: Announcement) {
      console.log("查看公告:", announcement);
      // 这里可以添加查看公告的逻辑
    },
  },
});
