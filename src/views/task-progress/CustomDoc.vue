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
                v-if="!isEditing"
                @click="startEditing"
                class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
              >
                <i class="el-icon-edit-outline mr-1"></i>编辑
              </button>
              <div v-else class="flex space-x-2">
                <button
                  @click="saveEditing"
                  class="text-green-500 hover:text-green-700 text-sm flex items-center"
                >
                  <i class="el-icon-check mr-1"></i>保存
                </button>
                <button
                  @click="cancelEditing"
                  class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                >
                  <i class="el-icon-close mr-1"></i>取消
                </button>
              </div>
            </div>
          </template>
          <el-table
            :data="isEditing ? editingData : customerData"
            style="width: 100%"
            class="custom-table"
            border
            :cell-style="{ padding: '10px 12px' }"
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
                v-if="!isEditing"
                @click="startEditing"
                class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
              >
                <i class="el-icon-edit-outline mr-1"></i>编辑
              </button>
              <div v-else class="flex space-x-2">
                <button
                  @click="saveEditing"
                  class="text-green-500 hover:text-green-700 text-sm flex items-center"
                >
                  <i class="el-icon-check mr-1"></i>保存
                </button>
                <button
                  @click="cancelEditing"
                  class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                >
                  <i class="el-icon-close mr-1"></i>取消
                </button>
              </div>
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
// const activeTab = ref("files"); // 注释掉未使用的变量

// 定义数据类型接口
interface TableDataItem {
  label: string;
  value: string;
}

// 编辑状态管理
const isEditing = ref(false);
const editingData = ref<TableDataItem[]>([]);

// 开始编辑
const startEditing = () => {
  isEditing.value = true;
  // 创建编辑数据副本
  editingData.value = JSON.parse(JSON.stringify(customerData.value));
};

// 保存编辑
const saveEditing = () => {
  // 这里可以添加保存逻辑，比如API调用
  customerInfo.id = editingData.value[0].value;
  customerInfo.name = editingData.value[1].value;
  customerInfo.phone = editingData.value[2].value;
  customerInfo.altPhone = editingData.value[3].value;
  customerInfo.address = editingData.value[4].value;
  customerInfo.property = editingData.value[5].value;
  customerInfo.district = editingData.value[6].value;
  customerInfo.houseNumber = editingData.value[7].value;
  customerInfo.construction = editingData.value[8].value;
  customerInfo.decorationManager = editingData.value[9].value;
  customerInfo.wechat = editingData.value[10].value;
  customerInfo.qq = editingData.value[11].value;
  customerInfo.bankAccount = editingData.value[12].value;
  customerInfo.doorPassword = editingData.value[13].value;
  customerInfo.familyMembers = editingData.value[14].value;
  customerInfo.age = editingData.value[15].value;
  customerInfo.features = editingData.value[16].value;
  customerInfo.preferences = editingData.value[17].value;
  customerInfo.customer1 = editingData.value[18].value;
  customerInfo.customer2 = editingData.value[19].value;
  customerInfo.communityInfo = editingData.value[20].value;

  // 更新表格数据
  // 由于customerData是computed属性，它会自动更新，不需要直接赋值
  isEditing.value = false;
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
  editingData.value = [];
};

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
  { label: "装修偏好", value: customerInfo.preferences },
  { label: "联系人1", value: customerInfo.customer1 },
  { label: "联系人2", value: customerInfo.customer2 },
  { label: "备注信息", value: customerInfo.communityInfo },
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

// 组件挂载时初始化数据
onMounted(() => {
  // 可以在这里添加初始化逻辑
  // 可以在这里获取数据或执行其他初始化操作
});
</script>

<style scoped>
/* 自定义样式 */
.custom-table .el-table__cell {
  padding: 10px 12px !important;
  border: 1px solid #e4e7ed !important;
}

.custom-table th.el-table__cell {
  background-color: #f5f7fa !important;
  font-weight: bold !important;
  color: #333;
}

/* 卡片样式优化 */
.el-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.1);
}

.el-card .el-card__header {
  padding: 12px 15px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

/* 按钮样式 */
button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 14px;
}

button:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

/* 表格内容溢出处理 */
.custom-table .el-table__body-wrapper {
  overflow-x: hidden;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .grid-cols-1.lg\:grid-cols-4.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-4.md\:grid-cols-2 {
    grid-template-columns: 1fr 1fr;
  }
}

/* 编辑状态样式 */
.editing-row .el-input__inner {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
}
</style>
