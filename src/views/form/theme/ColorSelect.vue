<template>
  <div class="color-wrap">
    <div class="label">
      {{ label }}
    </div>
    <el-color-picker
      ref="colorPickerRef"
      v-model="modelValue"
      @change="handleChange"
      show-alpha
      size="default"
      :predefine="predefineColors"
    />
    <el-icon
      size="13"
      class="ml5"
      @click="handleClear"
    >
      <ele-Delete />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  /**
   * 描述文字
   */
  label: {
    type: String,
    default: ""
  },
  /**
   * value
   */
  value: {
    type: String,
    default: ""
  }
});

const modelValue = ref(props.value);

watch(
  () => props.value,
  value => {
    modelValue.value = value;
  }
);

const colorPickerRef = ref(null);

const emit = defineEmits(["update:value"]);

const handleChange = value => {
  emit("update:value", value);
};

const handleClear = () => {
  modelValue.value = "";
  emit("update:value", "");
};

const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577"
]);
</script>
<style scoped lang="scss">
.theme-all-picker {
  cursor: pointer;
  width: 100%;
  position: relative;
  height: 22px;
  border-radius: 4px;
  margin-right: 8px;
}

.color-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .el-icon {
    cursor: pointer;

    &:hover {
      color: var(--el-color-danger);
    }
  }
}

.label {
  color: #333;
  font-size: 12px;
  margin-bottom: 8px;
  margin-top: 16px;
  margin-right: 15px;
}

:deep(.el-color-picker__trigger) {
  width: 120px;
}

:deep(.el-color-picker__color) {
  border: none;
}

:deep(.el-color-picker__color-inner) {
  border: none;
}
</style>
