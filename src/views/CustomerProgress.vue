<template>
  <div
    class="min-h-screen min-w-full bg-gray-100 overflow-x-hidden overflow-y-auto"
  >
    <!-- 导航栏 -->
    <CustomHeader
      :items="[
        { title: '首页', index: 'home' },
        { title: '全部档案', index: 'all-archives' },
        { title: '定单详情', index: 'order-details' },
        { title: '合同详情', index: 'contract-details' },
        { title: '产品详情', index: 'product-details' },
        { title: '出货', index: 'shipment' },
      ]"
      :defaultActive="'order-details'"
      :title="'陆泰-重庆市万科蓝岸三期'"
      @select="handleMenuSelect"
      @profile-click="handleProfileClick"
    />
    <div class="flex orderPanel items-center max-w-full">
      <div class="leftBox flex items-center">
        <div class="leftCell flex flex-col">
          <div>
            <span class="text-gray-700 mr-2">订单日期:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">合同日期:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>

        <div class="leftCell flex flex-col">
          <div>
            <span class="text-gray-700 mr-2"
              >定&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金:</span
            >
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">合同金额:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>
        <div class="leftCell flex flex-col">
          <div>
            <span class="text-gray-700 mr-2"
              >电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话:</span
            >
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">备用电话:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>
        <div class="leftCell flex flex-col">
          <div>
            <span class="text-gray-700 mr-2">销售顾问:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
          <div>
            <span class="text-gray-700 mr-2">设&nbsp;计&nbsp;&nbsp;师:</span>
            <span class="font-medium">2025-01-01</span>
          </div>
        </div>
      </div>
      <div class="rightBox flex items-center flex-1">
        <div class="rightCell">
          <div class="">
            <span>区域：</span>
            <span>重庆是冉家坝</span>
          </div>
          <div>
            <span>id:</span>
            <span>123456</span>
          </div>
        </div>
        <div class="rightCell">
          <div class="lastRight">
            <span>地址：</span
            ><span>重庆市冉家坝重庆市冉家坝重庆市冉家坝重庆市冉家坝</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 左右并排的表格布局 -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- 左侧：进度列表 -->
      <div
        class="w-full lg:w-1/2 bg-white rounded-lg shadow p-4 border border-gray-100 relative"
      >
        <div class="mb-3 flex justify-between items-center">
          <h3 class="font-medium text-gray-800">进度列表</h3>
          <span class="text-xs text-gray-500">详情</span>
        </div>
        <div class="overflow-y-auto max-h-[400px] pr-1">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  日期
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  事件名
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  详情
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/12/28
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  合同
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  合同金额258264元，签合同时客户来现场沟通生产周期问题
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/12/28
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  咨询
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户沟通确认方案细节，沟通未来订单意向合同办理
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer bg-yellow-50"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/12/28
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  咨询
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户咨询定制方案，电话沟通未能解答，需上门复尺
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/12/26
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  通知
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户通知方案调整，增加门楣尺寸，墙面未刷
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/11/22
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  测量
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户江门测量尺寸，墙面未刷，不能上门复尺，谭敬江已处理
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/11/05
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  咨询
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户询问方案细节，电子图发送客户确认
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="showTooltip('progress', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/11/01
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  出图
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户确认方案图纸，约定下次测量时间
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 提示气泡 -->
        <div
          v-if="showProgressTooltip"
          class="absolute bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10 max-w-xs"
          :style="{
            left: tooltipLeft + 'px',
            top: tooltipTop + 'px',
          }"
        >
          点击列表，进行相应操作，编辑相关录入操作
        </div>
      </div>

      <!-- 右侧：待办列表 -->
      <div
        class="w-full lg:w-1/2 bg-white rounded-lg shadow p-4 border border-gray-100 relative"
      >
        <div class="mb-3 flex justify-between items-center">
          <h3 class="font-medium text-gray-800">待办列表</h3>
        </div>
        <div class="overflow-y-auto max-h-[400px] pr-1">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  待办日期
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  事项
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  内容
                </th>
                <th
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  待办人
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @dblclick="showTooltip('todo', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/01/23
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  待合同
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  合同金额258264元，签合同时客户来现场沟通生产周期问题
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  待办人
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @dblclick="showTooltip('todo', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/01/23
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  待咨询
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  客户沟通确认方案细节，沟通未来订单意向合同办理
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  待办人
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @dblclick="showTooltip('todo', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/01/23
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  待合同
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  合同金额258264元，签合同时客户来现场沟通生产周期问题
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  待办人
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @dblclick="showTooltip('todo', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/01/23
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  待合同
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  合同金额258264元，签合同时客户来现场沟通生产周期问题
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  待办人
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @dblclick="showTooltip('todo', $event)"
              >
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  2019/01/23
                </td>
                <td
                  class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  待合同
                </td>
                <td class="px-3 py-2 text-xs text-gray-500">
                  合同金额258264元，签合同时客户来现场沟通生产周期问题
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  待办人
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 提示气泡 -->
        <div
          v-if="showTodoTooltip"
          class="absolute bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10 max-w-xs"
          :style="{
            left: tooltipLeft + 'px',
            top: tooltipTop + 'px',
          }"
        >
          您可以双击单元格某个范围内修改内容，例如修改客户名称、状态、时长 3
          天内等内容
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加组件逻辑
import { ref } from "vue";
import CustomHeader from "@/components/CustomHeader.vue";

// 提示气泡状态
const showProgressTooltip = ref(false);
const showTodoTooltip = ref(false);
const tooltipLeft = ref(0);
const tooltipTop = ref(0);

// 显示进度列表提示
const showTooltip = (type: string, event: MouseEvent) => {
  if (type === "progress") {
    showProgressTooltip.value = true;
    showTodoTooltip.value = false;
  } else {
    showProgressTooltip.value = false;
    showTodoTooltip.value = true;
  }
  tooltipLeft.value = event.clientX + 10;
  tooltipTop.value = event.clientY + 10;

  // 3秒后自动隐藏提示
  setTimeout(() => {
    showProgressTooltip.value = false;
    showTodoTooltip.value = false;
  }, 3000);
};

// 示例数据 - 可以根据实际需求扩展
const progressList = [
  {
    date: "2019/12/28",
    event: "合同",
    detail: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
  },
  {
    date: "2019/12/28",
    event: "咨询",
    detail: "客户沟通确认方案细节，沟通未来订单意向合同办理",
  },
  {
    date: "2019/12/28",
    event: "咨询",
    detail: "客户咨询定制方案，电话沟通未能解答，需上门复尺",
  },
  {
    date: "2019/12/26",
    event: "通知",
    detail: "客户通知方案调整，增加门楣尺寸，墙面未刷",
  },
  {
    date: "2019/11/22",
    event: "测量",
    detail: "客户江门测量尺寸，墙面未刷，不能上门复尺，谭敬江已处理",
  },
  {
    date: "2019/11/05",
    event: "咨询",
    detail: "客户询问方案细节，电子图发送客户确认",
  },
  {
    date: "2019/11/01",
    event: "出图",
    detail: "客户确认方案图纸，约定下次测量时间",
  },
];

const todoList = [
  {
    date: "2019/01/23",
    item: "待合同",
    content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
    person: "待办人",
  },
  {
    date: "2019/01/23",
    item: "待咨询",
    content: "客户沟通确认方案细节，沟通未来订单意向合同办理",
    person: "待办人",
  },
  {
    date: "2019/01/23",
    item: "待合同",
    content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
    person: "待办人",
  },
  {
    date: "2019/01/23",
    item: "待合同",
    content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
    person: "待办人",
  },
  {
    date: "2019/01/23",
    item: "待合同",
    content: "合同金额258264元，签合同时客户来现场沟通生产周期问题",
    person: "待办人",
  },
];

// 事件列表数据
const eventList = ref([
  {
    name: "待测量",
    deadline: "1月15日前",
    person: "谭敬江",
    isImportant: true,
  },
  { name: "待付款", deadline: "1月15日前", person: "赵飞", isImportant: false },
  {
    name: "待核定",
    deadline: "1月15日前",
    person: "谭敬江",
    isImportant: false,
  },
]);

// 处理事件列表行点击
const handleEventRowClick = (row: any) => {
  console.log("点击了事件:", row.name);
  // 这里可以添加点击事件后的处理逻辑
  showTooltip("event", new MouseEvent("click"));
};

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  console.log("选择了菜单:", key);
  // 这里可以添加菜单选择后的处理逻辑
  if (!key) return;
  // 给选中的添加 active 样式

  switch (key) {
    case "home":
      // 处理首页选择
      break;
    case "all-archives":
      // 处理全部档案选择
      break;
    case "order-details":
      // 处理定单详情选择
      break;
    case "contract-details":
      // 处理合同详情选择
      break;
    case "product-details":
      // 处理产品详情选择
      break;
    case "shipment":
      // 处理出货选择
      break;
  }
};

// 处理客户档案按钮点击
const handleProfileClick = () => {
  console.log("点击了进入客户档案");
  // 这里可以添加进入客户档案的处理逻辑
};
</script>

<style scoped>
/* 可以添加组件样式 */
.customBox {
  margin-bottom: 30px !important;
}
.orderPanel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(113, 160, 190);
  padding: 10px 8px;
  border-radius: 2px;
  & span {
    font-weight: 500;
    border-radius: 2px;
    padding: 3px 5px;
    font-size: 14px;
    color: rgb(26, 27, 70);
  }
  & span:nth-of-type(2) {
    background-color: #fff;
    line-height: height;
    padding: 2px 5px;
  }
  & .leftCell {
    min-height: 60px;
    justify-content: space-evenly;
  }
  & span {
  }
}

.leftBox {
  width: 70%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 30px;
}
.rightBox {
  flex: 1;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > .rightCell {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* background-color: red; */
    & > .lastRight {
      display: flex;
      align-items: center;
      /* justify-content: space-between; */
      /* background-color: blue; */
      width: 100%;
      height: 100%;
    }
    & span {
      line-height: height;
      text-align: left;
    }
  }
}
</style>
