<template>
  <div class="app-container">
    <div
      v-show="reSearch"
      class="form-adapt-container"
    >
      <el-card
        shadow="never"
        :header="$t('form.queryPage.queryConditions.title')"
        style="width: 600px"
      >
        <template #header>
          <div class="clearfix">
            <div class="medium-font-size">{{ queryConfig.name }}</div>
            <div class="text-placeholder-color mt10">
              {{ queryConfig.description }}
            </div>
          </div>
        </template>
        <el-form>
          <el-row :gutter="10">
            <el-col
              v-for="item in queryFields"
              :key="item.value"
              :span="24"
            >
              <p class="title">{{ item.label }}</p>
              <el-input
                v-model="queryParams.queryParams[item.value]"
                :placeholder="$t('form.queryPage.queryConditions.placeholder')"
                clearable
              />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-button
                type="primary"
                style="margin-top: 20px; width: 100%"
                icon="ele-Search"
                @click="handleQueryData"
              >
                {{ $t("form.queryPage.queryConditions.searchButton") }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div v-show="noOpenQuery">
      <el-button
        type="primary"
        icon="ele-Search"
        v-show="noOpenQuery"
        @click="serachAgain"
      >
        {{ $t("form.queryPage.noQueryOpen.retryButton") }}
      </el-button>
      <base-table
        v-if="queryConfig.config && queryConfig.config.styleType === 'TABLE'"
        ref="publicQueryTableRef"
        class="mt10"
        :grid-options="gridOptions"
      >
        <template #operate="{ row }">
          <el-button
            v-if="openReply"
            icon="ele-ChatLineSquare"
            :title="$t('form.queryPage.resultTable.replyButton')"
            circle
            @click="openReplyDrawer(row)"
          />
          <el-button
            v-if="queryConfig.config && queryConfig.config.allowModify"
            icon="ele-Edit"
            type="primary"
            :title="$t('form.queryPage.resultTable.modifyButton')"
            circle
            @click="handleOpenEdit(row)"
          />
        </template>
      </base-table>
      <el-tabs
        v-if="queryConfig.config && queryConfig.config.styleType === 'CARD' && queryDataList.length > 0"
        class="mt10"
        type="border-card"
      >
        <el-tab-pane
          v-for="(form, index) in queryDataList"
          :key="index"
          :label="getTabLabel(index)"
        >
          <generate-form
            v-if="formConf.fields.length"
            :form-conf="formConf"
            :page-form-model="form"
            style="margin-bottom: 40px"
          />
          <el-button
            v-if="openReply"
            type="primary"
            icon="ele-ChatLineSquare"
            @click="openReplyDrawer(form)"
          >
            {{ $t("form.queryPage.resultCard.replyButton") }}
          </el-button>
          <el-button
            v-if="queryConfig.config && queryConfig.config.allowModify"
            icon="ele-Edit"
            type="primary"
            status="primary"
            @click="handleOpenEdit(form)"
          >
            {{ $t("form.queryPage.resultCard.modifyButton") }}
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-result
      v-show="noData"
      icon="warning"
      :sub-title="$t('form.queryPage.noDataResult.subtitle')"
      :title="$t('form.queryPage.noDataResult.title')"
    >
      <template #extra />
    </el-result>
    <el-drawer
      :title="$t('form.queryPage.editDataDrawer.title')"
      size="100%"
      v-model="dialogFormVisible"
      direction="btt"
      class="demo-drawer"
      ref="drawer"
    >
      <el-container>
        <el-main>
          <div class="demo-drawer__content">
            <generate-form
              v-if="formConf.fields.length"
              ref="generateFormRef"
              :form-conf="formConf"
              :page-form-model="editFormData"
              style="margin-bottom: 20px"
            />
          </div>
        </el-main>
        <el-footer>
          <div class="demo-drawer__footer">
            <el-button @click="cancelEdit">{{ $t("form.queryPage.editDataDrawer.cancelButton") }}</el-button>
            <el-button
              type="primary"
              @click="handleUpdateFormData"
            >
              {{ $t("form.queryPage.editDataDrawer.confirmButton") }}
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </el-drawer>

    <reply-drawer
      v-if="selectDataId"
      ref="replyDrawerRef"
      :form-key="formKey"
      :data-id="selectDataId"
    />
  </div>
</template>

<script name="PublicQuery" setup>
import { nextTick, onBeforeMount, provide, reactive, ref } from "vue";
import BaseTable from "./table/BaseTable.vue";
import ReplyDrawer from "./ReplyDrawer.vue";
import { formatTableColumn } from "./table/formatTableColumn";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { getPublicQueryContentRequest, listPublicQueryDataRequest } from "@/api/project/publish";
import { getPublicSettingsRequest } from "@/api/project/setting";
import { jsonSimpleClone, removeHtmlTag } from "@/views/formgen/utils";
import { updateFormDataRequest } from "@/api/project/data";
import { i18n } from "@/i18n";
import { MessageUtil } from "@/utils/messageUtil";
import { useRoute } from "vue-router";
import { useFormWxHook } from "@/views/form/write/hooks/useFormWxHook";

const editFormData = ref({});
const dialogFormVisible = ref(false);
const noOpenQuery = ref(false);
const reSearch = ref(true);
const noData = ref(false);
const drawer = ref(false);
const formKey = ref("");
const queryId = ref(null);

const gridOptions = reactive({
  border: true,
  stripe: true,
  resizable: true,
  showHeaderOverflow: true,
  showOverflow: true,
  highlightHoverRow: true,
  keepSource: true,
  id: "publicQueryGrid",
  rowId: "id",
  pagerConfig: {
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000]
  },
  proxyConfig: {
    autoLoad: false,
    seq: true,
    props: {
      result: "data.rows",
      total: "data.total"
    },
    ajax: {
      query: ({ page, sorts, filters, form }) => {
        queryParams.size = page.pageSize;
        queryParams.current = page.currentPage - 1;
        queryParams.formKey = formKey.value;
        queryParams.queryId = queryId.value;
        queryParams.queryParams = removeEmptyParams();
        return listPublicQueryDataRequest(queryParams);
      }
    }
  },
  columns: []
});

const route = useRoute();

onBeforeMount(async () => {
  const res = await wxHook.getWxAuthorizationUserInfoByCode();
  console.log(res);
  formKey.value = route.query.key || route.params.key;
  queryId.value = route.query.qid || route.params.qid;
  await queryUserProjectSetting();
  handleQueryFields();
});

const openReply = ref(false);
const queryConfig = ref({
  config: {
    allowModify: false
  }
});

const queryFields = ref([]);
const showFields = ref([]);
const selectDataId = ref(null);

const queryParams = reactive({
  formKey: "",
  queryId: null,
  queryParams: {}
});

const queryDataList = ref([]);

const formConf = reactive({
  fields: [],
  formKey: "",
  formRef: "elForm",
  disabled: true,
  span: 24,
  size: "small",
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

const getTabLabel = index => i18n.global.t("form.queryPage.resultCard.replyButton") + (index + 1);

const serachAgain = () => {
  reSearch.value = true;
  noOpenQuery.value = false;
  noData.value = false;
};

const queryUserProjectSetting = () => {
  getPublicSettingsRequest(formKey.value).then(res => {
    if (res.data) {
      openReply.value = res.data.openReply;
    }
  });
};

const removeEmptyParams = () => {
  let params = queryParams.queryParams;
  for (let key in params) {
    if (params[key] === "") {
      delete params[key];
    }
  }
  return params;
};

const wxHook = useFormWxHook();

const handleQueryFields = () => {
  getPublicQueryContentRequest(formKey.value, queryId.value).then(res => {
    if (res.data.status === 0) {
      noOpenQuery.value = true;
    }
    showFields.value = res.data.showFields;
    // 是否包含微信的openId
    checkWxOpenId(res.data.queryFields);
    queryFields.value = res.data.queryFields;
    queryConfig.value = res.data.queryConfig;
    handleTableColumns(res.data.showFields);
    formConf.fields = res.data.showFields
      .filter(item => item.scheme)
      .map(item => {
        if (item.scheme) {
          item.scheme.viewMode = true;
          item.scheme.config.label = removeHtmlTag(item.scheme.config.label);
        }
        return item.scheme;
      });
    queryConfig.value = res.data.queryConfig;
  });
};

const checkWxOpenId = queryFields => {
  const openIdItem = queryFields.find(item => item.value === "wxOpenId");
  if (openIdItem) {
    // 先判断获取了wx信息了没
    if (wxHook.getCookieAuthorizationUserInfo()) {
      queryParams.queryParams["wxOpenId"] = wxHook.getCookieAuthorizationUserInfo().openid;
      // 并且只有一个字段 直接查询
      if (queryFields.length === 1) {
        handleQueryData();
      }
    } else {
      wxHook.checkWxWriteSetting({ onlyWxWrite: true });
    }
  }
};

const publicQueryTableRef = ref(null);

const handleQueryData = () => {
  let flag = false;
  queryFields.value.forEach(item => {
    if (!queryParams.queryParams[item.value]) {
      flag = true;
    }
  });
  const inputAllCondition = queryConfig.value.config.inputAllCondition;
  if (flag && inputAllCondition) {
    MessageUtil.error(i18n.global.t("formI18n.all.pleaseEnter"));
    return;
  }
  reSearch.value = false;
  if (queryConfig.value.config.styleType === "TABLE") {
    noOpenQuery.value = true;
    publicQueryTableRef.value.getXGrid().commitProxy("reload");
  } else {
    noOpenQuery.value = true;
    handleQueryDataList();
  }
};

const handleQueryDataList = () => {
  queryParams.size = 100;
  queryParams.current = 0;
  queryParams.formKey = formKey.value;
  queryParams.queryId = queryId.value;
  queryParams.queryParams = removeEmptyParams();
  listPublicQueryDataRequest(queryParams).then(res => {
    if (res.data == null || res.data.total == 0) {
      noData.value = true;
    }
    queryDataList.value = res.data.rows;
  });
};

const handleOpenEdit = item => {
  editFormData.value = item;
  dialogFormVisible.value = true;
  formConf.disabled = false;
};

const cancelEdit = () => {
  dialogFormVisible.value = false;
  formConf.disabled = true;
};

const handleTableColumns = fields => {
  gridOptions.columns = fields.map(item => formatTableColumn(item));
  if (openReply.value || queryConfig.value.config.allowModify) {
    gridOptions.columns.push({
      title: i18n.global.t("formI18n.all.operate"),
      width: 120,
      fixed: "right",
      slots: { default: "operate" }
    });
  }
};

provide("formDisabled", formConf.disabled);

const replyDrawerRef = ref(null);

const openReplyDrawer = row => {
  selectDataId.value = row.id;
  nextTick(() => {
    replyDrawerRef.value.open();
  });
};

const generateFormRef = ref(null);

const handleUpdateFormData = () => {
  generateFormRef.value.validateForm().then(valid => {
    if (valid) {
      let formModel = jsonSimpleClone(generateFormRef.value.formModel);
      let tempFormModel = {};
      for (let key in formModel) {
        let bool = /.*\d+.*/g.test(key);
        if (bool) {
          tempFormModel[key] = formModel[key];
        }
      }
      updateFormDataRequest({
        id: formModel.id,
        completeTime: null,
        formKey: formKey.value,
        submitOs: "",
        submitBrowser: "",
        submitUa: null,
        wxUserInfo: null,
        wxOpenId: "",
        originalData: tempFormModel
      }).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        dialogFormVisible.value = false;
        formConf.disabled = true;
        window.location.reload();
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
}

.title {
  margin: 10px;
}

.demo-drawer__content {
  margin: 20px;
}

.demo-drawer__footer {
  margin-bottom: 20px;
  margin-right: 20px;
  float: right;
}

.form-adapt-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.project-form) {
  background-color: #ffffff !important;
  width: 100% !important;
}

:deep(.vxe-export--panel tr:last-child) {
  display: none !important;
}

@media screen and (max-width: 500px) {
  :deep(.vxe-pager) {
    padding-top: 30px !important;
  }
  :deep(.vxe-modal--box) {
    width: 100% !important;
  }
  :deep(.el-dialog__wrapper .el-dialog) {
    width: 100% !important;
  }
  :deep(.vxe-toolbar) {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    height: 100px;

    &:last-child .el-button {
      margin-left: 0px;
    }

    .vxe-toolbar {
      margin-top: 10px;
    }
  }
}
</style>
