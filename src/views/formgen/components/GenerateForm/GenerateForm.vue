<template>
  <div class="t-gen-form">
    <el-form
      ref="genFormRef"
      :disabled="formConf?.disabled"
      :label-position="formConfCopy.labelPosition"
      :label-width="formConfCopy.labelWidth + 'px'"
      :model="formModel"
      :rules="formRules"
      :size="formConfCopy.size"
      :validate-on-rule-change="false"
      @validate="handleFormValidate"
    >
      <el-row
        :gutter="formConfCopy.gutter"
        style="margin: 0"
      >
        <generate-form-item
          v-for="(item, index) in getFields"
          :key="`${item.key}_${index}`"
          :cid="item.vModel"
          :index="index"
          :item="item"
          v-model:models="formModel"
          :seq-no="getSeqNo(index, item)"
          v-show="isFieldShow(item)"
          @next="nextPage"
          @prev="prevPage"
          @input-change="onInputChange"
          @ocr-success="handleOcrSuccess"
        />
        <el-col v-if="formConfCopy.formBtns">
          <el-form-item
            class="submit-btn-form-item"
            size="large"
            style="margin-top: 30px"
          >
            <el-button
              class="submit-btn"
              type="primary"
              :loading="btnLoading"
              @click="submitForm"
              :color="formThemeConfig?.themeColor"
            >
              {{ formThemeConfig?.submitBtnText || "提交" }}
            </el-button>
            <el-button
              v-if="formConfCopy.resetBtn"
              @click="resetForm"
            >
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="GenerateForm">
import type { Ref } from "vue";
import { computed, inject, onMounted, ref, watch, watchEffect } from "vue";
import GenerateFormItem from "./GenerateFormItem.vue";
import { cloneDeep, get, isArray, throttle } from "lodash-es";
import { execRemoteAPI } from "../../api/execRemoteAPI";
import { saveFormData } from "../../utils/db";
import { useRouter } from "vue-router";
import { useFormValidateRule } from "./hooks/useFormValidateRule";
import { useUserForm } from "@/stores/userForm";
import { storeToRefs } from "pinia";
import { useFormLogic } from "./hooks/useFormLogicHook";
import type { FormInstance } from "element-plus";
import { FormItemProp } from "element-plus";
import { useExamForm } from "@/views/formgen/components/GenerateForm/hooks/useExamHook";

let seqNo = 0;

const props = defineProps({
  // 表单配置
  formConf: {
    type: Object,
    required: true
  },
  // 表单数据对象
  pageFormModel: {
    type: Object,
    required: false
  },
  // 是否是子表单
  isSubForm: {
    type: Boolean,
    required: false,
    default: false
  }
});

const genFormRef = ref<FormInstance>();

const formConfCopy = ref<any>(cloneDeep(props.formConf));
const formModel = ref<any>(cloneDeep(props.pageFormModel));
const formRules = ref({});

const btnLoading = ref(false);

// 监听器：formThemeConfig
watchEffect(() => {
  seqNo = formConfCopy.value.startSeqNo || 0;
});

// 监听器：formModel
watch(
  formModel,
  val => {
    emit("update:pageFormModel", val);
  },
  { deep: true }
);

// 计算属性：hideFields
const userFormStore = useUserForm();
const { hiddenFormItemIds } = storeToRefs(userFormStore);
const hideFields = computed(() => hiddenFormItemIds.value || []);

const formThemeConfig = inject("formThemeConfig", ref({ showFormNumber: false, submitBtnText: "提交", themeColor: "" }));

// 监听显示序号开关的变化 把序号重置为0 不然会累加 主题页面开关会错误
watch(
  () => formThemeConfig.value.showFormNumber,
  () => {
    seqNo = 0;
  },
  { deep: true }
);

// 过滤隐藏字段
const getFields = computed(() => {
  return formConfCopy.value.fields.filter((item: any) => !item.hideType);
});

// 创建阶段
onMounted(() => {
  // 初始化动态数据 比如SELECT等远程数据
  initDynamicOptions(formConfCopy.value.fields);
  // 初始化默认值
  initFormData(formConfCopy.value.fields, formModel.value);
  // 构建表单校验规则
  buildRules(formConfCopy.value.fields, formRules);
  // 特殊处理分页
  seqNo = formConfCopy.value.startSeqNo || 0;
  // 加载考试设置
  examHook.handleExamSetting();
});

const examHook = useExamForm(() => {
  emit("submit", { formModel: formModel.value });
});

/**
 * 构建表单校验规则
 * @param componentList
 * @param rules
 */
const buildRules = (componentList: any[], rules: Ref<any>) => {
  componentList.forEach(cur => {
    // 逻辑城市显示并且不是隐藏字段
    console.log(cur);
    if (isFieldShow(cur) && !cur.hideType) {
      buildRule(cur, rules, formModel);
    }
  });
};

const handleFormValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.log(prop);
  console.log(isValid);
  console.log(message);
};

let router = useRouter();
const getRouteValue = (key: string): any => {
  const route = router.currentRoute.value;
  if (route && route.query && route.query[key]) {
    return route.query[key];
  }
  return null;
};

/**
 * 初始化动态选项 比如多选的接口取值 等
 * @param componentList
 */
const initDynamicOptions = async (componentList: any[]) => {
  for (const cur of componentList) {
    const config = cur.config;
    //  接口获取值
    if (config.optionsType && config.optionsType === 1) {
      try {
        const res = await execRemoteAPI.get(config.dynamicOptions.url);
        const options = get(res.data, config.dynamicOptions.dataPath);
        if (options && isArray(options)) {
          const dyOptions = options.map((op: any) => {
            let other: any = {};
            if (config.dynamicOptions.childrenField) {
              other["children"] = get(op, config.dynamicOptions.childrenField);
            }
            return {
              value: get(op, config.dynamicOptions.valueField),
              label: get(op, config.dynamicOptions.labelField),
              ...other
            };
          });
          config.options = dyOptions;
        }
      } catch (error) {
        console.error("Error fetching dynamic options:", error);
      }
    }
    //  如果是字典值 从字字典接口获取
    if (config.optionsType && config.optionsType === 2) {
      try {
        const dictRes = await execRemoteAPI.get(`/system/dict/data/type/${config.dictOptionType}`);
        config.options = dictRes.data.data.map((op: any) => ({
          value: op.dictValue,
          label: op.dictLabel
        }));
      } catch (error) {
        console.error("Error fetching dictionary options:", error);
      }
    }
  }
};
// 初始化表单默认值
const initFormData = (componentList: any[], formData: any) => {
  componentList.forEach(cur => {
    const config = cur.config;
    // 如果存在分页带回的数据
    if (cur.vModel && !formData[cur.vModel]) {
      const defaultValue = getRouteValue(cur.vModel) || config.defaultValue;
      formData[cur.vModel] = defaultValue;
      // 处理默认值的逻辑 不包括“”
      if (defaultValue !== undefined && defaultValue !== null) {
        handleLogicChange(config.defaultValue, cur.vModel, {});
      }
      console.log(formData[cur.vModel]);
    }
    if (config.children) {
      initFormData(config.children, formData);
    }
  });
  if (!props.isSubForm) {
    handleHiddenFieldDefaultValue(formData);
  }
};

// 隐藏字段默认值处理 如果符合自定义字段的规则的话 就填充到表单值中
const handleHiddenFieldDefaultValue = (formData: any) => {
  const queryParams = router.currentRoute.value.query;
  if (queryParams) {
    for (let key in queryParams) {
      if (/\d/.test(key) && !formData[key]) {
        formData[key] = queryParams[key];
      }
    }
  }
};

const { buildRule } = useFormValidateRule();

const { logicShowHandle } = useFormLogic(formConfCopy, formModel, formRules, buildRule);

const handleLogicChange = (value: any, field: any, item: any) => {
  seqNo = formConfCopy.value.startSeqNo || 0;
  logicShowHandle(value, field, item);
};

/**
 * 重置表单
 */
const resetForm = () => {
  formConfCopy.value = cloneDeep(props.formConf);
  genFormRef.value?.resetFields();
};

/**
 * 验证表单
 */
const validateForm = () => {
  return new Promise(resolve => {
    genFormRef.value?.validate((valid: boolean) => {
      resolve(valid);
    });
  });
};

/**
 * 提交表单
 */
const submitForm = throttle(function () {
  genFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      setTimeout(() => {
        const isError = document.getElementsByClassName("is-error");
        const input = isError[0].querySelector("input");
        if (input) {
          input.focus();
        } else {
          document.getElementsByClassName("is-error")[0].scrollIntoView();
        }
      }, 100);
      return false;
    }
    // 考试是否达到提交要求
    if (!examHook.handleExamCanSubmit()) {
      return;
    }
    if (valid) {
      btnLoading.value = true;
      setTimeout(() => {
        btnLoading.value = false;
      }, 1000);
      console.log(JSON.stringify(formModel.value));
      emit("submit", { formModel: formModel.value });
      return true;
    }
  });
}, 3000);

/**
 *
 * @param value
 * @param field
 * @param item
 */
const onInputChange = (value: any, field: any, item: any) => {
  emit("on-change", field, value, formModel);
  handleLogicChange(value, field, item);
  tempSaveFormData();
};

const nextPage = (page: number) => {
  switchPage("next", page);
};

const prevPage = (page: number) => {
  switchPage("prev", page);
};

const switchPage = (eventName: string, page: number) => {
  genFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      setTimeout(() => {
        const isError = document.getElementsByClassName("is-error") as any;
        isError[0].querySelector("input").focus();
      }, 100);
      return false;
    }
    //@ts-ignore
    emit(eventName, {
      page,
      startSeqNo: formConfCopy.value.startSeqNo,
      endSeqNo: seqNo,
      formModel: formModel.value
    });
    return true;
  });
};

/**
 * 字段是否显示
 * @param item
 */
const isFieldShow = (item: any) => {
  return !hideFields.value || !hideFields.value.length || hideFields.value.indexOf(item.vModel) === -1;
};

/**
 * 获取序号
 * @param index
 * @param item
 */
const getSeqNo = (index: number, item: any): number | null => {
  if (!formThemeConfig.value || formThemeConfig.value.showFormNumber !== true) {
    return null;
  }
  if (isFieldShow(item) && !item.displayType) {
    seqNo++;
  }
  return seqNo;
};

/**
 * OCR 识别成功
 * @param val
 */
const handleOcrSuccess = (val: any) => {
  Object.keys(val).forEach(key => {
    formModel.value[key] = val[key];
    const index = formConfCopy.value.fields.findIndex((item: any) => item.vModel === key);
    if (index === -1) return;
    const item = formConfCopy.value.fields[index];
    item.key = new Date() + key;
  });
};

/**
 * 临时保存
 */
const tempSaveFormData = throttle(function () {
  if (props.formConf?.value?.setting && props.formConf?.value.setting?.saveNotSubmitStatus) {
    saveFormData(formModel.value, props.formConf.value.formKey);
  }
}, 430);

/**]
 * 滚动到某个字段
 */
const scrollToField = (fieldId: string) => {
  genFormRef.value?.scrollToField(fieldId);
};

defineExpose({
  validateForm,
  resetForm,
  formModel,
  scrollToField
});

const emit = defineEmits(["submit", "on-change", "next", "prev", "update:pageFormModel"]);
</script>

<style lang="scss" scoped>
.submit-btn-form-item {
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center !important;
    justify-content: center !important;
  }
}

.submit-btn:hover {
  border: none;
  transform: scale(1.02);
  transition: all 0.3s ease;
}

.t-gen-form {
  width: 100%;
  padding: 12px 28px;

  .el-form {
    width: 100%;
  }
}
</style>
