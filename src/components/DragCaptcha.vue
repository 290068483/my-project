<template>
  <div class="drag-captcha-container">
    <div class="captcha-panel" ref="captchaPanelRef">
      <!-- 背景图片 -->
      <div class="captcha-background">
        <canvas ref="backgroundCanvasRef" :width="canvasWidth" :height="canvasHeight" class="background-canvas">
        </canvas>
      </div>

      <!-- 拖拽块 -->
      <div
        class="captcha-block"
        ref="captchaBlockRef"
        :style="{ left: blockLeft + 'px', top: blockTop + 'px' }"
        @mousedown="startDrag"
        @touchstart="startDrag">
        <canvas ref="blockCanvasRef" :width="blockSize" :height="blockSize" class="block-canvas"> </canvas>
      </div>

      <!-- 缺失的图案区域 -->
      <div class="captcha-gap" :style="{ left: gapLeft + 'px', top: gapTop + 'px' }"></div>
    </div>

    <!-- 拖拽滑块 -->
    <div class="drag-slider" ref="dragSliderRef">
      <div class="slider-track">
        <div class="slider-fill" :style="{ width: sliderProgress + '%' }"></div>
        <div
          class="slider-handle"
          ref="sliderHandleRef"
          :style="{ left: sliderLeft + 'px' }"
          @mousedown="startSliderDrag"
          @touchstart="startSliderDrag">
          <span class="slider-text">{{ sliderText }}</span>
        </div>
      </div>
    </div>

    <!-- 验证状态 -->
    <div class="verification-status" v-if="verificationStatus">
      <el-icon class="status-icon" :class="verificationStatusClass">
        <Check v-if="isVerified" />
        <Close v-else />
      </el-icon>
      <span :class="verificationStatusClass">{{ verificationMessage }}</span>
    </div>

    <!-- 刷新按钮 -->
    <div class="refresh-button" @click="refreshCaptcha">
      <el-icon><Refresh /></el-icon>
      <span>刷新验证码</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { ElIcon, ElMessage } from "element-plus";
import { Check, Close, Refresh } from "@element-plus/icons-vue";

// 定义组件事件
const emit = defineEmits<{
  verified: [success: boolean, token?: string];
  refresh: [];
}>();

// 定义组件属性
interface Props {
  width?: number;
  height?: number;
  blockSize?: number;
  tolerance?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 150,
  blockSize: 42,
  tolerance: 5,
  disabled: false,
});

// 响应式数据
const canvasWidth = computed(() => props.width);
const canvasHeight = computed(() => props.height);
const blockSize = computed(() => props.blockSize);

// DOM引用
const captchaPanelRef = ref<HTMLElement>();
const backgroundCanvasRef = ref<HTMLCanvasElement>();
const blockCanvasRef = ref<HTMLCanvasElement>();
const captchaBlockRef = ref<HTMLElement>();
const dragSliderRef = ref<HTMLElement>();
const sliderHandleRef = ref<HTMLElement>();

// 拖拽状态
const isDragging = ref(false);
const isSliderDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const sliderStartX = ref(0);

// 位置状态
const blockLeft = ref(0);
const blockTop = ref(0);
const gapLeft = ref(0);
const gapTop = ref(0);
const sliderLeft = ref(0);

// 验证状态
const isVerified = ref(false);
const verificationStatus = ref(false);
const verificationMessage = ref("");

// 计算属性
const sliderProgress = computed(() => {
  const maxWidth = (dragSliderRef.value?.offsetWidth || 260) - 50;
  return (sliderLeft.value / maxWidth) * 100;
});

const sliderText = computed(() => {
  if (isVerified.value) return "验证成功";
  if (verificationStatus.value && !isVerified.value) return "验证失败";
  return "向右拖动滑块填补图案";
});

const verificationStatusClass = computed(() => ({
  success: isVerified.value,
  error: verificationStatus.value && !isVerified.value,
}));

// 生成随机验证码图案
const generateCaptcha = async () => {
  if (!backgroundCanvasRef.value || !blockCanvasRef.value) return;

  const bgCanvas = backgroundCanvasRef.value;
  const blockCanvas = blockCanvasRef.value;
  const bgCtx = bgCanvas.getContext("2d");
  const blockCtx = blockCanvas.getContext("2d");

  if (!bgCtx || !blockCtx) return;

  // 清空画布
  bgCtx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  blockCtx.clearRect(0, 0, blockSize.value, blockSize.value);

  // 生成随机背景
  await drawRandomBackground(bgCtx);

  // 生成拼图位置
  generatePuzzlePosition();

  // 绘制拼图缺口和拼图块
  drawPuzzlePiece(bgCtx, blockCtx);

  // 重置状态
  resetVerificationState();
};

// 绘制随机背景
const drawRandomBackground = async (ctx: CanvasRenderingContext2D) => {
  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth.value, canvasHeight.value);
  gradient.addColorStop(0, `hsl(${Math.random() * 360}, 70%, 80%)`);
  gradient.addColorStop(1, `hsl(${Math.random() * 360}, 70%, 60%)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

  // 添加噪点
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
    ctx.fillRect(Math.random() * canvasWidth.value, Math.random() * canvasHeight.value, 2, 2);
  }
};

// 生成拼图位置
const generatePuzzlePosition = () => {
  const maxX = canvasWidth.value - blockSize.value - 20;
  const maxY = canvasHeight.value - blockSize.value - 20;

  gapLeft.value = 50 + Math.random() * (maxX - 50);
  gapTop.value = 20 + Math.random() * (maxY - 20);

  // 初始化拖拽块位置
  blockLeft.value = 0;
  blockTop.value = gapTop.value;
};

// 绘制拼图块
const drawPuzzlePiece = (bgCtx: CanvasRenderingContext2D, blockCtx: CanvasRenderingContext2D) => {
  const path = createPuzzlePath();

  // 在背景画布上创建缺口
  bgCtx.save();
  bgCtx.globalCompositeOperation = "destination-out";
  bgCtx.translate(gapLeft.value, gapTop.value);
  bgCtx.fill(path);
  bgCtx.restore();

  // 在拼图块画布上绘制图案
  blockCtx.save();
  blockCtx.fillStyle = bgCtx.createPattern(backgroundCanvasRef.value!, "no-repeat") || "#f0f0f0";
  blockCtx.translate(-gapLeft.value, -gapTop.value);
  blockCtx.fill(path);
  blockCtx.restore();

  // 添加边框
  blockCtx.strokeStyle = "#fff";
  blockCtx.lineWidth = 2;
  blockCtx.stroke(path);
};

// 创建拼图路径
const createPuzzlePath = (): Path2D => {
  const path = new Path2D();
  const size = blockSize.value;
  const r = size * 0.1; // 圆角半径

  // 创建不规则拼图形状
  path.moveTo(r, 0);
  path.lineTo(size - r, 0);
  path.quadraticCurveTo(size, 0, size, r);
  path.lineTo(size, size * 0.3);

  // 添加凸起
  path.arc(size - r, size * 0.4, r, 0, Math.PI * 2);

  path.lineTo(size, size - r);
  path.quadraticCurveTo(size, size, size - r, size);
  path.lineTo(size * 0.6, size);

  // 添加凹陷
  path.arc(size * 0.5, size - r, r, 0, Math.PI * 2, true);

  path.lineTo(r, size);
  path.quadraticCurveTo(0, size, 0, size - r);
  path.lineTo(0, r);
  path.quadraticCurveTo(0, 0, r, 0);

  return path;
};

// 开始拖拽
const startDrag = (event: MouseEvent | TouchEvent) => {
  if (props.disabled || isVerified.value) return;

  event.preventDefault();
  isDragging.value = true;

  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

  dragStartX.value = clientX - blockLeft.value;
  dragStartY.value = clientY - blockTop.value;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
};

// 拖拽过程
const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  event.preventDefault();
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

  const newLeft = clientX - dragStartX.value;
  const maxLeft = canvasWidth.value - blockSize.value;

  blockLeft.value = Math.max(0, Math.min(newLeft, maxLeft));

  // 同步滑块位置
  const maxSliderWidth = (dragSliderRef.value?.offsetWidth || 260) - 50;
  sliderLeft.value = (blockLeft.value / maxLeft) * maxSliderWidth;
};

// 停止拖拽
const stopDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);

  // 验证位置
  verifyPosition();
};

// 开始滑块拖拽
const startSliderDrag = (event: MouseEvent | TouchEvent) => {
  if (props.disabled || isVerified.value) return;

  event.preventDefault();
  isSliderDragging.value = true;

  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  sliderStartX.value = clientX - sliderLeft.value;

  document.addEventListener("mousemove", onSliderDrag);
  document.addEventListener("mouseup", stopSliderDrag);
  document.addEventListener("touchmove", onSliderDrag);
  document.addEventListener("touchend", stopSliderDrag);
};

// 滑块拖拽过程
const onSliderDrag = (event: MouseEvent | TouchEvent) => {
  if (!isSliderDragging.value) return;

  event.preventDefault();
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

  const newLeft = clientX - sliderStartX.value;
  const maxSliderWidth = (dragSliderRef.value?.offsetWidth || 260) - 50;

  sliderLeft.value = Math.max(0, Math.min(newLeft, maxSliderWidth));

  // 同步拼图块位置
  const maxBlockLeft = canvasWidth.value - blockSize.value;
  blockLeft.value = (sliderLeft.value / maxSliderWidth) * maxBlockLeft;
};

// 停止滑块拖拽
const stopSliderDrag = () => {
  if (!isSliderDragging.value) return;

  isSliderDragging.value = false;

  document.removeEventListener("mousemove", onSliderDrag);
  document.removeEventListener("mouseup", stopSliderDrag);
  document.removeEventListener("touchmove", onSliderDrag);
  document.removeEventListener("touchend", stopSliderDrag);

  // 验证位置
  verifyPosition();
};

// 验证位置
const verifyPosition = () => {
  const tolerance = props.tolerance;
  const distance = Math.abs(blockLeft.value - gapLeft.value);

  verificationStatus.value = true;

  if (distance <= tolerance) {
    isVerified.value = true;
    verificationMessage.value = "验证成功！";

    // 自动对齐到正确位置
    blockLeft.value = gapLeft.value;
    const maxSliderWidth = (dragSliderRef.value?.offsetWidth || 260) - 50;
    const maxBlockLeft = canvasWidth.value - blockSize.value;
    sliderLeft.value = (gapLeft.value / maxBlockLeft) * maxSliderWidth;

    // 生成验证token
    const token = generateVerificationToken();
    emit("verified", true, token);

    ElMessage.success("验证成功！");
  } else {
    isVerified.value = false;
    verificationMessage.value = "验证失败，请重试";

    // 延迟重置位置
    setTimeout(() => {
      resetPosition();
    }, 1000);

    emit("verified", false);
    ElMessage.error("验证失败，请重试");
  }
};

// 生成验证token
const generateVerificationToken = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `captcha_${timestamp}_${random}`;
};

// 重置位置
const resetPosition = () => {
  blockLeft.value = 0;
  sliderLeft.value = 0;
  verificationStatus.value = false;
  isVerified.value = false;
  verificationMessage.value = "";
};

// 重置验证状态
const resetVerificationState = () => {
  resetPosition();
  sliderLeft.value = 0;
};

// 刷新验证码
const refreshCaptcha = async () => {
  emit("refresh");
  await nextTick();
  await generateCaptcha();
};

// 组件挂载
onMounted(async () => {
  await nextTick();
  await generateCaptcha();
});

// 暴露方法
defineExpose({
  refresh: refreshCaptcha,
  reset: resetVerificationState,
  isVerified: () => isVerified.value,
});
</script>

<style scoped>
.drag-captcha-container {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.captcha-panel {
  position: relative;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
}

.captcha-background {
  position: relative;
  width: 100%;
  height: 150px;
}

.background-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.captcha-block {
  position: absolute;
  cursor: pointer;
  transition: box-shadow 0.2s;
  z-index: 10;
}

.captcha-block:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.captcha-block.dragging {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.block-canvas {
  display: block;
  border-radius: 2px;
}

.captcha-gap {
  position: absolute;
  width: 42px;
  height: 42px;
  border: 2px dashed #409eff;
  border-radius: 2px;
  background: rgba(64, 158, 255, 0.1);
  z-index: 5;
}

.drag-slider {
  margin-top: 15px;
  padding: 0 10px;
}

.slider-track {
  position: relative;
  height: 40px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  overflow: hidden;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 20px;
  transition: width 0.2s ease;
}

.slider-handle {
  position: absolute;
  top: 0;
  width: 50px;
  height: 40px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.slider-handle:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.slider-handle.dragging {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.slider-text {
  position: absolute;
  left: 60px;
  white-space: nowrap;
  font-size: 14px;
  color: #909399;
  pointer-events: none;
  transition: color 0.2s;
}

.verification-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-size: 14px;
  gap: 5px;
}

.verification-status.success {
  color: #67c23a;
}

.verification-status.error {
  color: #f56c6c;
}

.status-icon {
  font-size: 16px;
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 8px 16px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.2s;
  gap: 5px;
}

.refresh-button:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .drag-captcha-container {
    max-width: 100%;
  }

  .captcha-panel {
    height: 120px;
  }

  .slider-text {
    font-size: 12px;
  }
}
</style>
