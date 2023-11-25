<template>
  <div class="sync-data-wrap">
    <el-card style="width: 500px">
      <h1>同步数据</h1>
      <p>数据量大同步时间可能会长，确定显示完成后再关闭页面</p>
      <el-form>
        <el-form-item label="表单key">
          <el-input
            v-model.trim="formKey"
            placeholder="非必填，不填写同步全部数据"
          />
        </el-form-item>
        <el-button
          type="danger"
          @click="syncDataIndex"
        >
          提交
        </el-button>
      </el-form>
      <div
        v-if="isStart && progress"
        class="progress"
      >
        <el-progress
          :percentage="progress.rate"
          type="circle"
        ></el-progress>
        <span class="percentage-label">{{ progress.current }}/{{ progress.total }} {{ progress.tips }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      formKey: "",
      isStart: false,
      progress: null
    };
  },
  methods: {
    syncDataIndex() {
      this.$api.get("/syncFormDataToMongo", { params: { formKey: this.formKey } }).then(res => {
        let count = 0;
        let timer = setInterval(() => {
          this.$api.get("/common/process", { params: { key: "sync_data_process" } }).then(res1 => {
            this.progress = res1.data;
            // 多次返回100 才停止
            if (res1.data && res1.data.rate === 100 && count >= 10) {
              clearInterval(timer);
            }
            count++;
            this.isStart = true;
            console.log(res1);
          });
        }, 1000);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sync-data-wrap {
  padding: 20px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 100%;
}
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
