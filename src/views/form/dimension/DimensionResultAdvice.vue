<template>
  <div class="setting-wrap">
    <div>{{ $t("form.dimension.dimensionResultAndSuggestion") }}</div>
    <div>
      <span>{{ $t("form.dimension.dimscoreTitle") }}：</span>
      <el-radio-group v-model="dimensionConf.dimensionScoreType">
        <el-radio :label="1">{{ $t("form.dimension.sumScore") }}</el-radio>
        <el-radio :label="2">{{ $t("form.dimension.avgScore") }}</el-radio>
      </el-radio-group>
    </div>
    <div class="dimension-list">
      <div
        v-for="dim in dimensionConf.dimensionList"
        :key="dim.id"
        class="dimension-item"
      >
        <div class="dimension-item__header">
          <span class="mr5">{{ $t("form.dimension.dimensionName") }}:</span>
          <div class="dimension-item__title">{{ dim.name }}</div>
          <span class="mr5">{{ $t("form.dimension.scoreTitle") }}</span>
          <div class="dimension-item__score">{{ getDimensionScore(dim) }}</div>
          <el-text
            size="default"
            type="primary"
            @click="handleAdd(dim)"
          >
            {{ $t("form.dimension.addResultAndSuggestion") }}
          </el-text>
        </div>
        <el-table
          :data="dim.resultAdvices"
          border
          size="default"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('form.dimension.scoreRangeIndex')"
            prop="name"
            width="150"
          >
            <template #default="scope">
              <div>{{ scope.row.minScore }} ~ {{ scope.row.maxScore }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('form.dimension.resultSuggestionIndex')"
            prop="name"
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
                @click="handleEdit(dim, scope.row, scope.$index)"
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
    </div>
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
import { ProjectItem } from "@/api/project/form";
import { useExamForm } from "@/views/formgen/components/FormDesign/hooks/useExamForm";

const resultAdviceDialogRef = ref<any>(null);

const props = defineProps<{
  dimensionConf: DimensionConfig;
  fields: ProjectItem[];
}>();

// 当前的维度配置
const currentDimensionInfo = ref<DimensionInfo>();
// 当前选中的结果和建议
const currentResultAdviceIndex = ref<number>();

const handleSaveResultAdvice = (item: ResultAdvice) => {
  // 如果当前没有就是新增
  if (currentResultAdviceIndex.value == undefined) {
    currentDimensionInfo.value?.resultAdvices.push(item);
  } else {
    currentDimensionInfo.value!.resultAdvices[currentResultAdviceIndex.value] = item;
  }
};

const handleAdd = (item: DimensionInfo) => {
  currentDimensionInfo.value = item;
  resultAdviceDialogRef.value.handleShow(null, getDimensionScore(currentDimensionInfo.value));
};

const handleEdit = (item: DimensionInfo, resultAdvice: ResultAdvice, index: number) => {
  currentDimensionInfo.value = item;
  currentResultAdviceIndex.value = index;
  resultAdviceDialogRef.value.handleShow({ ...resultAdvice }, getDimensionScore(currentDimensionInfo.value));
};

const examFormHook = useExamForm();

// 计算当前维度题目分值
const getDimensionScore = (item: DimensionInfo) => {
  // 当前维度题目
  const fieldList = item.fieldList;
  // 查找改维度题目的分值
  const fieldScoreList = props.fields
    .filter(field => {
      return fieldList.includes(field.formItemId);
    })
    .map(field => field.scheme);
  return examFormHook.getTotalScore(fieldScoreList);
};

const handleDelete = (index: number) => {
  MessageBoxUtil.confirm(i18n.global.t("common.deleteConfirm"), () => {
    props.dimensionConf.dimensionList.splice(index, 1);
  });
};
</script>

<style lang="scss" scoped>
.setting-wrap {
  padding: 20px;
  color: var(--el-text-color-primary);
  height: 100%;
}

.dimension-list {
  margin-top: 10px;
  height: 70%;
  overflow: auto;

  .dimension-item {
    margin-top: 10px;

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
  }
}
</style>
