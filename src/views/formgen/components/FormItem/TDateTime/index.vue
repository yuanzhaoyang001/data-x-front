<template>
  <el-date-picker
    v-bind="{ ...item }"
    v-model="changeValue"
    popper-class="t-date-picker"
    :editable="!isMobile()"
  />
</template>

<script name="TDateTime" setup>
import dayjs from "dayjs";
import { isMobile } from "../../../utils/index";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { onMounted } from "vue";

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

function dateFormat(fmt, date) {
  const day = dayjs(date);
  return day.format(fmt);
}

onMounted(() => {
  // models 存在说明为填写页面 表单设计器中无需填充默认值
  if (props.item.config.defaultNowTime && props.models) {
    changeValue.value = dateFormat(props.item.format, new Date());
  }
});
</script>
