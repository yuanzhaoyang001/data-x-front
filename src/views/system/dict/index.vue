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
        :label="$t('system.dictionary.dictionaryName')"
        prop="dictName"
      >
        <el-input
          v-model="queryParams.dictName"
          clearable
          :placeholder="$t('system.dictionary.enterDictionaryName')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.dictionary.dictionaryType')"
        prop="dictType"
      >
        <el-input
          v-model="queryParams.dictType"
          clearable
          :placeholder="$t('system.dictionary.enterDictionaryType')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.dictionary.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.dictionary.dictionaryStatus')"
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
      <el-form-item :label="$t('system.dictionary.createTime')">
        <el-date-picker
          v-model="dateRange"
          :end-placeholder="$t('system.dictionary.endDate')"
          range-separator="-"
          :start-placeholder="$t('system.dictionary.startDate')"
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
          {{ $t("system.dictionary.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.dictionary.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dict:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("system.dictionary.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dict:edit']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("system.dictionary.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dict:remove']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("system.dictionary.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dict:export']"
          :loading="exportLoading"
          icon="ele-Download"
          plain
          type="warning"
          @click="handleExport"
        >
          {{ $t("system.dictionary.export") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dict:remove']"
          icon="ele-Refresh"
          plain
          type="danger"
          @click="handleRefreshCache"
        >
          {{ $t("system.dictionary.refreshCache") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="typeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionary.dictionaryNumber')"
        prop="id"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.dictionary.dictionaryName')"
        prop="dictName"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.dictionary.dictionaryType')"
      >
        <template #default="scope">
          <router-link
            :to="'/dict/type/data/' + scope.row.id"
            class="link-type"
          >
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('system.dictionary.status')"
        prop="status"
      >
        <template #default="scope">
          <dict-tag
            :options="statusOptions"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('system.dictionary.note')"
        prop="remark"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionary.createTime')"
        prop="createTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('system.dictionary.operation')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.dictionary.modify')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:dict:edit']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.dictionary.delete')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:dict:remove']"
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
      width="35%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item
          :label="$t('system.dictionary.dictionaryName')"
          prop="dictName"
        >
          <el-input
            v-model="form.dictName"
            :placeholder="$t('system.dictionary.enterDictionaryName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionary.dictionaryType')"
          prop="dictType"
        >
          <el-input
            v-model="form.dictType"
            :placeholder="$t('system.dictionary.enterDictionaryType')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionary.status')"
          prop="status"
        >
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionary.note')"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            :placeholder="$t('system.dictionary.enterContent')"
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
import { addType, delType, exportType, getType, listType, refreshCache, updateType } from "@/api/system/dict/type";
import { i18n } from "@/i18n";

export default {
  name: "Dict",
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          {
            required: true,
            message: i18n.global.t("system.dictionary.dictionaryNameRequired"),
            trigger: "blur"
          }
        ],
        dictType: [
          {
            required: true,
            message: i18n.global.t("system.dictionary.dictionaryTypeRequired"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.typeList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
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
        dictName: undefined,
        dictType: undefined,
        status: "0",
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
      this.title = i18n.global.t("system.dictionary.addDictionaryType");
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
      getType(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("system.dictionary.modifyDictionaryType");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateType(this.form).then(response => {
              this.msgSuccess(i18n.global.t("common.updateSuccess"));
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
              this.msgSuccess(i18n.global.t("common.addSuccess"));
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
      this.$confirm(
        i18n.global.t("system.dictionary.confirmDeleteDictionary") +
          '"' +
          ids +
          '"' +
          i18n.global.t("system.dictionary.dataItem"),
        i18n.global.t("system.dictionary.warning"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          type: "warning"
        }
      )
        .then(() => delType(ids))
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.dictionary.deleteSuccess"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(i18n.global.t("system.dictionary.confirmExportAllData"), i18n.global.t("system.dictionary.warning"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportType(queryParams);
        })
        .then(response => {
          this.download(response, i18n.global.t("system.dictionary.dictionaryType"));
          this.exportLoading = false;
        })
        .catch(() => {});
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
