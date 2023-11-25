<template>
  <BaseConfig :widgetConfig="widgetConfig" />
  <el-form
    ref="formRef"
    :model="widgetConfig"
    label-width="120px"
    size="default"
    label-position="top"
  >
    <el-form-item :label="$t('form.formPoster.textConfig.dynamicValueBinding')">
      <form-item-list-select
        v-model="widgetConfig.dynamicValue"
        :form-key="route.query.formKey"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.center')">
      <el-switch v-model="widgetConfig.center" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.content')">
      <el-input
        v-model="widgetConfig.text"
        style="width: 90%"
        type="textarea"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.letterSpacing')">
      <el-input-number
        v-model="widgetConfig.space"
        :min="0"
        :precision="0"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.strikeThrough')">
      <el-switch v-model="widgetConfig.strikeThrough" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.color')">
      <el-color-picker
        v-model="widgetConfig.color"
        :show-alpha="false"
      />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.font')">
      <el-select v-model="widgetConfig.fontName">
        <el-option
          v-for="item in fontList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.fontSize')">
      <el-input-number v-model="widgetConfig.fontSize" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.lineHeight')">
      <el-input-number v-model="widgetConfig.lineHeight" />
    </el-form-item>
    <el-form-item :label="$t('form.formPoster.textConfig.rotate')">
      <el-input-number v-model="widgetConfig.rotate" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="TextConfig">
import { PropType } from "vue";
import { TextWidget } from "./textWidget";
import BaseConfig from "../common/BaseConfig.vue";
import FormItemListSelect from "@/views/components/FormItemListSelect/index.vue";
import { useRoute } from "vue-router";

defineProps({
  widgetConfig: {
    type: Object as PropType<TextWidget>,
    required: true
  }
});
const fontList = [
  {
    value: "Alibaba-PuHuiTi-Medium",
    label: "阿里巴巴普惠体Medium"
  }
];

const route = useRoute();
</script>

<style scoped lang="scss"></style>
