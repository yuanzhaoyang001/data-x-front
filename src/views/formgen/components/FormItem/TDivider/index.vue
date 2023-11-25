<template>
  <div ref="divider">
    <el-divider>
      {{ content }}
    </el-divider>
  </div>
</template>

<script>
export default {
  name: "TDivider",
  props: {
    color: {
      type: String,
      default: "#dcdfe6"
    },
    content: {
      type: String,
      default: ""
    }
  },
  watch: {
    color(val) {
      let d = (this.$refs.divider.children[0].style.backgroundColor = val);
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.divider.children[0].style.backgroundColor = this.color;
    });
  }
};
</script>
