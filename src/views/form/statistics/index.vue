<template>
  <div class="statistics-tabs">
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        :label="$t('form.statistics.statisticsView')"
        name="chart"
        v-if="hasFormButtonAuth('chart')"
      >
        <chart />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.statistics.dataAnalysis')"
        name="analysis"
        v-if="hasFormButtonAuth('analysis')"
      >
        <analysis />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script name="ProjectStatistics" setup>
import { ref } from "vue";
import chart from "./chart.vue";
import analysis from "./analysis.vue";
import { useFormInfo } from "@/stores/formInfo";

const activeName = ref("chart");

const { hasFormButtonAuth } = useFormInfo();
</script>

<style scoped>
.statistics-tabs {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

:deep(.el-tabs__content) {
  padding: 0;
}
</style>
