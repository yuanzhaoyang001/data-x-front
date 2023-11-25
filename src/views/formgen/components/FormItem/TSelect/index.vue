<template>
  <div
    class="w100"
    :class="classList"
  >
    <span class="tip-icon-inner"></span>
    <el-select
      v-bind="{ ...item }"
      v-model="changeValue"
      popper-class="t-select-popper"
      filterable
      @change="handleChange"
    >
      <el-option
        v-for="(option, index) in getOptions()"
        :key="option.value + index"
        :value="option.value"
        :label="option.label"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts" name="TSelect">
import { useFormItemExam } from "@/views/formgen/components/FormItem/hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { nextTick, onMounted } from "vue";

const props = defineProps({
  ...formItemProps
});

const emits = defineEmits([...formEmits, "changeLabel", "next"]);

const examHook = useFormItemExam(<BasicComponent>props.item);

const { classList } = examHook;

const formItemHook = useFormItem(props, emits);

const { changeValue, getOptions } = formItemHook;

const handleChange = (val: any) => {
  classList.value = examHook.getExamClass(changeValue.value, null);
  const label = getOptions().find((item: any) => val == item.value)?.label;
  emits("changeLabel", label);
  nextTick(() => {
    if (val) {
      formItemHook.autoNextPage(emits);
    }
  });
};

onMounted(() => {
  handleChange(changeValue);
});
</script>

<style scoped lang="scss">
@import "../../../assets/styles/exam";
</style>
