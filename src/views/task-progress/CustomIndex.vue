<template>
  <div class="component-CustomIndex">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="首页" class="" name="first">
        <!-- 日期信息 -->
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{ "列表内容 " + o }}
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="全部档案" name="second">全部档案</el-tab-pane>
      <el-tab-pane label="订单详情" name="third">订单详情</el-tab-pane>
      <el-tab-pane label="合同详情" name="fourth">合同详情</el-tab-pane>
      <el-tab-pane label="出货-问题" name="fifth">出货-问题</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const activeName = ref("first");

const handleClick = (tab: { name: string }) => {
  console.log(tab);
  activeName.value = tab.name as string;
  // 给点击的tab添加类名 activeName 移除其他没点击的activeName

  const tabRefs = ref<HTMLElement[]>([]);

  onMounted(() => {
    tabRefs.value = Array.from(document.querySelectorAll(".el-tabs__item"));
  });

  tabRefs.value.forEach((item) => {
    if (item) {
      // item.classList.remove('activeName')
      // if (item.textContent === tab.name) {
      //   item.classList.add('activeName')
      // }
    }
  });
};
</script>

<style scoped>
/* 组件样式 */
.activeName {
  background-color: #fff !important;
  color: red !important;
}
</style>
