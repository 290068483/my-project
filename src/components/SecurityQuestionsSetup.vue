<template>
  <div class="security-questions-setup">
    <div class="setup-header">
      <h3>设置密保问题</h3>
      <p class="setup-description">
        密保问题用于账户安全验证，请选择您熟悉且他人不易猜测的问题和答案。 建议设置{{
          minQuestions
        }}个问题，以提高账户安全性。
      </p>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="questions-form">
      <div v-for="(item, index) in form.questions" :key="index" class="question-item">
        <div class="question-header">
          <span class="question-number">问题 {{ index + 1 }}</span>
          <el-button
            v-if="form.questions.length > minQuestions"
            type="danger"
            size="small"
            text
            @click="removeQuestion(index)">
            删除
          </el-button>
        </div>

        <el-form-item :label="`问题${index + 1}`" :prop="`questions.${index}.question`" class="question-select">
          <el-select
            v-model="item.question"
            placeholder="请选择安全问题"
            style="width: 100%"
            @change="onQuestionChange(index, $event)">
            <el-option
              v-for="question in availableQuestions"
              :key="question.id"
              :label="question.text"
              :value="question.text"
              :disabled="isQuestionUsed(question.text, index)" />
          </el-select>
        </el-form-item>

        <el-form-item :label="`答案${index + 1}`" :prop="`questions.${index}.answer`" class="answer-input">
          <el-input v-model="item.answer" placeholder="请输入答案" :show-password="!showAnswers[index]" clearable>
            <template #suffix>
              <el-button type="primary" text @click="toggleAnswerVisibility(index)">
                <el-icon>
                  <component :is="showAnswers[index] ? 'Hide' : 'View'" />
                </el-icon>
              </el-button>
            </template>
          </el-input>
          <div class="answer-hint">提示：答案区分大小写，请确保记住准确的答案</div>
        </el-form-item>
      </div>

      <div class="form-actions">
        <el-button v-if="form.questions.length < maxQuestions" type="primary" plain @click="addQuestion">
          <el-icon><Plus /></el-icon>
          添加问题
        </el-button>

        <div class="action-buttons">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="saveQuestions" :loading="saving" :disabled="!isFormValid">
            保存设置
          </el-button>
        </div>
      </div>
    </el-form>

    <!-- 已设置的问题预览 -->
    <div v-if="existingQuestions.length > 0" class="existing-questions">
      <el-divider>当前已设置的安全问题</el-divider>
      <div class="existing-list">
        <div v-for="(question, index) in existingQuestions" :key="index" class="existing-item">
          <div class="existing-question">
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
            <span>{{ question.question }}</span>
          </div>
          <el-button type="primary" size="small" text @click="editExistingQuestion(index)"> 修改 </el-button>
        </div>
      </div>
    </div>

    <!-- 安全提示 -->
    <div class="security-tips">
      <el-divider>安全提示</el-divider>
      <div class="tips-content">
        <div class="tip-item">
          <el-icon class="tip-icon"><InfoFilled /></el-icon>
          <span>选择只有您知道答案的问题</span>
        </div>
        <div class="tip-item">
          <el-icon class="tip-icon"><InfoFilled /></el-icon>
          <span>答案避免使用容易被他人猜测的信息</span>
        </div>
        <div class="tip-item">
          <el-icon class="tip-icon"><InfoFilled /></el-icon>
          <span>定期更新密保问题和答案</span>
        </div>
        <div class="tip-item">
          <el-icon class="tip-icon"><WarningFilled /></el-icon>
          <span>请将答案保存在安全的地方，遗忘将影响账户找回</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, QuestionFilled, InfoFilled, WarningFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { setSecurityQuestions, getSecurityQuestions } from "@/api/authSecurity";

// Props
const props = defineProps<{
  minQuestions?: number;
  maxQuestions?: number;
}>();

// Emits
const emit = defineEmits<{
  saved: [questions: Array<{ question: string; answer: string }>];
  cancel: [];
}>();

// 配置
const minQuestions = props.minQuestions || 2;
const maxQuestions = props.maxQuestions || 5;

// 响应式数据
const formRef = ref<FormInstance>();
const saving = ref(false);
const showAnswers = ref<boolean[]>([]);

// 表单数据
const form = reactive({
  questions: Array.from({ length: minQuestions }, () => ({
    question: "",
    answer: "",
  })),
});

// 已存在的问题
const existingQuestions = ref<Array<{ question: string; answer?: string }>>([]);

// 预定义的安全问题
const predefinedQuestions = [
  { id: 1, text: "您最喜欢的电影是什么？" },
  { id: 2, text: "您的第一个宠物叫什么名字？" },
  { id: 3, text: "您母亲的姓氏是什么？" },
  { id: 4, text: "您小学最好的朋友叫什么名字？" },
  { id: 5, text: "您第一份工作的公司名称是什么？" },
  { id: 6, text: "您最喜欢的老师姓什么？" },
  { id: 7, text: "您第一次去的城市是哪里？" },
  { id: 8, text: "您童年时最喜欢的玩具是什么？" },
  { id: 9, text: "您父亲的中间名是什么？" },
  { id: 10, text: "您学会驾驶的城市名称是什么？" },
  { id: 11, text: "您最喜欢的食物是什么？" },
  { id: 12, text: "您第一次工作的城市是哪里？" },
  { id: 13, text: "您最难忘的生日是哪一年？" },
  { id: 14, text: "您的第一部手机是什么品牌？" },
  { id: 15, text: "您最喜欢的歌手或乐队是什么？" },
];

// 计算可用问题（排除已选择的）
const availableQuestions = computed(() => {
  const usedQuestions = form.questions.map((q) => q.question).filter(Boolean);
  return predefinedQuestions.filter((q) => !usedQuestions.includes(q.text));
});

// 表单验证规则
const rules: FormRules = {
  [`questions.${0}.question`]: [{ required: true, message: "请选择安全问题", trigger: "change" }],
  [`questions.${0}.answer`]: [
    { required: true, message: "请输入答案", trigger: "blur" },
    { min: 2, message: "答案至少2个字符", trigger: "blur" },
  ],
};

// 检查表单是否有效
const isFormValid = computed(() => {
  return form.questions.every((q) => q.question && q.answer && q.answer.length >= 2);
});

// 检查问题是否已被使用
const isQuestionUsed = (question: string, currentIndex: number): boolean => {
  return form.questions.some((q, index) => index !== currentIndex && q.question === question);
};

// 方法
const addQuestion = () => {
  if (form.questions.length < maxQuestions) {
    form.questions.push({ question: "", answer: "" });
    showAnswers.value.push(false);
  }
};

const removeQuestion = (index: number) => {
  if (form.questions.length > minQuestions) {
    form.questions.splice(index, 1);
    showAnswers.value.splice(index, 1);
  }
};

const onQuestionChange = (index: number, question: string) => {
  form.questions[index].question = question;
  // 清空答案，让用户重新输入
  form.questions[index].answer = "";
};

const toggleAnswerVisibility = (index: number) => {
  showAnswers.value[index] = !showAnswers.value[index];
};

const resetForm = () => {
  form.questions = Array.from({ length: minQuestions }, () => ({
    question: "",
    answer: "",
  }));
  showAnswers.value = Array.from({ length: minQuestions }, () => false);
  formRef.value?.clearValidate();
};

const editExistingQuestion = (index: number) => {
  const existing = existingQuestions.value[index];
  // 将已存在的问题加载到表单中进行编辑
  ElMessageBox.confirm("修改此问题将替换当前设置的问题，是否继续？", "确认修改", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 找到一个空的表单项或替换第一个
      const emptyIndex = form.questions.findIndex((q) => !q.question);
      const targetIndex = emptyIndex >= 0 ? emptyIndex : 0;

      form.questions[targetIndex] = {
        question: existing.question,
        answer: "",
      };
    })
    .catch(() => {
      // 用户取消
    });
};

const saveQuestions = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    const questionsData = form.questions.map((q) => ({
      question: q.question,
      answer: q.answer.trim(),
    }));

    const response = await setSecurityQuestions(questionsData);

    if (response.code === 200) {
      ElMessage.success("密保问题设置成功");
      emit("saved", questionsData);

      // 更新已存在的问题列表
      existingQuestions.value = questionsData.map((q) => ({
        question: q.question,
      }));

      // 重置表单
      resetForm();
    } else {
      ElMessage.error(response.msg || "设置失败");
    }
  } catch (error) {
    console.error("设置密保问题失败:", error);
    ElMessage.error("设置失败");
  } finally {
    saving.value = false;
  }
};

// 加载已存在的问题
const loadExistingQuestions = async () => {
  try {
    const response = await getSecurityQuestions();
    if (response.code === 200) {
      existingQuestions.value = response.data.map((q) => ({
        question: q.question,
      }));
    }
  } catch (error) {
    console.error("加载密保问题失败:", error);
  }
};

// 页面挂载时初始化
onMounted(() => {
  // 初始化显示状态
  showAnswers.value = Array.from({ length: form.questions.length }, () => false);

  // 加载已存在的问题
  loadExistingQuestions();
});
</script>

<style scoped>
.security-questions-setup {
  max-width: 800px;
  margin: 0 auto;
}

.setup-header {
  margin-bottom: 24px;
}

.setup-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
}

.setup-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.questions-form {
  margin-bottom: 24px;
}

.question-item {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-number {
  font-weight: 600;
  color: #409eff;
}

.question-select,
.answer-input {
  margin-bottom: 12px;
}

.answer-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.existing-questions {
  margin-bottom: 24px;
}

.existing-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.existing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
}

.existing-question {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-icon {
  color: #409eff;
}

.security-tips {
  margin-top: 24px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.tip-icon {
  color: #909399;
  flex-shrink: 0;
}

.tip-item:last-child {
  color: #e6a23c;
}

.tip-item:last-child .tip-icon {
  color: #e6a23c;
}
</style>
