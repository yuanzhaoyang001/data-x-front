<template>
  <div class="video-wrap">
    <div
      v-if="urlType === 'iframe'"
      class="t-video-iframe"
      v-html="getSecurityUrl"
    ></div>
    <div
      v-else
      style="width: 100%"
    >
      <video
        :src="getSecurityUrl"
        autoplay
        controls
        style="width: 100%"
      ></video>
    </div>
  </div>
</template>
<script lang="ts" name="TVideo" setup>
import { defineProps, onMounted, computed } from "vue";

const props = defineProps({
  urlType: {
    type: String,
    default: "iframe"
  },
  videoUrl: {
    type: String,
    default: ""
  }
});

const getSecurityUrl = computed(() => {
  //props.videoUrl 判断这里面是不是只有一个ifame标签 避免注入安全漏洞

  return props.urlType === "iframe" ? sanitizeInput(props.videoUrl) : props.videoUrl;
});

function sanitizeInput(input) {
  //  正则判断是否是iframe标签
  const iframeRegex = /<iframe.*?>(.*?)<\/iframe>/;
  console.log(input);
  console.log(iframeRegex.test(input));
  if (iframeRegex.test(input)) {
    // 如果匹配成功，返回用户输入
    return input;
  } else {
    // 如果不匹配，可以返回默认值或者给出错误提示
    return "";
  }
}

onMounted(() => {});
</script>

<style lang="scss" scoped>
.video-wrap {
  height: 100%;
}
</style>
<style>
.t-video-iframe iframe {
  width: 100%;
  height: 250px;
}
</style>
