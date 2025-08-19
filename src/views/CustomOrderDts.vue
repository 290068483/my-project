<template>
  <div class="custom-order-dts">
    <!-- header -->
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
    />
    <!-- 内容信息 -->

    <CustomerContent>
      <div class="cusContentBox">
        <div class="cell">
          <div><span>客户姓名：</span><span></span></div>
          <div><span>客户电话：</span><span></span></div>
        </div>
        <div class="cell">
          <div><span>备用电话：</span><span></span></div>
          <div><span>订单号：</span><span></span></div>
        </div>
        <div class="cell">
          <div><span>订购日期：</span><span></span></div>
          <div><span>定金：</span><span></span></div>
        </div>
      </div>
    </CustomerContent>
  </div>
</template>

<script setup lang="ts">
import CustomHeader from "@/components/CustomHeader.vue";
import CustomerContent from "@/components/CustomerContent.vue";
import { ref } from "vue";

// 定义表格数据
const tableData = ref([
  {
    name: "1",
    phone: "2",
    backupPhone: "3",
    orderNumber: "4",
    orderDate: "5",
    deposit: "6",
  },
]);
// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
.cusContentBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
  &.cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
  }
}
</style>
