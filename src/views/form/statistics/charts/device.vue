<template>
  <div class="branch">
    <el-card
      class="branch-card"
      shadow="hover"
    >
      <template #header>
        <chart-pie-one
          theme="outline"
          size="13"
          fill="#333"
        />
        <span>{{ $t("form.statistics.commonEquipment") }}</span>
      </template>
      <t-chart
        class="device-echart"
        :init-options="initOptions"
        :option="option"
        theme="tduck-echarts-theme"
      />
    </el-card>
  </div>
</template>

<script>
import TChart from "@/views/components/TChart/index.vue";
import { ChartPieOne } from "@icon-park/vue-next";
import { getFormDeviceRequest } from "@/api/project/report";
import { i18n } from "@/i18n";

export default {
  components: {
    TChart,
    ChartPieOne
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
          trigger: "item"
        },
        series: [
          {
            name: i18n.global.t("form.statistics.commonEquipment"),
            type: "pie",
            radius: ["50%", "70%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: []
          }
        ]
      }
    };
  },
  created() {
    this.getProjectSubmitDevice();
  },
  methods: {
    getProjectSubmitDevice() {
      getFormDeviceRequest({ formKey: this.formKey }).then(res => {
        if (res.data && res.data.length) {
          this.option.series[0].data = res.data.map(item => {
            return {
              value: item.count,
              name: item.osName ? item.osName : i18n.global.t("form.statistics.other")
            };
          });
        }
      });
    }
  }
};
</script>
