<template>
  <div>
    <el-form-item :label="$t('formgen.scrollText.title')">
      <el-input v-model="activeData.text" />
    </el-form-item>
    <el-form-item :label="$t('formgen.scrollText.fontSize')">
      <el-input-number v-model="activeData.fontSize" />
    </el-form-item>
    <el-form-item :label="$t('formgen.scrollText.speed')">
      <el-input-number v-model="activeData.speed" />
    </el-form-item>
    <el-form-item :label="$t('formgen.scrollText.bold')">
      <el-switch v-model="activeData.bold" />
    </el-form-item>
    <el-form-item :label="$t('formgen.scrollText.italic')">
      <el-switch v-model="activeData.italic" />
    </el-form-item>
    <el-form-item :label="$t('formgen.scrollText.colorType')">
      <el-radio-group v-model="activeData.colorType">
        <el-radio-button label="default">
          {{ $t("formgen.scrollText.color") }}
        </el-radio-button>
        <el-radio-button label="gradient">
          {{ $t("formgen.scrollText.gradient") }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="activeData.colorType === 'default'"
      :label="$t('formgen.scrollText.color')"
    >
      <el-color-picker v-model="activeData.colorValue" />
    </el-form-item>
    <el-form-item
      v-if="activeData.colorType === 'gradient'"
      :label="$t('formgen.scrollText.gradient')"
    >
      <el-color-picker v-model="activeData.colorGradient[0]" />
      <el-color-picker v-model="activeData.colorGradient[1]" />
    </el-form-item>
  </div>
</template>

<script lang="ts" name="ConfigItemScrollText" setup>
import type { scrollTextComponent } from "@/views/formgen/components/GenerateForm/marketingConfig";

const props = defineProps<{
  activeData: scrollTextComponent;
}>();
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
