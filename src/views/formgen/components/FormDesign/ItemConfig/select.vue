<template>
  <div>
    <el-form-item
      v-if="activeData.config.tag === 'el-select'"
      :label="$t('formgen.select.search')"
    >
      <el-switch v-model="activeData.filterable" />
    </el-form-item>
    <el-form-item
      v-if="activeData.config.tag === 'el-select'"
      :label="$t('formgen.select.multiChoose')"
    >
      <el-switch
        v-model="activeData.multiple"
        @change="multipleChange"
      />
    </el-form-item>
    <config-item-option :active-data="activeData" />
  </div>
</template>

<script>
import ConfigItemOption from "./option.vue";

export default {
  name: "ConfigItemSelect",
  components: { ConfigItemOption },
  props: ["activeData"],
  methods: {
    multipleChange(val) {
      this.activeData.config["defaultValue"] = val ? [] : "";
    }
  }
};
</script>
