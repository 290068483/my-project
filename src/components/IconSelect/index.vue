<template>
  <div class="icon-body">
    <el-input
      v-model="iconName"
      class="icon-search"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix><el-icon><Search /></el-icon></template>
    </el-input>
    <div class="icon-list">
      <div class="list-container">
        <div v-for="(item, index) in iconList" class="icon-item-wrapper" :key="index" @click="selectedIcon(item)">
          <div :class="['icon-item', { active: activeIcon === item }]">
            <el-icon :size="20"><component :is="item" /></el-icon>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 定义属性
const props = defineProps({
  activeIcon: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['selected'])

// 图标名称搜索
const iconName = ref('')

// 图标列表
const iconList = ref<string[]>([])

// 获取所有图标名称
const icons = Object.keys(ElementPlusIconsVue)

// 过滤图标
function filterIcons() {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter(item => item.toLowerCase().includes(iconName.value.toLowerCase()))
  }
}

// 选择图标
function selectedIcon(name: string) {
  emit('selected', name)
  document.body.click()
}

// 重置
function reset() {
  iconName.value = ''
  iconList.value = icons
}

// 初始化图标列表
iconList.value = icons

// 暴露方法
defineExpose({
  reset
})
</script>

<style lang='scss' scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  
  .icon-search {
    position: relative;
    margin-bottom: 5px;
  }
  
  .icon-list {
    height: 200px;
    overflow: auto;
    
    .list-container {
      display: flex;
      flex-wrap: wrap;
      
      .icon-item-wrapper {
        width: calc(100% / 3);
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        display: flex;
        
        .icon-item {
          display: flex;
          max-width: 100%;
          height: 100%;
          padding: 0 5px;
          
          &:hover {
            background: #ececec;
            border-radius: 5px;
          }
          
          span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            padding-left: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          &.active {
            background: #409eff;
            color: #fff;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>