<template>
  <div class="exam-result-wrap">
    <div class="exam-result-wrap__card">
      <div class="exam-result-wrap__card__header">
        <div class="top-bar">
          <el-button
            size="small"
            plain
            type="primary"
            v-if="examResultData.examSetting?.showRank"
            @click="handleToRankList"
          >
            <ranking
              theme="outline"
              size="16"
              :stroke-width="3"
              stroke-linejoin="bevel"
              class="mr5"
            />
            {{ $t("form.exam.leaderboard") }}
          </el-button>
          <el-button
            v-if="showDimensionReport"
            size="small"
            plain
            icon="ele-TrendCharts"
            type="primary"
            @click="handleToDimensionReport"
          >
            {{ $t("form.exam.dimensionReport") }}
          </el-button>
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
            {{ $t("form.exam.shareToFriends") }}
          </el-button>
        </div>
        <div class="content">
          <div
            v-html="examResultData?.examName"
            class="left"
          ></div>
          <div class="right">
            <div class="sub-title">满分：{{ examResultData?.totalScore }}</div>
            <div class="my-score-wrap">
              <div class="score-warp">
                <img
                  v-for="img in getMyScoreImageList"
                  :src="img"
                  :key="img"
                  alt=""
                />
              </div>
              <img
                :src="UnderLine"
                :alt="$t('form.exam.underline')"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="exam-result-wrap__card__detail"
        v-if="examResultData.examSetting?.showScoreCard"
      >
        <table>
          <tbody>
            <tr class="header">
              <td>{{ $t("form.exam.currentRanking") }}</td>
              <td>{{ $t("form.exam.answerDuration") }}</td>
              <td>{{ $t("form.exam.submissionTime") }}</td>
            </tr>
            <tr>
              <td>{{ examResultData?.examRank }}</td>
              <td>{{ examResultData?.examDuration }}</td>
              <td>{{ examResultData?.examTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="exam-result-wrap__card__items">
        <exam-form
          v-if="formConf.fields && formConf.fields.length"
          :form-conf-copy="formConf"
          :form-model="examResultData.examResult"
          :correct-or-error-map="examResultData.correctOrErrorMap"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ExamResult">
import { computed, onBeforeMount, ref } from "vue";
import { FormExamResultVO, getExamResult } from "@/api/project/exam";
import { useRoute, useRouter } from "vue-router";
import { Ranking, ShareThree } from "@icon-park/vue-next";
import ExamForm from "./ExamForm.vue";
import { dbDataConvertForItemJson } from "@/views/formgen/utils/convert";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";

import Num0 from "@/assets/images/exam/0.svg";
import Num1 from "@/assets/images/exam/1.svg";
import Num2 from "@/assets/images/exam/2.svg";
import Num3 from "@/assets/images/exam/3.svg";
import Num4 from "@/assets/images/exam/4.svg";
import Num5 from "@/assets/images/exam/5.svg";
import Num6 from "@/assets/images/exam/6.svg";
import Num7 from "@/assets/images/exam/7.svg";
import Num8 from "@/assets/images/exam/8.svg";
import Num9 from "@/assets/images/exam/9.svg";
import Dot from "@/assets/images/exam/dot.svg";
import UnderLine from "@/assets/images/exam/under-line.svg";

const numMap: { [key: string]: any } = {
  "0": Num0,
  "1": Num1,
  "2": Num2,
  "3": Num3,
  "4": Num4,
  "5": Num5,
  "6": Num6,
  "7": Num7,
  "8": Num8,
  "9": Num9,
  ".": Dot
};

const examResultData = ref<FormExamResultVO>({
  scoreMap: {},
  examName: "",
  examResult: {},
  examTime: "",
  examDuration: "",
  examRank: 0,
  totalScore: 0,
  myScore: 0,
  correctOrErrorMap: {}
});

const router = useRouter();
const route = useRoute();
const props = defineProps({
  dataId: Number,
  // 显示维度报告
  showDimensionReport: Boolean
});

const examUniqueId = ref<string | null>(null);

onBeforeMount(async () => {
  // 从path获取参数
  const uniqueId = route.params.uniqueId;
  let res = await getExamResult(uniqueId as unknown as string, props.dataId as number);
  const fields = res.data.examItems?.map((item: any) => {
    let itemJson = dbDataConvertForItemJson(item) as BasicComponent;
    if (itemJson.examConfig) {
      itemJson.examConfig["showAnswer"] = true;
    }
    return itemJson;
  });
  formConf.value.formKey = res.data.formKey;
  formConf.value.fields = fields;
  examResultData.value = res.data;
  examUniqueId.value = res.data.examUniqueId as string;
});

// 获取我的分数的图片列表
const getMyScoreImageList = computed(() => {
  if (examResultData.value.myScore != null || examResultData.value.myScore !== undefined) {
    // 数字有几位数
    let numLength = examResultData.value.myScore?.toString().length || 0;
    let imgList = [];
    for (let i: number = 0; i < numLength; i++) {
      const char = examResultData.value.myScore?.toString().charAt(i) || "";
      // 数字几等于几
      imgList.push(numMap[char]);
    }
    return imgList;
  }
  return [];
});

const handleToRankList = () => {
  router.push({
    path: "/exam/rank/list",
    query: {
      uniqueId: examUniqueId.value
    }
  });
};

const handleToDimensionReport = () => {
  const href = router.resolve({
    path: "/form/dimension/result",
    query: {
      key: examResultData.value?.dataUniqueId
    }
  });
  window.open(href.href, "_blank");
};

const formConf = ref<any>({
  fields: [],
  formKey: "", // 项目唯一标识
  size: "default",
  labelPosition: "top",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  disabled: true,
  span: 24
});

const linkUrl = ref<string>(window.location.href);
</script>

<style scoped lang="scss">
.exam-result-wrap {
  height: 100%;
  &__card {
    min-height: 200px;
    width: 940px;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 10px;
  }
}

@media (max-width: 768px) {
  .exam-result-wrap__card {
    width: 100%;
  }

  .exam-result-wrap__card__detail {
    padding: 40px 0;
    table {
      margin: 0 auto;
      width: 350px !important;
      border-collapse: collapse;
      border-spacing: 0;

      .header td {
        background: var(--el-bg-color-page);
        font-size: 14px;
        width: 293px;
        height: 38px;
        border: var(--el-border);
        border-bottom: none;
        text-align: center;
        line-height: 1;
        color: var(--el-text-color-primary);
      }

      td {
        width: 292.5px;
        height: 38px;
        border: var(--el-border);
        text-align: center;
        line-height: 1;
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }
  }
  .exam-result-wrap__card__header {
    .top-bar {
      display: flex;
      justify-content: space-between;
      padding: 23px 30px;
      border-bottom: var(--el-border);
    }
    .content {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;

      .left {
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-left: 40px;
      }

      .right {
        width: 30% !important;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;

        .sub-title {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }

        .my-score-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 20px;
        }

        .score-warp {
          display: flex;
        }
      }
    }
  }
}

.exam-result-wrap__card__header {
  .top-bar {
    display: flex;
    justify-content: space-between;
    padding: 23px 30px;
    border-bottom: var(--el-border);
  }
  .content {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .left {
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .right {
      width: 20%;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .sub-title {
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }

      .my-score-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 20px;
      }

      .score-warp {
        display: flex;
      }
    }
  }
}

.exam-result-wrap__card__detail {
  padding: 40px 0;
  table {
    margin: 0 auto;
    width: 810px;
    border-collapse: collapse;
    border-spacing: 0;

    .header td {
      background: var(--el-bg-color-page);
      font-size: 14px;
      width: 293px;
      height: 38px;
      border: var(--el-border);
      border-bottom: none;
      text-align: center;
      line-height: 1;
      color: var(--el-text-color-primary);
    }

    td {
      width: 292.5px;
      height: 38px;
      border: var(--el-border);
      text-align: center;
      line-height: 1;
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  }
}
</style>
