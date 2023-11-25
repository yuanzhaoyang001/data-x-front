<template>
  <div
    ref="showPanel"
    class="text-copy"
    :class="{ 'box-focus': isShow }"
    @click="handleCopy"
  >
    <div class="body">
      <span class="pl10">{{ text }}</span>
      <el-link
        v-if="isShow"
        v-copyText="text"
        class="copy-btn mr10"
        :underline="false"
        @click.stop="() => {}"
      >
        <el-icon class="el-icon-copy-document">
          <ele-View />
        </el-icon>
        复制
      </el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextCopy",
  props: {
    text: {
      type: [String, Number, Object, Array],
      default: ""
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  mounted() {
    document.addEventListener("click", this.bodyCloseCopy);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.bodyCloseCopy);
  },
  methods: {
    bodyCloseCopy(e) {
      if (this.$refs.showPanel) {
        let isSelf = this.$refs.showPanel.contains(e.target);
        if (!isSelf) {
          this.isShow = false;
        }
      }
    },
    handleCopy() {
      this.isShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  line-height: 34px;
  min-height: 34px;
  word-break: break-all;
  background: #f6f8f9;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  width: 95%;

  .copy-btn {
    float: right;
    width: 45px;
  }
}

.box-focus {
  border: 1px solid #409eff;
}
</style>
