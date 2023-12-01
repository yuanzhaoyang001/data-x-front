<template>
  <div class="dimension-wrap">
    <div class="steps-wrap">
      <el-steps
        :active="active"
        align-center
      >
        <el-step
          v-for="(title, index) in stepList"
          :key="title"
          :title="title"
          @click="active = index + 1"
        />
      </el-steps>
      <dimension-setting
        v-if="active === 1"
        :dimension-conf="dimensionConfig"
      />
      <dimension-form-item
        v-if="active === 2"
        :dimension-conf="dimensionConfig"
        :fields="fields"
      />
      <dimension-result-advice
        v-if="active === 3"
        :dimension-conf="dimensionConfig"
        :fields="fields"
      />
      <dimension-standard-score
        v-if="active === 4"
        :dimension-conf="dimensionConfig"
        :fields="fields"
      />
      <evaluation-report-setting
        v-if="active === 5"
        :dimension-conf="dimensionConfig"
        :fields="fields"
      />
    </div>
  </div>
</template>

<script lang="ts" name="Dimension" setup>
import { onMounted, ref, watch } from "vue";
import { DimensionConfig } from "./types";
import DimensionSetting from "./DimensionSetting.vue";
import DimensionFormItem from "./DimensionFormItem.vue";
import DimensionResultAdvice from "./DimensionResultAdvice.vue";
import DimensionStandardScore from "./DimensionStandardScore.vue";
import EvaluationReportSetting from "./EvaluationReportSetting.vue";
import { i18n } from "@/i18n";
import { listProjectItemRequest, ProjectItem } from "@/api/project/form";
import { useRoute } from "vue-router";
import { getDimensionByKey, saveDimension } from "@/api/project/dimension";

const active = ref<number>(1);

const stepList = [
  i18n.global.t("form.dimension.dimensions"),
  i18n.global.t("form.dimension.question"),
  i18n.global.t("form.dimension.dimensionResults"),
  i18n.global.t("form.dimension.scoreWeight"),
  i18n.global.t("form.dimension.reportSettings")
];

const dimensionConfig = ref<DimensionConfig>({
  evaluationDesc: "",
  dimensionList: [],
  dimensionScoreType: 1,
  enableStandardScore: true,
  enableWeight: false,
  enableEvaluation: true,
  enableEvaluationResult: true,
  evaluationResultAdvices: []
});

const fields = ref<ProjectItem[]>([]);

const route = useRoute();

onMounted(() => {
  listProjectItemRequest({ key: route.query.key as unknown as string, displayType: false }).then((res: any) => {
    fields.value = res.data;
  });
  getDimensionByKey(route.query.key as unknown as string).then(res => {
    if (res.data) {
      dimensionConfig.value = res.data;
    }
  });
});

watch(
  () => dimensionConfig,
  () => {
    saveDimension({
      formKey: route.query.key as unknown as string,
      ...dimensionConfig.value
    }).then(res => {
      if (res.data && res.data.id) {
        dimensionConfig.value.id = res.data.id;
      }
    });
  },
  {
    deep: true
  }
);
</script>

<style lang="scss" scoped>
.dimension-wrap {
  padding: 20px;
  height: 100%;

  .steps-wrap {
    width: 70%;
    margin: 0 auto;
    height: 100%;
  }
}
</style>
