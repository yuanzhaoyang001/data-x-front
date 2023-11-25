<template>
  <div
    :style="getBackgroundStyle"
    class="project-form-wrapper"
  >
    <h1
      id="inActiveTime"
      style="display: none"
    />
    <top-login-user v-if="formThemeConfig?.showTopUserInfo" />
    <div
      v-show="!showConfirm"
      class="project-form"
    >
      <answer-card
        :field-list="allFields"
        :models="pageFormModel"
        @item-click="handleAnswerCardItemClick"
      />
      <div
        class="logo-img-wrap"
        v-if="formThemeConfig?.logoImgUrl"
      >
        <img
          alt="Logo"
          :src="formThemeConfig.logoImgUrl"
          class="logo-img"
        />
      </div>
      <el-image
        v-if="formThemeConfig?.headImgUrl"
        :src="formThemeConfig?.headImgUrl"
        style="width: 100%"
      />
      <div
        class="form-name-text"
        style="text-align: center"
        v-html="formConf?.title"
      />
      <div
        class="describe-html"
        v-html="formConf?.description"
      />
      <GenerateForm
        v-if="startParser"
        :key="parserKey"
        ref="pageContentRef"
        class="p15 mt15"
        :form-conf="tempFormConf"
        :all-fields="allFields"
        v-model:page-form-model="pageFormModel"
        @next="nextPage"
        @prev="prevPage"
        @submit="submitForm"
      />
      <p
        class="text-center foot-text"
        v-if="formThemeConfig?.showFootDescription"
      >
        {{ formThemeConfig?.footDescription }}
      </p>
      <p
        class="text-center support-text"
        v-if="formThemeConfig?.showSupport"
      >
        {{ getDevSupport }} {{ $t("formgen.index.powerBy") }}
      </p>
    </div>
    <div
      v-show="showConfirm"
      class="confirm-warp"
    >
      <el-result
        :sub-title="confirmTitle"
        icon="success"
      >
        <template #icon>
          <img src="../../../../assets/images/generateFormIcons/form.png" />
        </template>
        <template #extra>
          <el-button @click="showConfirm = false">{{ $t("formI18n.all.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleReStore"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts" name="GenerateFormWrap">
import type { Ref } from "vue";
import { computed, inject, nextTick, onMounted, onUnmounted, PropType, ref, watch } from "vue";
import { cloneDeep, get, keys, values } from "lodash-es";
import {
  BasicComponent,
  FormConfigType,
  FormModelType,
  FormThemeType,
  KeyValueType
} from "@/views/formgen/components/GenerateForm/types/form";
import { deepClone } from "@/views/formgen/utils";
import { useUserForm } from "@/stores/userForm";
import { setThemeVars } from "@/views/formgen/utils/theme";
import { useFormData } from "@/views/formgen/components/GenerateForm/hooks/useFormDataHook";
import { storeToRefs } from "pinia";
import { saveFormSaveData } from "@/views/formgen/utils/db";
import { generateId } from "@/utils";
import { getUserName } from "@/utils/auth";
import watermark from "@/utils/watermark";
import "@/views/formgen/utils/usertime";

import TopLoginUser from "./component/TopLoginUser.vue";
import GenerateForm from "./GenerateForm.vue";
import AnswerCard from "./component/AnswerCard.vue";
import { useThemeConfig } from "@/stores/themeConfig";

const props = defineProps({
  formConf: Object as PropType<FormConfigType>,
  // 表单数据
  formData: Object
});

// 开始解析
const startParser = ref<boolean>(false);
// 当前页面值
const pageFormModel: Ref<FormModelType> = ref(props.formData || {});

const tempFormConf = ref<FormConfigType>(
  (cloneDeep(props.formConf) as FormConfigType) || {
    fields: [],
    logicShowRules: {},
    formKey: "",
    formRef: "elForm",
    size: "small",
    labelPosition: "top",
    labelWidth: 100,
    formRules: "rules",
    gutter: 15,
    disabled: false,
    span: 24,
    formBtns: true,
    resetBtn: false,
    submitBtnColor: "#409EFF",
    unFocusedComponentBorder: true,
    perPageFields: {},
    hiddenFormItemIds: [],
    pageSeqNoObj: {}
  }
);

const parserKey = ref<string>(generateId());

// 主题
const formThemeConfig = inject<Ref<FormThemeType>>("formThemeConfig");

// 获取背景的样式
const getBackgroundStyle = computed(() => {
  const style: KeyValueType = {};
  if (formThemeConfig?.value.backgroundColor) {
    style["background"] = formThemeConfig?.value.backgroundColor;
  }
  if (formThemeConfig?.value.backgroundImg) {
    style["background"] = `url(${formThemeConfig?.value.backgroundImg}) no-repeat`;
  }
  return style;
});

const themeConfigStore = useThemeConfig();

const { themeConfig } = storeToRefs(themeConfigStore);

// 获取 技术支持文字
const getDevSupport = computed(() => {
  return themeConfig.value.globalTitle ? themeConfig.value.globalTitle : "";
});

const getFormPageCount = computed<number>(() => {
  return keys(props.formConf?.perPageFields).length;
});

const userFormStore = useUserForm();

const { allFields, hiddenFormItemIds } = storeToRefs(userFormStore);

const { restoreNotSaveData, pageContentRef, restoreLastSubmitData, showConfirm, confirmTitle, restoreData } =
  useFormData(tempFormConf);

onMounted(() => {
  tempFormConf.value = deepClone(props.formConf);
  // 分页序号存放
  tempFormConf.value.pageSeqNoObj = {};
  userFormStore.setAllFields(props.formConf?.fields || []);
  // 分页取出每页数据合并
  if (keys(tempFormConf.value.perPageFields)) {
    let allFields: BasicComponent[] = [];
    values(tempFormConf.value.perPageFields || {}).forEach((value: any) => {
      allFields = allFields.concat(value);
    });
    if (allFields && allFields.length) {
      userFormStore.setAllFields(allFields);
    }
  }
  userFormStore.setHiddenFormItemIds(tempFormConf.value.hiddenFormItemIds);
  startParser.value = true;
  // 恢复没提交的数据N
  restoreNotSaveData();
  // 恢复上次提交的数据
  restoreLastSubmitData();
});

onUnmounted(() => {
  watermark.del();
});

watch(
  () => formThemeConfig,
  () => {
    setThemeVars(formThemeConfig?.value || null);
    // 设置水印
    if (formThemeConfig?.value?.watermark) {
      let text = formThemeConfig?.value?.watermarkText || "";
      if (formThemeConfig?.value?.watermarkUserName) {
        text = getUserName();
      }
      watermark.del();
      watermark.set(text);
    }
  },
  { immediate: true, deep: true }
);

// 上一页
const prevPage = (params: any) => {
  if (params.page <= 1) {
    return;
  }
  tempFormConf.value.pageSeqNoObj[params.page] = params;
  tempFormConf.value.startSeqNo = tempFormConf.value.pageSeqNoObj[params.page - 1]?.startSeqNo;
  switchPage(params.page - 1, params);
  // 如果页无有效显示内容 直接跳过
  if (!hasShowField()) {
    params.page = params.page - 1;
    prevPage(params);
  }
};
// 下一页
const nextPage = (params: any) => {
  if (params.page >= getFormPageCount.value) {
    return;
  }
  tempFormConf.value.pageSeqNoObj[params.page] = params;
  tempFormConf.value.startSeqNo = params.endSeqNo;
  switchPage(params.page + 1, params);
  // 如果页无有效显示内容 直接跳过
  if (!hasShowField()) {
    params.page = params.page + 1;
    nextPage(params);
    return;
  }
  // 分页滚动到最顶部
  nextTick(() => {
    const container = document.querySelector(".write-container");
    if (container) {
      container.scrollTop = 0;
    }
  });
};

const switchPage = (page: number, params: any) => {
  const { formModel } = params;
  pageFormModel.value = formModel;
  tempFormConf.value.formBtns = keys(tempFormConf.value.perPageFields).length <= page;
  tempFormConf.value.fields = get(tempFormConf.value.perPageFields, page) || [];
  tempFormConf.value.currentPage = page;
  parserKey.value = generateId();
};

const handleReStore = () => {
  restoreData(pageFormModel, parserKey);
};

// 是否有显示字段
const hasShowField = () => {
  let hasShow = false;
  // 过滤掉分页组件本身
  let fields = tempFormConf.value.fields.filter((item: any) => item.typeId !== "PAGINATION");
  // 找到一个就证明有了
  for (let field of fields) {
    hasShow = !hiddenFormItemIds.value || !hiddenFormItemIds.value.length || hiddenFormItemIds.value.indexOf(field.vModel) === -1;
    if (hasShow) {
      break;
    }
  }
  return hasShow;
};

const submitForm = (data: any) => {
  const { formModel } = data;
  try {
    if (props.formConf?.setting && props.formConf?.setting.saveSubmitStatus) {
      saveFormSaveData(formModel, props.formConf.formKey);
    }
  } catch (e) {
    console.log(e);
  }
  emit("submit", data);
};

const handleAnswerCardItemClick = (formItemId: string) => {
  console.log(formItemId);
  pageContentRef.value.scrollToField(formItemId);
};

const emit = defineEmits(["submit"]);

// 静止缩放
window.onload = function () {
  document.addEventListener("touchstart", event => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener("gesturestart", event => {
    event.preventDefault();
  });
};
// @ts-ignore
document.querySelector("meta[name='viewport']")["content"] =
  "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
</script>

<style lang="scss">
@import "../../assets/styles/elementui-mobile";
@import "../../assets/styles/custom-theme";
</style>
