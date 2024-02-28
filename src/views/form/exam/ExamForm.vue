<template>
  <div
    class="t-gen-form"
    v-if="formConfCopy"
  >
    <el-form
      ref="examFormRef"
      :disabled="formConfCopy?.disabled"
      :label-position="formConfCopy?.labelPosition"
      :label-width="formConfCopy.labelWidth + 'px'"
      :model="formModel"
      :size="formConfCopy.size"
      v-if="hiddenFormItemIds !== null"
    >
      <template
        v-for="(item, index) in formConfCopy.fields"
        :key="index"
      >
        <div
          v-if="!hiddenFormItemIds.includes(item.vModel)"
          class="form-item"
          :class="currentItemId === item.vModel ? 'form-item-active' : ''"
          @click.stop="handleFormItemClick(item)"
        >
          <div class="item-seq-no">第 {{ index + 1 }} 题</div>
          <div class="form-item-wrap">
            <generate-form-item
              :cid="item.vModel"
              :index="index"
              :item="item"
              :models="formModel"
              :rules="formRules"
              class="gen-form-item"
            />
            <!--   操作插槽-->
            <slot
              name="action"
              v-bind="{ item, index }"
            ></slot>
            <div class="result-icon">
              <img
                v-if="correctOrErrorMap[item.vModel]"
                :src="correct"
                :alt="$t('form.exam.correct')"
              />
              <img
                v-if="correctOrErrorMap[item.vModel] === false"
                :src="error"
                :alt="$t('form.exam.wrong')"
              />
            </div>
          </div>

          <div v-if="item.examConfig?.answerAnalysis">
            <div class="mb5 ml5 answer-analysis">{{ $t("form.exam.answerAnalysis") }}：</div>
            <div
              class="mb10 ml5"
              v-html="item.examConfig.answerAnalysis"
            ></div>
          </div>
        </div>
      </template>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="ExamForm">
import { onBeforeMount, provide, Ref, ref } from "vue";
import GenerateFormItem from "@/views/formgen/components/GenerateForm/GenerateFormItem.vue";
import correct from "@/assets/images/exam/correct.svg";
import error from "@/assets/images/exam/error.svg";
import { getFormLogicRequest } from "@/api/project/form";
import { getHiddenFormItemIds } from "@/views/formgen/components/BizProjectForm/FormLogic";
import { inject } from "vue-demi";

const props = defineProps<{
  formConfCopy: any;
  formModel?: { [key: string]: any };
  correctOrErrorMap: { [key: string]: boolean };
}>();

const formRules = ref<any>([]);

const currentItemId = ref<string>("");

const handleFormItemClick = (item: any) => {
  currentItemId.value = item.vModel;
};

const hiddenFormItemIds = ref<string[] | null>(null);

const formLogicData = inject<Ref<any> | null>("formLogicData", null);

onBeforeMount(async () => {
  let tempLogicData = formLogicData && formLogicData!.value;
  if (!tempLogicData) {
    const res = await getFormLogicRequest({ formKey: props.formConfCopy.formKey });
    tempLogicData = res.data;
  }
  hiddenFormItemIds.value = getHiddenFormItemIds(props.formModel, tempLogicData, props.formConfCopy.fields) || [];
});

provide("formDisabled", true);

const examFormRef = ref<any>(null);

const scrollToField = (prop: string) => {
  examFormRef.value?.scrollToField(prop);
};

defineExpose({
  fields: props.formConfCopy.fields,
  scrollToField
});
</script>

<style scoped lang="scss">
.t-gen-form {
  padding: 20px 40px;
}

.form-item {
  border-bottom: 1px dashed var(--el-border-color);
  margin-bottom: 20px;
  position: relative;
  flex-direction: column;

  :deep(.el-form-item__label) {
    font-size: 14px;
    color: var(--el-text-color-primary);
    line-height: 28px;
    height: 28px;
  }
}

.result-icon {
  position: absolute;
  right: 0;
  top: 0;
}

.answer-analysis {
  color: var(--el-text-color-secondary);
}

.item-seq-no {
  font-size: 12px;
  line-height: 20px;
  color: var(--el-text-color-secondary);
}

.form-item-wrap {
  position: relative;
}

:deep(.form-item .el-form-item__label) {
  height: 100%;
}
</style>
