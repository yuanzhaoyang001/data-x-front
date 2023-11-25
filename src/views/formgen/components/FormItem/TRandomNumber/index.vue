<template>
  <el-input
    v-bind="{ ...item }"
    v-model="changeValue"
    :placeholder="$t('formgen.randNumberConfig.inputText')"
    disabled
    readonly
  />
</template>

<script>
import mixin from "../mixin";

export default {
  name: "TRandomNumber",
  mixins: [mixin]
};
</script>
