<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="118px"
    >
      <el-form-item
        :label="$t('system.operlog.systemModule')"
        prop="title"
      >
        <el-input
          v-model="queryParams.title"
          clearable
          :placeholder="$t('system.operlog.systemModule')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.operlog.operator')"
        prop="operName"
      >
        <el-input
          v-model="queryParams.operName"
          clearable
          :placeholder="$t('system.operlog.operator')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.operlog.type')"
        prop="businessType"
      >
        <el-select
          v-model="queryParams.businessType"
          clearable
          :placeholder="$t('system.operlog.operationType')"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('system.operlog.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.operlog.operationStatus')"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.operlog.operationTime')">
        <el-date-picker
          v-model="dateRange"
          :end-placeholder="$t('system.operlog.endDate')"
          range-separator="-"
          :start-placeholder="$t('system.operlog.startDate')"
          style="width: 240px"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          {{ $t("system.operlog.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.operlog.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['monitor:operlog:remove']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("system.operlog.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['monitor:operlog:remove']"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleClean"
        >
          {{ $t("system.operlog.clear") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['monitor:operlog:export']"
          :loading="exportLoading"
          icon="ele-Download"
          plain
          type="warning"
          @click="handleExport"
        >
          {{ $t("system.operlog.export") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      ref="tables"
      v-loading="loading"
      :data="list"
      :default-sort="defaultSort"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        width="100"
        :label="$t('system.operlog.logNumber')"
        prop="id"
      />
      <el-table-column
        align="center"
        width="100"
        :label="$t('system.operlog.systemModule')"
        prop="title"
      />
      <el-table-column
        :formatter="typeFormat"
        align="center"
        :label="$t('system.operlog.operationType')"
        prop="businessType"
      />
      <el-table-column
        align="center"
        :label="$t('system.operlog.requestMethod')"
        prop="requestMethod"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        :sort-orders="['descending', 'ascending']"
        align="center"
        :label="$t('system.operlog.operator')"
        prop="operName"
        sortable="custom"
        width="100"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.operlog.address')"
        prop="operIp"
        width="180"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.operlog.location')"
        prop="operLocation"
      />
      <el-table-column
        :formatter="statusFormat"
        align="center"
        :label="$t('system.operlog.state')"
        prop="status"
      />
      <el-table-column
        :sort-orders="['descending', 'ascending']"
        align="center"
        :label="$t('system.operlog.date')"
        prop="operTime"
        sortable="custom"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('system.operlog.operation')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.operlog.details')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-View"
              @click="handleView(scope.row, scope.index)"
              v-hasPermi="['monitor:operlog:query']"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:limit="queryParams.size"
      v-model:page="queryParams.current"
      :total="total"
      @pagination="getList"
    />

    <!-- 操作日志详细 -->
    <el-dialog
      v-model="open"
      append-to-body
      :title="$t('system.operlog.operationLogDetails')"
      width="50%"
    >
      <el-form
        ref="form"
        :model="form"
        :label-width="labelWidth"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('system.operlog.operationModule') + ':'">
              {{ form.title }} / {{ typeFormat(form) }}
            </el-form-item>
            <el-form-item :label="$t('system.operlog.loginInfo') + ':'">
              {{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.operlog.requestAddress') + ':'">
              {{ form.operUrl }}
            </el-form-item>
            <el-form-item :label="$t('system.operlog.requestMethodLabel') + ':'">
              {{ form.requestMethod }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('system.operlog.operationMethod') + ':'">
              {{ form.method }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('system.operlog.requestParams') + ':'">
              {{ form.operParam }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('system.operlog.responseParams') + ':'">
              {{ form.jsonResult }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.operlog.operationStatus') + ':'">
              <div v-if="form.status === 0">{{ $t("system.operlog.operationStatusNormal") }}</div>
              <div v-else-if="form.status === 1">{{ $t("system.operlog.operationStatusFailed") }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.operlog.operationTimestamp') + ':'">
              {{ parseTime(form.operTime) }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.status === 1"
              :label="$t('system.operlog.errorMessage') + ':'"
            >
              {{ form.errorMsg }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">{{ $t("system.operlog.close") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { cleanOperlog, delOperlog, exportOperlog, list } from "@/api/system/operlog";
import { i18n } from "@/i18n";

export default {
  name: "Operlog",
  data() {
    return {
      loading: true,
      exportLoading: false,
      ids: [],
      multiple: true,
      showSearch: true,
      total: 0,
      list: [],
      open: false,
      typeOptions: [],
      statusOptions: [],
      dateRange: [],
      defaultSort: { prop: "operTime", order: "descending" },
      form: {},
      queryParams: {
        current: 1,
        size: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
        params: {
          orderByColumn: "id"
        }
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_oper_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType) || i18n.global.t("system.operlog.other");
    },
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order);
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    handleSortChange(column, prop, order) {
      this.queryParams.params["orderByColumn"] = column.prop;
      this.queryParams.params["isAsc"] = column.order;
      this.getList();
    },
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        i18n.global.t("system.operlog.confirmDeleteLogNumber") + `"${ids}"` + i18n.global.t("system.operlog.dataItem"),
        i18n.global.t("system.operlog.warning"),
        {
          confirmButtonText: i18n.global.t("system.operlog.confirm"),
          cancelButtonText: i18n.global.t("system.operlog.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          return delOperlog(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.operlog.deleteSuccess"));
        })
        .catch(() => {});
    },
    handleClean() {
      this.$confirm(i18n.global.t("system.operlog.confirmClearLogs"), i18n.global.t("system.operlog.warning"), {
        confirmButtonText: i18n.global.t("system.operlog.confirm"),
        cancelButtonText: i18n.global.t("system.operlog.cancel"),
        type: "warning"
      })
        .then(() => {
          return cleanOperlog();
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.operlog.clearSuccess"));
        })
        .catch(() => {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(i18n.global.t("system.operlog.confirmExportLogs"), i18n.global.t("system.operlog.warning"), {
        confirmButtonText: i18n.global.t("system.operlog.confirm"),
        cancelButtonText: i18n.global.t("system.operlog.cancel"),
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportOperlog(queryParams);
        })
        .then(response => {
          this.download(response, i18n.global.t("system.operlog.operationLogs"));
          this.exportLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
