<template>
  <div>
    <el-input
      v-model="showValue"
      class="cursor-none"
      readonly
    ></el-input>
  </div>
</template>

<script>
import mixin from "../mixin";
import { getCodeDesc } from "@/views/formgen/components/FormItem/ConfirmationCode/ConfirmationCode";

export default {
  name: "ConfirmationCode",
  mixins: [mixin],
  data() {
    return {
      showValue: ""
    };
  },
  created() {
    this.showValue = getCodeDesc(this.value);
  }
};
</script>

<style scoped>
.cursor-none {
  cursor: none;
}
</style>
