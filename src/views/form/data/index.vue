<template>
  <div class="app-container">
    <base-table
      ref="baseTableRef"
      :grid-options="gridOptions"
      @cell-click="handleViewOrUpdate"
      @cell-menu="cellContextMenuEvent"
      @menu-click="contextMenuClickEvent"
    >
      <template #toolbar>
        <el-button
          size="default"
          v-if="checkBtnPerms('add')"
          icon="ele-Plus"
          type="primary"
          @click="handleAdd"
        >
          {{ $t("form.formData.add") }}
        </el-button>
        <el-button
          size="default"
          v-if="checkBtnPerms('query')"
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          {{ $t("form.formData.query") }}
        </el-button>
        <el-button
          size="default"
          v-if="checkBtnPerms('import')"
          icon="ele-Upload"
          type="primary"
          @click="handleImport"
        >
          {{ $t("form.formData.import") }}
        </el-button>
        <el-button
          size="default"
          v-if="checkBtnPerms('download')"
          icon="ele-Download"
          type="primary"
          @click="handleDownload"
        >
          {{ $t("form.formData.downloadAttachment") }}
        </el-button>
        <print-template-list
          class="ml8 mr8"
          :data-ids="checkboxIds"
          ref="printTemplateListRef"
        >
          <el-button
            size="default"
            icon="ele-Printer"
            type="primary"
            @click="handleBatchPrint"
          >
            {{ $t("form.formData.batchPrint") }}
          </el-button>
        </print-template-list>
        <el-button
          v-if="formType === 4 && checkBtnPerms('examScoreAssign')"
          icon="ele-EditPen"
          size="default"
          type="primary"
          @click="handleExamAssignScore"
        >
          {{ $t("form.formData.examScoreAssign") }}
        </el-button>
        <el-button
          size="default"
          v-if="checkBtnPerms('delete')"
          icon="ele-Remove"
          type="danger"
          @click="handleDelete"
        >
          {{ $t("form.formData.delete") }}
        </el-button>
        <el-input
          class="ml10"
          prefix-icon="ele-Search"
          size="default"
          clearable
          :placeholder="$t('form.formData.fullTextSearch')"
          style="width: 200px"
          v-model="inputSearch"
          @change="handleInputSearchChange"
        />
      </template>
      <template #tools>
        <div style="margin-right: 12px">
          <button
            v-if="checkBtnPerms('export')"
            class="vxe-button type--button is--circle"
            :title="$t('form.formData.export')"
            type="button"
            @click="handleExport"
          >
            <el-icon>
              <ele-Download />
            </el-icon>
          </button>
        </div>
      </template>
    </base-table>

    <ViewOrUpdate
      v-if="formModel && formKey"
      ref="viewOrUpdateDialogRef"
      :can-update="checkBtnPerms('update')"
      :fields="fields"
      :fixed-fields="fixedFields"
      :form-key="formKey"
      :form-model="formModel"
      @reload="handleReloadTable"
      @openReply="$refs.replyDrawerRef.open()"
    />
    <el-dialog
      v-model="addDialogVisible"
      v-if="addDialogVisible"
      :close-on-click-modal="false"
      :title="$t('form.formData.add')"
      width="60%"
    >
      <el-scrollbar
        height="750px"
        class="t-form-theme-wrap"
      >
        <biz-project-form
          v-if="formConfig.formKey"
          :form-config="formConfig"
          @submit="submitForm"
        />
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="queryDialogVisible"
      :close-on-click-modal="false"
      class="t-dialog t-dialog--top"
      :title="$t('form.formData.query')"
      width="50%"
    >
      <data-filter
        :fields="fields"
        @filter="
          params => {
            queryParams.filter = params;
          }
        "
      />
      <template #footer>
        <div class="t-dialog__footer">
          <el-button @click="queryDialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="handleConditionQueryTable"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <import
      ref="dataImportRef"
      :form-key="formKey"
      @success="handleReloadTable"
    />
    <export-data
      ref="dataExportRef"
      :export-field-list="fields"
    />
    <reply-drawer
      ref="replyDrawerRef"
      :data-id="selectDataId"
      :form-key="formKey"
    />
    <download-file
      ref="downloadFileRef"
      :fields="fields"
      :query-params="queryParams"
    />
  </div>
</template>

<script name="DataIndex" setup>
import { nextTick, onBeforeMount, provide, ref } from "vue";
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import DataFilter from "./filter.vue";
import ViewOrUpdate from "./ViewOrUpdate.vue";
import BaseTable from "./table/BaseTable.vue";
import ReplyDrawer from "./ReplyDrawer.vue";
import DownloadFile from "./table/DownloadFile.vue";
import ExportData from "./table/ExportData.vue";
import PrintTemplateList from "@/views/form/data/table/PrintTemplateList.vue";
import { createFormResultRequest, deleteFormDataRequest, listFormDataTableRequest } from "@/api/project/data";
import { getFormLogicRequest, listFixedFormFieldsRequest, listFormFieldsRequest, MyFormRole } from "@/api/project/form";
import Import from "./table/import.vue";
import { formatTableColumn } from "./table/formatTableColumn";
import { i18n } from "@/i18n";
import { useRoute, useRouter } from "vue-router";
import { MessageBoxUtil, MessageUtil } from "@/utils/messageUtil";
import commonFunction from "@/utils/commonFunction";
import { useFormInfo } from "@/stores/formInfo";
import { storeToRefs } from "pinia";
import { getDimensionByKey } from "@/api/project/dimension";
import { Local } from "@/utils/storage";

const formKey = ref("");
const formConfig = ref({
  formKey: "",
  preview: false,
  showBtns: true
});
const formParseKey = ref(new Date().getTime());
const formModel = ref({});
const queryParams = ref({
  authGroupId: null,
  formKey: "",
  filter: {}
});

const queryDialogVisible = ref(false);

const addDialogVisible = ref(false);
const selectDataId = ref(null);
const checkboxIds = ref([]);
const fields = ref([]);
const fixedFields = ref([]);

const inputSearch = ref("");

const props = defineProps({
  mode: {
    type: Number,
    required: false,
    default: 1
  },
  // 权限信息
  authGroup: {
    type: Object,
    required: false,
    default: () => {}
  }
});

const initPerms = () => {
  if (props.mode === 1) {
    const btns = ["print", "custom"];
    btns.forEach(key => {
      gridOptions.value.toolbarConfig[key] = true;
    });
    return true;
  }
  props.authGroup.btnPerms.forEach(key => {
    if (key !== "export") {
      gridOptions.value.toolbarConfig[key] = true;
    }
  });
  fields.value.forEach(field => {
    let haveFieldIds = props.authGroup.fieldEditPerms;
    if (!haveFieldIds.includes(field.value)) {
      if (field.scheme) {
        field.scheme.disabled = true;
      }
    }
  });
};

const route = useRoute();
const router = useRouter();
const formLogicData = ref(null);
provide("formLogicData", formLogicData);

const dimensionConfig = ref(null);
provide("dimensionConfig", dimensionConfig);

onBeforeMount(async () => {
  formKey.value = route.query.key || route.params.key;
  // 详情固定列
  listFixedFormFieldsRequest(formKey.value).then(res => {
    fixedFields.value = res.data;
  });
  // 表格字段查询
  handleQueryFields().then(() => {
    initPerms();
    // 表格固定列设置
    const fixedCols = Local.get("fixedCols-" + formKey.value);
    fixedCols.forEach(col => {
      nextTick(() => {
        baseTableRef.value.getXGrid().setColumnFixed(col.field, col.fixed);
      });
    });
  });
  // 获取逻辑
  const { data: logicData } = await getFormLogicRequest({ formKey: formKey.value });
  formLogicData.value = logicData;
  // 获取维度信息
  if (formType.value === 4) {
    getDimensionByKey(formKey.value).then(res => {
      if (res.data) {
        dimensionConfig.value = res.data;
      }
    });
  }
});

const checkBtnPerms = btn => {
  if (props.mode === 2) {
    return props.authGroup.btnPerms.includes(btn);
  } else if (myFormRole === MyFormRole.COLLABORATOR) {
    return formInfoStore.authGroupInfo?.btnPerms.includes(btn);
  } else {
    return true;
  }
};

const handleConditionQueryTable = () => {
  queryDialogVisible.value = false;
  handleReloadTable();
};

const formInfoStore = useFormInfo();

const { myFormRole, formType } = storeToRefs(formInfoStore);

const handleQueryFields = () => {
  return new Promise((resolve, reject) => {
    // 普通模式
    if (props.mode === 2 || myFormRole === MyFormRole.COLLABORATOR) {
      // 是不是协作者身份
      let tempAuthGroup = props.authGroup;
      if (myFormRole === MyFormRole.COLLABORATOR) {
        tempAuthGroup = formInfoStore.authGroupInfo || {};
      }
      listFormFieldsRequest(formKey.value).then(res => {
        let haveFieldIds = tempAuthGroup.fieldVisiblePerms;
        fields.value = res.data.filter(item => haveFieldIds.includes(item.value));
        handleTableColumns(fields.value);
        resolve(fields.value);
      });
      queryParams.value.authGroupId = tempAuthGroup.id;
    } else {
      listFormFieldsRequest(formKey.value).then(res => {
        handleTableColumns(res.data);
        resolve(fields.value);
      });
    }
  });
};

const handleTableColumns = data => {
  let firstCol = [
    { type: "checkbox", width: 60, title: "" },
    {
      field: "id",
      title: "Id",
      minWidth: "150"
    }
  ];
  gridOptions.value.columns = firstCol.concat(
    data
      .map(item => {
        return formatTableColumn(item);
      })
      .filter(item => item !== undefined)
  );
  fields.value = data;
};

const handleQuery = () => {
  queryDialogVisible.value = true;
};

const dataImportRef = ref(null);

const handleImport = () => {
  dataImportRef.value.upload.open = true;
};

const baseTableRef = ref(null);
const dataExportRef = ref(null);

const selectRecords = ref([]);

const handleExport = () => {
  const { pager } = baseTableRef.value.getXGrid().getProxyInfo();
  let params = {
    selectRecords: selectRecords.value,
    currentPage: pager.currentPage - 1,
    pageSize: pager.pageSize,
    total: pager.total,
    formKey: formKey.value,
    filter: queryParams.value.filter,
    authGroupId: queryParams.value.authGroupId,
    checkboxIds: baseTableRef.value
      .getXGrid()
      .getCheckboxRecords()
      .map(item => item.id)
  };
  dataExportRef.value.openExportDialog(params);
};

const downloadFileRef = ref(null);

const handleDownload = () => {
  if (!baseTableRef.value.getXGrid().getProxyInfo().pager.total) {
    MessageUtil.error(i18n.global.t("form.formData.formNoFileCollected"));
    return;
  }
  downloadFileRef.value.openDownloadFile();
};

const handleExamAssignScore = () => {
  router.push({
    path: "/exam/score/assign",
    query: {
      formKey: formKey.value
    }
  });
};

const printTemplateListRef = ref(null);

const handleBatchPrint = () => {
  let ids = baseTableRef.value
    .getXGrid()
    .getCheckboxRecords(true)
    .map(item => item.id);
  if (!ids.length) {
    MessageUtil.warning(i18n.global.t("form.formData.selectData"));
    return;
  }
  checkboxIds.value = ids;
  printTemplateListRef.value.showClick();
};

const handleDelete = () => {
  let ids = baseTableRef.value
    .getXGrid()
    .getCheckboxRecords(true)
    .map(item => item.id);
  if (!ids.length) {
    MessageUtil.warning(i18n.global.t("form.formData.selectData"));
    return;
  }
  MessageBoxUtil.confirm(
    `${i18n.global.t("form.formData.deleteConfirmation")}${ids.length}${i18n.global.t("form.formData.deleteConfirmationCount")}`,
    () => {
      deleteFormDataRequest(ids, formKey.value).then(() => {
        MessageUtil.success(i18n.global.t("formI18n.all.success"));
        handleReloadTable();
      });
    }
  );
};

const handleAdd = () => {
  formConfig.value.formKey = formKey.value;
  formParseKey.value = new Date().getTime();
  addDialogVisible.value = true;
};

const handleReloadTable = () => {
  baseTableRef.value.getXGrid().commitProxy("query");
};

const gridOptions = ref({
  border: true,
  stripe: true,
  resizable: true,
  showHeaderOverflow: true,
  showOverflow: true,
  highlightHoverRow: true,
  keepSource: true,
  id: "formDataGrid",
  rowId: "id",
  rowConfig: {
    keyField: "id",
    isHover: true
  },
  customConfig: {
    storage: false
  },
  printConfig: {},
  menuConfig: {
    body: {
      options: [
        [
          {
            code: "copy",
            name: i18n.global.t("form.formData.copyContent"),
            visible: true,
            disabled: false
          },
          {
            code: "clear",
            name: i18n.global.t("form.formData.clearContent"),
            visible: true,
            disabled: false
          }
        ]
      ]
    }
  },
  sortConfig: {
    trigger: "cell",
    remote: true
  },
  filterConfig: {
    remote: true
  },
  pagerConfig: {
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000]
  },
  toolbarConfig: {
    refresh: true,
    import: false,
    export: false,
    print: false,
    zoom: true,
    custom: false,
    slots: {
      buttons: "toolbar_buttons",
      tools: "toolbar_tools"
    }
  },
  proxyConfig: {
    seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
    // 对应响应结果 { result: [], page: { total: 100 } }
    props: {
      result: "data.rows", // 配置响应结果列表字段
      total: "data.total" // 配置响应结果总页数字段
    },
    ajax: {
      // 接收 Promise 对象
      query: ({ page, sorts, filters, form }) => {
        queryParams.value.size = page.pageSize;
        queryParams.value.current = page.currentPage - 1;
        queryParams.value.formKey = formKey.value;
        // A workaround for handle empty filter condition
        const filter = queryParams.value.filter;
        if (filter && filter?.conditionList) {
          filter.conditionList = filter.conditionList.filter(({ formItemId, method, value }) => {
            return formItemId !== "" && method !== "" && (value !== "" || method === "IS_NULL" || method === "NOT_NULL");
          });
        }
        return listFormDataTableRequest(queryParams.value);
      }
    }
  },
  columns: [],
  importConfig: {
    // remote: true,
    // importMethod: this.importMethod,
    types: ["csv", "html", "xml", "txt"],
    modes: ["insert"]
  },
  // 废弃 重写导出了
  exportConfig: {
    // remote: true,
    isMerge: false,
    isAllExpand: false,
    remote: true,
    exportMethod: handleExport,
    types: ["xlsx", "csv"],
    modes: ["current", "selected", "all"]
  },
  checkboxConfig: {
    // labelField: 'id',
    reserve: true,
    highlight: true,
    range: true
  }
});

const cellContextMenuEvent = ({ row }) => {
  const $grid = baseTableRef.value.getXGrid();
  $grid.setCurrentRow(row);
};

const viewOrUpdateDialogRef = ref(null);

const handleViewOrUpdate = event => {
  if (!checkBtnPerms("detail")) {
    return;
  }
  if (event.triggerCheckbox) {
    return;
  }
  formModel.value = event.row;
  selectDataId.value = event.row.id;
  viewOrUpdateDialogRef.value.showDialog();
};

const { copyText } = commonFunction();

const contextMenuClickEvent = ({ menu, row, column }) => {
  const $grid = baseTableRef.value.getXGrid();
  switch (menu.code) {
    case "copy":
      if (row && column) {
        copyText(row[column.property]);
      }
      break;
    case "clear":
      $grid.clearData(row, column.property);
      break;
    case "myPrint":
      $grid.print();
      break;
    case "myExport":
      $grid.exportData();
      break;
  }
};

const submitForm = async data => {
  await createFormResultRequest({
    ...data,
    formKey: formConfig.value.formKey
  });
  handleReloadTable();
  addDialogVisible.value = false;
  MessageUtil.success(i18n.global.t("formI18n.all.success"));
};

const handleInputSearchChange = () => {
  queryParams.value.filter["keyword"] = inputSearch.value;
  handleReloadTable();
};

provide("checkBtnPerms", checkBtnPerms);

defineExpose({
  checkBtnPerms
});
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
}

:deep(.project-form) {
  background-color: #ffffff !important;
  width: 100% !important;
}

/*// 使用样式隐藏最后一行无用设置
*/
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

.fixed-col-wrap {
  white-space: nowrap;
  overflow: hidden;

  .el-checkbox {
    display: block !important; /* 每个复选框一行显示 */
    overflow: hidden; /* 隐藏超出容器宽度的复选框文本 */
  }
}
</style>
