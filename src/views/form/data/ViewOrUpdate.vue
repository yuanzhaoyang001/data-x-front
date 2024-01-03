<template>
  <el-dialog
    :class="fullscreen ? 't-dialog--fullscreen' : 't-dialog'"
    :fullscreen="fullscreen"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    class="view-dialog"
    width="65%"
    :show-close="false"
    :style="{ top: fullscreen ? '0' : '20px' }"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="t__dialog__header">
        <span
          class="el-dialog__title"
          :id="titleId"
          :class="titleClass"
        >
          {{ dialogTitle }}
        </span>
        <div class="t__dialog__menu">
          <el-button
            class="el-dialog__close"
            text
            type="primary"
            v-print="printForm"
          >
            {{ $t("form.data.printData") }}
          </el-button>

          <print-template-list
            :data-ids="[formModel.id]"
            ref="printTemplateListRef"
          ></print-template-list>

          <print-poster-list
            :data-ids="[formModel.id]"
            ref="printPosterListRef"
          ></print-poster-list>

          <el-icon :size="18">
            <i
              class="iconfont el-dialog__close"
              :class="fullscreen ? 'icon-tuichuquanping' : 'icon-fullscreen'"
              @click="handleFullScreen"
            />
          </el-icon>

          <el-icon
            class="el-icon--left"
            @click="close"
            :size="18"
          >
            <ele-Close />
          </el-icon>
        </div>
      </div>
    </template>

    <el-row
      class="dialog-form"
      :style="{ height: `${dialogHeight}px` }"
    >
      <el-col
        :span="18"
        :xs="24"
        class="left"
        :style="{ height: `${dialogHeight}px` }"
      >
        <el-scrollbar>
          <generate-form
            v-if="formConf.fields.length && formModel && isEditMode"
            ref="generateFormRef"
            :form-conf="formConf"
            :page-form-model="formModel"
            style="margin-bottom: 40px"
          />
          <div v-else>
            <exam-result
              v-if="formType === 4 && dialogVisible"
              id="printForm"
              ref="examFormRef"
              :data-id="formModel['id']"
              style="margin-bottom: 40px"
              :show-dimension-report="!!dimensionConfig"
            />
            <view-data
              v-else
              id="printForm"
              v-model:is-print="isPrint"
              :fields="fields"
              :page-form-model="formModel"
            />
          </div>
        </el-scrollbar>
      </el-col>
      <el-col
        :span="6"
        :xs="24"
        class="right"
      >
        <el-tabs
          v-model="activeName"
          :stretch="true"
        >
          <el-scrollbar style="height: 800px">
            <el-descriptions
              :column="1"
              size="small"
              :title="$t('form.viewOrUpdate.basicInformation')"
            >
              <el-descriptions-item
                v-for="field in fixedFields"
                :key="field.value"
                :label="field.label"
              >
                <span v-if="field.value === 'submitUaOs'">
                  {{ formModel.submitUa ? formModel.submitUa.os.name : "" }}
                  {{ formModel.submitUa ? formModel.submitUa.os.version : "" }}
                </span>
                <span v-if="field.value === 'submitBrowser'">
                  {{ formModel.submitUa ? formModel.submitUa.browser.name : "" }}
                  {{ formModel.submitUa ? formModel.submitUa.browser.version : "" }}
                </span>
                <span v-if="field.value === 'submitUaDevice'">
                  {{ formModel.submitUa ? formModel.submitUa.device : "" }}
                </span>
                <span v-if="field.value === 'wxUserInfo'">
                  {{ formModel.wxUserInfo ? formModel.wxUserInfo.nickname : "" }}
                </span>
                <span v-else>
                  {{ formModel[field.value] }}
                </span>
              </el-descriptions-item>
            </el-descriptions>
            <data-remark
              :data-id="formModel.id"
              :form-key="formKey"
            />
          </el-scrollbar>
        </el-tabs>
      </el-col>
    </el-row>

    <template #footer>
      <span class="t-dialog__footer">
        <el-button
          v-if="isEditMode"
          type="primary"
          size="default"
          @click="handleUpdate"
        >
          {{ $t("form.viewOrUpdate.confirm") }}
        </el-button>
        <el-button
          v-if="!isEditMode && canUpdate"
          icon="ele-Edit"
          type="primary"
          size="default"
          @click="handleEditMode"
        >
          {{ $t("form.viewOrUpdate.modify") }}
        </el-button>
        <el-button
          v-if="openReply"
          type="success"
          size="default"
          icon="ele-ChatLineSquare"
          @click="emit('openReply')"
        >
          {{ $t("form.viewOrUpdate.reply") }}
        </el-button>
        <el-button
          v-if="checkBtnPerms('delete')"
          type="danger"
          plain
          size="default"
          @click="handleDelete"
        >
          {{ $t("form.viewOrUpdate.delete") }}
        </el-button>
        <el-button
          size="default"
          @click="handleCancel"
        >
          {{ $t("form.viewOrUpdate.cancel") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script name="ViewOrUpdate" setup>
import { defineProps, inject, onBeforeMount, ref, watch } from "vue";
import { deleteFormDataRequest, updateFormDataRequest } from "@/api/project/data";
import { getSettingRequest } from "@/api/project/setting";
import { jsonSimpleClone, removeHtmlTag } from "@/views/formgen/utils";
import { i18n } from "@/i18n";
import print from "vue3-print-nb";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import { ElMessageBox } from "element-plus";
import { useFormInfo } from "@/stores/formInfo";
import DataRemark from "@/views/form/data/components/DataRemark.vue";
import PrintTemplateList from "@/views/form/data/table/PrintTemplateList.vue";
import PrintPosterList from "@/views/form/data/table/PrintPosterList.vue";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import ExamResult from "@/views/form/exam//ExamResult.vue";
import ViewData from "./ViewData.vue";
import { storeToRefs } from "pinia";

const props = defineProps(["fields", "fixedFields", "formModel", "formKey", "canUpdate"]);

const vPrint = print;
const activeName = ref("info");
const isEditMode = ref(false);
const formParseKey = ref(new Date().getTime());

const formConf = ref({
  formRef: "generateForm",
  fields: [],
  formKey: "",
  disabled: true,
  span: 24,
  size: "default",
  labelPosition: "top",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  formBtns: false,
  resetBtn: false,
  theme: {
    backgroundImg: "",
    showFormTitle: true,
    showFormDescribe: true,
    showFormNumber: false,
    btnsColor: null
  }
});

const dialogVisible = ref(false);
const dialogTitle = ref(i18n.global.t("form.viewOrUpdate.view"));
const fullscreen = ref(false);
const openReply = ref(false);
const isPrint = ref(false);
const dialogHeight = ref(700);
const remarkEditDisable = ref(false);
const remarkButton = ref("");

const printForm = ref({
  id: "printForm",
  popTitle: "",
  extraHead:
    '<meta http-equiv="Content-Language" content="zh-cn"/>,<style>  #printForm { width: 100%;  }  .not-print {display: none!important } .print{ display: block!important}<style>',
  previewBeforeOpenCallback(vue) {
    //console.log("正在加载预览窗口");
  },
  previewOpenCallback(vue) {
    //console.log("已经加载完预览窗口");
  },
  beforeOpenCallback(vue) {
    //console.log("打开之前");
  },
  openCallback(vue) {
    //console.log("执行了打印");
  },
  closeCallback(vue) {
    //console.log("关闭了打印工具");
  }
});

watch(
  () => props.fields,
  val => {
    formConf.value.fields = val
      .filter(item => {
        return item.scheme;
      })
      .map(item => {
        if (item.scheme) {
          item.scheme.viewMode = true;
          // 去除标签中富文本
          item.scheme.config.label = removeHtmlTag(item.scheme.config.label);
        }
        return item.scheme;
      });
  },
  { deep: true, immediate: true }
);

onBeforeMount(() => {
  queryUserProjectSetting();
});

const checkBtnPermsFunc = inject("checkBtnPerms");

const checkBtnPerms = btn => {
  return checkBtnPermsFunc(btn);
};

const dimensionConfig = inject("dimensionConfig");

const showDialog = () => {
  formConf.value.disabled = true;
  dialogTitle.value = i18n.global.t("form.viewOrUpdate.view");
  formParseKey.value = new Date().getTime();
  isEditMode.value = false;
  dialogVisible.value = true;
  remarkEditDisable.value = true;
  remarkButton.value = i18n.global.t("form.viewOrUpdate.edit");
  activeName.value = "info";
};

const emit = defineEmits(["reload", "openReply"]);

const handleCancel = () => {
  if (isEditMode.value) {
    isEditMode.value = false;
    formConf.value.disabled = true;
    return;
  }
  dialogVisible.value = false;
  emit("reload");
};

const handleEditMode = () => {
  isEditMode.value = true;
  dialogTitle.value = i18n.global.t("form.viewOrUpdate.edit");
  formConf.value.disabled = false;
};

const handleFullScreen = () => {
  fullscreen.value = !fullscreen.value;
};

const queryUserProjectSetting = () => {
  getSettingRequest(props.formKey).then(res => {
    if (res.data) {
      openReply.value = res.data.openReply;
    }
  });
};

const handleDelete = () => {
  ElMessageBox.alert(i18n.global.t("form.viewOrUpdate.irreversibleDeletion"), i18n.global.t("formI18n.all.waring"), {
    confirmButtonText: i18n.global.t("formI18n.all.confirm"),
    callback: action => {
      if (action === "confirm")
        deleteFormDataRequest([props.formModel.id], props.formKey).then(res => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          dialogVisible.value = false;
          emit("reload");
        });
    }
  });
};

const generateFormRef = ref(null);

const updateFromRequest = () => {
  let formModel = jsonSimpleClone(generateFormRef.value.formModel);
  let tempFormModel = {};
  for (let key in formModel) {
    let bool = /.*\d+.*/g.test(key);
    if (bool) {
      tempFormModel[key] = formModel[key];
    }
  }
  updateFormDataRequest({
    id: props.formModel.id,
    completeTime: null,
    formKey: props.formKey,
    submitOs: "",
    submitBrowser: "",
    submitUa: null,
    wxUserInfo: null,
    wxOpenId: "",
    originalData: tempFormModel
  }).then(() => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    dialogVisible.value = false;
    setTimeout(() => {
      emit("reload");
    }, 1000);
  });
};

const handleUpdate = () => {
  generateFormRef.value.validateForm().then(valid => {
    if (valid) {
      updateFromRequest();
    } else {
      MessageBoxUtil.confirm(
        i18n.global.t("form.viewOrUpdate.forceSaveText"),
        () => {
          updateFromRequest();
        },
        i18n.global.t("form.viewOrUpdate.confirm")
      );
    }
  });
};

const { formType } = storeToRefs(useFormInfo());

defineExpose({
  showDialog
});
</script>

<style lang="scss" scoped>
.dialog-form {
  height: 563px;

  .left {
    overflow: auto;
    height: 100%;
    //border-right: var(--el-bg-color-page) solid 1px;
    padding: 10px;
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .right {
    height: 100%;
    padding: 10px;
  }
}

.el-icon--left :hover {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  transform: rotate(180deg);
}

.el-icon--left :not(:hover) {
  transition: transform 0.3s ease; /* 添加过渡效果，使旋转平滑 */
  transform: rotate(0deg); /* 鼠标离开后缓慢转回原始状态 */
}

.operate-btns {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.exam-result-wrap .exam-result-wrap__card) {
  width: 90% !important;
}
:deep(.exam-result-wrap) {
  height: 100%;
  overflow: inherit !important;
}
</style>
<style lang="scss">
:deep(.view-dialog .el-dialog__body) {
  overflow-y: hidden !important;
}
</style>
