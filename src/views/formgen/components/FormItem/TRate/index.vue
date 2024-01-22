<template>
  <el-rate
    v-bind="{ ...item }"
    v-model="changeValue"
    @change="handleChange"
    :texts="['非常糟糕', '失望', '一般', '满意', '惊喜']"
  />
</template>

<script>
import mixin from "../mixin";

export default {
  name: "TRate",
  mixins: [mixin],
  data() {
    return {
      oldValue: null
    };
  },
  methods: {
    handleChange(val) {
      // 重复点击说明是想取消
      if (this.changeValue === this.oldValue) {
        this.changeValue = 0;
      } else {
        this.oldValue = val;
      }
    }
  }
};
</script>
