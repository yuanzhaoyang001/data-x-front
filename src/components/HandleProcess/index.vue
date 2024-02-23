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

<script setup>
import { onMounted, onUnmounted, ref, useAttrs } from "vue";
import request from "@/utils/request";
import { ElDialog, ElLink, ElProgress } from "element-plus";

defineOptions({
  inheritAttrs: false
});
const attrs = useAttrs();

const props = defineProps({
  tips: {
    type: String,
    default: () => {
      return "";
    }
  },
  message: {
    type: String,
    default: () => {
      return "";
    }
  },
  requestKey: {
    type: String,
    default: () => {
      return "";
    }
  }
});

const completeMessage = "已完成";
const downloadUrl = ref("");
let timer = null;
const percentage = ref(0);
const dialogVisible = ref(true);
const resultTips = ref("");

const getHandleProcess = () => {
  request.get(`/common/process?key=${props.requestKey}`).then(res => {
    if (res.data) {
      let { rate, url, tips } = res.data;
      if (rate) {
        percentage.value = rate;
      }
      if (tips) {
        resultTips.value = tips;
      }
      if (url) {
        downloadUrl.value = url;
        clearInterval(timer);
      }
    }
  });
};

onMounted(() => {
  getHandleProcess();
  timer = setInterval(() => {
    getHandleProcess();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const handleClose = () => {
  clearInterval(timer);
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.download {
  width: 70px;
  margin: 10px auto;
  display: block;
}
</style>
