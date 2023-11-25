<template>
  <el-select
    v-model="dataValue"
    v-bind="$attrs"
    @change="handleChange"
  >
    <el-option
      v-for="option in fields"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts" name="FormOptionSelect">
import { ref } from "vue";
import { listFormFieldsRequest } from "@/api/project/form";
import { useRoute } from "vue-router";
import { UPDATE_MODEL_EVENT } from "element-plus";

const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  formKey: {
    type: String,
    default: ""
  }
});

const fields = ref<any[]>([]);

const dataValue = ref(props.value);

listFormFieldsRequest(props.formKey).then(res => {
  fields.value = res.data;
});

const emit = defineEmits([UPDATE_MODEL_EVENT]);

const handleChange = (val: string) => {
  emit(UPDATE_MODEL_EVENT, val);
};
</script>

<style scoped lang="scss"></style>
