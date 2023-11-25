<template>
  <el-row
    :gutter="15"
    class="home-card-one mb15"
  >
    <el-col
      :xs="24"
      :sm="12"
      :md="12"
      :lg="6"
      :xl="6"
      v-for="(v, k) in list"
      :key="k"
      :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }"
    >
      <div class="home-card-item flex">
        <div
          class="flex-margin flex w100"
          :class="` home-one-animation${k}`"
        >
          <div class="flex-auto">
            <span class="font30">{{ v.num1 }}</span>
            <span
              class="ml5 font16"
              :style="{ color: v.color1 }"
            >
              {{ v.num2 }}
            </span>
            <div class="mt10 title">
              {{ v.title }}
              <el-tooltip
                :content="v.desc"
                placement="right-end"
                effect="tduck"
              >
                <el-icon>
                  <ele-QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </div>
          <div
            class="home-card-item-icon flex"
            :style="{ background: `var(${v.color2})` }"
          >
            <div
              class="flex-margin font32"
              :class="v.icon"
              :style="{ color: `var(${v.color3})` }"
            >
              <IconPark
                :type="v.icon"
                theme="filled"
              />
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IconPark } from "@icon-park/vue-next/es/all";
import { getFormBaseIndexReq } from "@/api/mannage/analysis";
import { i18n } from "@/i18n";

const list = ref([
  {
    num1: "0",
    num2: "0",
    title: i18n.global.t("system.home.totalForms"),
    icon: "add-three",
    color1: "#FF6462",
    desc: i18n.global.t("system.home.totalFormsDescription"),
    color2: "--next-color-primary-lighter",
    color3: "--el-color-primary"
  },
  {
    num1: "0",
    num2: "0",
    title: i18n.global.t("system.home.totalResponses"),
    icon: "write",
    color1: "#6690F9",
    desc: i18n.global.t("system.home.totalResponsesDescription"),
    color2: "--next-color-success-lighter",
    color3: "--el-color-success"
  },
  {
    num1: "0",
    num2: "0",
    title: i18n.global.t("system.home.totalViews"),
    desc: i18n.global.t("system.home.totalViewsDescription"),
    icon: "preview-open",
    color1: "#6690F9",
    color2: "--next-color-warning-lighter",
    color3: "--el-color-warning"
  },
  {
    num1: "0",
    num2: "",
    title: i18n.global.t("system.home.responseRate"),
    desc: i18n.global.t("system.home.responseRateDescription"),
    icon: "percentage",
    color1: "#ffaba9",
    color2: "--next-color-danger-lighter",
    color3: "--el-color-danger"
  }
]);

onMounted(() => {
  getFormBaseIndexReq().then(res => {
    if (res.data) {
      list.value[0].num1 = `${res.data.formCount || 0}`;
      list.value[0].num2 = `+${res.data.todayFormCount || 0}`;
      list.value[1].num1 = `${res.data.submitCount || 0}`;
      list.value[1].num2 = `+${res.data.todaySubmitCount || 0}`;
      list.value[2].num1 = `${res.data.viewCount || 0}`;
      list.value[2].num2 = `+${res.data.todayViewCount || 0}`;
      list.value[3].num1 = `${res.data.completeRatePercent}`;
      list.value[3].num2 = `${res.data.completeRate}`;
    }
  });
});
</script>

<style scoped lang="scss">
.home-card-one {
  .home-card-item {
    width: 100%;
    height: 120px;
    border-radius: 15px;
    transition: all ease 0.3s;
    padding: 20px;
    overflow: hidden;
    background: var(--el-color-white);
    color: var(--el-text-color-primary);
    border: 1px solid var(--next-border-color-light);
    &:hover {
      box-shadow: 0 2px 12px var(--next-color-dark-hover);
      transition: all ease 0.3s;
    }
    &-icon {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      flex-shrink: 1;
      i {
        color: var(--el-text-color-placeholder);
      }
    }
    &-title {
      font-size: 15px;
      font-weight: bold;
      height: 30px;
    }
  }
}
.home-card-one {
  @for $i from 0 through 3 {
    .home-one-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/4) + s;
    }
  }
}
</style>
