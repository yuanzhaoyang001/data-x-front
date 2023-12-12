<template>
  <el-radio-group
    v-bind="{ ...item }"
    v-model="changeValue"
    style="width: 100%"
  >
    <template v-for="option in getOptions()">
      <div
        v-if="!isHideQuota(option)"
        class="show-vote"
        :class="getOptionClass(option)"
      >
        <el-radio
          :disabled="option.quotaSetting && getSurplusQuota(option) <= 0"
          :label="option.value"
          @click.prevent="handleClick(option)"
        >
          <span v-if="getSurplusQuota(option) <= 0 && item?.config?.quotaBlankWarning">{{ item.config.quotaBlankWarning }}</span>
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
        </el-radio>
        <div class="vote-wrap">
          <el-input
            v-if="option.type && option.type === 'input' && isChecked(option.value)"
            v-model="inputValue"
            class="other-input"
          />
          <vote
            :value="option.value"
            :vote-list="voteList"
            :total-vote="totalVote"
            v-if="item?.config?.showVoteResult"
          ></vote>
        </div>
      </div>
    </template>
  </el-radio-group>
</template>

<script setup name="TRadioGroup" lang="ts">
import Vote from "../TVote/vote.vue";
import { nextTick, onMounted, ref, toValue, watch } from "vue";
import { useFormItemExam } from "../hooks/useExamHook";
import { formEmits, formItemProps, useFormItem } from "../hooks/useFormItemHook";
import { BasicComponent } from "../../GenerateForm/types/form";
import { useVoteHook } from "../TVote/useVoteHook";
import { useOptionQuota } from "../hooks/useOptionQuotaHook";
import { removeHtmlTag } from "@/views/formgen/utils";

const props = defineProps({
  ...formItemProps,
  models: {
    type: Object,
    default: () => {}
  }
});

const inputValue = ref("");

const emits = defineEmits([...formEmits, "next"]);

const examHook = useFormItemExam(<BasicComponent>props.item);
const formItemHook = useFormItem(props, emits);
const { changeValue, getOptions, autoNextPage } = formItemHook;
const voteHook = useVoteHook(props);
const { handleVote, voteList, totalVote } = voteHook;
const optionQuotaHook = useOptionQuota(props);

const { isHideQuota, getSurplusQuota, showQuota } = optionQuotaHook;

watch(
  () => inputValue,
  (val: any) => {
    props.models[`${props.item?.vModel}label`] = val;
  },
  {
    deep: true
  }
);

onMounted(() => {
  if (props.models) {
    inputValue.value = props.models[`${props.item?.vModel}label`];
  }
});

const getOptionClass = (option: any) => {
  let classList = [
    props.item?.config?.inline ? "inline-block" : "block",
    isChecked(option.value) ? "checked" : "",
    props.item?.disabled ? "disabled" : ""
  ];
  if (!changeValue.value) {
    return classList;
  }
  classList.push(...examHook.getExamClass(changeValue.value, option.value));
  return classList;
};

const isChecked = (val: any) => {
  return val === changeValue.value;
};

const handleClick = (option: any) => {
  if (formItemHook.disabledProp.value) {
    return;
  }
  if (option.quotaSetting && getSurplusQuota(option) <= 0) {
    return;
  }
  option.value === changeValue.value ? (changeValue.value = null) : (changeValue.value = option.value);
  handleVote(changeValue.value);
  // 清空其他的输入
  inputValue.value = "";
  // 如果不是输入框 就把值赋值给label
  if (option.type !== "input") {
    props.models[`${props.item?.vModel}label`] = option.value === changeValue.value ? removeHtmlTag(option.label) : null;
  }
  // 分值
  props.models[`${props.item?.vModel}score`] = option.value === changeValue.value ? option.score : 0;
  // 自动下一页
  nextTick(() => {
    if (toValue(changeValue)) {
      autoNextPage(emits);
    }
  });
};

// 一页一题
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/exam";

.el-radio {
  height: auto;
  padding: 5px 10px;
  line-height: 28px !important;
}

:deep(.el-radio) {
  display: flex;

  .el-radio__input {
    line-height: 32px !important;
  }

  .el-radio__label {
    line-height: 28px !important;
  }
}

.block {
  margin-bottom: 10px;
  width: 100%;
  flex-direction: column;

  .el-radio {
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

  .el-radio {
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
  border-radius: 8px;
  border: var(--el-border);

  .vote-wrap {
    padding: 5px 10px;
  }

  .vote-wrap:empty {
    padding: 0;
  }

  .other-input {
    margin-top: 0;
  }
}

.checked {
  border-color: var(--form-theme-hover-color, #4c4edb);
}

.checked.disabled {
  border-color: #dcdfe6;
}

@media screen and (max-width: 414px) {
  .inline-block.show-vote:nth-child(even) {
    margin-right: 0;
  }
}

:deep(.el-radio__label) {
  width: 90% !important;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
  display: inline-block;
  vertical-align: middle;
}
</style>
