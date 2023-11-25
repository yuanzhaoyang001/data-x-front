<template>
  <div :style="{ textAlign: arrange }">
    <el-button
      type="primary"
      :icon="icon"
      @click="buttonHandle(config.buttonFunction)"
    >
      {{ content }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "TButton",
  props: {
    arrange: "",
    icon: "",
    content: {
      type: String,
      default: ""
    },
    functionText: "",
    config: ""
  },
  watch: {},
  created() {},
  methods: {
    buttonHandle(buttonFunction) {
      if (buttonFunction == "drop") {
        window.open(this.functionText, "_blank");
      }
      if (buttonFunction == "call") {
        window.location.href = "tel:" + this.functionText;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  text-align: center;
}
</style>
