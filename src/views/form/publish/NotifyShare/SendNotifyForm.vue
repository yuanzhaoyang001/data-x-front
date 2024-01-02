<template>
  <div>
    <el-form>
      <el-form-item :label="$t('form.notifyShare.notifyTemplate')">
        <el-select v-model="sendNotifyForm.templateId">
          <el-option
            v-for="item in msgTemplateList"
            :key="item.id"
            :label="item.templateName"
            :value="item.id"
          >
            <span class="float-left">
              {{ item.templateName }}
            </span>
            <span class="float-right ml10">
              <el-tag
                type="success"
                size="default"
              >
                {{ item.templateTypeDesc }}
              </el-tag>
            </span>
          </el-option>
        </el-select>
        <el-button
          class="ml10"
          @click="handleConfigMsgTemplate"
        >
          {{ $t("form.notifyShare.config") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-input
          type="textarea"
          :autosize="{ minRows: 16, maxRows: 16 }"
          :placeholder="$t('form.notifyShare.notifyUsersPlaceholder')"
          v-model="notifyUsers"
        />
      </el-col>
      <el-col :span="12">
        <div
          v-if="templateContent"
          class="msg-content"
        >
          <div v-html="templateContent"></div>
        </div>
      </el-col>
    </el-row>
    <div class="mt10">
      <el-button
        type="primary"
        @click="handleSendMsg"
        v-re-click
      >
        {{ $t("form.notifyShare.sendNotify") }}
      </el-button>
    </div>
    <config-params
      v-if="sendNotifyForm.templateId"
      ref="msgTemplateConfigRef"
      :fields="fields"
      :select-template-id="sendNotifyForm.templateId"
      :template-list="msgTemplateList"
      @submit="handleSaveConfigParams"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { sendFormNotify, SendMessageParam } from "@/api/project/form";
import { useFormInfo } from "@/stores/formInfo";
import { storeToRefs } from "pinia";
import { getBaseUrlPath } from "@/utils/auth";
import { listMsgTemplate, MsgTemplate } from "@/api/system/msgtemplate";
import { MessageUtil } from "@/utils/messageUtil";
import { verifyEmail, verifyPhone } from "@/utils/toolsValidate";
import ConfigParams from "../DataHelper/ConfigParams.vue";
import { i18n } from "@/i18n";

const notifyUsers = ref("");
const route = useRoute();

const sendNotifyForm = ref<SendMessageParam>({
  templateParamMapping: {},
  formKey: route.query.key as string,
  receiverList: [],
  templateId: null
});

const formInfoStore = useFormInfo();

const { currentFormName } = storeToRefs(formInfoStore);

const extFormParam = ref<any>({
  link: `${getBaseUrlPath()}/s/${route.query.key}?shareKey=\${tMsgId}`,
  formName: currentFormName.value,
  userName: "${tUserName} "
});

const fields = [
  {
    value: "link",
    label: i18n.global.t("form.notifyShare.linkText")
  },
  {
    value: "userName",
    label: i18n.global.t("form.notifyShare.nameText")
  },
  {
    value: "formName",
    label: i18n.global.t("form.notifyShare.formNameText")
  }
];

const msgTemplateConfigRef = ref<any>(null);

const msgTemplateList = ref<MsgTemplate[]>([]);

const templateContent = computed(() => {
  let content = msgTemplateList.value.find(item => item.id == sendNotifyForm.value.templateId)?.templateContent || "";
  if (sendNotifyForm.value.templateParamMapping) {
    Object.keys(sendNotifyForm.value.templateParamMapping).forEach((key: string) => {
      content = content.replace(
        new RegExp(`\\$\\{${key}\\}`, "g"),
        extFormParam.value[sendNotifyForm.value.templateParamMapping[key]]
      );
    });
  }
  return content;
});

const msgTemplate = computed(() => {
  return msgTemplateList.value.find(item => item.id == sendNotifyForm.value.templateId);
});

const handleConfigMsgTemplate = () => {
  msgTemplateConfigRef.value.show(sendNotifyForm.value.templateParamMapping);
};

const handleSaveConfigParams = (val: any) => {
  sendNotifyForm.value.templateParamMapping = val;
};

const handleSendMsg = async () => {
  if (!notifyUsers.value) {
    MessageUtil.error(i18n.global.t("form.notifyShare.notifyUsersNotEmpty"));
    return;
  }
  let errorMsg = "";
  const templateType = msgTemplateList.value.find(item => item.id == sendNotifyForm.value.templateId)?.templateType;
  // 根据每行数据，拆分成数组
  const notifyUserList = notifyUsers.value.split("\n");
  // 每行根据中英文逗号分隔开
  sendNotifyForm.value.receiverList = notifyUserList.map(item => {
    const arr = item.split(/[,，]/);
    const id = arr[0];
    if (templateType && templateType == "1") {
      if (id && !verifyPhone(id.trim())) {
        errorMsg += "  " + id;
      }
    } else if (templateType == "2") {
      if (id && !verifyEmail(id.trim())) {
        errorMsg += "  " + id;
      }
    }
    return {
      id: id,
      userName: arr[1] || ""
    };
  });
  if (errorMsg) {
    MessageUtil.error(i18n.global.t("form.notifyShare.notifyUsersFormatError").replace("[errorMsg]", errorMsg));
    return;
  }
  sendNotifyForm.value.extParam = { ...extFormParam.value };
  await sendFormNotify(sendNotifyForm.value);
  emit("sendSuccess");
};

const emit = defineEmits(["sendSuccess"]);

onMounted(() => {
  listMsgTemplate({}).then(res => {
    msgTemplateList.value = res.data;
    extFormParam.value.formName = currentFormName.value;
  });
});
</script>

<style scoped lang="scss">
.msg-content {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  padding: 10px;
  background-color: var(--el-bg-color-page);
  border: var(--el-border);
  border-radius: 4px;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}
</style>
