<template>
  <div>
    <!-- {{ activeData.config }} -->
    <el-form-item
      v-if="activeData.config['requireDetailAddr'] !== undefined"
      :label="$t('formgen.provinceConfig.address')"
    >
      <el-switch v-model="activeData.config['requireDetailAddr']" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemProvinceCity",
  props: ["activeData"]
};
</script>
