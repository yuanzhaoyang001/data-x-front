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
import { watchDebounced } from "@vueuse/core";
import { useFuncCalcHook } from "@/views/formgen/components/FormItem/TFunCalc/useFuncCalc";
import { inject } from "vue-demi";

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

const isSubForm = inject("isSubForm", false);

//@ts-ignore
watchDebounced(
  () => props.models,
  (val: any) => {
    // 如果是子表单
    const result = evalFormula(val, props.item?.calcFormula, isSubForm);
    if (result != null) {
      changeValue.value = result;
    }
  },
  { debounce: 500, maxWait: 1000, immediate: true, deep: true }
);
</script>
