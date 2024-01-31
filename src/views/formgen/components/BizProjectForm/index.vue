<template>
  <GenerateForm
    v-if="startParser"
    ref="GenerateForm"
    :form-conf="formConf"
    :form-data="formData"
    :question-mode="false"
    @submit="submitForm"
  />
</template>

<script setup lang="ts" name="BizProjectForm">
import { computed, onMounted, provide, ref } from "vue";
import UAParser from "ua-parser-js";
import { themeDefaultValues } from "@/views/formgen/utils/theme";
import { getFormLogicData, parserFormLogic } from "./FormLogic";
import { useRoute } from "vue-router";
import { cloneDeep, get, keys, set } from "lodash-es";
import GenerateForm from "../GenerateForm/index.vue";
import { dbDataConvertForItemJson } from "../../utils/convert";
import request from "@/utils/request";
import { htmlDecodeByRegExp, isMobile, loadCSS, removeHtmlTag } from "../../utils";
import { useUserForm } from "@/stores/userForm";
import { composeComponents } from "@/views/formgen/components/GenerateForm/config";
import { SubmitFormData } from "@/api/project/data";
import { FormThemeType } from "@/views/formgen/components/GenerateForm/types/form";

const formConf = ref<any>({
  fields: [],
  logicShowRules: {},
  formKey: "",
  formKind: 1,
  formRef: "elForm",
  formModel: "formData",
  size: "default",
  labelPosition: "top",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
  resetBtn: false,
  unFocusedComponentBorder: true,
  perPageFields: {},
  setting: {},
  theme: {}
});

const startParser = ref(false);

provide(
  "formThemeConfig",
  computed(() => formConf.value.theme || themeDefaultValues)
);
provide(
  "formSetting",
  computed(() => formConf.value.setting || {})
);

const emit = defineEmits(["submit", "completed", "cover"]);

const propsData = defineProps({
  // 表单配置
  formConfig: Object,
  // 表单数据
  formData: Object
});

const route = useRoute();

const userFormStore = useUserForm();

onMounted(async () => {
  // Retrieve form key and kind from props or route query
  if (propsData.formConfig?.formKey) {
    formConf.value.formKey = propsData.formConfig?.formKey;
    if (propsData.formConfig?.formKind) {
      formConf.value.formKind = propsData.formConfig?.formKind;
    }
  } else if (route.query.key) {
    formConf.value.formKey = route.query.key as string;
    if (route.query.kind) {
      formConf.value.formKind = Number(route.query.kind);
    }
    formConf.value.formBtns = true;
  }
  formConf.value.setting = propsData.formConfig?.setting;
  // 合并
  formConf.value = Object.assign(formConf.value, propsData.formConfig);
  // 加载数据
  // 是模板还是用户自定义表单
  let url = `/user/form/details/${formConf.value.formKey}`;
  if (formConf.value.formKind === 2) {
    url = `/form/template/details/${formConf.value.formKey}`;
  }
  // 请求表单详细数据
  request.get(url).then((res: any) => {
    if (res.data) {
      // 处理逻辑表单
      let { logicTriggerRules, hiddenFormItemIds } = parserFormLogic(res.data);
      // 主题数据
      if (res.data.userFormTheme) {
        formConf.value.theme = res.data.userFormTheme;
        // 处理封面
        handleShowFormCover(res.data.userFormTheme);
        loadCSS(res.data.userFormTheme?.cssUrl);
      }
      // 处理表单问题项
      const fields = res.data.formItems.map((item: any) => {
        return dbDataConvertForItemJson(item);
      });
      // 是否有分页 处理分页数据
      pageShowHandle(fields);
      // 处理一页一题
      handleOnePerPage(fields);
      if (keys(formConf.value.perPageFields).length !== 0) {
        formConf.value.fields = get(formConf.value.perPageFields, 1);
        formConf.value.formBtns = false;
      } else {
        formConf.value.fields = fields;
      }
      if (res.data.form) {
        formConf.value.title = res.data.form.name;
        document.title = htmlDecodeByRegExp(removeHtmlTag(res.data.form.name));
        formConf.value.description = res.data.form.description;
        formConf.value.formType = res.data.form.type;
        formConf.value.formKey = res.data.form.formKey;
      }
      formConf.value.logicShowRules = logicTriggerRules;
      formConf.value.hiddenFormItemIds = [...hiddenFormItemIds.keys()] || [];
      startParser.value = true;
      // 题库抽题
      userFormStore.setRandomQuestionIds(res.data?.extractInfo?.randomQuestionIds);
      // 获取路由的参数
      userFormStore.setExtractInfo(route.query);
      // 加载完成后触发 给上级页面完成一些操作
      emit("completed");
    }
  });
});

const handleShowFormCover = (theme: FormThemeType) => {
  if (theme.enableCover && isMobile()) {
    emit("cover", theme);
  }
};

/**
 * 分页组件处理
 * @param allFields
 */
const pageShowHandle = (allFields: any[]) => {
  // 判断是否存在分页
  const index = allFields.findIndex(item => item.typeId === "PAGINATION");
  if (index < 0) {
    return;
  }
  let curr = 1;
  // 每页字段
  const perPageFields = {};
  // 存储全部分页组件的信息
  const pageFields = {};
  // 遍历所有字段 把不同页的组件归类到对象的同一个key下
  allFields.forEach(item => {
    let fields = get(perPageFields, curr);
    if (item.typeId === "PAGINATION") {
      set(pageFields, curr, item);
      // 判断当前页是否有组件 如果没有组件则认为是一个无效的分页组件，页数则不+1
      if (fields) {
        item.currPageNum = curr++;
      }
    } else {
      // 防止没获取到
      if (!fields) {
        fields = [];
      }
      fields.push(item);
      set(perPageFields, curr, fields);
    }
  });

  const len = keys(perPageFields).length;
  // 计算总页数 为每个分页控件绑定数据 并把分页控件添加到每页的控件数据末尾，
  // 并且为最后一页默认生成一个分页控件 否则不拖动将无法返回第一页
  keys(perPageFields).forEach((key: string) => {
    // 获取分页组件的定义
    const pageItem = get(pageFields, key);
    if (pageItem) {
      const fields = get(perPageFields, key);
      pageItem.totalPageNum = len;
      fields.push(pageItem);
      set(perPageFields, key, fields);
    }
    // 特殊处理最后一页 如果没有主动拖分页 则默认添加一个
    else {
      // 至少有一个分页组件 所以从1开始
      let defaultPageItem = cloneDeep(get(pageFields, 1));
      const fields = get(perPageFields, key);
      defaultPageItem.totalPageNum = len;
      defaultPageItem.currPageNum = len;
      fields.push(defaultPageItem);
      set(perPageFields, key, fields);
    }
  });
  formConf.value.perPageFields = perPageFields;
};

// 处理每页一题
const handleOnePerPage = (fields: any) => {
  // 开启了每日一题
  if (!formConf.value.setting || !formConf.value.setting?.onePageOneQuestion?.enableOnePageOneQuestion) {
    return;
  }
  // 找到分页的数据
  const pageCom = composeComponents.find(item => item.typeId === "PAGINATION") as any;
  // 除了隐藏的组件 每页一题
  const perPageFields = {};
  let curr = 1;
  const allFields = fields.filter((item: any) => !item.hideType);
  allFields.forEach((item: any) => {
    const currentPageComs = [item];
    const tempPageCom = cloneDeep(pageCom);
    tempPageCom!.totalPageNum = allFields.length;
    tempPageCom!.currPageNum = curr;
    currentPageComs.push(tempPageCom);
    set(perPageFields, curr, cloneDeep(currentPageComs));
    curr++;
  });
  formConf.value.perPageFields = perPageFields;
};

const getLogicShowData = (data: any) => {
  return getFormLogicData(data, formConf.value.logicShowRules);
};

//  统计用户停留时间
const ua = new UAParser(navigator.userAgent);

const submitFormData = ref<SubmitFormData>({
  completeTime: "",
  formKey: formConf.value.formKey,
  submitOs: ua.getOS()?.name,
  submitBrowser: ua.getBrowser()?.name,
  submitUa: ua.getResult(),
  wxUserInfo: null,
  wxOpenId: null,
  formType: formConf.value.formType,
  otherParam: undefined,
  originalData: null
});

const submitForm = (data: any) => {
  console.log("formmodel:", data);
  const { formModel } = data;
  const allData = {
    ...submitFormData.value,
    anonymous: formConf?.value?.setting?.anonymousWrite,
    completeTime: document.getElementById("inActiveTime")?.innerText,
    originalData: formModel,
    formType: formConf.value.formType
  };
  emit("submit", allData);
};

defineExpose({
  getLogicShowData,
  submitForm,
  formConf
});
</script>

<style lang="scss">
$themeColor: var(--form-theme-color);
@import "../../assets/styles/custom-theme-popper";
</style>

<style lang="scss" scoped>
$themeColor: var(--form-theme-color);
@import "../../assets/styles/custom-theme";
</style>
