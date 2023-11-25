<template>
  <div class="w100">
    <el-input
      v-bind="{ ...item }"
      v-model="changeValue"
    />
  </div>
</template>

<script setup lang="ts" name="TFunCalc">
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { watch } from "vue";
import { useFuncCalcHook } from "@/views/formgen/components/FormItem/TFunCalc/useFuncCalc";

const props = defineProps({
  ...formItemProps,
  models: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(formEmits);

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;

const { evalFormula } = useFuncCalcHook();

watch(
  () => props.models,
  (val: any) => {
    const result = evalFormula(val, props.item?.calcFormula);
    if (result != null) {
      changeValue.value = result;
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
