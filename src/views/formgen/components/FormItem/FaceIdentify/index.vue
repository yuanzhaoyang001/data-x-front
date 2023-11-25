<template>
  <el-input
    v-bind="{ ...item }"
    size="default"
    :placeholder="$t('formgen.faceId.text')"
    disabled
    readonly
  />
</template>

<script>
import mixin from "../mixin";

export default {
  name: "FaceIdentify",
  mixins: [mixin]
};
</script>
