<template>
  <div class="horizontal-input">
    <span v-for="(item, index) in arr">
      <span v-if="item">{{ item }}</span>
      <span
        v-if="index < arr.length - 1"
        contenteditable="true"
        class="span-input"
        @input="onInput($event, index)"
        @keydown="onSpanInput"
      >
        {{ changeValue[index] }}
      </span>
    </span>
  </div>
</template>

<script setup name="HorizontalInput" lang="ts">
import { onMounted, ref, watch } from "vue";
import { formEmits, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";

const props = defineProps({
  input: {
    type: String,
    default: ""
  },
  value: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(formEmits);

const { changeValue } = useFormItem(props, emits);

const arr = ref<string[]>([]);

onMounted(() => {});

const initInputValueArr = () => {
  arr.value = props.input.split("$input");
};

watch(
  () => props.input,
  () => {
    initInputValueArr();
  },
  {
    immediate: true,
    deep: true
  }
);

const onSpanInput = el => {
  if (el.keyCode === 13) {
    el.preventDefault();
    return false;
  }
};

const onInput = (el, index) => {
  const { offsetWidth, innerText } = el.target;
  console.log(offsetWidth);
  if (offsetWidth > 80) {
    el.target.classList.add("span-input-inline");
  } else {
    el.target.classList.remove("span-input-inline");
  }
  changeValue.value[index] = innerText;
};
</script>

<style lang="scss" scoped>
:deep(.el-input__inner) {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #606266 !important;
  border-radius: 0px !important;
}

.horizontal-input {
  color: #606266;
  padding: 10px;

  .span-input {
    display: inline-block;
    min-width: 80px;
    border-bottom: 1px solid;
    padding: 0 5px;
    margin-right: 10px;
    line-height: 1;
  }

  .span-input-inline {
    display: inline;
  }
}
</style>
