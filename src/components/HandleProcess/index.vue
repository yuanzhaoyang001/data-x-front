<template>
  <el-dialog
    :before-close="handleClose"
    v-model="dialogVisible"
    title="提示"
    width="30%"
  >
    <p class="text-danger">
      {{ tips }}
    </p>
    <p style="text-align: center; color: #a1a1a1">
      {{ percentage >= 100 ? completeMessage : message }}
    </p>
    <el-progress :percentage="percentage" />
    <el-link
      v-if="downloadUrl"
      :href="downloadUrl"
      class="download"
      type="primary"
    >
      下载地址
    </el-link>
    <p
      v-if="resultTips"
      class="text-danger"
    >
      {{ resultTips }}
    </p>
  </el-dialog>
</template>

<script>
export default {
  name: "HandleProcess",
  props: {},
  data() {
    return {
      tips: "",
      completeMessage: "已完成",
      message: "处理中",
      downloadUrl: "",
      key: "",
      timer: null,
      percentage: 0,
      dialogVisible: true,
      resultTips: ""
    };
  },
  created() {
    this.getHandleProcess();
    this.timer = setInterval(() => {
      this.getHandleProcess();
    }, 5000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    /**
     * 获取处理进去
     */
    getHandleProcess() {
      this.$api.get(`/common/process?key=${this.key}`).then(res => {
        let { rate, url, tips } = res.data;
        if (rate) {
          this.percentage = rate;
        }
        if (tips) {
          this.resultTips = tips;
        }
        if (url) {
          this.downloadUrl = url;
          clearInterval(this.timer);
        }
      });
    },
    handleClose() {
      clearInterval(this.timer);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>

<style lang="scss" scoped>
.download {
  width: 70px;
  margin: 10px auto;
  display: block;
}
</style>
