<template>
  <div class="aside-wrap">
    <el-tabs
      tab-position="left"
      class="t-tabs"
      v-model="activeName"
    >
      <el-tab-pane name="widget">
        <template #label>
          <span class="fun-tabs-label">
            <i class="tduck icon-zujian" />
            <span>{{ $t("form.formPoster.widget") }}</span>
          </span>
        </template>
        <widget-list />
      </el-tab-pane>
      <el-tab-pane name="layers">
        <template #label>
          <span class="fun-tabs-label">
            <i class="tduck icon-tuceng" />
            <span>{{ $t("form.formPoster.layers") }}</span>
          </span>
        </template>
        <Layers />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";
import { useRoute } from "vue-router";
import WidgetList from "./WidgetList.vue";
import Layers from "./Layers.vue";

const activeName = ref("widget");

provide("posterKey", useRoute().query.key);
</script>

<style scoped lang="scss">
.aside-wrap {
  box-shadow: var(--el-box-shadow);
  height: 100%;

  :deep(.el-tabs__content) {
    overflow: auto;
    height: 100%;
    position: relative;
  }
}
</style>
