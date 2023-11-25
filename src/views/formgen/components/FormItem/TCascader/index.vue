<template>
  <el-cascader
    v-bind="{ ...item }"
    v-model="changeValue"
    popper-class="t-cascader-popper"
    :options="getOptions()"
  />
</template>

<script>
import mixin from "../mixin";
import { findLabelsByIds } from "@/views/formgen/components/GenerateForm/FormItemLabel";

export default {
  name: "TCascader",
  mixins: [mixin],
  data() {
    return {};
  },
  watch: {
    changeValue: {
      deep: true,
      handler(val) {
        this.$emit("changeLabel", findLabelsByIds(this.getOptions(), val));
      }
    }
  }
};
</script>

<style scoped>
test {
  color: rgba(95, 127, 157, 1);
}
</style>
