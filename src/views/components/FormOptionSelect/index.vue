<template>
  <el-select
    v-model="dataValue"
    v-bind="$attrs"
    @change="handleChange"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option[props.valueProp]"
    />
  </el-select>
</template>

<script setup lang="ts" name="FormOptionSelect">
import { ref, watch } from "vue";
import { execRemoteAPI } from "@/views/formgen/api/execRemoteAPI";
import { get, isArray } from "lodash-es";
import { removeHtmlTag } from "@/views/formgen/utils";

const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  item: {
    type: Object,
    default: () => {}
  },
  valueProp: {
    type: String,
    default: "label"
  }
});
const dataValue = ref(props.value);
const options = ref<any[]>([]);

const getOptions = async (item: any) => {
  if (!item) {
    return;
  }
  const config = item.config;
  // 数据为从接口获取
  let finalOptions = item.config.options;
  // 转换
  if (finalOptions && isArray(finalOptions)) {
    finalOptions = finalOptions.map(op => ({
      value: op.value,
      label: removeHtmlTag(op.label)
    }));
  }
  if (config.optionsType && config.optionsType === 1) {
    execRemoteAPI.get(config.dynamicOptions.url).then(res => {
      const options = get(res.data, config.dynamicOptions.dataPath);
      if (options && isArray(options)) {
        const dyOptions = options.map(op => ({
          value: get(op, config.dynamicOptions.valueField),
          label: get(op, config.dynamicOptions.labelField)
        }));
        finalOptions = dyOptions;
      }
    });
  }
  // 从字典获取
  if (config.optionsType && config.optionsType === 2) {
    let dictRes = await execRemoteAPI.get(`/system/dict/data/type/${config.dictOptionType}`);
    finalOptions = dictRes.data.data.map(op => ({
      value: op.dictValue,
      label: op.dictLabel
    }));
  }
  options.value = finalOptions;
  return finalOptions;
};

watch(
  () => props.item,
  val => {
    if (val && val.field) {
      getOptions(props.item?.field?.scheme);
    }
  },
  {
    immediate: true,
    deep: true
  }
);

const emit = defineEmits(["input"]);
const handleChange = () => {
  emit("input", dataValue.value);
};
</script>

<style scoped lang="scss"></style>
