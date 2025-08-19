<template name="CustomDoc">
  <div
    class="bg-white min-h-screen min-w-full overflow-x-hidden overflow-y-auto relative z-10"
    :style="{ paddingTop: 'calc(var(--header-height, 80px) + 20px)' }"
  >
    <div class="mx-auto w-full px-4 sm:px-6 pb-12 max-w-7xl">
      <!-- 页面标题 -->
      <div class="border-b border-gray-200">
        <div
          class="flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-0 relative"
        >
          <h1
            class="text-xl sm:text-2xl font-bold text-gray-800 z-10 relative w-full text-center px-2"
          >
            陆秦-重庆市万科科蓝岸三期
          </h1>
          <div
            class="flex items-center text-white bg-blue-500 border-2 rounded-sm border-white z-10 relative mt-2 sm:mt-0 ml-auto px-3 whitespace-nowrap"
          >
            <button
              class="text-white hover:text-blue-800 text-sm font-medium mr-1"
            >
              <i class="el-icon-folder-open mr-1"></i>进入客户文件夹
            </button>
          </div>
        </div>
      </div>

      <!-- 导航标签 -->
      <div
        class="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-4 py-2 overflow-x-auto max-w-7xl mx-auto w-full"
      >
        <el-tabs
          v-model="activeTab"
          type="border-card"
          size="medium"
          class="min-w-full"
        >
          <el-tab-pane label="首页" name="home"></el-tab-pane>
          <el-tab-pane label="全部档案" name="files"></el-tab-pane>
          <el-tab-pane label="订单详情" name="order"></el-tab-pane>
          <el-tab-pane label="合同详情" name="contract"></el-tab-pane>
          <el-tab-pane label="出货·日期" name="delivery"></el-tab-pane>
        </el-tabs>
      </div>

      <!-- 主要内容区域 -->
      <div class="p-4 sm:p-6 pt-4 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- 左侧表格：客户信息 -->
        <el-card
          class="border border-gray-200 rounded-md shadow-sm"
          header-class="bg-gray-50 border-b border-gray-200"
        >
          <template>
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-800">客户信息</span>
              <button
                class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
              >
                <i class="el-icon-edit-outline mr-1"></i>编辑
              </button>
            </div>
          </template>
          <el-table
            :data="customerData"
            style="width: 100%"
            class="custom-table"
          >
            <el-table-column
              prop="label"
              label="项目"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="value"
              label="内容"
              width="200"
            ></el-table-column>
          </el-table>
        </el-card>

        <!-- 右侧表格：日期 -->
        <el-card
          class="border border-gray-200 rounded-md shadow-sm"
          header-class="bg-gray-50 border-b border-gray-200"
        >
          <template>
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-800">日期</span>
              <button
                class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
              >
                <i class="el-icon-edit-outline mr-1"></i>编辑
              </button>
            </div>
          </template>
          <el-table
            :data="dateData"
            border
            style="width: 100%"
            class="custom-table"
          >
            <el-table-column
              prop="label"
              label="项目"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="value"
              label="内容"
              width="200"
            ></el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面结构，无交互实现
import { ref, computed, onMounted, onUnmounted } from "vue";

// 假数据
const activeTab = ref("files");

// 监听header高度变化
const updateHeaderHeight = () => {
  if (document.documentElement) {
    const headerHeight = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--header-height");
    if (headerHeight) {
      document.documentElement.style.setProperty(
        "--header-height",
        headerHeight
      );
    }
  }
};

onMounted(() => {
  // 初始化时更新header高度
  updateHeaderHeight();

  // 监听窗口大小变化
  window.addEventListener("resize", updateHeaderHeight);
});

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  window.removeEventListener("resize", updateHeaderHeight);
});

// 客户信息数据
const customerInfo = {
  id: "10465821",
  name: "陆秦",
  phone: "1392640056",
  altPhone: "15226642801",
  address: "重庆市渝北区",
  property: "龙渊滩古典家",
  district: "重庆市渝北区·南区写字楼",
  houseNumber: "15栋2-6",
  construction: "周末不能施工",
  decorationManager: "刘师傅（18649621102）",
  wechat: "1392640056",
  qq: "53024",
  bankAccount: "6228 4785 6534 6528 (陆秦)",
  doorPassword: "828806#",
  familyMembers: "夫妻2人 + 父母和1小孩",
  age: "35岁左右",
  features: "男的很健谈，女的有气质，两口子意见比较统一",
  preferences: "想做极简，但又不全然黑白灰",
  customer1: "吴玉莲，关系：同事",
  customer2: "赵云潭，关系：亲属",
  communityInfo: "周末不能施工",
};

// 日期数据
const dateInfo = {
  visitDate: "2019/2/28",
  contractDate: "2019/3/16",
  orderDate: "2019/3/28",
  reviewDate: "2019/5/22",
  stockDate: "2019/7/5",
  deliveryDate: "2019/7/8",
  installationDate: "2019/7/9",
  afterSalesDate: "2019/7/15",
  revisitDate: "2019/7/26",
  settlementDate: "2019/7/27",
};

// 客户信息表格数据
const customerData = computed(() => [
  { label: "ID号", value: customerInfo.id },
  { label: "姓名", value: customerInfo.name },
  { label: "电话", value: customerInfo.phone },
  { label: "备用电话", value: customerInfo.altPhone },
  { label: "家庭住址", value: customerInfo.address },
  { label: "楼盘名称", value: customerInfo.property },
  { label: "地区", value: customerInfo.district },
  { label: "房号", value: customerInfo.houseNumber },
  { label: "小区情况", value: customerInfo.construction },
  { label: "装修负责人", value: customerInfo.decorationManager },
  { label: "微信", value: customerInfo.wechat },
  { label: "QQ号", value: customerInfo.qq },
  { label: "银行卡号", value: customerInfo.bankAccount },
  { label: "进门密码", value: customerInfo.doorPassword },
  { label: "家庭成员", value: customerInfo.familyMembers },
  { label: "客户年龄", value: customerInfo.age },
  { label: "客户特征", value: customerInfo.features },
  { label: "意见", value: customerInfo.preferences },
  { label: "喜好特征", value: customerInfo.preferences },
  { label: "子母客户1", value: customerInfo.customer1 },
  { label: "子母客户2", value: customerInfo.customer2 },
  { label: "小区情况", value: customerInfo.communityInfo },
]);

// 日期表格数据
const dateData = computed(() => [
  { label: "到店", value: dateInfo.visitDate },
  { label: "定合", value: dateInfo.contractDate },
  { label: "下单", value: dateInfo.orderDate },
  { label: "审单", value: dateInfo.reviewDate },
  { label: "入库", value: dateInfo.stockDate },
  { label: "送货", value: dateInfo.deliveryDate },
  { label: "安装", value: dateInfo.installationDate },
  { label: "售后", value: dateInfo.afterSalesDate },
  { label: "回访", value: dateInfo.revisitDate },
  { label: "结算", value: dateInfo.settlementDate },
]);
</script>

<style scoped>
/* 自定义样式 */
.custom-table .el-table__cell {
  padding: 10px 12px !important;
  border: 1px solid #dcdcdc !important;
}

.custom-table th.el-table__cell {
  background-color: #f2f2f2 !important;
  font-weight: bold !important;
  border: 1px solid #dcdcdc !important;
}

.custom-table .el-table__header-wrapper,
.custom-table .el-table__body-wrapper {
  border: 1px solid #dcdcdc;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .el-tabs__nav {
    flex-wrap: wrap;
  }
}

/* 大屏幕调整 */
@media (min-width: 1025px) {
  .el-tabs__nav {
    justify-content: center;
    flex-wrap: nowrap;
    width: 100%;
    padding: 0 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    height: 48px;
  }

  .el-tab-pane {
    min-width: 120px;
    text-align: center;
  }

  /* 确保在大屏幕上内容不会被header遮挡 */
  .bg-white {
    padding-top: calc(var(--header-height, 80px) + 20px);
  }
}
</style>
