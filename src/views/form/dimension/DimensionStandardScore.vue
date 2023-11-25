<template>
  <div class="setting-wrap">
    <div class="header">
      <div>
        {{ $t("form.dimension.standardScore") }}
        <el-switch
          v-model="dimensionConf.enableStandardScore"
          size="default"
        />
      </div>
      <div class="ml15">
        {{ $t("form.dimension.weight") }}
        <el-switch
          v-model="dimensionConf.enableWeight"
          size="default"
        />
      </div>
    </div>
    <div class="text-danger mb10">{{ $t("form.dimension.scoreAndWithDesc") }}</div>
    <el-table
      :data="dimensionConf.dimensionList"
      border
      size="default"
      style="width: 100%"
    >
      <el-table-column
        :label="$t('form.dimension.dimensionSettingIndex')"
        min-width="60"
        type="index"
      ></el-table-column>
      <el-table-column
        :label="$t('form.dimension.dimensionTotalScore')"
        prop="name"
        width="300"
      >
        <template #default="scope">
          {{ getDimensionScore(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="dimensionConf.enableStandardScore"
        :label="$t('form.dimension.standardScore')"
        prop="name"
        width="300"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.standardScore"
            :min="0"
            :max="getDimensionScore(scope.row)"
            controls-position="right"
            size="default"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="dimensionConf.enableWeight"
        :label="$t('form.dimension.weightName')"
        prop="name"
        width="300"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.weight"
            :min="0"
            controls-position="right"
            size="default"
          />
          %
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { DimensionConfig, DimensionInfo } from "./types";
import { useExamForm } from "@/views/formgen/components/FormDesign/hooks/useExamForm";
import { ProjectItem } from "@/api/project/form";

const props = defineProps<{
  dimensionConf: DimensionConfig;
  fields: ProjectItem[];
}>();

const examFormHook = useExamForm();

// 计算当前维度题目分值
const getDimensionScore = (item: DimensionInfo): number => {
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
</script>

<style lang="scss" scoped>
.setting-wrap {
  padding: 20px;
  color: var(--el-text-color-primary);
}

.header {
  display: flex;
  justify-items: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>
