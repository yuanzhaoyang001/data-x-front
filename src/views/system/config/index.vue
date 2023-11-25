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
        :label="$t('system.parameter.parameterName')"
        prop="configName"
      >
        <el-input
          v-model="queryParams.configName"
          clearable
          :placeholder="$t('system.parameter.enterParameterName')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.parameter.parameterKey')"
        prop="configKey"
      >
        <el-input
          v-model="queryParams.configKey"
          clearable
          :placeholder="$t('system.parameter.enterParameterKey')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.parameter.systemBuiltIn')"
        prop="configType"
      >
        <el-select
          v-model="queryParams.configType"
          clearable
          :placeholder="$t('system.parameter.systemBuiltIn')"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.parameter.createTime')">
        <el-date-picker
          v-model="dateRange"
          :end-placeholder="$t('system.parameter.endDate')"
          range-separator="-"
          :start-placeholder="$t('system.parameter.startDate')"
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
          {{ $t("system.parameter.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.parameter.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:config:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("system.parameter.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:config:edit']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("system.parameter.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:config:remove']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("system.parameter.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:config:export']"
          :loading="exportLoading"
          icon="ele-Download"
          plain
          type="warning"
          @click="handleExport"
        >
          {{ $t("system.parameter.export") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:config:remove']"
          icon="ele-Refresh"
          plain
          type="danger"
          @click="handleRefreshCache"
        >
          {{ $t("system.parameter.refreshCache") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('system.parameter.parameterPrimaryKey')"
        prop="id"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.parameter.parameterName')"
        prop="configName"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.parameter.parameterKey')"
        prop="configKey"
      />
      <el-table-column
        align="center"
        :label="$t('system.parameter.parameterKeyValue')"
        prop="configValue"
      />
      <el-table-column
        :formatter="typeFormat"
        align="center"
        :label="$t('system.parameter.systemBuiltIn')"
        prop="configType"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.parameter.note')"
        prop="remark"
      />
      <el-table-column
        align="center"
        :label="$t('system.parameter.createTime')"
        prop="createTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('system.parameter.operation')"
      >
        <template v-slot="scope">
          <el-tooltip
            :content="$t('system.parameter.modify')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:config:edit']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.parameter.delete')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:config:remove']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item
          :label="$t('system.parameter.parameterName')"
          prop="configName"
        >
          <el-input
            v-model="form.configName"
            :placeholder="$t('system.parameter.enterParameterName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.parameter.parameterKey')"
          prop="configKey"
        >
          <el-input
            v-model="form.configKey"
            :placeholder="$t('system.parameter.enterParameterKey')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.parameter.parameterKeyValue')"
          prop="configValue"
        >
          <el-input
            v-model="form.configValue"
            :placeholder="$t('system.parameter.enterParameterKeyValue')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.parameter.systemBuiltIn')"
          prop="configType"
        >
          <el-radio-group v-model="form.configType">
            <el-radio
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('system.parameter.note')"
          prop="remark"
        >
          <el-input
            rows="6"
            v-model="form.remark"
            :placeholder="$t('system.parameter.enterContent')"
            type="textarea"
          />
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
          <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addConfig, delConfig, exportConfig, getConfig, listConfig, refreshCache, updateConfig } from "@/api/system/config";
import { i18n } from "@/i18n";

export default {
  name: "Config",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        configName: undefined,
        configKey: undefined,
        configType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configName: [
          {
            required: true,
            message: i18n.global.t("system.parameter.parameterNameRequired"),
            trigger: "blur"
          }
        ],
        configKey: [
          {
            required: true,
            message: i18n.global.t("system.parameter.parameterKeyRequired"),
            trigger: "blur"
          }
        ],
        configValue: [
          {
            required: true,
            message: i18n.global.t("system.parameter.parameterValueRequired"),
            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {},
  created() {
    this.getList();
    this.getDicts("sys_yes_no").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.configList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 参数系统内置字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.configType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        configName: undefined,
        configKey: undefined,
        configValue: undefined,
        configType: "Y",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = i18n.global.t("system.parameter.addParameter");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("system.parameter.modifyParameter");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateConfig(this.form).then(response => {
              this.msgSuccess(i18n.global.t("system.parameter.updateSuccess"));
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
              this.msgSuccess(i18n.global.t("system.parameter.addSuccess"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(i18n.global.t("system.parameter.confirmDeleteParameter", { id: ids }), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.parameter.deleteSuccess"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(i18n.global.t("system.parameter.confirmExportAllData"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      }).then(() => {
        this.exportLoading = true;
        return exportConfig(queryParams).then(res => {
          this.download(res, i18n.global.t("system.parameter.systemConfiguration"));
          this.exportLoading = false;
        });
      });
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
      });
    }
  }
};
</script>
