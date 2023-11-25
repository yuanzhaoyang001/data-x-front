<template>
  <BaseConfig :widgetConfig="widgetConfig" />
  <el-form
    ref="formRef"
    :model="widgetConfig"
    label-width="120px"
    label-position="top"
    size="default"
  >
    <el-form-item :label="$t('form.formPoster.qrcodeConfig.qrCodeUrl')">
      <el-input v-model="widgetConfig.url" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.qrcodeConfig.size')">
      <el-input-number v-model="widgetConfig.size" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.qrcodeConfig.bgColor')">
      <el-color-picker
        v-model="widgetConfig.bgColor"
        :show-alpha="false"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.qrcodeConfig.margin')">
      <el-input-number
        v-model="widgetConfig.margin"
        :min="0"
        :precision="0"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="QrcodeConfig">
import { PropType } from "vue";
import BaseConfig from "../common/BaseConfig.vue";
import { QrcodeWidget } from "./qrcodeWidget";

defineProps({
  widgetConfig: {
    type: Object as PropType<QrcodeWidget>,
    required: true
  }
});
</script>

<style scoped lang="scss"></style>
