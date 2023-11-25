<template>
  <div class="app-container">
    <base-table
      ref="baseTable"
      :grid-options="gridOptions"
      @cell-click="handleViewOrUpdate"
      @cell-menu="cellContextMenuEvent"
      @menu-click="contextMenuClickEvent"
    >
      <template #toolbar />
    </base-table>
    <ViewOrUpdate
      v-if="formModel && formKey"
      ref="viewOrUpdateDialog"
      :can-update="checkBtnPerms('update')"
      :fields="fields"
      :fixed-fields="fixedFields"
      :form-key="formKey"
      :form-model="formModel"
      @reload="handleReloadTable"
      @openReply="$refs.replyDrawer.open()"
    />
    <el-dialog
      v-model="addDialogVisible"
      title="添加"
    >
      <biz-project-form
        v-if="formConfig.formKey"
        :form-config="formConfig"
        @submit="submitForm"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="queryDialogVisible"
      class="t-dialog t-dialog--top"
      title="查询"
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
          <el-button @click="queryDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleConditionQueryTable"
          >
            查 询
          </el-button>
        </div>
      </template>
    </el-dialog>
    <import
      ref="dataImport"
      :form-key="formKey"
      @success="handleReloadTable"
    />
    <reply-drawer
      ref="replyDrawer"
      :data-id="selectDataId"
      :form-key="formKey"
    />
  </div>
</template>

<script>
import BizProjectForm from "@/views/formgen/components/BizProjectForm/index.vue";
import DataFilter from "../filter.vue";
import ViewOrUpdate from "../ViewOrUpdate.vue";
import BaseTable from "../table/BaseTable.vue";
import ReplyDrawer from "../ReplyDrawer.vue";
import {
  createFormResultRequest,
  deleteFormDataRequest,
  downloadFormDataFileRequest,
  exportDataRequest,
  listFormDataTableRequest
} from "@/api/project/data";
import { listFixedFormFieldsRequest, listFormFieldsRequest } from "@/api/project/form";
import _ from "lodash-es";
import Import from "../table/import.vue";
import { formatTableColumn } from "../table/formatTableColumn";

export default {
  name: "FormData",
  components: {
    ReplyDrawer,
    BaseTable,
    Import,
    BizProjectForm,
    DataFilter,
    ViewOrUpdate
  },
  props: {
    // 模式 1表示控制台中的管理 2 表示权限组
    mode: {
      type: Number,
      required: false,
      default: 1
    },
    // 权限信息
    authGroup: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      formKey: "",
      formConfig: {
        formKey: "",
        preview: false,
        showBtns: true
      },
      formParseKey: new Date().getTime(),
      formModel: {},
      gridOptions: {
        border: true,
        stripe: true,
        resizable: true,
        showHeaderOverflow: true,
        showOverflow: true,
        highlightHoverRow: true,
        keepSource: true,
        id: "formDataGrid",
        rowId: "id",
        customConfig: {
          storage: true
        },
        printConfig: {},
        menuConfig: {
          body: {
            options: [
              [
                {
                  code: "copy",
                  name: "复制内容",
                  visible: true,
                  disabled: false
                },
                {
                  code: "clear",
                  name: "清除内容",
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
            buttons: "toolbar_buttons"
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
              this.queryParams.size = page.pageSize;
              this.queryParams.current = page.currentPage - 1;
              this.queryParams.formKey = this.formKey;
              return listFormDataTableRequest(this.queryParams);
            },
            // 查询全部 导出全部时会被调用
            queryAll: () => {
              this.queryParams.size = null;
              this.queryParams.current = null;
              this.queryParams.formKey = this.formKey;
              return listFormDataTableRequest(this.queryParams).then(res => {
                // 临时处理对象导出显示
                let datas = [];
                res.data.rows.forEach(data => {
                  let dataObj = {};
                  _.keys(data).forEach(key => {
                    if (_.isObject(data[key])) {
                      dataObj[key] = JSON.stringify(data[key]);
                    } else {
                      dataObj[key] = data[key];
                    }
                  });
                  datas.push(dataObj);
                });
                return Promise.resolve(datas);
              });
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
        exportConfig: {
          // remote: true,
          // exportMethod: this.exportMethod,
          isMerge: false,
          isAllExpand: false,
          remote: true,
          exportMethod: this.handleExport,
          types: ["xlsx", "csv"],
          modes: ["current", "selected", "all"]
          // beforeExportMethod: options=>{
          //     console.log(options )
          // }
        },
        checkboxConfig: {
          // labelField: 'id',
          reserve: true,
          highlight: true,
          range: true
        }
      },
      queryDialogVisible: false,
      addDialogVisible: false,
      fields: [],
      fixedFields: [],
      queryParams: {
        authGroupId: null,
        formKey: "",
        filter: {}
      },
      // 选择数据Id
      selectDataId: null
    };
  },
  created() {
    this.formKey = this.$route.query.key || this.$route.params.key;
    this.handleQueryFields();
    this.initPerms();
    listFixedFormFieldsRequest(this.formKey).then(res => {
      this.fixedFields = res.data;
    });
  },
  methods: {
    /**
     * 检查按钮是否有权限
     * @param btn
     */
    checkBtnPerms(btn) {
      if (this.mode === 1) {
        return true;
      }
      return this.authGroup.btnPerms.includes(btn);
    },
    // 初始化权限
    initPerms() {
      // 管理模式
      if (this.mode === 1) {
        const btnPerms = ["export", "print", "custom"];
        btnPerms.forEach(key => {
          this.gridOptions.toolbarConfig[key] = true;
        });
        return true;
      }
      this.authGroup.btnPerms.forEach(key => {
        this.gridOptions.toolbarConfig[key] = true;
      });
      // 允许编辑的字段
      this.fields.forEach(field => {
        let haveFieldIds = this.authGroup.fieldEditPerms;
        // 没权限字段全部禁用
        if (!haveFieldIds.includes(field.value)) {
          if (field.scheme) {
            field.scheme.disabled = true;
          }
        }
      });
    },
    handleConditionQueryTable() {
      this.queryDialogVisible = false;
      this.$refs.baseTable.getXGrid().commitProxy("reload");
    },
    handleQueryFields() {
      return new Promise((resolve, reject) => {
        if (this.mode === 1) {
          listFormFieldsRequest(this.formKey).then(res => {
            this.handleTableColumns(res.data);
            resolve(this.fields);
          });
        } else {
          listFormFieldsRequest(this.formKey).then(res => {
            let haveFieldIds = this.authGroup.fieldVisiblePerms;
            this.fields = res.data.filter(item => haveFieldIds.includes(item.value));
            this.handleTableColumns(this.fields);
            resolve(this.fields);
          });
          this.queryParams.authGroupId = this.authGroup.id;
        }
      });
    },
    /**
     * 格式化处理表格数据
     */
    handleTableColumns(fields) {
      // 部分组件格式化显示 Json
      let firstCol = [{ type: "checkbox", width: 60 }];
      this.gridOptions.columns = firstCol.concat(
        fields.map(item => {
          return formatTableColumn(item);
        })
      );
      this.fields = fields;
    },
    handleQuery() {
      this.queryDialogVisible = true;
    },
    handleImport() {
      this.$refs.dataImport.upload.open = true;
    },
    handleExport({ options }) {
      const { pager } = this.$refs.baseTable.getXGrid().getProxyInfo();
      let params = {
        columns: options.columns
          .reduce((arr, d) => {
            arr.push(d.property);
            return arr;
          }, [])
          .filter(item => item != null),
        filename: options.filename,
        mode: options.mode,
        sheetName: options.sheetName,
        type: options.type,
        selectRecords: this.selectRecords,
        currentPage: pager.currentPage - 1,
        pageSize: pager.pageSize,
        total: pager.total,
        formKey: this.formKey,
        filter: this.queryParams.filter,
        checkboxIds: this.$refs.baseTable
          .getXGrid()
          .getCheckboxRecords()
          .map(item => item.id)
      };
      this.$refs.baseTable.exportMsg();
      exportDataRequest(params).then(response => {
        if (options.type == "csv") {
          this.download(response, options.filename, ".csv");
        } else {
          this.download(response, options.filename);
        }
        this.$refs.baseTable.endExportMsg();
      });
    },
    handleDownload() {
      if (!this.$refs.baseTable.getXGrid().getProxyInfo().pager.total) {
        this.$message.error("无附件，无法导出");
        return;
      }
      downloadFormDataFileRequest(this.queryParams).then(res => {
        this.$process({
          tips: "* 导出当前筛选出的全部附件",
          message: "附件导出中",
          key: res.data
        });
      });
    },
    handleDelete() {
      let ids = this.$refs.baseTable
        .getXGrid()
        .getCheckboxRecords(true)
        .map(item => item.id);
      if (!ids.length) {
        this.msgWarning("请选择数据");
        return;
      }
      this.$confirm(`此操作将删除选中的${ids.length}条数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteFormDataRequest(ids, this.formKey).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.$refs.baseTable.getXGrid().commitProxy("reload");
          });
        })
        .catch(() => {});
    },
    handleAdd() {
      this.formConfig.formKey = this.formKey;
      this.formParseKey = new Date().getTime();
      this.addDialogVisible = true;
    },
    handleReloadTable() {
      this.$refs.baseTable.getXGrid().commitProxy("reload");
    },
    cellContextMenuEvent({ row }) {
      const $grid = this.$refs.baseTable.getXGrid();
      $grid.setCurrentRow(row);
    },
    handleViewOrUpdate(event) {
      if (!this.checkBtnPerms("detail")) {
        return;
      }
      if (event.triggerCheckbox) {
        return;
      }
      this.formModel = event.row;
      this.selectDataId = event.row.id;
      this.$refs.viewOrUpdateDialog.showDialog();
    },
    contextMenuClickEvent({ menu, row, column }) {
      const $grid = this.$refs.baseTable.getXGrid();
      switch (menu.code) {
        case "copy":
          if (row && column) {
            if (this.$copyText(row[column.property])) {
              this.msgSuccess("已复制到剪贴板");
            }
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
    },
    submitForm(data) {
      createFormResultRequest({
        ...data,
        formKey: this.formConfig.formKey
      }).then(() => {
        setTimeout(() => {
          this.$refs.baseTable.getXGrid().commitProxy("reload");
        }, 1000);
        this.addDialogVisible = false;
        this.msgSuccess("添加成功");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
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
