<template>
  <el-form-item :label="$t('formgen.subform.title')">
    <el-input
      v-model="activeData.config.label"
      :placeholder="$t('formgen.subform.enterTitile')"
    />
  </el-form-item>
</template>

<script>
export default {
  name: "ConfigItemSubForm",
  props: ["activeData"]
};
</script>
