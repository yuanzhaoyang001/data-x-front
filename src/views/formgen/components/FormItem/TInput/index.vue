<template>
  <div
    class="w100"
    :class="classList"
  >
    <span class="tip-icon-inner"></span>
    <el-input-number
      v-bind="{ ...item }"
      @change="handleInputChange"
      v-if="item && item.config?.dataType && ['integer', 'float', 'number'].includes(item.config.dataType.type)"
      v-model.number="changeValue"
    />
    <el-input
      v-bind="{ ...item }"
      v-else
      type="text"
      v-model="changeValue"
      @change="handleInputChange"
    >
      <template
        v-if="item && item.prepend"
        #prefix
      >
        {{ item?.prepend }}
      </template>
      <template
        v-if="item && item.append"
        #suffix
      >
        {{ item?.append }}
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts" name="TInput">
import { onMounted } from "vue";
import { useFormItemExam } from "@/views/formgen/components/FormItem/hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { postRequest } from "@/api/baseRequest";

const props = defineProps({
  ...formItemProps,
  models: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(formEmits);

const examHook = useFormItemExam(<BasicComponent>props.item);

const { classList } = examHook;

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;

const handleInputChange = (val: any) => {
  classList.value = examHook.getExamClass(changeValue.value, null);
  handleLinkData();
};

const handleLinkData = () => {
  if (!props.item?.config?.dataLinkConfig || !changeValue.value) {
    return;
  }
  postRequest("/form/ext/getLinkDataResult", {
    inputValue: changeValue.value,
    dataLinkConfig: props.item?.config?.dataLinkConfig
  }).then(res => {
    console.log(res);
    if (res.data) {
      Object.keys(res.data).forEach(key => {
        props.models[key] = res.data[key];
      });
    }
  });
};

onMounted(() => {
  handleInputChange(changeValue);
});
</script>
<style scoped lang="scss">
@import "../../../assets/styles/exam";
</style>
