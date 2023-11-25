<template>
  <div>
    <el-input
      v-bind="{ ...item }"
      v-model="changeSelectValue"
      readonly="readonly"
      suffix-icon="ele-ArrowDown"
      @click="onClick"
    ></el-input>
    <van-popup
      round
      closeable
      lazy-render
      v-model:show="showPicker"
      position="bottom"
    >
      <div>
        <div class="title">
          <b>{{ item?.placeholder || "请选择" }}</b>
        </div>
        <div class="search">
          <el-input
            v-model="searchVal"
            placeholder="请输入名称搜索选项"
            @input="handleSearchInput"
          />
        </div>
        <div class="select-body">
          <dl class="select-option">
            <dd
              v-for="option in mobileOptions"
              :key="option?.value"
              class="select-option-item"
              :class="value == option?.value ? 'select-option-item-checked' : ''"
              @click="onConfirm(option?.value)"
            >
              <i></i>
              <div>{{ option?.label }}</div>
            </dd>
          </dl>
          <div v-if="!mobileOptions || !mobileOptions.length">
            <div class="no-data">
              <p>暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts" name="MobileTSelect">
import { useFormItemExam } from "@/views/formgen/components/FormItem/hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import { computed, onMounted, ref, watch, nextTick } from "vue";

const props = defineProps({
  ...formItemProps
});

const emits = defineEmits([...formEmits, "changeLabel", "next"]);

const examHook = useFormItemExam(<BasicComponent>props.item);

const { classList } = examHook;

const formItemHook = useFormItem(props, emits);

const { changeValue, getOptions, autoNextPage } = formItemHook;

const handleChange = (val: any) => {
  classList.value = examHook.getExamClass(changeValue.value, null);
};

const searchVal = ref("");
const showPicker = ref(false);
const mobileOptions = ref<any>([]);

const changeSelectValue = computed(() => {
  const options = getOptions();
  const value = options.find((e: any) => e.value === props.value);
  if (value) {
    return value.label;
  }
  return "";
});

const handleSearchInput = () => {
  mobileOptions.value = queryOptions(searchVal.value);
};

const queryOptions = (val: string) => {
  const options = getOptions();
  if (!val) {
    return getOptions();
  }
  return options.filter((e: any) => e.label.indexOf(val) > -1) || [];
};

const onClick = () => {
  mobileOptions.value = getOptions();
  showPicker.value = true;
};

const onConfirm = (value: any) => {
  changeValue.value = value;
  showPicker.value = false;
  const label = getOptions().find((item: any) => value == item.value)?.label;
  emits("changeLabel", label);
  // 自动下一页
  nextTick(() => {
    if (changeValue) {
      autoNextPage(emits);
    }
  });
};

onMounted(() => {
  mobileOptions.value = getOptions();
  handleChange(changeValue);
});
</script>

<style lang="scss" scoped>
.title {
  max-width: 80%;
  font-size: 16px;
  margin-top: 8px;
  margin-left: 16px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search {
  padding: 2px 5px;
}

.no-data {
  text-align: center;
  padding: 10px 0;
  margin: auto;
  color: #999;
}

.select-body {
  height: 44vh;
  overflow: hidden;
  overflow-y: auto;
  font-size: 16px;

  .select-option {
    padding-bottom: 30px;
  }

  .select-option-item {
    padding: 5px 18px;
    display: flex;

    i {
      background-color: #eff1f4;
      border-radius: 100%;
      box-sizing: border-box;
      cursor: pointer;
      display: block;
      height: 18px;
      margin-top: 3px;
      overflow: hidden;
      position: relative;
      width: 18px;
    }

    div {
      flex: 1;
      overflow: hidden;
      line-height: 22px;
      padding-left: 10px;
    }
  }

  .select-option-item-checked {
    i {
      border: 5px solid var(--color-primary);
    }
  }
}
</style>
