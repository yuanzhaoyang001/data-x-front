<template>
  <div
    class="w100"
    :class="classList"
  >
    <span class="tip-icon-inner"></span>
    <el-input-number
      v-bind="{ ...item }"
      v-model="changeValue"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts" name="TNumber">
import { useFormItemExam } from "@/views/formgen/components/FormItem/hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { onMounted } from "vue";

const props = defineProps({
  ...formItemProps
});

const emits = defineEmits(formEmits);

const examHook = useFormItemExam(<BasicComponent>props.item);

const { classList } = examHook;

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;

const handleChange = (val: any) => {
  classList.value = examHook.getExamClass(changeValue.value, null);
};

onMounted(() => {
  handleChange(changeValue);
});
</script>
<style scoped lang="scss">
@import "../../../assets/styles/exam";
</style>
