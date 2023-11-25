<template>
  <el-card shadow="hover">
    <template #header>
      <map-draw
        theme="outline"
        size="13"
        fill="#333"
      />
      {{ $t("form.statistics.distribution") }}
    </template>
    <t-chart
      :init-options="initOptions"
      :option="option"
      style="height: 430px; margin: 0 auto"
      theme="tduck-echarts-theme"
    />
  </el-card>
</template>

<script>
import axios from "axios";
import TChart from "@/views/components/TChart/index.vue";
import { getFormPositionRequest } from "@/api/project/report";
import { MapDraw } from "@icon-park/vue-next";
import { i18n } from "@/i18n";

export default {
  components: {
    TChart,
    MapDraw
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
      // 中国地图
      option: {}
    };
  },
  created() {
    this.getMap();
  },
  methods: {
    // 项目提交地址
    getProjectSubmitPosition() {
      getFormPositionRequest({ formKey: this.formKey }).then(res => {
        this.option.series[0].data = Object.keys(res.data).map(key => {
          return {
            name: key.replace(/省(s?)|市(s?)|\//gi, ""),
            value: res.data[key]
          };
        });
      });
    },
    async getMap() {
      const { data } = await axios({
        url: location.origin + "/china.json",
        method: "get"
      });
      TChart.registerMap("china", data);
      this.option = {
        title: {
          text: "",
          subtext: ""
        },
        tooltip: {
          trigger: "item"
        },
        dataRange: {
          min: 0,
          max: 55000,
          text: [i18n.global.t("form.statistics.high"), i18n.global.t("form.statistics.low")],
          splitNumber: 0
        },
        series: [
          {
            name: i18n.global.t("form.statistics.submitNum"),
            type: "map",
            roam: false,
            map: "china",
            selectedMode: "multiple",
            emphasis: {
              label: {
                show: true
              }
            },
            data: []
          }
        ]
      };
      this.getProjectSubmitPosition();
    }
  }
};
</script>
