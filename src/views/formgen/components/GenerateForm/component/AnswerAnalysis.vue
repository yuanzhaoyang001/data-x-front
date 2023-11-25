<template>
  <div
    v-if="isShow"
    class="answer-analysis-wrap"
  >
    <el-button
      class="mb5"
      v-if="!item.examConfig?.showAnswer && item.examConfig?.answerAnalysis"
      size="default"
      icon="ele-View"
      plain
      type="primary"
      @click="handleShowAnswer"
    >
      显示答案
    </el-button>
    <div
      class="answer-wrap"
      v-else
    >
      <!--		 正确答案-->
      <div
        class="correct-answer-wrap"
        v-if="!selectFields.includes(item.typeId)"
      >
        <div class="title">正确答案：</div>
        <div class="content">
          {{ item.examConfig?.answer }}
        </div>
      </div>
      <div
        class="correct-answer-wrap"
        v-if="item.examConfig?.answerAnalysis"
      >
        <div class="title">答案解析：</div>
        <div class="content">
          <div v-html="item.examConfig?.answerAnalysis"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { examComIds, selectFields } from "@/views/formgen/components/GenerateForm/examConfig";
import { computed } from "vue";
import { useExamForm } from "@/views/formgen/components/GenerateForm/hooks/useExamHook";

interface Props {
  // 组件数据模型
  item: BasicComponent;
  // 组件的输入值
  dataModel: any;
}

const props = defineProps<Props>();

// 显示答案
const handleShowAnswer = () => {
  props.item.examConfig!.showAnswer = true;
};

const { getExamSetting } = useExamForm();

const isShow = computed(() => {
  return examComIds.includes(props.item.typeId) && props.dataModel && getExamSetting.value?.practiceMode;
});

/**
 * 			selectFields: ["RADIO", "CHECKBOX", "IMG_SELECT", "SELECT"],
 * 			inputFields: ["INPUT", "TEXTAREA", "NUMBER"]
 * 		 考试支持的组件
 */
// 获取考试支持的组件Id类型
</script>

<style scoped lang="scss">
.answer-analysis-wrap {
  margin-bottom: 20px;
}
.correct-answer-wrap {
  background-color: rgba(241, 243, 246, 0.5);
  border-radius: 5px;
  padding: 8px 20px;
  margin-bottom: 10px;
  transition: all 0.3s linear;

  .title {
    padding-left: 8px;
    font-size: 14px;
    height: 16px;
    line-height: 16px;
    margin: 4px 0;
    color: var(--el-text-color-primary);
    border-left: 2px solid var(--el-color-primary);
  }

  .content {
    padding-left: 12px;
  }
}
</style>
