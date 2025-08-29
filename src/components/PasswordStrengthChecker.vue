<template>
  <div class="password-strength-checker">
    <!-- 密码强度指示器 -->
    <div v-if="password" class="strength-indicator">
      <div class="strength-bar">
        <div class="strength-fill" :class="strengthClass" :style="{ width: `${strengthPercentage}%` }"></div>
      </div>
      <div class="strength-text">
        <span :class="strengthClass">{{ strengthText }}</span>
        <span class="strength-score">({{ strengthScore }}/100)</span>
      </div>
    </div>

    <!-- 密码要求检查列表 -->
    <div v-if="showRequirements" class="requirements-list">
      <div class="requirements-title">密码要求：</div>
      <div class="requirement-item" :class="{ met: requirements.length.met }">
        <el-icon class="requirement-icon">
          <component :is="requirements.length.met ? 'SuccessFilled' : 'CircleCloseFilled'" />
        </el-icon>
        <span>{{ requirements.length.text }}</span>
      </div>
      <div class="requirement-item" :class="{ met: requirements.uppercase.met }">
        <el-icon class="requirement-icon">
          <component :is="requirements.uppercase.met ? 'SuccessFilled' : 'CircleCloseFilled'" />
        </el-icon>
        <span>{{ requirements.uppercase.text }}</span>
      </div>
      <div class="requirement-item" :class="{ met: requirements.lowercase.met }">
        <el-icon class="requirement-icon">
          <component :is="requirements.lowercase.met ? 'SuccessFilled' : 'CircleCloseFilled'" />
        </el-icon>
        <span>{{ requirements.lowercase.text }}</span>
      </div>
      <div class="requirement-item" :class="{ met: requirements.numbers.met }">
        <el-icon class="requirement-icon">
          <component :is="requirements.numbers.met ? 'SuccessFilled' : 'CircleCloseFilled'" />
        </el-icon>
        <span>{{ requirements.numbers.text }}</span>
      </div>
      <div class="requirement-item" :class="{ met: requirements.special.met }">
        <el-icon class="requirement-icon">
          <component :is="requirements.special.met ? 'SuccessFilled' : 'CircleCloseFilled'" />
        </el-icon>
        <span>{{ requirements.special.text }}</span>
      </div>
    </div>

    <!-- 密码建议 -->
    <div v-if="suggestions.length > 0" class="suggestions">
      <div class="suggestions-title">建议：</div>
      <ul class="suggestions-list">
        <li v-for="suggestion in suggestions" :key="suggestion">{{ suggestion }}</li>
      </ul>
    </div>

    <!-- 常见密码警告 -->
    <div v-if="isCommonPassword" class="common-password-warning">
      <el-icon class="warning-icon"><WarningFilled /></el-icon>
      <span>此密码过于常见，建议使用更复杂的密码</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { WarningFilled } from "@element-plus/icons-vue";

// Props定义
const props = defineProps<{
  password: string;
  showRequirements?: boolean;
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}>();

// Emits定义
const emit = defineEmits<{
  strengthChange: [score: number, level: string, isValid: boolean];
}>();

// 默认配置
const config = computed(() => ({
  minLength: props.minLength || 8,
  maxLength: props.maxLength || 20,
  requireUppercase: props.requireUppercase !== false,
  requireLowercase: props.requireLowercase !== false,
  requireNumbers: props.requireNumbers !== false,
  requireSpecialChars: props.requireSpecialChars !== false,
}));

// 常见密码列表（简化版）
const commonPasswords = [
  "123456",
  "password",
  "123456789",
  "12345678",
  "12345",
  "1234567",
  "admin",
  "qwerty",
  "abc123",
  "Password",
  "123123",
  "welcome",
  "login",
  "master",
  "monkey",
  "dragon",
  "pass",
  "mustang",
];

// 密码强度分析
const strengthAnalysis = computed(() => {
  const password = props.password;
  if (!password) {
    return {
      score: 0,
      level: "none",
      suggestions: [],
      isCommon: false,
    };
  }

  let score = 0;
  const suggestions: string[] = [];

  // 长度检查
  if (password.length >= config.value.minLength) {
    score += 20;
  } else {
    suggestions.push(`密码长度至少${config.value.minLength}个字符`);
  }

  if (password.length >= 12) {
    score += 10; // 额外加分
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else if (config.value.requireUppercase) {
    suggestions.push("包含至少一个大写字母");
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 15;
  } else if (config.value.requireLowercase) {
    suggestions.push("包含至少一个小写字母");
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 15;
  } else if (config.value.requireNumbers) {
    suggestions.push("包含至少一个数字");
  }

  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 15;
  } else if (config.value.requireSpecialChars) {
    suggestions.push("包含至少一个特殊字符");
  }

  // 字符种类多样性
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const diversity = [hasUpper, hasLower, hasNumbers, hasSpecial].filter(Boolean).length;

  if (diversity >= 3) {
    score += 10;
  }

  // 避免连续字符
  if (!/(.)\1{2,}/.test(password)) {
    score += 5;
  } else {
    suggestions.push("避免使用连续重复的字符");
  }

  // 避免常见模式
  if (!/123|abc|qwe|asd|zxc/i.test(password)) {
    score += 5;
  } else {
    suggestions.push("避免使用键盘序列或连续字符");
  }

  // 检查是否为常见密码
  const isCommon = commonPasswords.includes(password.toLowerCase());
  if (isCommon) {
    score = Math.min(score, 30); // 常见密码最高30分
    suggestions.push("避免使用常见密码");
  }

  // 确定强度等级
  let level = "weak";
  if (score >= 80) level = "very_strong";
  else if (score >= 60) level = "strong";
  else if (score >= 40) level = "medium";

  return {
    score: Math.min(score, 100),
    level,
    suggestions,
    isCommon,
  };
});

// 计算属性
const strengthScore = computed(() => strengthAnalysis.value.score);
const strengthLevel = computed(() => strengthAnalysis.value.level);
const suggestions = computed(() => strengthAnalysis.value.suggestions);
const isCommonPassword = computed(() => strengthAnalysis.value.isCommon);

const strengthPercentage = computed(() => strengthScore.value);

const strengthClass = computed(() => {
  const level = strengthLevel.value;
  return {
    "strength-weak": level === "weak",
    "strength-medium": level === "medium",
    "strength-strong": level === "strong",
    "strength-very-strong": level === "very_strong",
  };
});

const strengthText = computed(() => {
  const texts = {
    none: "",
    weak: "弱",
    medium: "中等",
    strong: "强",
    very_strong: "很强",
  };
  return texts[strengthLevel.value as keyof typeof texts];
});

// 密码要求检查
const requirements = computed(() => {
  const password = props.password;

  return {
    length: {
      met: password.length >= config.value.minLength && password.length <= config.value.maxLength,
      text: `${config.value.minLength}-${config.value.maxLength}个字符`,
    },
    uppercase: {
      met: !config.value.requireUppercase || /[A-Z]/.test(password),
      text: "包含大写字母",
    },
    lowercase: {
      met: !config.value.requireLowercase || /[a-z]/.test(password),
      text: "包含小写字母",
    },
    numbers: {
      met: !config.value.requireNumbers || /\d/.test(password),
      text: "包含数字",
    },
    special: {
      met: !config.value.requireSpecialChars || /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      text: "包含特殊字符",
    },
  };
});

// 是否满足所有要求
const isValid = computed(() => {
  return Object.values(requirements.value).every((req) => req.met);
});

// 监听密码变化，触发事件
watch(
  [strengthScore, strengthLevel, isValid],
  () => {
    emit("strengthChange", strengthScore.value, strengthLevel.value, isValid.value);
  },
  { immediate: true },
);
</script>

<style scoped>
.password-strength-checker {
  margin-top: 8px;
}

.strength-indicator {
  margin-bottom: 8px;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background-color: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-fill.strength-weak {
  background-color: #f56565;
}

.strength-fill.strength-medium {
  background-color: #ed8936;
}

.strength-fill.strength-strong {
  background-color: #48bb78;
}

.strength-fill.strength-very-strong {
  background-color: #38a169;
}

.strength-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.strength-text span.strength-weak {
  color: #f56565;
}

.strength-text span.strength-medium {
  color: #ed8936;
}

.strength-text span.strength-strong {
  color: #48bb78;
}

.strength-text span.strength-very-strong {
  color: #38a169;
}

.strength-score {
  color: #909399;
}

.requirements-list {
  margin-bottom: 8px;
}

.requirements-title {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.requirement-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.requirement-item.met {
  color: #67c23a;
}

.requirement-icon {
  margin-right: 4px;
  font-size: 14px;
}

.requirement-item:not(.met) .requirement-icon {
  color: #f56565;
}

.requirement-item.met .requirement-icon {
  color: #67c23a;
}

.suggestions {
  margin-bottom: 8px;
}

.suggestions-title {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.suggestions-list {
  margin: 0;
  padding-left: 16px;
}

.suggestions-list li {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.common-password-warning {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #e6a23c;
  background-color: #fdf6ec;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #f5dab1;
}

.warning-icon {
  margin-right: 4px;
  font-size: 14px;
}
</style>
