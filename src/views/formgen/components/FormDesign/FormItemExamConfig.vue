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
            :inline="true"
            :toolbar="formTitleToolbar"
          />
        </div>
      </div>
    </div>
    <el-divider>{{ $t("formgen.examConfig.valueSetting") }}</el-divider>
  </div>
</template>

<script>
import { debounce } from "lodash-es";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { inputFields, selectFields } from "@/views/formgen/components/GenerateForm/examConfig";

export default {
  name: "FormItemExamConfig",
  components: { FormTinymce },
  props: ["activeData", "formConf"],
  data() {
    return {
      formTitleToolbar:
        " styleselect fontsizeselect bold italic underline strikethrough undo redo  removeformat alignleft aligncenter alignright  subscript superscript " +
        " hr  charmap    forecolor backcolor    ",
      selectFields: selectFields,
      inputFields: inputFields
    };
  },
  computed: {
    isSupport() {
      return ["INPUT", "TEXTAREA", "RADIO", "CHECKBOX", "SELECT", "IMG_SELECT", "NUMBER"].includes(this.activeData.typeId);
    }
  },
  watch: {
    activeData: {
      handler(val) {
        if (!val.examConfig && this.isSupport) {
          this.activeData["examConfig"] = {
            scoringType: null,
            score: 1,
            enableScore: true,
            answer: null,
            // 答案解析
            answerAnalysis: null
          };
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    dataChange: debounce(function (val) {
      this.$emit("data-change", val);
    }, 430),
    changeRenderKey() {
      this.activeData.config.renderKey = +new Date();
    },
    handleEnableScoreChange(val) {},
    handleOptionScoreChange() {
      // 累加分值
      let totalScore = 0;
      // 如果是单选取最大值
      if (this.activeData.typeId === "RADIO" || this.activeData.typeId === "SELECT") {
        totalScore = Math.max(...this.activeData.config.options.map(item => item.score));
      } else {
        for (let option of this.activeData.config.options) {
          totalScore += option.score;
        }
      }
      this.activeData.examConfig.score = totalScore.toFixed(2);
    },
    handleScoringTypeChange(val) {
      if (val == 4) {
        for (let option of this.activeData.config.options) {
          option.score = 2;
        }
      }
    }
  },
  emits: ["data-change"]
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/right";
.answer-analysis-wrap {
  min-height: 50px;
  padding: 10px 0;
  overflow-y: auto;
  border-radius: 5px;
  border: var(--el-border);
}
</style>
