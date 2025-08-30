<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button circle icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="Object.keys(columns).length > 0">
        <el-button circle icon="Menu" @click="showColumn()" v-if="showColumnsType == 'transfer'"/>
        <el-dropdown trigger="click" :hide-on-click="false" style="padding-left: 12px" v-if="showColumnsType == 'checkbox'">
          <el-button circle icon="Menu" />
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 全选/反选 按钮 -->
              <el-dropdown-item>
                <el-checkbox :indeterminate="isIndeterminate" v-model="isChecked" @change="toggleCheckAll"> 列展示 </el-checkbox>
              </el-dropdown-item>
              <div class="check-line"></div>
              <template v-for="(item, key) in columns" :key="item.key">
                <el-dropdown-item>
                  <el-checkbox v-model="item.visible" @change="checkboxChange($event, key)" :label="item.label" />
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="transferData"
        @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  /* 是否显示检索条件 */
  showSearch: {
    type: Boolean,
    default: true
  },
  /* 显隐列信息（数组格式、对象格式） */
  columns: {
    type: [Array, Object],
    default: () => ({})
  },
  /* 是否显示检索图标 */
  search: {
    type: Boolean,
    default: true
  },
  /* 显隐列类型（transfer穿梭框、checkbox复选框） */
  showColumnsType: {
    type: String,
    default: "checkbox"
  },
  /* 右外边距 */
  gutter: {
    type: Number,
    default: 10
  },
})

const emits = defineEmits(['update:showSearch', 'queryTable'])

// 显隐数据
const value = ref<number[]>([])
// 弹出层标题
const title = ref("显示/隐藏")
// 是否显示弹出层
const open = ref(false)

const style = computed(() => {
  const ret: Record<string, string> = {}
  if (props.gutter) {
    ret.marginRight = `${props.gutter / 2}px`
  }
  return ret
})

// 是否全选/半选 状态
const isChecked = computed({
  get: () => Array.isArray(props.columns) ? props.columns.every((col: any) => col.visible) : Object.values(props.columns).every((col: any) => col.visible),
  set: () => {}
})

const isIndeterminate = computed(() => 
  Array.isArray(props.columns) 
    ? props.columns.some((col: any) => col.visible) && !isChecked.value 
    : Object.values(props.columns).some((col: any) => col.visible) && !isChecked.value
)

const transferData = computed(() => 
  Array.isArray(props.columns) 
    ? props.columns.map((item: any, index: number) => ({ key: index, label: item.label })) 
    : Object.keys(props.columns).map((key: string, index: number) => ({ key: index, label: props.columns[key].label }))
)

// 搜索
function toggleSearch() {
  emits("update:showSearch", !props.showSearch)
}

// 刷新
function refresh() {
  emits("queryTable")
}

// 右侧列表数据
function showColumn() {
  open.value = true
  value.value = Array.isArray(props.columns)
    ? props.columns.filter((item: any) => item.visible).map((item: any, index: number) => index)
    : Object.keys(props.columns)
        .filter((key: string) => props.columns[key].visible)
        .map((key: string, index: number) => index)
}

// 关闭弹出层
function closeColumn() {
  open.value = false
}

// 数据变更
function dataChange(newVal: number[]) {
  const newColumns = Array.isArray(props.columns) ? [...props.columns] : { ...props.columns }
  if (Array.isArray(newColumns)) {
    newColumns.forEach((item: any, index: number) => {
      item.visible = newVal.includes(index)
    })
  } else {
    Object.keys(newColumns).forEach((key: string, index: number) => {
      newColumns[key].visible = newVal.includes(index)
    })
  }
  emits('queryTable')
}

// 复选框变化
function checkboxChange(checked: boolean, key: string) {
  emits('queryTable')
}

// 全选/反选
function toggleCheckAll(checked: boolean) {
  const newColumns = Array.isArray(props.columns) ? [...props.columns] : { ...props.columns }
  if (Array.isArray(newColumns)) {
    newColumns.forEach((item: any) => {
      item.visible = checked
    })
  } else {
    Object.keys(newColumns).forEach((key: string) => {
      newColumns[key].visible = checked
    })
  }
  emits('queryTable')
}
</script>

<style lang='scss' scoped>
:deep(.el-transfer__buttons) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.el-transfer__button) {
  margin: 0 0 10px 0;
}

.check-line {
  border-bottom: 1px solid #ebeef5;
  margin: 6px 0;
}
</style>