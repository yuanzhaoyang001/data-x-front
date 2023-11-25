<template>
  <el-dialog
    v-model="dialogVisible"
    class="t-dialog"
    :title="$t('form.exportData.title')"
    width="45%"
  >
    <el-form
      ref="form"
      :model="exportDataParams"
      class="export-form"
      label-width="80px"
    >
      <el-form-item :label="$t('form.exportData.fileNameLabel')">
        <el-input
          v-model="exportDataParams.filename"
          :placeholder="$t('form.exportData.fileNamePlaceholder')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.exportData.saveTypeLabel')">
        <el-select
          v-model="exportDataParams.type"
          :placeholder="$t('form.exportData.saveTypePlaceholder')"
        >
          <el-option
            label="Excel (*.xlsx)"
            value="xlsx"
          ></el-option>
          <el-option
            label="CSV (*.csv)"
            value="csv"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="exportDataParams.type === 'xlsx'"
        :label="$t('form.exportData.sheetNameLabel')"
      >
        <el-input
          v-model="exportDataParams.sheetName"
          :placeholder="$t('form.exportData.sheetNamePlaceholder')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('form.exportData.dataSelectionLabel')">
        <el-select
          v-model="exportDataParams.mode"
          :placeholder="$t('form.exportData.dataType')"
        >
          <el-option
            :label="$t('form.exportData.currentExportText')"
            value="current"
          ></el-option>
          <el-option
            :label="$t('form.exportData.selectedExportText')"
            value="selected"
          ></el-option>
          <el-option
            :label="$t('form.exportData.allExportText')"
            value="all"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('form.exportData.asyncExportLabel')">
        <el-switch v-model="exportDataParams.asyncExport" />
      </el-form-item>
      <el-form-item :label="$t('form.exportData.selectFieldsLabel')">
        <div class="checked-column-warp">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            class="check-all p5"
            @change="handleCheckAllChange"
          >
            {{ $t("form.exportData.checkAll") }}
          </el-checkbox>
          <el-scrollbar
            class="m5"
            style="height: 220px"
          >
            <el-checkbox-group v-model="exportDataParams.columns">
              <el-checkbox
                v-for="filed in exportFieldList"
                :key="filed.value"
                :label="filed.value"
              >
                {{ filed.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button
          size="default"
          @click="dialogVisible = false"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
        <el-button
          size="default"
          type="primary"
          @click="handleExportData"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { exportDataRequest } from "@/api/project/data";
import { VXETable } from "vxe-table";
import { i18n } from "@/i18n";

export default {
  name: "ExportData",
  props: {
    // 导出字段列表
    exportFieldList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkAll: false,
      checkedColumns: [],
      isIndeterminate: true,
      exportDataParams: {},
      defaultConfig: {
        filename: "",
        type: "xlsx",
        mode: "current",
        sheetName: "",
        columns: [],
        asyncExport: false
      },
      dialogVisible: false
    };
  },
  methods: {
    openExportDialog(exportConfig) {
      this.dialogVisible = true;
      this.isIndeterminate = true;
      this.checkAll = true;
      this.exportDataParams = { ...this.defaultConfig, ...exportConfig };
      this.exportDataParams.columns = this.exportFieldList.map(item => item.value);
    },
    handleCheckAllChange(val) {
      this.exportDataParams.columns = val ? this.exportFieldList.map(item => item.value) : [];
      this.isIndeterminate = false;
    },
    handleExportData() {
      this.dialogVisible = false;
      if (!this.exportDataParams.filename) {
        const getTime = () => {
          const now = new Date();
          return `${now.getFullYear()}${
            now.getMonth() + 1
          }${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${Math.floor(Math.random() * 90000) + 10000}`;
        };
        // 默认导出文件名为当前时间加上文件类型
        this.exportDataParams.filename = `导出文件${getTime()}`;
      }
      VXETable.modal.message({
        content: i18n.global.t("form.exportData.loadingMessage"),
        status: "loading",
        duration: -1,
        id: "export-loading"
      });
      exportDataRequest(this.exportDataParams).then(response => {
        VXETable.modal.close("export-loading");
        if (this.exportDataParams.asyncExport) {
          this.$notify.info({
            position: "top-right",
            title: i18n.global.t("form.exportData.asyncPreparingMessage"),
            offset: 50,
            dangerouslyUseHTMLString: true,
            message: i18n.global.t("formI18n.all.success")
          });
          return;
        } else {
          if (this.exportDataParams.type == "csv") {
            this.download(response, this.exportDataParams.filename, ".csv");
          } else {
            this.download(response, this.exportDataParams.filename);
          }
          VXETable.modal.message({ content: i18n.global.t("formI18n.all.success"), status: "success" });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.export-form .el-form-item .el-form-item__label) {
  font-weight: 750;
}

.checked-column-warp {
  min-width: 460px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;

  .check-all {
    background-color: #f8f8f9;
  }

  .el-checkbox {
    display: block;
    padding-left: 5px;
  }

  height: 270px;
}
</style>
