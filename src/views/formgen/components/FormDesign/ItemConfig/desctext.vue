<template>
  <div class="descriptive-text">
    <el-form-item :label="$t('formgen.desc.title')">
      <el-input
        v-model="activeData.config.label"
        :placeholder="$t('formgen.desc.title')"
      />
    </el-form-item>
    <el-divider>{{ $t("formgen.desc.text") }}</el-divider>
    <div>
      <tinymce v-model:value="activeData.content" />
    </div>
  </div>
</template>

<script setup name="ConfigItemDescText">
import tinymce from "../../tinymce/index.vue";

const props = defineProps({
  activeData: {
    type: Object,
    default: () => {}
  }
});
</script>

<style lang="scss" scoped></style>
