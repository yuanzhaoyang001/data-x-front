<template>
  <div
    style="height: 100%"
    ref="homeLineRef"
  ></div>
</template>
<script setup lang="ts">
import { markRaw, nextTick, onActivated, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import * as echarts from "echarts";
import { useThemeConfig } from "@/stores/themeConfig";
import { useTagsViewRoutes } from "@/stores/tagsViewRoutes";
import { getFormSubmitCountLineDataReq } from "@/api/mannage/analysis";
import { i18n } from "@/i18n";

const homeLineRef = ref();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const storesTagsViewRoutes = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);

// 监听 pinia 中是否开启深色主题
watch(
  () => themeConfig.value.isIsDark,
  isIsDark => {
    nextTick(() => {
      state.charts.theme = isIsDark ? "dark" : "";
      state.charts.bgColor = isIsDark ? "transparent" : "";
      state.charts.color = isIsDark ? "#dadada" : "#303133";
      setTimeout(() => {
        initLineChart();
      }, 500);
    });
  },
  {
    deep: true,
    immediate: true
  }
);

// 批量设置 echarts resize
const initEchartsResizeFun = () => {
  nextTick(() => {
    state.myChart.resize();
  });
};
// 批量设置 echarts resize
const initEchartsResize = () => {
  window.addEventListener("resize", initEchartsResizeFun);
};
// 页面加载时
onMounted(async () => {
  // 加载数据
  try {
    const res = await getFormSubmitCountLineDataReq();
    option.xAxis.data = res.data.map(item => item.date);
    option.series[0].data = res.data.map(item => item.submitCount || 0);
    option.series[1].data = res.data.map(item => item.viewCount || 0);
  } catch (e) {
    console.log(e);
  }
  initEchartsResize();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
  initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
  () => isTagsViewCurrenFull.value,
  () => {
    initEchartsResizeFun();
  }
);
const state = reactive({
  global: {
    homeChart: null,
    disposeChart: null
  },
  myChart: null,
  charts: {
    theme: "",
    bgColor: "",
    color: "#303133"
  }
});

const option = {
  backgroundColor: state.charts.bgColor,
  title: {
    text: i18n.global.t("system.home.formData"),
    x: "left",
    textStyle: { fontSize: "15", color: state.charts.color }
  },
  grid: { top: 70, right: 20, bottom: 30, left: 30 },
  tooltip: { trigger: "axis" },
  legend: { data: [i18n.global.t("system.home.dataCount"), i18n.global.t("system.home.dataView")], right: 0 },
  xAxis: {
    data: []
  },
  yAxis: [
    {
      type: "value",
      name: i18n.global.t("system.home.total"),
      splitLine: { show: true, lineStyle: { type: "dashed", color: "#f5f5f5" } }
    }
  ],
  series: [
    {
      name: i18n.global.t("system.home.dataCount"),
      type: "line",
      symbolSize: 6,
      symbol: "circle",
      smooth: true,
      data: [],
      lineStyle: { color: "#fe9a8b" },
      itemStyle: { color: "#fe9a8b", borderColor: "#fe9a8b" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#fe9a8bb3" },
          { offset: 1, color: "#fe9a8b03" }
        ])
      }
    },
    {
      name: i18n.global.t("system.home.dataView"),
      type: "line",
      symbolSize: 6,
      symbol: "circle",
      smooth: true,
      data: [],
      lineStyle: { color: "#9E87FF" },
      itemStyle: { color: "#9E87FF", borderColor: "#9E87FF" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#9E87FFb3" },
          { offset: 1, color: "#9E87FF03" }
        ])
      },
      emphasis: {
        itemStyle: {
          color: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: "#9E87FF" },
              { offset: 0.4, color: "#9E87FF" },
              { offset: 0.5, color: "#fff" },
              { offset: 0.7, color: "#fff" },
              { offset: 0.8, color: "#fff" },
              { offset: 1, color: "#fff" }
            ]
          },
          borderColor: "#9E87FF",
          borderWidth: 2
        }
      }
    }
  ]
};
// 折线图
const initLineChart = () => {
  // if (!state.global.disposeChart) state.global.disposeChart.dispose();
  state.global.homeChart = markRaw(echarts.init(homeLineRef.value, state.charts.theme));
  state.global.homeChart.setOption(option);
  state.myChart = state.global.homeChart;
};
</script>

<style scoped lang="scss"></style>
