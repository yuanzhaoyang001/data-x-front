<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      {{ $t("form.setting.examSettingLabel") }}
      <span class="small-font-size ml20 text-secondary-color">{{ $t("form.setting.examSettingDescription") }}</span>
    </p>
    <el-divider />
    <el-scrollbar :height="`${wdHeight - 200}px`">
      <el-form
        ref="examSettingFormRef"
        :model="examSettingForm"
        :rules="settingRules"
      >
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.showAnswerCardLabel") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.showAnswerCardTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.showAnswerCard"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.disableCopyQuestionLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.disableCopyQuestionTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.disableCopyQuestion"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.enableMinTimeLabel") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.disableCopyQuestionTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.enableMinTime"
            @change="saveSettingHandle"
          />
        </div>
        <el-form-item
          v-if="examSettingForm.enableMinTime"
          :rules="[{ required: true, message: $t('form.setting.minTimeInputLabel'), trigger: 'blur' }]"
          prop="minTime"
        >
          <el-input-number
            v-model="examSettingForm.minTime"
            min="0"
            size="small"
            @change="saveSettingHandle"
          />
          {{ $t("form.setting.minute") }}
        </el-form-item>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.enableMaxTimeLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.enableMaxTimeTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.enableMaxTime"
            @change="saveSettingHandle"
          />
        </div>
        <el-form-item
          v-if="examSettingForm.enableMaxTime"
          :rules="[{ required: true, message: $t('form.setting.enableMaxTimeLabel'), trigger: 'blur' }]"
          prop="maxTime"
        >
          <el-input-number
            v-model="examSettingForm.maxTime"
            min="1"
            size="small"
            @change="saveSettingHandle"
          />
          {{ $t("form.setting.minute") }}
        </el-form-item>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.enableSwitchCountLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.enableSwitchCountTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.enableSwitchCount"
            @change="saveSettingHandle"
          />
        </div>
        <el-form-item
          v-if="examSettingForm.enableSwitchCount"
          :rules="[{ required: true, message: $t('form.setting.enableSwitchCountLabel'), trigger: 'blur' }]"
          prop="maxSwitchCount"
        >
          <el-input-number
            v-model="examSettingForm.maxSwitchCount"
            min="1"
            size="small"
            @change="saveSettingHandle"
          />
          {{ $t("form.setting.order") }}
        </el-form-item>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.practiceModeLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.practiceModeTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.practiceMode"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.randomQuestionOrderLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.randomQuestionOrderTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.randomQuestionOrder"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.enableViewAnswerLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.enableViewAnswerTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.enableViewAnswer"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.showScoreCardLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.showScoreCardTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.showScoreCard"
            @change="
              () => {
                examSettingForm.enableViewAnswer = true;
                saveSettingHandle();
              }
            "
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.showRankLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.showRankTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="examSettingForm.showRank"
            @change="
              () => {
                examSettingForm.enableViewAnswer = true;
                saveSettingHandle();
              }
            "
          />
        </div>
        <el-divider>{{ $t("form.setting.randomQuestion") }}</el-divider>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.randomDrawQuestionLabel") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.randomDrawQuestionTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-button
            bg
            icon="ele-Setting"
            size="small"
            text
            type="primary"
            @click="handleOpenRandomQuestion"
          >
            {{ $t("form.setting.extractQuestions") }}
          </el-button>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.questionBankRandomDrawLabel") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.questionBankRandomDrawTooltip')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-button
            bg
            icon="ele-Setting"
            size="small"
            text
            type="primary"
            @click="handleOpenBankRandomQuestion"
          >
            {{ $t("form.setting.extractQuestions") }}
          </el-button>
        </div>
        <RandomDrawQuestion
          ref="randomDrawQuestionRef"
          @change="handleRandomDrawQuestionChange"
        />
        <QuestionBankRandomDraw
          ref="questionBankRandomDrawRef"
          @change="handleQuestionBankDrawRuleChange"
        />
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" name="ExamSetting" setup>
import { onMounted, ref } from "vue";
import type { FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { MessageUtil } from "@/utils/messageUtil";
import { useWindowSize } from "@vueuse/core";
import { ExamSetting, getExamSettingRequest, saveExamSettingRequest } from "@/api/project/setting";
import RandomDrawQuestion from "./components/RandomDrawQuestion.vue";
import QuestionBankRandomDraw from "./components/QuestionBankRandomDraw.vue";

const { height: wdHeight } = useWindowSize();

const examSettingForm = ref<ExamSetting>({
  randomQuestionOrder: false,
  maxSwitchCount: 0,
  maxTime: 0,
  minTime: 0,
  enableMinTime: false,
  enableMaxTime: false,
  enableSwitchCount: false,
  showAnswerCard: false,
  disableCopyQuestion: false,
  practiceMode: false,
  enableViewAnswer: false,
  showScoreCard: false,
  showRank: false,
  // 随机抽题规则
  drawQuestionRuleList: [],
  // 题库抽题规则
  questionBankDrawRuleList: []
});

const settingRules = ref<any>([]);

const examSettingFormRef = ref<FormInstance>();

const router = useRouter();

const formKey = router.currentRoute.value.query.key as string;

const randomDrawQuestionRef = ref<any>(null);

const questionBankRandomDrawRef = ref<any>(null);

const saveSettingHandle = () => {
  examSettingFormRef.value?.validate(async valid => {
    if (valid) {
      saveExamSettingRequest(examSettingForm.value, formKey).then(() => {
        MessageUtil.success("保存成功");
      });
    }
  });
};

const handleRandomDrawQuestionChange = (val: any) => {
  examSettingForm.value.drawQuestionRuleList = val;
  saveSettingHandle();
};

const handleQuestionBankDrawRuleChange = (val: any) => {
  examSettingForm.value.questionBankDrawRuleList = val;
  saveSettingHandle();
};

const handleOpenRandomQuestion = () => {
  randomDrawQuestionRef.value?.showDialog(examSettingForm.value.drawQuestionRuleList);
};

const handleOpenBankRandomQuestion = () => {
  questionBankRandomDrawRef.value?.showDialog(examSettingForm.value.questionBankDrawRuleList);
};

onMounted(async () => {
  const res = await getExamSettingRequest(formKey);
  if (res.data) {
    examSettingForm.value = res.data;
  }
});
</script>
<style lang="scss" scoped>
@import "settting";
</style>
