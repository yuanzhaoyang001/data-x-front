<template>
  <div
    class="w100"
    :class="classList"
  >
    <span class="tip-icon-inner"></span>
    <el-input
      v-bind="{ ...item }"
      size="default"
      type="textarea"
      v-model="changeValue"
      @change="handleInputChange"
    ></el-input>
  </div>
</template>

<script setup lang="ts" name="TTextarea">
import { onMounted } from "vue";
import { useFormItemExam } from "@/views/formgen/components/FormItem/hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";

const props = defineProps({
  ...formItemProps
});

const emits = defineEmits(formEmits);

const examHook = useFormItemExam(<BasicComponent>props.item);

const { classList } = examHook;

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;

const handleInputChange = (val: any) => {
  classList.value = examHook.getExamClass(changeValue.value, null);
};

onMounted(() => {
  handleInputChange(changeValue);
});
</script>
<style scoped lang="scss">
@import "../../../assets/styles/exam";
</style>
