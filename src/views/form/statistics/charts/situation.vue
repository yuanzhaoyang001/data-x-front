<template>
  <el-card
    class="situation"
    shadow="hover"
  >
    <template #header>
      <chart-histogram-two
        theme="outline"
        size="14"
        fill="#333"
      />
      {{ $t("form.statistics.week") }}
    </template>
    <t-chart
      style="width: 100%; height: 430px; margin: 0 auto"
      :init-options="initOptions"
      :option="option"
      theme="tduck-echarts-theme"
    />
  </el-card>
</template>

<script>
import TChart from "@/views/components/TChart/index.vue";
import { ChartHistogramTwo } from "@icon-park/vue-next";
import { getFormSituationRequest } from "@/api/project/report";
import { i18n } from "@/i18n";

export default {
  components: {
    TChart,
    ChartHistogramTwo
  },
  props: {
    formKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      initOptions: {
        renderer: "svg"
      },
      option: {
        tooltip: {
          trigger: "axis",
          extraCssText: "z-index:1"
        },
        grid: {
          top: "5%",
          left: "2%",
          right: "4%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1
          }
        ],
        series: [
          {
            name: i18n.global.t("form.statistics.recoveryAmount"),
            stack: i18n.global.t("form.statistics.count"),
            type: "line",
            data: [],
            smooth: true,
            areaStyle: {},
            itemStyle: {
              borderRadius: [0, 5, 5, 0],
              color: new TChart.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                ["#3ED572", "#399efd"].map((color, offset) => ({
                  color,
                  offset
                }))
              )
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getProjectSituation();
  },
  methods: {
    getProjectSituation() {
      getFormSituationRequest({ formKey: this.formKey }).then(res => {
        this.option.xAxis[0].data = res.data.map(item => {
          return item.createTime;
        });
        this.option.series[0].data = res.data.map(item => {
          return item.count;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.situation {
  width: 100%;
}
</style>
