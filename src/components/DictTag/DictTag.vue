<template>
  <div>
    <template v-for="(item, index) in options" :key="index">
      <template v-if="values.includes(item.value)">
        <span
          v-if="(item.elTagType == 'default' || item.elTagType == '') && (item.elTagClass == '' || item.elTagClass == null)"
          :key="`span-${item.value}`"
          :index="index"
          :class="item.elTagClass"
        >{{ item.label + " " }}</span>
        <el-tag
          v-else
          :disable-transitions="true"
          :key="`tag-${item.value}`"
          :index="index"
          :type="item.elTagType"
          :class="item.elTagClass"
        >{{ item.label + " " }}</el-tag>
      </template>
    </template>
    <template v-if="unmatchArray.length > 0 && showValue">
      {{ unmatchArray.join(separator) }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  // 数据
  options: {
    type: Array as () => Array<{ value: string; label: string; elTagType?: string; elTagClass?: string }>,
    default: () => [],
  },
  // 当前的值
  value: {
    type: [Number, String, Array] as unknown as () => number | string | (number | string)[],
    default: null
  },
  // 当未找到匹配的数据时，显示value
  showValue: {
    type: Boolean,
    default: true,
  },
  separator: {
    type: String,
    default: ",",
  }
})

const values = computed(() => {
  if (props.value === null || typeof props.value === 'undefined' || props.value === '') return []
  if (Array.isArray(props.value)) {
    return props.value.map(item => String(item))
  }
  return [String(props.value)]
})

const unmatchArray = computed(() => {
  // 计算未匹配的值
  const matchedValues = props.options
    .filter(item => values.value.includes(item.value))
    .map(item => item.value)
  
  return values.value.filter(val => !matchedValues.includes(val))
})
</script>