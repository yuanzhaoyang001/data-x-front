<template>
  <div class="config-wrap">
    <el-scrollbar style="height: calc(100% - 60px); margin: 20px">
      <poster-config
        v-if="!selectedWidget"
        class="poster-config"
      />
      <widget-config
        v-else
        :widget-config="selectedWidget"
        class="widget-config"
      />
    </el-scrollbar>
  </div>
</template>

<script setup>
import { usePosterStore } from "@/stores/formPoster";
import { storeToRefs } from "pinia";
import PosterConfig from "./PosterConfig.vue";
import WidgetConfig from "./WidgetConfig.vue";

const store = usePosterStore();

const { selectedWidget } = storeToRefs(store);
</script>

<style scoped lang="scss">
.config-wrap {
  height: 100%;
  background-color: var(--el-bg-color-overlay);
}
.poster-config,
.widget-config {
  height: 100%;
}
</style>
