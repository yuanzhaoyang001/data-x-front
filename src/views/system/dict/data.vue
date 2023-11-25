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
        :label="$t('system.dictionaryData.dictionaryType')"
        prop="dictType"
      >
        <el-select v-model="queryParams.dictType">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.dictName"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('system.dictionaryData.dictionaryLabel')"
        prop="dictLabel"
      >
        <el-input
          v-model="queryParams.dictLabel"
          clearable
          :placeholder="$t('system.dictionaryData.enterDictionaryLabel')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.dictionaryData.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.dictionaryData.dataStatus')"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          {{ $t("system.dictionaryData.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.dictionaryData.reset") }}
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
          {{ $t("system.dictionaryData.add") }}
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
          {{ $t("system.dictionaryData.modify") }}
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
          {{ $t("system.dictionaryData.delete") }}
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
          {{ $t("system.dictionaryData.export") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionaryData.dictionaryCode')"
        prop="id"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionaryData.dictionaryLabel')"
        prop="dictLabel"
      >
        <template #default="scope">
          <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{ scope.row.dictLabel }}</span>
          <el-tag
            v-else
            :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass"
          >
            {{ scope.row.dictLabel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('system.dictionaryData.dictionaryKey')"
        prop="dictValue"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionaryData.dictionaryOrder')"
        prop="dictSort"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionaryData.status')"
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
        :label="$t('system.dictionaryData.note')"
        prop="remark"
      />
      <el-table-column
        align="center"
        :label="$t('system.dictionaryData.createTime')"
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
        :label="$t('system.dictionaryData.operation')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.dictionaryData.modify')"
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
            :content="$t('system.dictionaryData.delete')"
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
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="128px"
      >
        <el-form-item :label="$t('system.dictionaryData.dictionaryType')">
          <el-input
            v-model="form.dictType"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionaryData.dictionaryLabel')"
          prop="dictLabel"
        >
          <el-input
            v-model="form.dictLabel"
            :placeholder="$t('system.dictionaryData.enterDictionaryLabel')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionaryData.dictionaryKey')"
          prop="dictValue"
        >
          <el-input
            v-model="form.dictValue"
            :placeholder="$t('system.dictionaryData.enterDataKey')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionaryData.styleAttribute')"
          prop="cssClass"
        >
          <el-input
            v-model="form.cssClass"
            :placeholder="$t('system.dictionaryData.enterStyleAttribute')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionaryData.displayOrder')"
          prop="dictSort"
        >
          <el-input-number
            v-model="form.dictSort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionaryData.echoStyle')"
          prop="listClass"
        >
          <el-select v-model="form.listClass">
            <el-option
              v-for="item in listClassOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('system.dictionaryData.status')"
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
          :label="$t('system.dictionaryData.note')"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            :placeholder="$t('system.dictionaryData.enterContent')"
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
import { addData, delData, exportData, getData, listData, updateData } from "@/api/system/dict/data";
import { getType, optionselect } from "@/api/system/dict/type";
import { i18n } from "@/i18n";

export default {
  name: "Data",
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
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据标签回显样式
      listClassOptions: [
        {
          value: "default",
          label: i18n.global.t("system.dictionaryData.default")
        },
        {
          value: "primary",
          label: i18n.global.t("system.dictionaryData.primary")
        },
        {
          value: "success",
          label: i18n.global.t("system.dictionaryData.success")
        },
        {
          value: "info",
          label: i18n.global.t("system.dictionaryData.info")
        },
        {
          value: "warning",
          label: i18n.global.t("system.dictionaryData.warning")
        },
        {
          value: "danger",
          label: i18n.global.t("system.dictionaryData.danger")
        }
      ],
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
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
        dictLabel: [
          {
            required: true,
            message: i18n.global.t("system.dictionaryData.dataLabelRequired"),
            trigger: "blur"
          }
        ],
        dictValue: [
          {
            required: true,
            message: i18n.global.t("system.dictionaryData.dataKeyRequired"),
            trigger: "blur"
          }
        ],
        dictSort: [
          {
            required: true,
            message: i18n.global.t("system.dictionaryData.dataOrderRequired"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId;
    this.getType(dictId);
    this.getTypeList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询字典类型详细 */
    getType(dictId) {
      getType(dictId).then(response => {
        this.queryParams.dictType = response.data.dictType;
        this.defaultDictType = response.data.dictType;
        this.getList();
      });
    },
    /** 查询字典类型列表 */
    getTypeList() {
      optionselect().then(response => {
        this.typeOptions = response.data;
      });
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.data.records;
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
        dictLabel: undefined,
        dictValue: undefined,
        cssClass: undefined,
        listClass: "default",
        dictSort: 0,
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
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = i18n.global.t("system.dictionaryData.addDictionaryData");
      this.form.dictType = this.queryParams.dictType;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getData(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("system.dictionaryData.modifyDictionaryData");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateData(this.form).then(response => {
              this.msgSuccess(i18n.global.t("common.updateSuccess"));
              this.open = false;
              this.getList();
            });
          } else {
            addData(this.form).then(response => {
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
        i18n.global.t("system.dictionaryData.confirmDeleteDictionaryCode") +
          '"' +
          ids +
          '"' +
          i18n.global.t("system.dictionaryData.dataItem"),
        i18n.global.t("system.dictionaryData.warning"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          type: "warning"
        }
      )
        .then(function () {
          return delData(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.dictionaryData.deleteSuccess"));
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(i18n.global.t("system.dictionaryData.confirmExportAllData"), i18n.global.t("system.dictionaryData.warning"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportData(queryParams);
        })
        .then(response => {
          this.download(response, i18n.global.t("system.dictionaryData.dictionaryData"));
          this.exportLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
