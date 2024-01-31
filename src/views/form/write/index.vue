<template>
  <div class="write-container t-form-theme-wrap">
    <div
      v-cloak
      v-if="writeStatus == 0"
    >
      <!--			无法填写-->
      <el-result
        :title="writeNotStartPrompt"
        icon="error"
      />
    </div>
    <div
      v-cloak
      v-if="writeStatus == 3"
    >
      <form-enter-check
        :form-key="formKey"
        :setting="userFormSetting"
        @enter="writeStatus = 1"
      />
    </div>
    <div
      v-if="writeStatus == 1"
      class="form-container h100"
    >
      <biz-project-form
        v-if="formConfig.formKey"
        ref="bizProjectFormRef"
        :form-config="formConfig"
        @submit="submitForm"
        @completed="handleFormLoadCompleted"
        @cover="handleShowFormCover"
      />
      <form-qrcode />
      <!--    商品支付-->
      <goods-pay
        ref="goodsPayRef"
        @paySuccess="handlePaymentSuccess"
      />
    </div>
    <div
      v-cloak
      v-if="writeStatus == 2"
      class="title-icon-view"
    >
      <SubmitResult
        v-if="writeStatus == 2"
        :form-key="formKey"
        :form-data="submitFormDataReq?.originalData"
        :result-data="submitResult"
        :setting-config="userFormSetting"
      />
    </div>
    <Transition name="fade">
      <form-cover
        :form-theme-config="themeConfig"
        v-if="showCover"
        @close="showCover = false"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts" name="WriteView">
import { onBeforeMount, provide, Ref, ref } from "vue";

import { useRouter } from "vue-router";
import { useFormWxHook } from "@/views/form/write/hooks/useFormWxHook";
import { useFormExpand } from "@/views/form/write/hooks/useFormExpandHook";
import {
  createFormResultRequest,
  publicCreateFormResultRequest,
  SubmitFormData,
  viewFormResultRequest
} from "@/api/project/data";
import { getPublicSettingsRequest, getWriteSettingStatusRequest } from "@/api/project/setting";
import {
  getLastFormDataId,
  getTempFormData,
  removeFormData,
  removeTempFormData,
  saveLastFormDataId,
  saveTempFormData
} from "@/views/formgen/utils/db";
import { checkWriteCountCap, saveWriteCount } from "@/views/form/write/hooks/DeviceWriteCount";
import { getFaceIdentifyInfo, getFaceIdentifyUrl } from "@/api/project/form";
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import GoodsPay from "./component/GoodsPay.vue";
import SubmitResult from "@/views/form/write/component/SubmitResult.vue";
import FormQrcode from "./component/FormQrcode.vue";
import FormEnterCheck from "./component/FormEnterCheck.vue";

import { useUserForm } from "@/stores/userForm";
import { storeToRefs } from "pinia";
import { SHOW_HEADER_USER_INFO_KEY } from "@/views/formgen/components/GenerateForm/types/constants";
import FormCover from "@/views/form/write/component/FormCover.vue";
import { FormThemeType } from "@/views/formgen/components/GenerateForm/types/form";

const props = defineProps({
  // 1：公开填写 2：指定成员填写
  writeType: {
    type: Number,
    default: 1
  }
});

const formKey = ref<string>("");
const formConfig = ref<any>({
  formKey: "",
  preview: false,
  showBtns: true
});
// 0: 无法填写 1: 可以填写 2: 已填写 3. 密码填写
const writeStatus = ref<number>(1);
const writeNotStartPrompt = ref<string>("");
const userFormSetting = ref<any>({});

const submitResult = ref<any>({
  // 数据Id
  dataId: "",
  // 随机编号
  randomNumberText: "",
  // 考试成绩
  examScoreText: ""
});

const router = useRouter();

onBeforeMount(async () => {
  formKey.value = (router.currentRoute.value.query["key"] || router.currentRoute.value.params["key"]) as string;
  // 人脸识别回调
  let callbackRes: any = await handleCallBack();
  if (callbackRes.data) {
    return;
  }
  // 检查是否能进入填写
  queryProjectSettingStatus();
  let settingRes = await queryProjectSetting();
  // 查询相关设置 检查是否能打开等
  handleSettingWxConfig(settingRes.data);
  viewFormResultRequest(formKey.value).then(() => {});
});

const useFormWx = useFormWxHook();
const { wxUserInfo, handleSettingWxConfig, checkWxWriteSetting } = useFormWx;

const queryProjectSettingStatus = () => {
  // 是否能进入填写
  getWriteSettingStatusRequest({
    formKey: formKey.value,
    type: props.writeType,
    wxOpenId: wxUserInfo.value?.openid || ""
  }).then(res => {
    if (res.msg) {
      writeNotStartPrompt.value = res.msg;
      writeStatus.value = 0;
    }
  });
};

const queryProjectSetting = async () => {
  // 填写设置
  let res = await getPublicSettingsRequest(formKey.value);
  formConfig.value.formKey = formKey.value;
  if (res.data) {
    userFormSetting.value = res.data;
    formConfig.value.setting = res.data;
    checkShowFormSubmitContent(res.data);
    // 设备填写次数校验
    checkDeviceWriteLimit();
    // 检查微信的设置比如仅微信打开 记录授权等
    checkWxWriteSetting(res.data);
    // 开启了密码填写
    if (res.data && (res.data.passwordWriteStatus || res.data.enableWhiteList)) {
      writeStatus.value = 3;
    }
  }
  return res;
};

/**
 * 已填写查看
 */
const checkShowFormSubmitContent = (setting: any) => {
  // 开启了查看并且有缓存提交的
  const dataId = getLastFormDataId(formKey.value);
  if (setting.showSubmitContentBtn && dataId) {
    writeStatus.value = 2;
    submitResult.value.dataId = dataId;
  }
};

/**
 * 检查设备填写次数
 */
const checkDeviceWriteLimit = () => {
  if (userFormSetting.value.deviceWriteCountLimitStatus) {
    const flag = checkWriteCountCap(formKey.value, userFormSetting.value.deviceWriteCountLimit);
    if (flag) {
      writeNotStartPrompt.value = userFormSetting.value.deviceWriteCountLimitText;
      writeStatus.value = 0;
    }
    return flag;
  }
};

const goodsPayRef = ref<any>(null);

// Handle form load completed
const handleFormLoadCompleted = () => {
  // Initialize payment and get OpenId
  goodsPayRef.value.wxJsApiPay();
};

const themeConfig = ref<Ref<FormThemeType> | null>(null);

const showCover = ref(false);

const handleShowFormCover = (theme: FormThemeType) => {
  themeConfig.value = theme;
  showCover.value = true;
};

// Handle payment success
const handlePaymentSuccess = (resData: any) => {
  handleSubmitSuccess(resData || {});
};

const bizProjectFormRef = ref<any>(null);

const userFormStore = useUserForm();

const { extractInfo } = storeToRefs(userFormStore);

const submitFormDataReq = ref<SubmitFormData | null>();

// Handle form submission
const submitForm = async (submitFormData: SubmitFormData) => {
  submitFormData.wxUserInfo = wxUserInfo.value;
  submitFormData.wxOpenId = wxUserInfo.value ? wxUserInfo.value.openid : "";
  submitFormData.formKey = formKey.value;
  submitFormData.otherParam = extractInfo.value;
  submitFormData.extValue = useFormExpand().getExtValue();
  const beforeCheck = await handleSubmitBefore(submitFormData);
  if (!beforeCheck) {
    return;
  }
  let res = null;
  if (props.writeType === 1) {
    res = await publicCreateFormResultRequest(submitFormData);
  } else {
    res = await createFormResultRequest(submitFormData);
  }
  submitFormDataReq.value = submitFormData;
  handleSubmitSuccess(res.data, submitFormData.originalData);
};

// Handle submit success
const handleSubmitSuccess = (resData: any, submitData: any = {}) => {
  submitResult.value = resData;
  // Remove temporary cached data
  removeFormData(formKey.value);
  // Save write count if device write count limit is enabled
  saveWriteCount(formKey.value);
  // 保存最后一次的dataId
  saveLastFormDataId(resData.dataId, formKey.value);
  writeStatus.value = 2;
  console.log(submitData);
};

// Handle submit before (e.g., payment, face verification)
const handleSubmitBefore = async (submitFormData: any) => {
  const logicShowData = bizProjectFormRef.value.getLogicShowData({ ...submitFormData.originalData });

  if (goodsPayRef.value.openPay({ ...submitFormData, originalData: logicShowData }, formKey.value)) {
    return false;
  }

  let isFaceCheck = false;
  Object.keys(submitFormData.originalData).forEach(key => {
    if (key.includes("face_identify")) {
      isFaceCheck = true;
    }
  });

  if (isFaceCheck) {
    saveTempFormData(submitFormData, formKey.value);
    const res = await getFaceIdentifyUrl({ url: window.location.href });
    window.location.href = res.data;
    return false;
  }

  return true;
};

// Handle callback for operations that need to be completed on another page before submission
const handleCallBack = async () => {
  const backType = (router.currentRoute.value.query.backType || 0) as number;

  if (backType == 1) {
    const faceRes = await getFaceIdentifyInfo({ token: router.currentRoute.value.query.faceId });
    const tempData = getTempFormData(formKey.value);

    if (!tempData) {
      return false;
    }

    Object.keys(tempData.originalData).forEach(key => {
      if (key.includes("face_identify")) {
        tempData.originalData[key] = faceRes.data;
      }
    });

    const submitRes = await publicCreateFormResultRequest(tempData);
    removeTempFormData(formKey.value);
    handleSubmitSuccess(submitRes.data, tempData.originalData);
    return true;
  }

  return false;
};

provide(SHOW_HEADER_USER_INFO_KEY, props.writeType != 2);
</script>

<style lang="scss" scoped>
.write-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

.title-icon-view {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.icon-view {
  width: 59px;
  height: 59px;
  border-radius: 100px;
  background-color: #0076ff;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.success-icon {
  text-align: center;
  color: white;
  font-size: 30px;
}

.pwdinput-card {
  width: 350px;
  margin: 200px auto;
  min-height: 200px;
}

.fade-enter-active {
  transition: opacity 0.9s ease-in-out;
}

.fade-leave-active {
  transition: opacity 0.9s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
