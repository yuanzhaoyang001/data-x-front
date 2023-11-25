<template>
  <div class="evaluation-wrap">
    <div class="evaluation-wrap__card">
      <div class="top-bar">
        <el-button
          v-copyText="linkUrl"
          plain
          size="small"
          type="success"
        >
          <share-three
            :stroke-width="3"
            class="mr5"
            size="16"
            stroke-linejoin="bevel"
            theme="outline"
          />
          {{ $t("form.dimension.shareUrl") }}
        </el-button>
      </div>
      <div
        v-if="reportResult.userFormDimension?.enableEvaluation"
        class="mt10"
        v-html="reportResult.userFormDimension?.evaluationDesc"
      ></div>
      <div class="evaluation-result">
        <span class="title">{{ $t("form.dimension.evalResultTitle") }}：</span>
        <div class="text-desc mt10">{{ $t("form.dimension.currentEvalResult") }}</div>
        <div>
          <span class="evaluation-result-score text-danger">{{ reportResult.userFormDimensionResult?.evaluationScore }}</span>
          {{ $t("form.dimension.scoreUnit") }}
        </div>
        <div v-html="reportAdvice"></div>
      </div>
      <div class="report-charts mt20">
        <div class="report-charts__header">
          <span class="title">{{ $t("form.dimension.scoreFenxi") }}</span>
          <el-radio-group
            v-model="reportChartType"
            size="small"
          >
            <el-radio-button label="radar">{{ $t("form.dimension.radarChart") }}</el-radio-button>
            <el-radio-button label="bar">{{ $t("form.dimension.barChart") }}</el-radio-button>
            <el-radio-button label="line">{{ $t("form.dimension.lineChart") }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-wrap">
          <t-chart
            v-if="showChart"
            :init-options="{
              renderer: 'png'
            }"
            :option="getCharData"
            class="mt10"
            theme="tduck-echarts-theme"
          />
        </div>
      </div>
      <div class="mt20">
        <el-table
          :data="dimensionList"
          border
          size="default"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('form.dimension.dimension')"
            prop="name"
          ></el-table-column>
          <el-table-column
            :label="$t('form.dimension.myScore')"
            prop="score"
          ></el-table-column>
          <el-table-column
            :label="$t('form.dimension.standardScore')"
            prop="standardScore"
          ></el-table-column>
          <el-table-column
            :label="$t('form.dimension.resultSuggestionIndex')"
            prop="advice"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ShareThree } from "@icon-park/vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { EvaluationResultReport, getDimensionReport } from "@/api/project/dimension";
import { ResultData } from "@/api/types";
import TChart from "@/views/components/TChart/index.vue";
import { i18n } from "@/i18n";
import { DimensionInfo, ResultAdvice } from "@/views/form/dimension/types";
import { removeHtmlTag } from "@/views/formgen/utils";

const linkUrl = ref<string>(window.location.href);

const route = useRoute();

const reportResult = ref<EvaluationResultReport>({
  userFormDimension: null,
  userFormDimensionResult: null
});

// 分析图表的类型
const reportChartType = ref<string>("radar");

const reportAdvice = ref<string>("");

interface DimensionInfoRow {
  name: string;
  standardScore: number;
  score: number;
  advice: string;
}

const showChart = ref<boolean>(false);
const dimensionList = ref<DimensionInfoRow[]>([]);

onMounted(async () => {
  const reportRes: ResultData<EvaluationResultReport> = await getDimensionReport(route.query.key as unknown as string);
  if (reportRes.data) {
    reportResult.value = reportRes.data;
  }
  reportAdvice.value = getAdvice(
    reportResult.value.userFormDimension!.evaluationResultAdvices,
    reportResult.value.userFormDimensionResult!.evaluationScore
  );

  reportResult.value.userFormDimension!.dimensionList.forEach((item: DimensionInfo) => {
    const score =
      reportResult.value.userFormDimensionResult!.dimensionScoreList.find((ds: any) => ds.dimensionId === item.id)?.score || 0;
    dimensionList.value.push({
      name: item.name,
      standardScore: item.standardScore || 0,
      score: score,
      advice: removeHtmlTag(getAdvice(item.resultAdvices, score))
    });
  });
  showChart.value = true;
});

// 获取建议
const getAdvice = (resultAdvices: ResultAdvice[], score: number) => {
  // 根据分数计算时候哪个评价
  let advice = "";
  for (let evaluationResultAdvice of resultAdvices) {
    let result1 = false;
    let result2 = false;
    const evaluationScore = score;
    result1 =
      evaluationResultAdvice.minCompare === 1
        ? evaluationResultAdvice.minScore < evaluationScore
        : evaluationResultAdvice.minScore <= evaluationScore;
    result2 =
      evaluationResultAdvice.maxCompare === 1
        ? evaluationResultAdvice.maxScore > evaluationScore
        : evaluationResultAdvice.maxScore >= evaluationScore;
    if (result1 && result2) {
      advice = evaluationResultAdvice.advice;
      break;
    }
  }
  return advice;
};

const getCharData = computed(() => {
  const config: any = {
    legend: {
      // Try 'horizontal'
      orient: "horizontal",
      right: "5%", //left:"10%"  // // 组件离容器的距离
      top: "auto"
    },
    toolbox: {
      show: true,
      showFormTitle: false, // 隐藏默认文字，否则两者位置会重叠
      feature: {
        saveAsImage: {
          show: false
        }
      },
      tooltip: {
        // 和 option.tooltip 的配置项相同
        show: true,
        formatter: function (param) {
          return "<div>" + param.title + "</div>"; // 自定义的 DOM 结构
        },
        backgroundColor: "#FFF",
        textStyle: {
          fontSize: 12
        },
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);" // 自定义的 CSS 样式
      }
    },
    tooltip: {
      trigger: "axis",
      formatter: "{b} {c}"
    },
    grid: {
      top: "5%",
      left: "2%",
      right: "4%",
      bottom: "0%",
      containLabel: true
    },
    series: [
      {
        name: "",
        type: reportChartType.value,
        //重点
        label: {
          normal: {
            formatter: "{b} {c}  ({d}%)",
            textStyle: {
              fontWeight: "normal",
              fontSize: 14
            }
          }
        },
        data: []
      }
    ]
  };
  if (!dimensionList.value) {
    return config;
  }
  // 柱状 折现图
  if (["bar", "line"].includes(reportChartType.value)) {
    config.tooltip.axisPointer = {
      type: "line"
    };
    config.tooltip.trigger = "axis";
    config.xAxis = {
      type: "category",
      data: dimensionList.value.map((item: DimensionInfoRow) => item.name || "") || []
    };
    config.yAxis = {
      type: "value"
    };
    config.series = [
      {
        data: dimensionList.value.map((item: DimensionInfoRow) => item.score || 0) || [],
        type: reportChartType.value,
        showBackground: true
      },
      {
        data: dimensionList.value.map((item: DimensionInfoRow) => item.standardScore || 0) || [],
        type: reportChartType.value,
        showBackground: true
      }
    ];
    // 如果是bar设置宽度
    if (reportChartType.value === "bar") {
      config.series[0].barMaxWidth = 20;
      config.series[1].barMaxWidth = 20;
    }
  } else {
    // 提取
    config.radar = {
      indicator:
        dimensionList.value?.map((item: DimensionInfoRow) => {
          return {
            name: item.name,
            max: item.standardScore + 10 || 0
          };
        }) || []
    };
    config.series[0].data = [
      {
        value: dimensionList.value.map((item: DimensionInfoRow) => item.score || 0) || [],
        name: i18n.global.t("form.dimension.myScore")
      },
      {
        value: dimensionList.value.map((item: DimensionInfoRow) => item.standardScore || 0) || [],
        name: i18n.global.t("form.dimension.standardScore")
      }
    ];
  }
  return config;
});
</script>

<style lang="scss" scoped>
.evaluation-wrap {
  height: 100%;
  overflow: auto;

  .evaluation-wrap__card {
    min-height: 100%;
    width: 40%;
    margin: auto;
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow);
    border-radius: 5px;
    padding: 10px 20px;
  }

  .top-bar {
    display: flex;
    justify-content: flex-end;
  }

  .evaluation-result {
    margin-top: 20px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .evaluation-result-score {
    font-size: 30px;
    line-height: 50px;
  }

  .report-charts__header {
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
  }

  .chart-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .evaluation-wrap {
    .evaluation-wrap__card {
      width: 100%;
    }
  }
}
</style>
