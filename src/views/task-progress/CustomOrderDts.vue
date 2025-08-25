<template>
  <div class="custom-order-dts">
    <!-- header -->
    <Header preset="custom" :defaultActive="'custom-dts'" :title="'陆泰-重庆市万科蓝岸三期'" :titleStyle="docTitle" />
    <!-- 内容信息 -->

    <CustomerContent>
      <div class="cusContentBox flex gap-1 bg-[#bfd8ca]">
        <el-descriptions class="descBox" title="九素-全屋定制订购单" :column="1" border>
          <el-descriptions-item label="客户名称">陆秦</el-descriptions-item>
          <el-descriptions-item label="联系电话">1392640056</el-descriptions-item>
          <el-descriptions-item label="项目地址">重庆市渝北区</el-descriptions-item>
          <el-descriptions-item label="楼盘名称">龙渊滩古典家</el-descriptions-item>
          <el-descriptions-item label="装修负责人">刘师傅（18649621102）</el-descriptions-item>
        </el-descriptions>

        <div class="rightBox">
          <div>
            <h1>定单须知：</h1>
            <p>202308240001</p>
          </div>
          <div>
            <h1>常见加费项目 ：</h1>
            <p>2023-08-24</p>
          </div>
        </div>
      </div>
    </CustomerContent>
  </div>
</template>

<script setup lang="ts">
import Header from "@/views/components/header/Header.vue";

import CustomerContent from "@/components/CustomerContent.vue";
const docTitle = "text-5xl text-center  min-w-[80%] font-bold text-gray-800";

// 组件逻辑
</script>

<style scoped>
/* 组件样式 */

.el-descriptions__title {
  text-align: center;
  width: 100%;
}

.cusContentBox {
  width: 100%;
  /* min-height: 400px; */
  height: 100%;
  width: 60%;
  margin: 0 auto;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
}

.descBox {
  width: 50%;
  height: 100%;
  padding: 20px;
  box-shadow:
    inset 1px 0 0 0 #3f3d3d,
    inset -1px 0 0 0 rgba(255, 255, 255, 0.1);
  position: relative;
}

/* 使用伪元素实现凹槽效果 */
.descBox::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 1px;
  background: linear-gradient(to right, rgba(191, 216, 202, 0.9), rgba(191, 216, 202, 0.7), rgba(191, 216, 202, 0.5));
  box-shadow:
    1px 0 2px rgba(0, 0, 0, 0.3),
    -1px 0 1px rgba(255, 255, 255, 0.1);
}

.rightBox {
  flex: 1;
  height: 100%;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; */
  padding: 20px;
  padding-top: 0px;
}

.rightBox > div {
  width: 100%;
  height: 50%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
}

.rightBox > div > h1 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
}

.rightBox > div > p {
  font-size: 20px;
  min-height: 150px;
  min-width: 100%;
  background-color: aliceblue;
  text-indent: 20px;
  line-height: 30px;
  padding-top: 10px;
}
.rightBox > div:first-child {
  margin-top: 0px;
}
.el-descriptions__body {
  background-color: transparent;
}

.el-descriptions__content {
  color: black !important;
}

.descBox {
  min-height: 400px;
}
.rightBox {
  width: 100%;
  height: 100%;
}
</style>
