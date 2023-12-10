<template>
  <el-col
    :span="item.config.span"
    :class="{ 'none-display': !getItemLabel }"
  >
    <el-form-item
      :label-width="item.config.labelWidth ? `${item.config.labelWidth}px` : '100%'"
      :prop="item.vModel"
    >
      <template #label>
        <div class="t-form-item-label">
          <div v-html="getItemLabel" />
          <div
            v-html="item.description"
            v-if="item.description && item.titleDesc"
            class="form-item-description"
          ></div>
          <el-icon
            class="item-flag-icon"
            :class="getFlagIconClass(item.config.formId)"
            @click="toggleMarkedQuestion(item.config.formId)"
            v-if="showAnswerCard"
          >
            <ele-Flag />
          </el-icon>
        </div>
      </template>
      <div class="t-form-item-component">
        <!--特殊处理组件 二次包装的组件-->
        <template v-if="componentList.includes(item.typeId)">
          <component
            :is="itemComponent"
            v-model:value="dataModel"
            :item="item"
            :models="models"
            @changeLabel="handleChangeValueLabel"
            @next="
              (page: number) => {
                emit('next', page);
              }
            "
          />
        </template>
        <!--  OCR组件-->
        <template v-else-if="['OCR'].includes(item.typeId)">
          <component
            :is="itemComponent"
            v-model:value="dataModel"
            :item="item"
            :models="models"
            @ocr-success="
              (val: any) => {
                emit('ocr-success', val);
              }
            "
          />
        </template>
        <!--       分页-->
        <template v-else-if="['PAGINATION'].includes(item.typeId)">
          <component
            v-bind="{ ...item }"
            :is="itemComponent"
            @next="
              (page: number) => {
                emit('next', page);
              }
            "
            @prev="
              (page: number) => {
                emit('prev', page);
              }
            "
          />
        </template>
        <template v-else>
          <!--    其他无特殊处理组件-->
          <component
            v-bind="{ ...item }"
            :is="itemComponent"
            :item="item"
            v-model:value="dataModel"
          />
        </template>
      </div>
    </el-form-item>
    <AnswerAnalysis
      :item="item"
      :data-model="dataModel"
    />
  </el-col>
</template>

<script setup lang="ts">
import { computed, ref, toValue, watch } from "vue";
import { isLabelTag } from "./FormItemLabel";
import { isMobile } from "../../utils";
import { camelCase, upperFirst } from "lodash-es";
import { BasicComponent } from "@/views/formgen/components/GenerateForm/types/form";
import AnswerAnalysis from "./component/AnswerAnalysis.vue";
import { useUserForm } from "@/stores/userForm";
import { useExamForm } from "@/views/formgen/components/GenerateForm/hooks/useExamHook";

const props = defineProps<{
  item: BasicComponent;
  models: any;
  index?: number | null;
  seqNo?: number | null;
}>();

const { showAnswerCard } = useExamForm();
const emit = defineEmits(["ocr-success", "next", "prev", "update:models", "input-change"]);

// 动态导入组件
const modules = import.meta.glob("../FormItem/**/**.vue", { eager: true }) as any;
// 维护一个map 存储组件名和对象
const components: Record<string, any> = {};
Object.keys(modules).forEach(key => {
  const name = modules[key].default.name;
  if (name) {
    components[name] = modules[key].default;
  }
});

const itemComponent = computed(() => {
  const { tag } = props.item.config;
  let name = upperFirst(camelCase(tag));
  if (isMobile()) {
    let mCom = components[`Mobile${name}`];
    if (mCom) {
      return mCom;
    }
  }
  return components[name];
});

const componentList: string[] = [
  "SELECT",
  "IMAGE_CAROUSEL",
  "IMAGE_UPLOAD",
  "UPLOAD",
  "CASCADER",
  "IMAGE_SELECT",
  "INPUT",
  "TEXTAREA",
  "DATE",
  "SUB_FORM",
  "RATE",
  "SLIDER",
  "NUMBER",
  "FUNCTION_CALC",
  "RADIO",
  "CHECKBOX"
];

const dataModel = ref(props.models[props.item.vModel]);

const userFormStore = useUserForm();

const { toggleMarkedQuestion, markedQuestionList } = userFormStore;

const getFlagIconClass = (formId: string) => {
  return markedQuestionList.includes(formId) ? "item-flag-icon__active" : "";
};

const getItemLabel = computed(() => {
  if (!props.item.config.showLabel) {
    return "";
  }
  let seqNo = "";
  if (props.seqNo != null) {
    seqNo = `<span style="float: left;">${props.seqNo}：</span>`;
  }
  let label = props.item.config.label;
  // 存在动态引用其他字段
  if (props.item.config.label.includes("formvariable")) {
    const regex = /<formvariable[^>]*fieldid="([^"]*)"[^>]*>[^<]*<\/formvariable>/g;
    label = label.replace(regex, function (match: any, fieldid: string) {
      if (!props.models || !props.models[fieldid]) return match;
      if (isLabelTag(fieldid)) {
        return props.models[fieldid + "label"];
      }
      return props.models[fieldid];
    });
  }
  return seqNo + label;
});

watch(
  () => dataModel,
  val => {
    props.models[props.item.vModel] = val;
    emit("update:models", {
      ...props.models,
      [props.item.vModel]: toValue(val)
    });
    emit("input-change", toValue(val), props.item.vModel, props.item);
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.models,
  val => {
    dataModel.value = val[props.item.vModel];
  },
  {
    deep: true,
    immediate: true
  }
);

const handleChangeValueLabel = (value: any) => {
  props.models[props.item.vModel + "label"] = value;
  emit("update:models", props.models);
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label:before) {
  vertical-align: top;
  margin-top: 0.15em;
  display: inline-block;
}

:deep(.el-form-item__label) {
  display: flex !important;
}

.t-form-item-label {
  width: 100%;
  display: block;

  & > div {
    display: inline-block;
    width: 95%;
    word-wrap: break-word;
  }
}

//引用字段的值 不显示
:deep(formvariable) {
  display: none;
}

.t-form-item-component {
  width: 100%;
}

.none-display {
  :deep(.el-form-item__label) {
    display: none !important;
  }
}

.form-item-description {
  margin-left: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  word-wrap: break-word;
}

.item-flag-icon {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  cursor: pointer;

  &__active {
    color: var(--el-color-danger);
  }
}

.item-flag-icon:hover {
  transform: scale(1.2);
  // 加点过渡动画
  transition: all 0.1s ease;
}
</style>
