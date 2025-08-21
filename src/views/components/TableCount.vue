<template>
  <div class="table-count">
    <!-- 数据统计项 -->
    <div class="count-item" v-for="(item, index) in countData" :key="index">
      <p class="count-label">{{ item.label }}</p>
      <p class="count-value" :class="{ 'is-number': item.isNumber }">
        {{ item.value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

/**
 * 组件属性接口定义
 * @interface TableCountProps
 *
 * 该接口定义了TableCount组件的所有属性，用于接收父组件传递的统计数据
 * 所有属性都是可选的，只有当父组件明确传入时才会显示对应的统计项
 */

/**
 * ======================
 * TableCount 组件使用说明
 * ======================
 *
 * 功能概述：
 * TableCount是一个纯展示组件，用于展示父组件传递的统计数据。
 * 组件接收统计项数组，每个对象包含索引、标签和值，直接显示对应的统计数据。
 *
 * 主要特点：
 * 1. 只显示有标签的统计项
 * 2. 自动进行单位转换（<10000用"元">=10000用"万"）
 * 3. 提供美观的UI展示效果
 *
 * 属性说明：
 * - stats: 统计数据数组，每个元素是一个对象，包含index、label和value属性
* - totalUnitPriceLabel: 总估算单价标签，字符串类型，可选 * - avgUnitPriceLabel:
平均单价标签，字符串类型，可选 * - totalContractLabel:
总合同款标签，字符串类型，可选 * - avgContractLabel:
平均合同款标签，字符串类型，可选 * * 事件说明： * - dataUpdated:
当统计数据更新时触发，参数为更新后的统计数据数组 * * 使用示例： * 基础用法： *
<TableCount
  *
  totalLabel="总数量"
  *
  totalAmountLabel="总估算金额"
  *
  totalDepositLabel="总定金"
  *
  avgDepositLabel="平均定金" />
  *


* * 在这个示例中，组件会显示四个统计项，分别对应传入的标签。 *
如果没有传入某个标签，对应的统计项不会显示。
*/
/**
 * 统计项数据结构
 * @interface StatItem
 *
 * 该接口定义了统计项的数据结构，包括索引、值和标签
 */
interface StatItem {
  index: string; // 统计项索引
  value: string | number; // 统计项值
  label: string; // 统计项标签
}

/**
 * 字段映射接口
 * @interface FieldMap
 *
 * 该接口定义了字段映射关系
 */
interface FieldMap {
  [key: string]: string; // 键为字段名，值为对应的属性名
}

/**
 * 组件属性接口定义
 * @interface TableCountProps
 *
 * 该接口定义了TableCount组件的所有属性，用于接收父组件传递的统计数据
 */
interface TableCountProps {
  stats: StatItem[]; // 统计数据数组
  fieldMap?: FieldMap; // 字段映射对象，可选
}

// 默认属性值
const props = withDefaults(defineProps<TableCountProps>(), {
  // 默认空数组
  stats: () => [],
});

/**
 * 格式化金额
 * @param {number | string} amount - 金额数值
 * @param {"万" | "元"} [unit] - 单位，可选，如果未提供则根据数值大小自动选择
 * @returns {string} 格式化后的金额字符串
 *
 * 该函数用于将金额数值格式化为带有单位的字符串，处理了以下情况：
 * 1. 检查输入是否为有效数字
 * 2. 根据数值大小自动选择单位（<10000用"元"，>=10000用"万"）
 * 3. 根据单位类型进行不同的精度处理
 * 4. 返回格式化后的金额字符串
 */
const formatAmount = (amount: number | string, unit?: "万" | "元"): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return "0元";

  // 如果未提供单位，则根据数值大小自动选择
  if (!unit) {
    if (numAmount >= 10000) {
      // 大于等于10000，使用"万"单位
      const wanAmount = numAmount / 10000;
      return `${wanAmount.toFixed(2)}万`;
    } else {
      // 小于10000，使用"元"单位
      return `${Math.round(numAmount)}元`;
    }
  }

  // 如果提供了单位，则按指定单位处理
  const processedAmount =
    unit === "万" ? parseFloat(numAmount.toFixed(2)) : Math.round(numAmount);

  return `${processedAmount}${unit}`;
};

/**
 * 计算统计数据
 * @returns {Array<{label: string, value: string, isNumber: boolean}>} 统计数据数组
 *
 * 该计算属性负责根据父组件传入的统计数据配置，直接显示传入的统计数据
 * 处理流程：
 * 1. 遍历传入的stats数组
 * 2. 对于每个统计项，提取标签和值
 * 3. 应用相应的格式化函数处理数据
 */
const countData = computed(() => {
  if (!props.stats || props.stats.length === 0) return [];

  // 创建结果数组
  const result = [];

  // 遍历传入的统计数据
  props.stats.forEach((item) => {
    // 检查是否有标签
    if (!item.label) return; // 如果没有标签，跳过该项

    // 判断是否为数字类型
    const isNumber =
      typeof item.value === "number" || !isNaN(Number(item.value));

    // 应用格式化函数
    const formattedValue = isNumber
      ? formatAmount(item.value) // 自动选择单位
      : item.value;

    result.push({
      label: item.label,
      value: formattedValue,
      isNumber,
    });
  });

  return result;
});

/**
 * 导出组件名称以便调试
 *
 * 使用defineOptions定义组件的名称，便于在Vue DevTools中识别
 */
defineOptions({
  name: "TableCount",
});

// 添加组件事件
const emit = defineEmits<{
  (
    e: "dataUpdated",
    data: Array<{ label: string; value: string; isNumber: boolean }>
  ): void;
}>();

/**
 * 监听数据变化
 *
 * 该watch用于监听统计数据的变化，当数据变化时触发dataUpdated事件
 */
watch(
  () => props,
  () => {
    emit("dataUpdated", countData.value);
  },
  { deep: true }
);
</script>

<style scoped>
.table-count {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30px;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
}

.count-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-self: start;
  gap: 10px;
  padding: 15px;
  line-height: height;
  min-height: 30px;
  max-width: 15%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  align-items: center; /* 使子元素水平居中对齐 */
}

.count-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.count-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #409eff, #67c23a);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.count-item:hover::before {
  opacity: 1;
}

.count-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  text-align: left;
  text-decoration: underline;
  font-weight: 500;
}

.count-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.count-value.is-number {
  color: #f56c6c;
  font-size: 25px;
  margin-bottom: 5px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .table-count {
    gap: 15px;
  }

  .count-item {
    min-width: 100%;
  }
}
/**
 * ======================
 * TableCount 组件使用说明
 * ======================
 *
 * 功能概述：
 * TableCount是一个纯展示组件，用于展示父组件传递的统计数据。
 * 组件接收统计项数组，每个对象包含索引、标签和值，直接显示对应的统计数据。
 *
 * 主要特点：
 * 1. 只显示有标签的统计项
 * 2. 自动进行单位转换（<10000用"元"，>=10000用"万"）
 * 3. 提供美观的UI展示效果
 *
 * 属性说明：
 * - stats: 统计数据数组，每个元素是一个对象，包含index、label和value属性
 *
 * 事件说明：
 * - dataUpdated: 当统计数据更新时触发，参数为更新后的统计数据数组
 *
 * 使用示例：
 * 基础用法：
 * <TableCount :stats="[
 *   { index: 'total', value: 20, label: '订单总数' },
 *   { index: 'amount', value: 300000, label: '总金额' },
 *   { index: 'deposit', value: 50000, label: '定金' }
 * ]" />
 *
 * 在这个示例中，组件会显示三个统计项，分别对应传入的对象中的label。
 * 如果对象中没有label，对应的统计项不会显示。
 * 数字类型的值会根据数值大小自动选择单位（<10000用"元"，>=10000用"万"）。
 */
</style>
