<template>
  <div>
    <el-row :gutter="12">
      <el-col
        :span="10"
        :xs="14"
      >
        <el-input
          v-model="inputCode"
          :placeholder="$t('formgen.validateCode.placeholderText')"
          :readonly="readonly"
        >
          <template #append>
            <el-button
              v-if="!readonly"
              icon="ele-Select"
              @click="handleCheckCode"
            />
            <el-icon
              color="#439769"
              v-else
            >
              <ele-CircleCheck />
            </el-icon>
          </template>
        </el-input>
        <div class="err-msg">
          {{ msg }}
        </div>
      </el-col>
      <el-col
        :span="12"
        :xs="8"
      >
        <canvas
          style="border-radius: 5px"
          @click="handleClick"
          id="captchaCanvas"
          ref="canvasRef"
          width="100"
          height="30"
        ></canvas>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts" name="ValidateCode">
import { onMounted, ref } from "vue";
import { formEmits, formItemProps, useFormItem } from "../hooks/useFormItemHook";
import { useValidate } from "./useValidate";
import { i18n } from "@/i18n";

const emits = defineEmits(formEmits);

const props = defineProps({
  ...formItemProps,
  length: {
    type: Number,
    default: 4
  }
});

// 待确认验证码
const inputCode = ref("");

const msg = ref("");

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;
const canvasRef = ref(null);

const code = ref("");
const readonly = ref(false);

const validateHook = useValidate();

onMounted(() => {
  handleClick();
});

const handleCheckCode = () => {
  if (!inputCode.value) {
    return;
  }
  if (inputCode.value.trim().toLowerCase() !== code.value.toLowerCase()) {
    msg.value = i18n.global.t("formgen.validateCode.errorText");
  } else {
    msg.value = "";
    changeValue.value = inputCode.value;
    readonly.value = true;
  }
};

const handleClick = () => {
  // 初始化验证码
  code.value = validateHook.drawCaptcha(canvasRef, props.length);
};
</script>

<style scoped lang="scss">
.err-msg {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-left: 5px;
}
</style>
