<template>
  <div>
    <div v-if="defaultTip">
      <div
        v-if="settingConfig.submitShowType === 2"
        v-html="settingConfig.submitShowCustomPageContent"
      />
      <el-result
        v-else
        icon="success"
        :title="$t('form.submitResult.submitSuccess')"
      />
    </div>
    <div v-else>
      <el-result icon="success">
        <template #extra>
          <div
            style="max-width: 80%; margin: 0 auto"
            v-html="tipTitle"
          ></div>
        </template>
      </el-result>
    </div>
    <!-- 考试分数-->
    <div
      v-if="resultData.examScoreText && settingConfig?.examSettings?.showScoreText"
      class="text-center"
    >
      {{ resultData.examScoreText }}
    </div>
    <!--    随机编号-->
    <div
      v-if="resultData.randomNumberText"
      class="text-center"
    >
      {{ resultData.randomNumberText }}
      <el-button
        v-copyText="resultData.randomNumberText"
        class="pl10"
        link
        type="primary"
      >
        复制
      </el-button>
    </div>
    <!--    核销码-->
    <div
      v-if="resultData.confirmationCodeInfo"
      class="text-center"
    >
      <div v-html="resultData.confirmationCodeInfo.descText"></div>
      <div
        v-if="resultData.confirmationCodeInfo.type === 'QR_CODE'"
        class="mt10 flex-center"
      >
        <!--      二维码吗-->
        <vue-qr
          :margin="0"
          :size="150"
          :text="getCodeJson(resultData.confirmationCodeInfo.code)"
        />
      </div>
      <svg
        v-else
        id="barcode"
      ></svg>
      <div
        v-copyText="resultData.confirmationCodeInfo.code"
        class="text-center mt10"
      >
        {{ resultData.confirmationCodeInfo.code }}
      </div>
    </div>
    <!--    查看排名和解析-->
    <div
      class="flex-center mt5"
      @click="handleToExamResult"
    >
      <!--		考试按钮-->
      <el-button
        v-if="settingConfig?.examSettings?.enableViewAnswer"
        @click="handleToExamResult"
        type="primary"
      >
        {{ $t("form.submitResult.viewRankAnswer") }}
      </el-button>
    </div>
    <!--    查看提交内容-->
    <div
      class="mt5 flex-center"
      style="text-align: center"
      @click="handleToAnswerResult"
    >
      <el-button
        v-if="settingConfig?.showSubmitContentBtn"
        @click="handleToAnswerResult"
        type="primary"
      >
        {{ $t("form.submitResult.viewSubmitContent") }}
      </el-button>
    </div>
    <!--    参与抽奖-->
    <div class="mt5 text-center flex-center">
      <el-button
        v-if="hasLottery"
        type="primary"
        @click="handleToLottery"
      >
        {{ $t("form.submitResult.participateInLottery") }}
      </el-button>
    </div>
    <!--    测评结果-->
    <div
      class="mt5 flex-center"
      style="text-align: center"
      @click="handleToEvaluationResult"
    >
      <el-button
        v-if="settingConfig?.enableEvaluationResult"
        @click="handleToEvaluationResult"
        type="primary"
      >
        {{ $t("form.submitResult.evaluationResult") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, PropType, ref } from "vue";
import VueQr from "vue-qr/src/packages/vue-qr.vue";
import JsBarcode from "jsbarcode";
import { jumpUrl, logicJumpResult } from "@/views/form/write/hooks/SubmitJump";
import { useRoute, useRouter } from "vue-router";
import { getActivitiesByTimeRange } from "@/api/project/lottery";

interface ResultData {
  // 数据Id 自增
  id: number;
  // 数据Id 唯一
  dataId: string;
  // 考试Id
  examId: string;
  randomNumberText: string;
  examScoreText: string;
  confirmationCodeInfo: {
    descText: string;
    type: string;
    code: string;
  };
}

const props = defineProps({
  resultData: {
    type: Object as PropType<ResultData>,
    default: () => {}
  },
  // 表单key
  formKey: {
    type: String,
    default: ""
  },
  // 表单设置
  settingConfig: {
    type: Object,
    default: () => {}
  },
  // 提交数据
  formData: {
    type: Object,
    default: () => {}
  }
});

const defaultTip = ref(true);
const tipTitle = ref();

const getCodeJson = (code: string) => {
  return `${props.formKey},${code}`;
};

const router = useRouter();

const handleToExamResult = () => {
  router.push({
    path: "/exam/result/" + props.resultData?.examId
  });
};

const handleToAnswerResult = () => {
  router.push({
    path: "/form/answer/result",
    query: {
      id: props.resultData?.dataId
    }
  });
};

const handleToLottery = () => {
  router.push({
    path: "/form/lottery",
    query: {
      id: props.resultData?.dataId,
      key: props.formKey
    }
  });
};

const handleToEvaluationResult = () => {
  const href = router.resolve({
    path: "/form/dimension/result",
    query: {
      key: props.resultData?.dataId
    }
  });
  window.open(href.href, "_blank");
};

// 是否有抽奖
const hasLottery = ref(false);

onMounted(() => {
  // 有动态逻辑设置的话先执行那个
  if (props.settingConfig.commitJumpLogicList) {
    // 合并返回值和表单数据

    let jumpResult = logicJumpResult(props.settingConfig.commitJumpLogicList, { ...props.formData, ...props.resultData });
    if (jumpResult && Object.keys(jumpResult).length > 0) {
      // 文字提示
      if (jumpResult.promptJumpType === "prompt") {
        tipTitle.value = jumpResult.promptJumpContent;
        defaultTip.value = false;
      } else {
        jumpUrl(jumpResult.promptJumpContent, 0);
      }
    }
  }
  //  跳转到指定页面
  if (props.settingConfig.submitJump) {
    jumpUrl(props.settingConfig.submitJumpUrl, props.resultData.id);
  }

  //  生成核销码
  nextTick(() => {
    if (props.resultData && props.resultData.confirmationCodeInfo && props.resultData.confirmationCodeInfo.type === "BAR_CODE") {
      JsBarcode("#barcode", getCodeJson(props.resultData.confirmationCodeInfo.code), {
        height: 70,
        width: 1,
        fontSize: 14,
        format: "CODE128",
        text: getCodeJson(props.resultData.confirmationCodeInfo.code),
        displayValue: false,
        textPosition: "bottom"
      });
    }
  });

  // 抽奖
  getActivitiesByTimeRange("FORM_LOTTERY", useRoute().params.key).then(res => {
    if (res.data) {
      hasLottery.value = true;
    }
  });
});
</script>

<style lang="scss" scoped>
.flex-center {
  width: 200px;
}
</style>
