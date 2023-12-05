<template>
  <div class="w100 h100">
    <div class="t-nps-box">
      <span
        v-for="n in createArray(table?.min == undefined ? 1 : table?.min, table?.level)"
        class="item"
        :key="n"
        @mousemove="setCurrentHoverValue(n)"
        @click="handleClick(n)"
        :class="[currentHoverValue >= n ? 'hover' : '', changeValue === n ? 'active' : '']"
      >
        {{ n }}
      </span>
    </div>
    <div class="tip-text">
      <div>
        {{ table?.copyWriting.min }}
      </div>
      <div>
        {{ table?.copyWriting.max }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="TNps" setup>
import { ref } from "vue";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";

const props = defineProps({
  ...formItemProps,
  table: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(formEmits);

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;

const currentHoverValue = ref(0);

const setCurrentHoverValue = (val: number) => {
  if (val < changeValue.value) {
    return;
  }
  currentHoverValue.value = val;
};
const handleClick = (val: number) => {
  currentHoverValue.value = val;
  changeValue.value = val;
};

const createArray = (start: number, end: number) => {
  let array = [];
  for (let i = start; i <= end; i++) {
    array.push(i);
  }
  return array;
};
</script>

<style lang="scss">
.tip-text {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.t-nps-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--el-component-size);

  .item {
    transition: all 0.3s ease;
    height: var(--el-component-size);
    line-height: var(--el-component-size);
    flex: 1;
    text-align: center;
    display: inline-block;
    color: #314666;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
  }

  .hover {
    background-color: var(--form-theme-hover-color);
  }

  .active {
    background-color: var(--form-theme-color, #409eff);
    color: #fff;
  }
}

/*// 变亮
*/
@function tint($color, $percentage) {
  @return mix(white, $color, $percentage);
}
</style>
