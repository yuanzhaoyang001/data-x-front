<template>
  <div class="app-container">
    <el-alert
      :title="$t('system.noticeTemplate.tip')"
      type="warning"
    />
    <el-form
      v-show="showSearch"
      ref="queryFormRef"
      class="mt10"
      :model="queryParams"
      :inline="true"
      label-width="118px"
    >
      <el-form-item
        :label="$t('system.noticeTemplate.templateTitle')"
        prop="templateName"
      >
        <el-input
          v-model="queryParams.templateName"
          :placeholder="$t('system.noticeTemplate.enterTemplateTitle')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="Code"
        prop="templateCode"
      >
        <el-input
          v-model="queryParams.templateCode"
          :placeholder="$t('system.noticeTemplate.enterTemplateCode')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.noticeTemplate.templateType')"
        prop="templateType"
      >
        <el-select
          v-model="queryParams.templateType"
          :placeholder="$t('system.noticeTemplate.chooseTemplateType')"
          clearable
        >
          <el-option
            :label="$t('system.noticeTemplate.sms')"
            value="SMS"
          />
          <el-option
            :label="$t('system.noticeTemplate.email')"
            value="EMAIL"
          />
          <el-option
            :label="$t('system.noticeTemplate.wechat')"
            value="WX_MP"
          />
          <el-option
            :label="$t('system.noticeTemplate.inbox')"
            value="INTERNAL"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="ele-Search"
          @click="handleQuery"
        >
          {{ $t("formI18n.all.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("formI18n.all.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:save']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleAdd"
        >
          {{ $t("formI18n.all.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:update']"
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click="handleUpdate"
        >
          {{ $t("formI18n.all.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("formI18n.all.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:save']"
          icon="ele-Refresh"
          plain
          type="primary"
          @click="handleSyncWxMpTemplate"
        >
          {{ $t("system.noticeTemplate.syncWeChatTemplate") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="msgTemplateList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="ID"
        align="center"
        prop="id"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateTitle')"
        align="center"
        prop="templateName"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateCode')"
        align="center"
        prop="templateCode"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateType')"
        width="100"
        align="center"
        prop="templateTypeDesc"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateContent')"
        width="100"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleDesc(scope.row.templateContent)"
          >
            {{ $t("system.noticeTemplate.details") }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.noticeTemplate.thirdPartyTemplateId')"
        width="400"
        align="center"
        prop="thirdTemplateId"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.action')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="success"
            icon="ele-Position"
            @click="handleOpenSend(scope.row)"
          ></el-button>

          <el-button
            link
            type="primary"
            icon="ele-Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:msgtemplate:update']"
          ></el-button>
          <el-button
            link
            type="danger"
            icon="ele-Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:msgtemplate:delete']"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改message对话框 -->
    <el-dialog
      v-if="open"
      :title="title"
      v-model="open"
      width="800px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          :label="$t('system.noticeTemplate.templateTitle')"
          prop="templateName"
        >
          <el-input
            v-model="form.templateName"
            :placeholder="$t('system.noticeTemplate.enterTemplateTitle')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateCode')"
          prop="templateCode"
        >
          <el-input
            v-model="form.templateCode"
            :placeholder="$t('system.noticeTemplate.enterTemplateCode')"
          >
            <template #append>
              <el-button @click="handleRandCode">{{ $t("system.noticeTemplate.generateRandom") }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateType')"
          prop="templateType"
        >
          <el-select
            v-model="form.templateType"
            :placeholder="$t('system.noticeTemplate.chooseTemplateType')"
            clearable
          >
            <el-option
              :label="$t('system.noticeTemplate.sms')"
              value="1"
            />
            <el-option
              :label="$t('system.noticeTemplate.email')"
              value="2"
            />
            <el-option
              :label="$t('system.noticeTemplate.wechat')"
              value="3"
            />
            <el-option
              :label="$t('system.noticeTemplate.inbox')"
              value="4"
            />
            <el-option
              :label="$t('system.noticeTemplate.cpWechat')"
              value="5"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="['1', '3'].includes(form.templateType)"
          :label="$t('system.noticeTemplate.thirdPartyTemplateId')"
          prop="thirdTemplateId"
        >
          <el-input
            v-model="form.thirdTemplateId"
            :placeholder="$t('system.noticeTemplate.enterThirdPartyTemplateId')"
          />
          <p class="tips-text">{{ $t("system.noticeTemplate.wechatTemplateIdNote") }}</p>
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateContent')"
          prop="templateContent"
        >
          <div>
            <div v-if="form.templateType != 3">
              <el-button
                size="small"
                type="primary"
                @click="handleInsertVariable"
              >
                {{ $t("system.noticeTemplate.insertVariables") }}
              </el-button>
              <form-tinymce
                style="width: 600px; margin-top: 5px"
                ref="tinymceRef"
                v-model:value="form.templateContent"
                :toolbar="getToolbar"
                :key="form.templateType"
              />
            </div>
            <div
              v-else
              class="mt10"
            >
              {{ form.templateContent }}
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="cancel">
            {{ $t("formI18n.all.cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--发送测试-->
    <el-dialog
      v-if="sendOpen"
      :title="$t('system.noticeTemplate.sendMessage')"
      v-model="sendOpen"
      width="800px"
      append-to-body
    >
      <el-form
        ref="sendFormRef"
        :model="sendForm"
        label-width="130px"
      >
        <el-form-item
          :label="$t('system.noticeTemplate.receiver')"
          prop="receiver"
          :rules="[{ required: true, message: $t('system.noticeTemplate.enterReceiver'), trigger: 'blur' }]"
        >
          <el-input
            v-model="sendForm.receiver"
            :placeholder="$t('system.noticeTemplate.enterReceiver')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateCode')"
          prop="templateCode"
          :rules="[{ required: true, message: $t('system.noticeTemplate.enterTemplateCode'), trigger: 'blur' }]"
        >
          <el-input
            v-model="sendForm.templateCode"
            :placeholder="$t('system.noticeTemplate.enterTemplateCode')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.messageType')"
          prop="msgType"
          :rules="[{ required: true, message: $t('system.noticeTemplate.selectTemplateType'), trigger: 'blur' }]"
        >
          <el-select
            v-model="queryParams.templateType"
            :placeholder="$t('system.noticeTemplate.chooseTemplateType')"
            clearable
          >
            <el-option
              :label="$t('system.noticeTemplate.sms')"
              value="SMS"
            />
            <el-option
              :label="$t('system.noticeTemplate.email')"
              value="EMAIL"
            />
            <el-option
              :label="$t('system.noticeTemplate.wechat')"
              value="WX_MP"
            />
            <el-option
              :label="$t('system.noticeTemplate.inbox')"
              value="INTERNAL"
            />
            <el-option
              :label="$t('system.noticeTemplate.cpWechat')"
              value="WX_CP"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.params')"
          prop="testData"
        >
          <el-input
            rows="8"
            v-model="sendForm.testData"
            type="textarea"
            :placeholder="$t('system.noticeTemplate.templateParams')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="handleSendMsg"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="sendOpen = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      append-to-body
      :title="$t('system.noticeTemplate.details')"
      v-model="dialogVisible"
      width="40%"
    >
      <span>{{ dialogContent }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script name="MsgTemplate" setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  addMsgTemplate,
  delMsgTemplate,
  getMsgTemplate,
  pageMsgTemplate,
  sendTemplateMsg,
  syncWxTemplateMsg,
  updateMsgTemplate
} from "@/api/system/msgtemplate";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { customAlphabet } from "nanoid";
import { i18n } from "@/i18n";
import { resetFormRef } from "@/utils/tduck";
import { MessageUtil } from "@/utils/messageUtil";
import { ElMessageBox } from "element-plus";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

// Define state
const dialogContent = ref("");
const dialogVisible = ref(false);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const showSearch = ref(true);
const total = ref(0);
const msgTemplateList = ref([]);
const title = ref("");
const open = ref(false);
const sendOpen = ref(false);
const queryParams = reactive({
  current: 1,
  size: 10,
  templateName: null,
  templateCode: null,
  templateType: null,
  templateContent: null
});
const form = ref({});
const sendForm = ref({
  templateCode: null,
  receiver: null,
  msgType: null
});
const rules = {
  templateName: [{ required: true, message: i18n.global.t("system.noticeTemplate.templateName"), trigger: "blur" }],
  templateCode: [
    {
      required: true,
      message: i18n.global.t("system.noticeTemplate.templateCodeRequired"),
      trigger: "blur"
    }
  ],
  templateType: [
    {
      required: true,
      message: i18n.global.t("system.noticeTemplate.templateTypeRequired"),
      trigger: "change"
    }
  ],
  templateContent: [
    {
      required: true,
      message: i18n.global.t("system.noticeTemplate.templateContentRequired"),
      trigger: "blur"
    }
  ],
  thirdTemplateId: [{ required: true, message: i18n.global.t("system.noticeTemplate.inputRequired"), trigger: "blur" }]
};

// Define computed properties
const getToolbar = computed(() => {
  // 类型不一致
  if (form.value.templateType == 2) {
    return " styleselect fontsizeselect bold italic underline strikethrough undo redo  removeformat alignleft aligncenter alignright  subscript superscript  hr  charmap    forecolor backcolor   ";
  }
  return "  ";
});

const getList = () => {
  loading.value = true;
  pageMsgTemplate(queryParams).then(response => {
    msgTemplateList.value = response.data.records;
    total.value = response.data.total;
    loading.value = false;
  });
};

onMounted(() => {
  getList();
});

const tinymceRef = ref(null);

const formRef = ref(null);

const handleInsertVariable = () => {
  tinymceRef.value.handleInsertContent("${" + nanoid() + "}");
};

const cancel = () => {
  open.value = false;
  reset();
};

const reset = () => {
  form.value = {
    id: null,
    templateName: null,
    templateCode: null,
    templateType: null,
    templateContent: null,
    thirdTemplateId: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null
  };
  resetFormRef(formRef.value);
};

const handleQuery = () => {
  queryParams.current = 1;
  getList();
};

const queryFormRef = ref(null);

const resetQuery = () => {
  resetFormRef(queryFormRef);
  handleQuery();
};

const handleSelectionChange = selection => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};

const handleAdd = () => {
  reset();
  open.value = true;
  title.value = i18n.global.t("system.noticeTemplate.addTemplate");
};

const handleUpdate = row => {
  reset();
  const id = row.id || ids.value;
  getMsgTemplate(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = i18n.global.t("system.noticeTemplate.modifyTemplate");
  });
};

const handleOpenSend = row => {
  sendOpen.value = true;
  sendForm.value.templateCode = row.templateCode;
  sendForm.value.msgType = row.templateType;
};

const sendFormRef = ref(null);

const handleSendMsg = () => {
  sendFormRef.value.validate(valid => {
    if (valid) {
      sendTemplateMsg(sendForm.value).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        sendOpen.value = false;
      });
    }
  });
};

const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMsgTemplate(form.value).then(() => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          open.value = false;
          getList();
        });
      } else {
        addMsgTemplate(form.value).then(() => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          open.value = false;
          getList();
        });
      }
    }
  });
};

const handleDelete = row => {
  const idsToDelete = row.id || ids.value;
  ElMessageBox.confirm(i18n.global.t("system.noticeTemplate.isDelete"), i18n.global.t("formI18n.all.waring"))
    .then(() => delMsgTemplate(idsToDelete))
    .then(() => {
      getList();
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
    })
    .catch(() => {});
};

const handleDesc = content => {
  dialogVisible.value = true;
  dialogContent.value = content;
};

const handleRandCode = () => {
  form.value.templateCode = nanoid();
};

const handleSyncWxMpTemplate = () => {
  ElMessageBox.confirm(i18n.global.t("system.noticeTemplate.syncWxMpTemplate"), i18n.global.t("formI18n.all.waring"))
    .then(() => syncWxTemplateMsg({}))
    .then(() => {
      getList();
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
    })
    .catch(() => {});
};
</script>
<style>
.tips-text {
  color: #909399;
  font-size: 12px;
}
</style>
