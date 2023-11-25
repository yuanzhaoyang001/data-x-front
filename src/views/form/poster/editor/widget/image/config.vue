<template>
  <BaseConfig :widgetConfig="widgetConfig" />
  <el-form
    ref="formRef"
    :model="widgetConfig"
    label-width="120px"
    label-position="top"
  >
    <el-form-item :label="$t('form.formPoster.imgConfig.imgUrl')">
      <TImageUpload
        v-model:value="widgetConfig.imgUrl"
        :limit="1"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.imgConfig.zoomMode')">
      <el-select v-model="widgetConfig.zoomMode">
        <el-option
          :label="$t('form.formPoster.imgConfig.height')"
          :value="ZoomMode.Height"
        />
        <el-option
          :label="$t('form.formPoster.imgConfig.width')"
          :value="ZoomMode.Width"
        />
        <el-option
          :label="$t('form.formPoster.imgConfig.widthHeight')"
          :value="ZoomMode.WidthHeight"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.imgConfig.blur')">
      <el-input-number v-model="widgetConfig.blur" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.imgConfig.rotate')">
      <el-input-number v-model="widgetConfig.rotate" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="ImageConfig">
import { PropType } from "vue";
import BaseConfig from "../common/BaseConfig.vue";
import { ImageWidget, ZoomMode } from "./imageWidget";
import TImageUpload from "./ImageUpload.vue";

defineProps({
  widgetConfig: {
    type: Object as PropType<ImageWidget>,
    required: true
  }
});
</script>

<style scoped lang="scss"></style>
