<template>
  <div class="tc-checkbox-group">
    <el-checkbox-group
      @change="handleChange"
      v-bind="checkboxGroupProps"
      v-model="changeValue"
    >
      <template v-for="option in item?.config.options">
        <div
          v-if="!isHideQuota(option)"
          class="show-vote"
          :class="getOptionClass(option)"
        >
          <el-checkbox
            :label="option.value"
            :disabled="option.quotaSetting && getSurplusQuota(option) <= 0"
          >
            <span v-if="getSurplusQuota(option) <= 0 && item?.config.quotaBlankWarning">
              {{ item?.config.quotaBlankWarning }}
            </span>
            <span
              v-else
              v-html="option.label"
            ></span>
            <span
              class="text-muted"
              v-if="showQuota(option)"
            >
              (余{{ getSurplusQuota(option) }})
            </span>
          </el-checkbox>
          <div class="vote-wrap">
            <el-input
              v-if="option.type === 'input' && isChecked(option.value)"
              v-model="inputValueMap[option.value]"
              @change="handleInputValueChange"
              class="other-input"
            />
            <vote
              :value="option.value"
              :vote-list="voteList"
              :total-vote="totalVote"
              v-if="item?.config.showVoteResult"
            />
          </div>
        </div>
      </template>
    </el-checkbox-group>
  </div>
</template>

<script setup name="TCheckboxGroup" lang="ts">
import Vote from "../TVote/vote.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useFormItemExam } from "../hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "../hooks/useFormItemHook";
import { BasicComponent } from "../../GenerateForm/types/form";
import { useVoteHook } from "../TVote/useVoteHook";
import { useOptionQuota } from "../hooks/useOptionQuotaHook";

const props = defineProps({
  ...formItemProps,
  models: {
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits([...formEmits, "update:value", "changeLabel"]);
const examHook = useFormItemExam(<BasicComponent>props.item);
const formItemHook = useFormItem(props, emits);
const { changeValue, getOptions } = formItemHook;
const voteHook = useVoteHook(props);
const { handleArrayVote, voteList, totalVote } = voteHook;
const optionQuotaHook = useOptionQuota(props);
const { isHideQuota, getSurplusQuota, showQuota } = optionQuotaHook;

const inputValueMap = ref<any>({});

watch(
  () => changeValue,
  (val: any) => {
    // // 删除没选中的值
    if (!val.value) {
      return;
    }
    Object.keys(inputValueMap.value).forEach(key => {
      if (changeValue.value.indexOf(Number.parseInt(key)) < 0) {
        delete inputValueMap.value[key];
      }
    });
    // // 赋值label
    let labels: string[] = [];
    val.value.forEach((v: any) => {
      const item = getOptions().find((item: any) => item.value == v);
      if (item && item.type !== "input") {
        labels.push(item.label);
      } else {
        labels.push("");
      }
    });
    emits("changeLabel", labels);
  },
  {
    deep: true
  }
);

onMounted(() => {
  if (props.models && changeValue.value) {
    getOptions()
      .filter((item: any) => item.type === "input")
      .forEach((option: any) => {
        const index = changeValue.value.indexOf(option.value);
        if (index > -1) {
          inputValueMap[option.value] = props.models[`${props.item?.vModel}label`][index];
        }
      });
  }
});
const getOptionClass = (option: any) => {
  let classList = [
    props.item?.config.inline ? "inline-block" : "block",
    isChecked(option.value) ? "checked" : "",
    props.item?.disabled ? "disabled" : ""
  ];
  if (!changeValue.value) {
    return classList;
  }
  classList.push(...examHook.getExamClass(changeValue.value, option.value));
  return classList;
};

const checkboxGroupProps = computed(() => {
  const groupProps = { ...props.item };
  if (!groupProps?.max) {
    delete groupProps.max;
  }
  return groupProps;
});

const isChecked = (val: any) => {
  return changeValue.value && changeValue.value.indexOf(val) > -1;
};

const handleChange = (val: any) => {
  if (formItemHook.disabledProp.value) {
    return;
  }

  if (!val.length) {
    return;
  }

  handleArrayVote(props.value);

  // @ts-ignore
  const { exclusiveChoiceApiCodes, withExclusiveChoice } = props.item?.config;

  if (withExclusiveChoice) {
    const changeVal = val[val.length - 1];
    const isChecked = val.findIndex((e: any) => e.toString() === changeVal.toString());
    const isExclusive = exclusiveChoiceApiCodes.findIndex((e: any) => e.toString() === changeVal.toString());

    if (isChecked > -1 && isExclusive > -1) {
      emits("update:value", [changeVal]);
    }

    if (isChecked > -1 && isExclusive === -1) {
      const noExclusive = val.filter((e: any) => {
        const index = exclusiveChoiceApiCodes.findIndex((ex: any) => ex.toString() === e.toString());
        return index < 0;
      });
      emits("update:value", noExclusive);
    }
  }
  // 记录分值
  const scoreOptions = props.item?.config.options
    .filter((item: any) => val.indexOf(item.value) > -1 && item.score)
    .map((item: any) => item.score);
  props.models[`${props.item?.vModel}score`] = scoreOptions.reduce((acc: number, curr: number) => acc + curr, 0);
};

const handleInputValueChange = (val: any) => {
  const tempModels = props.models[`${props.item?.vModel}label`];
  Object.keys(inputValueMap.value).forEach(key => {
    let index = changeValue.value.indexOf(Number.parseInt(key));
    if (index > -1) {
      tempModels[index] = inputValueMap.value[key];
    }
  });
  emits("changeLabel", tempModels);
};
</script>
<style lang="scss" scoped>
@import "../../../assets/styles/exam";

.tc-checkbox-group {
  width: 100%;
}

.tc-checkbox-group .el-checkbox {
  height: auto;
  padding: 5px 10px;
  line-height: 28px !important;
}

:deep(.el-checkbox) {
  display: flex;

  .el-checkbox__input {
    line-height: 32px !important;
  }

  .el-checkbox__label {
    line-height: 28px !important;
  }
}

.block {
  margin-bottom: 10px;
  flex-direction: column;

  .el-checkbox {
    width: 100%;
  }

  .other-input {
    margin-top: 10px;
  }
}

.inline-block {
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 10px;
  vertical-align: top;

  .el-checkbox {
    width: 100%;
  }

  .other-input {
    margin-top: 10px;
  }
}

.inline-block.show-vote {
  min-width: 156px;
}

.show-vote {
  .other-input {
    margin-top: 0;
  }
}

@media screen and (max-width: 414px) {
  .inline-block.show-vote:nth-child(even) {
    margin-right: 0;
  }
}

.show-vote {
  border-radius: 8px;
  border: var(--el-border);

  .vote-wrap {
    padding: 5px 10px;
  }

  .vote-wrap:empty {
    padding: 0;
  }
}

.checked {
  border-color: var(--el-color-primary);
}

.checked.disabled {
  border-color: var(--el-disabled-border-color);
}

:deep(.el-checkbox__label) {
  width: 90% !important;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
  display: inline-block;
  vertical-align: middle;
}
</style>
