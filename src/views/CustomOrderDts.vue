<template>
  <div class="custom-order-dts">
    <!-- header -->
    <Header
      preset="custom"
      :defaultActive="'custom-dts'"
      :title="'陆泰-重庆市万科蓝岸三期'"
      :titleStyle="docTitle"
    />
    <!-- 内容信息 -->

    <CustomerContent>
      <div class="cusContentBox flex items-center gap-1 bg-[#048791]">
        <el-descriptions
          class="descBox min-h-[400px] p-3"
          title="九素-全屋定制订购单"
          align-items="center"
          label-align="right"
          width="150px"
        >
          <el-descriptions-item
            label="九素-全屋定制订购单"
            label-align="center"
            class="bg-transparent"
          ></el-descriptions-item>
          <el-descriptions-item label="Username"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="Telephone"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
          <el-descriptions-item label="Remarks"
            >Content of property to be described</el-descriptions-item
          >
        </el-descriptions>
        <div class="rightBox">
          <div>
            <h1>订单编号：</h1>
            <p>202308240001</p>
          </div>
          <div>
            <h1>订单编号：</h1>
            <p>202308240001</p>
          </div>
        </div>
      </div>
    </CustomerContent>
  </div>
</template>

<script setup lang="ts">
import Header from "../views/components/header/Header.vue";

import CustomerContent from "@/components/CustomerContent.vue";
const docTitle = "text-5xl text-center  min-w-[80%] font-bold text-gray-800";

// 组件逻辑
</script>

<style>
/* 组件样式 */

.el-descriptions__title {
  text-align: center;
  width: 100%;
}

.cusContentBox {
  width: 100%;
  /* min-height: 400px; */
  min-height: 400px;
  min-width: 800px;
  margin: 0 auto;
}
.descBox {
  width: 50%;
  height: 100%;
  /* 凹进去的竖线效果 - 方法1: 使用内阴影 */
  box-shadow:
    inset 1px 0 0 0 #3f3d3d,
    /* 内阴影 */ inset -1px 0 0 0 rgba(255, 255, 255, 0.1); /* 右侧轻微内阴影增加立体感 */
  /* 或者使用方法2: 伪元素实现更明显的凹槽效果 */
  /* position: relative; */
}

/* 方法2: 使用伪元素实现凹槽效果 */
.descBox::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgba(63, 61, 61, 0.9),
    /* 顶部深色 */ rgba(63, 61, 61, 0.7),
    /* 中间 */ rgba(63, 61, 61, 0.5) /* 底部浅色 */
  );
  box-shadow:
    1px 0 2px rgba(0, 0, 0, 0.3),
    /* 右侧阴影 */ -1px 0 1px rgba(255, 255, 255, 0.1); /* 左侧高光 */
}
/* .descBox::after {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 5px solid #d1e7dd;
  transform: skewX(-5deg) skewY(-5deg);
  z-index: -1;
} */
.rightBox {
  /* width: 50%; */
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  & > div {
    width: 100%;
    height: 50%;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & > h1 {
      font-size: 20px;
      font-weight: 600;
    }
    & > p {
      font-size: 20px;
      font-weight: 400;
    }
  }
}
.el-descriptions__body {
  background-color: transparent;
}
.el-descriptions__content {
  color: black !important;
}
</style>
