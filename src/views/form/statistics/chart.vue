<template>
  <div class="dashboard-container">
    <el-card
      class="count-card"
      shadow="hover"
    >
      <template #header>
        <info
          theme="outline"
          size="13"
          fill="#333"
        />
        {{ $t("form.statistics.basicInformation") }}
      </template>
      <el-row class="count-card-content">
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.completedVolume')"
            :value="projectStats.completeCount"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.totalViews')"
            :value="projectStats.viewCount"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.recoveryRate')"
            :value="projectStats.completeRate"
            suffix="%"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.averageCompletionTime')"
            :value="projectStats.avgCompleteFormatStr"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-card
      v-if="formType === 4"
      class="count-card mt10"
      shadow="hover"
    >
      <template #header>
        <info
          fill="#333"
          size="13"
          theme="outline"
        />
        {{ $t("form.statistics.examScoreTip") }}
      </template>
      <el-row class="count-card-content">
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.avgScore')"
            :value="examScoreInfo.avgScore"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.minScore')"
            :value="examScoreInfo.maxScore"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            :title="$t('form.statistics.maxScore')"
            :value="examScoreInfo.minScore"
          />
        </el-col>
      </el-row>
    </el-card>
    <div class="chat-wrap">
      <el-row :gutter="20">
        <el-col :span="12">
          <situation :form-key="formKey" />
        </el-col>
        <el-col :span="12">
          <position-map :form-key="formKey" />
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="mt20"
      >
        <el-col :span="12">
          <device :form-key="formKey" />
        </el-col>
        <el-col :span="12">
          <submit-source :form-key="formKey" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script name="StatisticsChart" setup>
import { getFormExamScoreRequest, getFormReportRequest } from "@/api/project/report";
import situation from "./charts/situation.vue";
import PositionMap from "./charts/PositionMap.vue";
import device from "./charts/device.vue";
import SubmitSource from "./charts/source.vue";
import { Info } from "@icon-park/vue-next";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useFormInfo } from "@/stores/formInfo";

const { formType } = useFormInfo();

/**
 * 将毫秒数转为hh:mm:ss或mm:ss格式
 * 如果毫秒数超过60分钟，则以hh:mm:ss格式显示，反之以mm:ss格式显示
 * @param ms 毫秒数
 * @returns {string}
 */
function timeFormat(ms) {
  let h = Math.floor(ms / 1000 / 60 / 60);
  let m = Math.floor(ms / 1000 / 60);
  let s = Math.floor(ms / 1000);
  if (h === 1) {
    // 当时间刚好是60分钟时，让它以mm:ss格式显示,即显示60:00,而不是显示01:00:00
    if (m / 60 === 1 && s % 60 === 0) {
      h = "";
      m = "60:";
    } else {
      h = "01:";
      m = addZero(m % 60) + ":";
    }
    s = addZero(s % 60);
  } else {
    h = h === 0 ? "" : addZero(h) + ":";
    m = addZero(m % 60) + ":";
    s = addZero(s % 60);
  }
  return h + m + s;
}

// 进行补0操作
function addZero(n) {
  return n < 10 ? "0" + n : n;
}

const formKey = ref("");
const projectStats = ref({
  avgCompleteTime: 0,
  avgCompleteFormatStr: 0,
  viewCount: 0,
  completeCount: 0,
  completeRate: 0
});

const examScoreInfo = ref({});

const route = useRoute();

onMounted(() => {
  formKey.value = route.query.key;
  getProjectStats();
});

const getProjectStats = async () => {
  const res = await getFormReportRequest({ formKey: formKey.value });
  projectStats.value = res.data;
  if (projectStats.value.completeCount) {
    let rate = projectStats.value.completeCount / projectStats.value.viewCount;
    projectStats.value.completeRate = rate > 1 ? 100 : rate * 100;
    projectStats.value.avgCompleteFormatStr = timeFormat(projectStats.value.avgCompleteTime);
  } else {
    projectStats.value.completeRate = 0;
    projectStats.value.avgCompleteFormatStr = 0;
  }
  const examRes = await getFormExamScoreRequest({ formKey: formKey.value });
  if (examRes.data) {
    examScoreInfo.value = examRes.data;
  }
};
</script>
<style lang="scss" scoped>
.dashboard-container {
  margin: 0;
  padding: 0;
  overflow-x: hidden !important;
  min-height: 500px;

  .count-card {
    margin: 50px;

    &-content {
      margin-top: 20px;
      text-align: center;
    }
  }
}
.chat-wrap {
  margin: 50px;
}

:deep(.el-card) {
  margin: 0px;
}
</style>
