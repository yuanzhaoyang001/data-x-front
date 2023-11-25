<template>
  <div>
    <el-form-item :label="$t('formgen.divider.dividerTextLabel')">
      <el-input
        v-model="activeData.content"
        :placeholder="$t('formgen.divider.dividerTextLabel')"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemDivider",
  props: ["activeData"]
};
</script>
