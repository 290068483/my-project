<template>
  <div
    name="CustomDoc"
    class="bg-white min-h-screen min-w-full overflow-x-hidden overflow-y-auto relative z-10 mx-auto"
  >
    <div class="min-w-full px-4 sm:px-6 pb-12 mx-auto">
      <!-- 导航标签 -->
      <Header
        preset="custom"
        :defaultActive="'custom-doc'"
        :title="'陆秦-重庆市万科科蓝岸三期'"
      />

      <!-- 主要内容区域 -->
      <div
        class="p-4 sm:p-6 pt-4 pb-12 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 sm:gap-6"
      >
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
import Header from "@/views/components/header/Header.vue";

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
}
</style>
