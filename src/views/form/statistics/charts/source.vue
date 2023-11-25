<template>
  <div class="source">
    <el-card
      class="source-card"
      shadow="hover"
    >
      <template #header>
        <span>
          <chart-histogram-two
            theme="outline"
            size="13"
            fill="#333"
          />
          {{ $t("form.statistics.source") }}
        </span>
      </template>
      <t-chart
        class="source-echart"
        :init-options="initOptions"
        :option="option"
        theme="tduck-echarts-theme"
      />
    </el-card>
  </div>
</template>

<script>
import TChart from "@/views/components/TChart/index.vue";
import { ChartHistogramTwo } from "@icon-park/vue-next";
import { getFormSourceRequest } from "@/api/project/report";
import { i18n } from "@/i18n";

export default {
  components: { TChart, ChartHistogramTwo },
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
          top: "0%",
          left: "2%",
          right: "20%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            splitLine: {
              show: false
            },
            type: "value",
            show: false
          }
        ],
        yAxis: [
          {
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            type: "category",
            axisTick: {
              show: false
            },
            data: []
          }
        ],
        series: [
          {
            name: i18n.global.t("form.statistics.num"),
            type: "bar",
            barWidth: 15,
            label: {
              show: true,
              position: "right",
              color: "#1890FF",
              fontSize: 12,
              formatter: ({ data }) => {
                return `${data}`;
              }
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            data: []
          }
        ]
      }
    };
  },
  created() {
    this.getProjectSubmitSource();
  },
  methods: {
    getProjectSubmitSource() {
      getFormSourceRequest({ formKey: this.formKey }).then(res => {
        if (res.data && res.data.length) {
          this.option.yAxis[0].data = res.data.map(item => {
            return item.browserName ? item.browserName : i18n.global.t("form.statistics.other");
          });
          this.option.series[0].data = res.data.map(item => {
            return item.count;
          });
        }
      });
    }
  }
};
</script>
