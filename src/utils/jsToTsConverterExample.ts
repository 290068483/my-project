/**
 * JavaScript 到 TypeScript 转换器使用示例
 * 演示各种使用场景和功能
 */

import {
  convertJSToTS,
  quickConvert,
  convertWithStrictMode,
  convertWithFastMode,
  convertObjectDefinition,
  convertFunctionDefinition,
} from "@/utils/jsToTsConverter";

/**
 * 基础使用示例
 */
export async function basicUsageExample() {
  console.log("=== 基础使用示例 ===");

  // 1. 简单变量转换
  const simpleVar = await quickConvert('let greeting = "Hello World";');
  console.log("简单变量:", simpleVar);

  // 2. 数字类型
  const numberVar = await quickConvert("const PI = 3.14159;");
  console.log("数字类型:", numberVar);

  // 3. 布尔类型
  const boolVar = await quickConvert("var isEnabled = true;");
  console.log("布尔类型:", boolVar);
}

/**
 * 完整转换示例（带详细信息）
 */
export async function fullConversionExample() {
  console.log("\n=== 完整转换示例 ===");

  const jsCode = `
    let userName = "Alice";
    const userAge = 25;
    var isAdmin = false;
  `;

  const result = await convertJSToTS(jsCode);

  console.log("转换成功:", result.success);
  console.log("转换后代码:");
  console.log(result.tsCode);
  console.log("统计信息:", result.statistics);

  if (result.warnings.length > 0) {
    console.log("警告:", result.warnings);
  }

  if (result.errors.length > 0) {
    console.log("错误:", result.errors);
  }
}

/**
 * 批量转换示例
 */
export async function batchConversionExample() {
  console.log("\n=== 批量转换示例 ===");

  const jsCodes = [
    'let title = "My App";',
    "const version = 1.0;",
    "var debugMode = true;",
    'let config = { theme: "dark" };',
  ];

  console.log("批量转换结果:");
  for (let i = 0; i < jsCodes.length; i++) {
    try {
      const tsCode = await quickConvert(jsCodes[i]);
      console.log(`${i + 1}. ${jsCodes[i]} → ${tsCode}`);
    } catch (error) {
      console.log(`${i + 1}. 转换失败: ${error.message}`);
    }
  }
}

/**
 * 错误处理示例
 */
export async function errorHandlingExample() {
  console.log("\n=== 错误处理示例 ===");

  const invalidCodes = [
    "let invalid = ;", // 语法错误
    'const = "test";', // 缺少变量名
    "", // 空代码
  ];

  for (const code of invalidCodes) {
    try {
      const result = await quickConvert(code);
      console.log(`成功转换: ${code} → ${result}`);
    } catch (error) {
      console.log(`转换失败: "${code}" - ${error.message}`);
    }
  }
}

/**
 * 高级功能示例
 */
export async function advancedFeaturesExample() {
  console.log("\n=== 高级功能示例 ===");

  try {
    // 1. 严格模式转换
    const strictResult = await convertWithStrictMode("let data = [1, 2, 3];");
    console.log("严格模式:", strictResult);

    // 2. 快速模式转换
    const fastResult = await convertWithFastMode("const settings = { auto: true };");
    console.log("快速模式:", fastResult);

    // 3. 对象定义转换
    const objResult = await convertObjectDefinition(`
      const user = {
        id: 1,
        name: "John",
        active: true
      };
    `);
    console.log("对象转换:", objResult.tsCode);
    console.log("生成接口:", objResult.interfaces);
  } catch (error) {
    console.log("高级功能错误:", error.message);
  }
}

/**
 * 在 Vue 组件中的使用示例
 */
export function vueComponentExample() {
  return `
<template>
  <div class="js-to-ts-converter">
    <h2>JavaScript 到 TypeScript 转换器</h2>

    <div class="input-section">
      <label>输入 JavaScript 代码:</label>
      <textarea
        v-model="jsInput"
        placeholder="let name = 'John';"
        rows="5"
      ></textarea>
    </div>

    <div class="actions">
      <button @click="convertCode" :disabled="loading">
        {{ loading ? '转换中...' : '转换' }}
      </button>
      <button @click="clearAll">清空</button>
    </div>

    <div v-if="tsOutput" class="output-section">
      <label>TypeScript 代码:</label>
      <pre><code>{{ tsOutput }}</code></pre>
    </div>

    <div v-if="error" class="error">
      错误: {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { quickConvert } from '@/utils/jsToTsConverter';

const jsInput = ref('');
const tsOutput = ref('');
const error = ref('');
const loading = ref(false);

const convertCode = async () => {
  if (!jsInput.value.trim()) {
    error.value = '请输入 JavaScript 代码';
    return;
  }

  loading.value = true;
  error.value = '';
  tsOutput.value = '';

  try {
    const result = await quickConvert(jsInput.value);
    tsOutput.value = result;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const clearAll = () => {
  jsInput.value = '';
  tsOutput.value = '';
  error.value = '';
};
</script>
  `;
}

/**
 * 运行所有示例
 */
export async function runAllExamples() {
  console.log("🚀 JavaScript 到 TypeScript 转换器使用示例\n");

  await basicUsageExample();
  await fullConversionExample();
  await batchConversionExample();
  await errorHandlingExample();
  await advancedFeaturesExample();

  console.log("\n✅ 所有示例运行完成！");
}

// 如果直接运行此文件
if (import.meta.main) {
  runAllExamples().catch(console.error);
}
