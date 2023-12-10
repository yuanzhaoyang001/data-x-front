<template>
  <div class="marquee-wrap">
    <h1
      v-if="title"
      class="text-center"
    >
      {{ title }}
    </h1>
    <div
      :style="{ maxHeight: `${maxHeight}px`, height: `${maxHeight}px` }"
      class="marquee-list"
    >
      <Vue3Marquee :vertical="vertical">
        <div v-html="dataList" />
      </Vue3Marquee>
    </div>
  </div>
</template>

<script lang="ts" name="TMarqueeList" setup>
import Vue3Marquee from "@/components/Vue3Marquee/index.vue";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  maxHeight: {
    type: Number,
    default: 200
  },
  dataList: {
    type: String,
    default: ""
  },
  vertical: {
    type: Boolean,
    default: true
  }
});
</script>

<style lang="scss" scoped>
.marquee-wrap {
  height: 100%;
}

.marquee-list {
  width: 80%;
  margin: 0 30px;
  margin-top: 20px;
}
</style>
