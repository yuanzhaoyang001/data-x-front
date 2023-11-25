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
      <tinymce
        :id="activeData.formId"
        :key="activeData.formId"
        v-model:value="activeData.content"
        placeholder=""
      />
    </div>
  </div>
</template>

<script>
import tinymce from "../../tinymce/index.vue";

export default {
  name: "ConfigItemDescText",
  components: {
    tinymce
  },
  props: ["activeData"]
};
</script>

<style lang="scss" scoped>
.descriptive-text {
  :deep(.tox .tox-tbtn) {
    height: 28px;
  }
}
</style>
