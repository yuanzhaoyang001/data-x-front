<template>
  <div class="analysis">
    <div v-if="list.length && list.length !== 0">
      <div
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="content">
          <div>
            <span>{{ $t("form.statistics.chartType") }}：</span>
            <el-select
              size="small"
              v-model="item.chartType"
              :placeholder="$t('form.statistics.selectPlaceholder')"
            >
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
          <div class="title">
            <span style="font-size: 16px">{{ item.label }}（{{ item.type }}）</span>
            <div>
              <span>{{ $t("form.statistics.proportion") }}</span>
              <el-table
                :data="getTableData(item)"
                height="350"
                style="width: 100%"
              >
                <el-table-column
                  prop="fieldName"
                  sortable
                  :label="$t('form.statistics.label')"
                  width="280"
                ></el-table-column>
                <el-table-column
                  prop="data"
                  sortable
                  :label="$t('form.statistics.totalCount')"
                  width="280"
                ></el-table-column>
                <el-table-column
                  prop="proportion"
                  sortable
                  :label="$t('form.statistics.proportion')"
                  width="280"
                ></el-table-column>
              </el-table>
            </div>
          </div>
          <t-chart
            :option="getCharData(item)"
            :init-options="initOptions"
            theme="tduck-echarts-theme"
          />
        </div>
        <el-divider />
      </div>
    </div>
    <el-empty
      v-else
      :description="$t('form.statistics.onlyChartAvailable')"
    />
  </div>
</template>

<script>
import TChart from "@/views/components/TChart/index.vue";
import { getFormAnalysisRequest } from "@/api/project/report";
import { i18n } from "@/i18n";

export default {
  components: {
    TChart
  },
  data() {
    return {
      initOptions: {
        renderer: "png"
      },
      list: [],
      options: [
        {
          value: "pie",
          label: i18n.global.t("form.statistics.pie")
        },
        {
          value: "bar",
          label: i18n.global.t("form.statistics.bar")
        },
        {
          value: "line",
          label: i18n.global.t("form.statistics.line")
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getFormAnalysisRequest({ formKey: this.$route.query.key }).then(res => {
        this.list = res.data;
      });
    },
    getCharData(data) {
      const config = {
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
              show: true,
              title: i18n.global.t("form.statistics.saveAsImage")
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
        xAxis: [
          {
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            type: "category",
            axisTick: {
              show: false,
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: i18n.global.t("form.statistics.num"),
            type: "pie",
            radius: [30, 100], //圆心空隙
            center: ["50%", "50%"],
            barWidth: "25%",
            data: [],
            //重点
            label: {
              normal: {
                formatter: "{b} {c}  ({d}%)",
                textStyle: {
                  fontWeight: "normal",
                  fontSize: 14
                }
              }
            }
          }
        ]
      };
      // 柱状 折现图
      if (["bar", "line"].includes(data.chartType)) {
        config.tooltip.axisPointer = {
          type: "line"
        };
        config.tooltip.trigger = "axis";
        config.xAxis[0].data = data.fieldName;
        config.series[0].data = data.data;
        config.series[0].type = data.chartType;
      } else {
        config.tooltip = {
          trigger: "item"
        };
        config.series[0].data = [];
        Object.keys(data.map).forEach(key => {
          config.series[0].data.push({ name: key, value: data.map[key] });
        });
      }
      return config;
    },
    getTableData(data) {
      let fieldName = data.fieldName;
      let dataNum = data.data;
      let sum = dataNum.reduce((a, b) => a + b, 0);
      return fieldName.map((field, index) => ({
        fieldName: field,
        data: dataNum[index],
        proportion: ((dataNum[index] / sum) * 100).toFixed(2) + "%"
      }));
    }
  }
};
</script>

<style lang="scss" scoped>
.analysis {
  width: 100%; /*// padding: 20px;*/
  .content {
    padding: 20px;
    width: 100%;

    .title {
      font-size: 14px;
      padding: 0 30px;
      height: 54px;
      line-height: 54px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .select {
        float: right;
      }
    }
  }
}
</style>
