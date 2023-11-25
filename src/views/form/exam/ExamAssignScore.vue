<template>
  <div class="exam-assign-wrap">
    <div class="exam-assign-wrap__header">
      <div>
        <span class="name">{{ currentFormName }}</span>
        <el-icon
          v-if="saveStatus"
          class="is-loading"
        >
          <ele-Loading />
        </el-icon>
        <el-icon v-else>
          <ele-Check />
        </el-icon>
        <span class="desc">{{ $t("form.exam.autoSaveTip") }}</span>
      </div>
      <div>
        <el-button
          size="default"
          type="primary"
          @click="handleSaveBack"
        >
          {{ $t("form.exam.saveAndExit") }}
        </el-button>
      </div>
    </div>
    <div class="exam-assign-wrap__body">
      <div class="exam-assign-wrap__body__inner">
        <div class="left-wrap">
          <el-card
            class="form-item-list-card"
            shadow="never"
          >
            <template #header>
              <div class="card-header">
                <span class="title">{{ $t("form.exam.scoreList") }}</span>
                <span class="desc">{{ currentDataIndex }}/{{ dataLst.length }}</span>
              </div>
            </template>
            <div class="list">
              <div
                v-for="(data, index) in dataLst"
                :key="data?.id"
                class="item"
                :class="[currentDataIndex - 1 == index ? 'item__active' : '']"
                @click="handleClick(data, index)"
              >
                {{ $t("form.exam.itemData") + (index + 1) }}
              </div>
            </div>
          </el-card>
          <el-card
            class="oper-card"
            shadow="never"
          >
            <el-switch
              v-model="onlyShowNoScore"
              :active-value="false"
              :inactive-value="null"
              size="default"
              @change="queryDataList"
            />
            {{ $t("form.exam.showUngradedOnly") }}
          </el-card>
          <el-card
            class="mt5"
            shadow="never"
          >
            <el-descriptions :column="1">
              <el-descriptions-item :label="$t('form.exam.answerDuration')">
                {{ formatSeconds(currentData?.answerTime || 0) }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t('form.exam.submissionTime')">{{ currentData?.createTime }}</el-descriptions-item>
              <el-descriptions-item :label="$t('form.exam.answerNo')">{{ currentDataIndex }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        <el-card
          class="center-wrap"
          shadow="never"
        >
          <exam-form
            ref="examFormWrapRef"
            v-if="formConf.fields && formConf.fields.length"
            :correct-or-error-map="examResultData.correctOrErrorMap"
            :form-conf-copy="formConf"
            :form-model="examResultData.examResult"
          >
            <template #action="{ item, index }">
              <el-form :disabled="false">
                <div
                  v-if="item.examConfig && item.examConfig.enableScore"
                  class="operate"
                >
                  <el-tag
                    size="default"
                    type="success"
                  >
                    {{ $t("form.exam.sumScoreText") }}：{{ getTotalScore([item]) }}
                  </el-tag>
                  <div>
                    <span class="desc-text mr10">{{ $t("form.exam.isCorrect") }}</span>
                    <span
                      :class="[item.correct && item.correct === true ? 'success' : '']"
                      class="btn"
                      @click="handleItemCorrect(item)"
                    >
                      <el-icon>
                        <ele-Check />
                      </el-icon>
                    </span>
                    <span
                      :class="[item?.correct === false ? 'danger' : '']"
                      class="btn"
                      @click="handleItemError(item)"
                    >
                      <el-icon><ele-Close /></el-icon>
                    </span>
                  </div>
                  <div class="flex-auto mt5">
                    <span class="desc-text mr10">{{ $t("form.exam.score") }}</span>
                    <el-input-number
                      controls-position="right"
                      v-model="item.score"
                      :max="getTotalScore([item])"
                      @change="handleChangeScore"
                      size="small"
                    />
                  </div>
                </div>
              </el-form>
            </template>
          </exam-form>
        </el-card>
        <div class="right-wrap">
          <el-card
            class="flex-center"
            shadow="never"
          >
            <span class="title">{{ $t("form.exam.currentScore") }}</span>
            <span class="current-score">{{ sumScore }}</span>
          </el-card>
          <el-card
            class="mt10 answer-card"
            shadow="never"
          >
            <template #header>
              <div class="card-header">
                <span>{{ $t("form.exam.answerCard") }}</span>
              </div>
            </template>
            <div class="answer-card__body">
              <div
                v-for="(filed, index) in formConf.fields"
                :key="index"
                :class="[
                  filed?.correct === true ? 'answer-card__body__item--correct' : '',
                  filed?.correct === false ? 'answer-card__body__item--error' : ''
                ]"
                class="answer-card__body__item"
                @click="gotoExamItem(filed.vModel)"
              >
                {{ index + 1 }}
              </div>
            </div>
          </el-card>
          <el-card
            class="mt10 flex-col-all-center"
            shadow="never"
          >
            <el-button
              :disabled="currentDataIndex == 1"
              plain
              size="default"
              type="primary"
              @click="handleSwitchPage(-1)"
            >
              {{ $t("form.exam.previousQuestion") }}
            </el-button>
            <el-button
              :disabled="currentDataIndex == dataLst.length"
              plain
              size="default"
              type="primary"
              @click="handleSwitchPage(1)"
            >
              {{ $t("form.exam.nextQuestion") }}
            </el-button>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFormInfo } from "@/stores/formInfo";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import { computed, onBeforeMount, provide, ref, watch } from "vue";
import ExamForm from "@/views/form/exam/ExamForm.vue";
import { FormExamResultVO, getExamDataList, getExamResult, saveManualRating, UserFormExamInfoEntity } from "@/api/project/exam";
import { dbDataConvertForItemJson } from "@/views/formgen/utils/convert";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { getFormLogicRequest } from "@/api/project/form";
import { useExamForm } from "@/views/formgen/components/FormDesign/hooks/useExamForm";

const { currentFormName } = storeToRefs(useFormInfo());

const router = useRouter();
const route = useRoute();

const handleSaveBack = () => {
  router.back();
};

const sumScore = computed(() => {
  // 累加字段分数
  let total = 0;
  console.log(JSON.stringify(formConf.value.fields));
  formConf.value.fields.forEach((item: any) => {
    if (item.examConfig && item.examConfig.enableScore) {
      total += item.score ? Number(item.score) : 0;
    }
  });
  return total || 0;
});

const formKey = route.query.formKey as unknown as string;

const dataLst = ref<UserFormExamInfoEntity[]>([]);

const currentDataIndex = ref<number>(1);
const currentData = ref<UserFormExamInfoEntity | null>(null);
const onlyShowNoScore = ref(null);

onBeforeMount(async () => {
  queryDataList();
  // 获取逻辑
  const { data: logicData } = await getFormLogicRequest({ formKey: formKey });
  formLogicData.value = logicData;
});

const queryDataList = () => {
  getExamDataList(formKey as unknown as string, onlyShowNoScore.value).then((res: any) => {
    dataLst.value = res.data;
    if (res.data) {
      currentData.value = res.data[0];
    }
  });
};

watch(
  () => currentData.value?.dataId as number,
  async (id: number) => {
    let res = await getExamResult("", id);
    const fields =
      res.data?.examItems?.map((item: any) => {
        let itemJson = dbDataConvertForItemJson(item) as BasicComponent;
        if (itemJson.examConfig) {
          itemJson.examConfig["showAnswer"] = true;
        }
        return itemJson;
      }) || [];
    formConf.value.formKey = res.data?.formKey;
    if (fields) {
      formConf.value.fields = fields.map((item: any) => {
        item.correct = res.data.correctOrErrorMap[item.vModel];
        item.score = res.data.scoreMap[item.vModel] || null;
        return item;
      });
    }
    examResultData.value = res.data;
  },
  {
    immediate: true,
    deep: true
  }
);

const handleSwitchPage = (page: number) => {
  currentDataIndex.value = currentDataIndex.value + page;
  if (currentDataIndex.value > dataLst.value.length) {
    currentDataIndex.value = 1;
  } else if (currentDataIndex.value < 1) {
    currentDataIndex.value = dataLst.value.length;
  }
  currentData.value = dataLst.value[currentDataIndex.value - 1];
};

const formLogicData = ref(null);
provide("formLogicData", formLogicData);

const handleClick = (item: UserFormExamInfoEntity, index: number) => {
  if (item.dataId) {
    currentData.value = item;
    currentDataIndex.value = index + 1;
  }
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

// 写一个把毫秒格式化成 12:30:23 时分秒的方法 不足0的补0
function formatSeconds(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  // 使用模板字符串确保输出的时、分、秒都是两位数，不足的话会用 0 补齐
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

const handleItemCorrect = (item: any) => {
  item.score = getTotalScore([item]);
  item.correct = true;
  saveStatus.value = true;
  handleSaveManualRating();
};

const handleItemError = (item: any) => {
  item.score = 0;
  item.correct = false;
  saveStatus.value = true;
  handleSaveManualRating();
};

// 保存中状态
const saveStatus = ref(false);

const handleChangeScore = () => {
  saveStatus.value = true;
  handleSaveManualRating();
};

const handleSaveManualRating = useDebounceFn(async () => {
  await saveManualRating(
    currentData.value?.id as number,
    formConf.value.fields
      .filter((item: any) => item.examConfig && item.examConfig.enableScore)
      .map((item: any) => {
        return {
          formItemId: item.vModel,
          score: item.score,
          correct: item.correct
        };
      })
  );
  saveStatus.value = false;
}, 500);

const examFormWrapRef = ref(null);

const gotoExamItem = (id: string) => {
  examFormWrapRef.value?.scrollToField(id);
};

const examForm = useExamForm();
const { getTotalScore } = examForm;
</script>
<style lang="scss" scoped>
.exam-assign-wrap {
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-page);

  &__header {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: var(--el-bg-color);

    .name {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
      color: var(--el-text-color-primary);
    }

    .desc {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  &__body {
    height: calc(100% - 50px);

    &__inner {
      margin: 0 auto;
      max-width: 85%;
      display: flex;
      align-items: center;
      height: 100%;
      justify-content: space-evenly;
    }

    .left-wrap {
      width: 250px;
      height: 90%;
      border-radius: 8px;

      .form-item-list-card {
        height: 65%;
        overflow: auto;
        margin-bottom: 10px;
      }

      .card-header {
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          font-size: 14px;
          font-weight: bold;
        }

        .desc {
          font-size: 12px;
        }
      }

      .list {
        .item {
          width: 100%;
          height: 35px;
          line-height: 35px;
          text-align: left;
          border-radius: 4px;
          // 超出部分省略
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: 10px;
          cursor: pointer;
          color: var(--el-text-color-primary);

          &:hover,
          &__active {
            background-color: var(--el-color-primary-light-10);
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .center-wrap {
    height: 90%;
    width: 50%;
    overflow: auto;
  }

  .right-wrap {
    height: 90%;
    width: 15%;

    .current-score {
      font-size: 30px;
      font-weight: bold;
      color: var(--el-color-danger);
      text-align: left;
      margin-left: 10px;
    }
  }

  .operate {
    float: left;
    margin-left: 40px;

    .btn {
      margin: 5px;
      display: inline-block;
      height: 25px;
      width: 25px;
      border-radius: 14px;
      border: var(--el-border);
      font-size: 14px;
      font-weight: bold;
      line-height: 25px;
      text-align: center;
      cursor: pointer;
    }

    .success {
      background-color: var(--el-color-success);
      color: #fff;
      border: 1px solid var(--el-color-success);
    }

    .danger {
      background-color: var(--el-color-danger);
      color: #fff;
      border: 1px solid var(--el-color-danger);
    }
  }
}

.answer-card {
  height: 80%;
}

.answer-card__body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15px;
  min-height: 70%;

  &__item {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: var(--el-bg-color-page);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333;
    margin: 5px;
    cursor: pointer;
  }

  &__item--error {
    background: var(--el-color-danger);
    color: #fff;
  }

  &__item--correct {
    background: var(--el-color-success);
    color: #fff;
  }
}

:deep(.t-gen-form) {
  padding: 0;
}

:deep(.result-icon) {
  display: none;
}

:deep(.form-item) {
  width: 100%;
  padding: 20px;
}

:deep(.form-item-wrap) {
  display: flex;
}

:deep(.gen-form-item) {
  width: 90%;
  flex: 0 0 70%;
}

:deep(.form-item-active) {
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 6px;
}
</style>
