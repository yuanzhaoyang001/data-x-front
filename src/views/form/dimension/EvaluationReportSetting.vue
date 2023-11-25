<template>
  <div class="setting-wrap">
    <div>
      {{ $t("form.dimension.testDescription") }}
      <el-switch
        v-model="dimensionConf.enableEvaluation"
        size="default"
      />
      <div>
        <el-button
          v-model="dimensionConf.enableEvaluation"
          icon="ele-Edit"
          size="default"
          text
          type="primary"
          @click="dialogVisible = true"
        >
          {{ $t("form.dimension.enableEvaluation") }}
        </el-button>
        <div v-html="dimensionConf.evaluationDesc"></div>
      </div>
    </div>
    <div class="mt10">
      {{ $t("form.dimension.enableEvaluationResult") }}
      <el-switch
        v-model="dimensionConf.enableEvaluationResult"
        size="default"
      />
    </div>
    <div class="dimension-list">
      <div class="dimension-item__header">
        <span class="mr5">{{ $t("form.dimension.sumScoreTitle") }}:</span>
        <div class="dimension-item__score">{{ getSumScore() }}</div>
        <el-text
          size="default"
          type="primary"
          @click="handleAdd()"
        >
          {{ $t("form.dimension.addResultAndSuggestion") }}
        </el-text>
      </div>
      <el-table
        :data="dimensionConf.evaluationResultAdvices"
        border
        style="width: 100%"
      >
        <el-table-column
          :label="$t('form.dimension.scoreRangeIndex')"
          prop="name"
        >
          <template #default="scope">
            <div>{{ scope.row.minScore }} ~ {{ scope.row.maxScore }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('form.dimension.resultSuggestionIndex')"
          prop="name"
          width="300"
        >
          <template #default="scope">
            <div>{{ removeHtmlTag(scope.row.advice) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('form.dimension.operationIndex1')">
          <template #default="scope">
            <el-button
              icon="ele-Edit"
              size="default"
              text
              type="primary"
              @click="handleEdit(scope.row)"
            >
              {{ $t("common.edit") }}
            </el-button>
            <el-button
              icon="ele-Delete"
              size="default"
              text
              type="danger"
              @click="handleDelete"
            >
              {{ $t("common.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('form.dimension.testDescription')"
      width="30%"
    >
      <form-tinymce v-model:value="evaluationDesc" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t("common.cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click="handleSaveEvaluationDesc"
          >
            {{ $t("common.enter") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <result-advice-dialog
      ref="resultAdviceDialogRef"
      @submit="handleSaveResultAdvice"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { DimensionConfig, DimensionInfo, ResultAdvice } from "./types";
import ResultAdviceDialog from "./ResultAdviceDialog.vue";
import { removeHtmlTag } from "@/views/formgen/utils";
import { MessageBoxUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { useExamForm } from "@/views/formgen/components/FormDesign/hooks/useExamForm";
import { ProjectItem } from "@/api/project/form";

const resultAdviceDialogRef = ref<any>(null);

const props = defineProps<{
  dimensionConf: DimensionConfig;
  fields: ProjectItem[];
}>();

const evaluationDesc = ref(props.dimensionConf.evaluationDesc);

// 当前选中的结果和建议
const currentResultAdvice = ref<ResultAdvice | null>(null);

const handleSaveResultAdvice = (item: ResultAdvice) => {
  // 如果当前没有就是新增
  if (!currentResultAdvice.value) {
    props.dimensionConf.evaluationResultAdvices.push(item);
  } else {
    currentResultAdvice.value = item;
  }
};

const dialogVisible = ref(false);

const handleAdd = () => {
  resultAdviceDialogRef.value.handleShow(null, getSumScore());
};

const handleEdit = (resultAdvice: ResultAdvice) => {
  currentResultAdvice.value = resultAdvice;
  resultAdviceDialogRef.value.handleShow(resultAdvice, getSumScore());
};

const handleDelete = (index: number) => {
  MessageBoxUtil.confirm(i18n.global.t("common.deleteConfirm"), () => {
    props.dimensionConf.evaluationResultAdvices.splice(index, 1);
  });
};

const examFormHook = useExamForm();

const getSumScore = () => {
  // 找到所有维度下面的题目 把所有维度的fieldList汇总
  const fieldList = props.dimensionConf.dimensionList.flatMap((item: DimensionInfo) => item.fieldList);
  // 查找改维度题目的分值
  const fieldScoreList = props.fields
    .filter(field => {
      return fieldList.includes(field.formItemId);
    })
    .map(field => field.scheme);
  return examFormHook.getTotalScore(fieldScoreList);
};

const handleSaveEvaluationDesc = () => {
  props.dimensionConf.evaluationDesc = evaluationDesc.value;
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.setting-wrap {
  padding: 20px;
  color: var(--el-text-color-primary);
}

.dimension-item__header {
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  .dimension-item__title {
    font-weight: bold;
    margin-right: 10px;
  }

  .dimension-item__score {
    font-weight: bold;
    color: var(--el-color-danger);
    margin-right: 10px;
  }
}
</style>
