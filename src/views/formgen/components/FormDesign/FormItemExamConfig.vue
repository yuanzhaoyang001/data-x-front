<template>
  <div v-if="activeData.examConfig && isSupport">
    <el-divider>{{ $t("formgen.examConfig.title") }}</el-divider>
    <el-form-item :label="$t('formgen.examConfig.openScore')">
      <el-switch
        v-model="activeData.examConfig.enableScore"
        @change="handleEnableScoreChange"
      />
    </el-form-item>
    <div v-if="activeData.examConfig.enableScore">
      <el-form-item :label="$t('formgen.examConfig.scoreMethod')">
        <el-select
          v-model="activeData.examConfig.scoringType"
          :placeholder="$t('formgen.examConfig.scoreMethod')"
          @change="handleScoringTypeChange"
        >
          <el-option
            v-if="selectFields.includes(activeData.typeId)"
            :label="$t('formgen.examConfig.onlyAnswer')"
            :value="1"
          />
          <el-option
            v-if="inputFields.includes(activeData.typeId)"
            :label="$t('formgen.examConfig.includeAnswers')"
            :value="2"
          />
          <el-option
            v-if="inputFields.includes(activeData.typeId)"
            :label="$t('formgen.examConfig.exactlySame')"
            :value="3"
          />
          <el-option
            v-if="selectFields.includes(activeData.typeId)"
            :label="$t('formgen.examConfig.custom')"
            :value="4"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('formgen.examConfig.total')"
        v-if="activeData.examConfig.scoringType !== 4"
      >
        <el-input-number
          v-model="activeData.examConfig.score"
          :min="0"
          :step="0.1"
        />
      </el-form-item>
      <el-form-item
        v-if="selectFields.includes(activeData.typeId) && activeData.examConfig.scoringType !== 4"
        :label="$t('formgen.examConfig.answer')"
      >
        <el-select
          v-model="activeData.examConfig.answer"
          multiple
        >
          <el-option
            v-for="option in activeData.config.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="inputFields.includes(activeData.typeId)"
        :label="$t('formgen.examConfig.answer')"
      >
        <el-input
          v-model="activeData.examConfig.answer"
          :placeholder="$t('formgen.examConfig.answerPlaceholder')"
          type="textarea"
        />
      </el-form-item>
      <div v-if="activeData.examConfig.scoringType === 4">
        <span class="el-form-item__label">{{ $t("formgen.examConfig.valueScore") }}</span>
        <el-row
          v-for="option in activeData.config.options"
          :key="option.value"
          class="mt10"
        >
          <el-col :span="7">
            <span class="extra-small-font-size text-secondary-color">
              {{ option.label }}
            </span>
          </el-col>
          <el-col :span="10">
            <el-input-number
              v-model="option.score"
              :min="0"
              :step="0.1"
              @change="handleOptionScoreChange"
            />
          </el-col>
        </el-row>
      </div>
      <div>
        <span class="el-form-item__label extra-small-font-size">{{ $t("formgen.examConfig.analysis") }}</span>
        <div class="answer-analysis-wrap">
          <form-tinymce
            v-model:value="activeData.examConfig.answerAnalysis"
            :config="{ toolbar_mode: 'scrolling', height: 200 }"
          />
        </div>
      </div>
    </div>
    <el-divider>{{ $t("formgen.examConfig.valueSetting") }}</el-divider>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { inputFields, selectFields } from "@/views/formgen/components/GenerateForm/examConfig";

const props = defineProps({
  activeData: {
    type: Object,
    default: () => {}
  }
});

const isSupport = () => {
  return ["INPUT", "TEXTAREA", "RADIO", "CHECKBOX", "SELECT", "IMG_SELECT", "NUMBER"].includes(props.activeData.typeId);
};

const handleOptionScoreChange = () => {
  let totalScore = 0;
  if (props.activeData.typeId === "RADIO" || props.activeData.typeId === "SELECT") {
    totalScore = Math.max(...props.activeData.config.options.map(item => item.score));
  } else {
    for (let option of props.activeData.config.options) {
      totalScore += option.score;
    }
  }
  props.activeData.examConfig.score = totalScore.toFixed(2);
};

const handleScoringTypeChange = val => {
  if (val == 4) {
    for (let option of props.activeData.config.options) {
      option.score = 2;
    }
  }
};

watch(
  () => props.activeData,
  val => {
    if (!val.examConfig && isSupport()) {
      val["examConfig"] = {
        scoringType: null,
        score: 1,
        enableScore: true,
        answer: null,
        answerAnalysis: null
      };
    }
  },
  { immediate: true, deep: true }
);

const handleEnableScoreChang = () => {};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/right";

.answer-analysis-wrap {
  min-height: 50px;
  padding: 10px 0;
  overflow-y: auto;
  border-radius: 5px;
}
</style>
