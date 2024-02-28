<template>
  <el-form-item
    class="edit-form-item"
    :label-width="labelWidth"
    :required="config.required"
    :for="'null'"
    :prop="formItemId"
  >
    <template
      #label
      style="display: inline-block"
    >
      <form-tinymce
        v-if="config.showLabel"
        v-model:value="config.label"
        :inline="true"
        :toolbar="formTitleToolbar"
        :form-item-id="formItemId"
        @click="
          event => {
            event.preventDefault(); // 阻止 label 元素的默认行为
          }
        "
      />
      <span
        v-if="currentItem.examConfig && currentItem.examConfig.score && currentItem.examConfig.enableScore"
        class="text-after"
        @click="
          event => {
            event.preventDefault(); // 阻止 label 元素的默认行为
          }
        "
      >
        ({{ $t("formgen.formItem.max") }}:{{ currentItem.examConfig.score }} {{ $t("formgen.formItem.text") }})
        <span
          v-if="currentItem.examConfig.answer && currentItem.examConfig.scoringType !== 4"
          style="color: #13ce66; margin-left: 20px"
        >
          {{ $t("formgen.formItem.answer") }}：{{ getExamAnswer }}
        </span>
      </span>
      <preview-close-one
        v-if="currentItem.config.hideType"
        theme="outline"
        size="18"
        fill="#333"
        :strokeWidth="3"
        strokeLinejoin="bevel"
      />
      <div
        v-if="currentItem.description && currentItem.titleDesc"
        class="form-item-description"
      >
        <div v-html="currentItem.description"></div>
      </div>
    </template>
    <template #default>
      <div
        class="form-content"
        :class="[clickComponentList.includes(currentItem.typeId) ? '' : 'not-click-component']"
      >
        <!--     特殊处理组件 会对值进行包装等操作-->
        <template v-if="componentList.includes(currentItem.typeId)">
          <component
            :is="formItemComponent"
            v-model:value="currentItem.config.defaultValue"
            :item="currentItem"
            :mode="'design'"
            class="'form-item-component'"
            @input="handleDefaultValue"
          />
        </template>
        <template v-else>
          <!--    其他无特殊处理组件-->
          <component
            v-bind="{ ...currentItem }"
            :is="formItemComponent"
            v-model:value="currentItem.config.defaultValue"
            class="form-item-component"
            :mode="'design'"
            @input="handleDefaultValue"
          />
        </template>
      </div>
    </template>
  </el-form-item>
</template>

<script setup name="FormItem">
import { computed, defineEmits, defineProps } from "vue";
import FormTinymce from "../tinymce/index.vue";
import { getCheckedLabel } from "../GenerateForm/FormItemLabel";
import { camelCase, upperFirst } from "lodash-es";
import { PreviewCloseOne } from "@icon-park/vue-next";

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {}
  }
});

const formTitleToolbar =
  " styles fontsize bold italic underline strikethrough undo redo     forecolor backcolor image   formvariable fulledit";

// 这些组件值需要被包装 需要特殊处理
const componentList = [
  "RADIO",
  "CHECKBOX",
  "SELECT",
  "IMAGE_CAROUSEL",
  "IMAGE_UPLOAD",
  "UPLOAD",
  "CASCADER",
  "IMAGE_SELECT",
  "INPUT",
  "TEXTAREA",
  "DATE",
  "RATE",
  "SLIDER",
  "NUMBER",
  "FUNCTION_CALC",
  "PROVINCE_CITY"
];

// 允许点击的组件
const clickComponentList = ["TABLE_SELECT", "SUB_FORM"];

// 动态导入组件
const modules = import.meta.glob("../FormItem/**/**/**.vue", { eager: true });

const formItemComponent = computed(() => {
  // 小写下划线转大写驼峰
  const componentName = camelCase(getComponentName(props.currentItem));
  return modules[`../FormItem/${upperFirst(componentName)}/index.vue`]?.default;
});

const emit = defineEmits(["change"]);

const config = computed(() => {
  return props.currentItem.config;
});

const formItemId = computed(() => {
  console.log(props.currentItem);
  return props.currentItem.vModel;
});

const labelWidth = computed(() => {
  return config.value.labelWidth ? `${config.value.labelWidth}px` : null;
});

const getExamAnswer = computed(() => {
  if (["RADIO", "CHECKBOX", "IMG_SELECT", "SELECT"].includes(props.currentItem.typeId)) {
    const label = getCheckedLabel(props.currentItem.examConfig.answer, props.currentItem.config.options, props.currentItem, {});
    return Array.isArray(label) ? label.join(",") : "";
  } else {
    return props.currentItem.examConfig.answer;
  }
});

const handleDefaultValue = val => {
  props.currentItem.config["defaultValue"] = val;
};

const getComponentName = item => {
  return item.config.tag;
};
</script>

<style lang="scss" scoped>
:deep(.not-click-component::after) {
  display: unset;
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0);
}

:deep(.not-click-component) {
  pointer-events: none;
  user-select: none;
}

:deep(.form-item-component) {
  width: 100%;
}

:deep(.el-form-item__label) {
  width: 100% !important;
}

.el-form-item__label > div {
  border-radius: 3px;
  display: inline-block;
  width: 95%;
  border: 1px dashed transparent;
}

.el-form-item__label > div:hover {
  border: 1px dashed #d8d8d8;
}

:deep(.el-form-item__label:before) {
  vertical-align: top;
  margin-top: 0.15em;
  display: inline-block;
}

.text-after {
  color: #1890ff;
  margin-left: 10px;
  display: block;
}

.form-content {
  width: 100%;
}

.form-item-description {
  color: var(--el-text-color-secondary);
}
</style>
