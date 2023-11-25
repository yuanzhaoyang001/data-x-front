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
        :label="$t('system.position.code')"
        prop="postCode"
      >
        <el-input
          v-model="queryParams.postCode"
          clearable
          :placeholder="$t('system.position.enterCode')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.position.name')"
        prop="postName"
      >
        <el-input
          v-model="queryParams.postName"
          clearable
          :placeholder="$t('system.position.enterName')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.position.status')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('system.position.positionStatus')"
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
          {{ $t("system.position.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.position.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:post:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("system.position.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:post:edit']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("system.position.edit") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:post:remove']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("system.position.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:post:export']"
          :loading="exportLoading"
          icon="ele-Download"
          plain
          type="warning"
          @click="handleExport"
        >
          {{ $t("system.position.export") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="postList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <!--      <el-table-column align="center" label="岗位编号" prop="id" />-->
      <el-table-column
        align="center"
        :label="$t('system.position.code')"
        prop="postCode"
      />
      <el-table-column
        align="center"
        :label="$t('system.position.name')"
        prop="postName"
      />
      <el-table-column
        align="center"
        :label="$t('system.position.level')"
        prop="level"
      />
      <el-table-column
        align="center"
        :label="$t('system.position.managerPosition')"
        prop="leaderPost"
        width="180"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.leaderPost === 1"
            type="success"
          >
            {{ $t("system.position.yes") }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
          >
            {{ $t("system.position.no") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="statusFormat"
        align="center"
        :label="$t('system.position.status')"
        prop="status"
      />
      <el-table-column
        align="center"
        :label="$t('system.position.createTime')"
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
        :label="$t('system.position.operation')"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="ele-Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          ></el-button>
          <el-button
            link
            type="danger"
            icon="ele-Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <template v-show="total > 0">
      <pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.current"
        :total="total"
        @pagination="getList"
      />
    </template>

    <!-- 添加或修改岗位对话框 -->
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
        label-width="135px"
      >
        <el-form-item
          :label="$t('system.position.name')"
          prop="postName"
        >
          <el-input
            v-model="form.postName"
            :placeholder="$t('system.position.enterName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.position.code')"
          prop="postCode"
        >
          <el-input
            v-model="form.postCode"
            :placeholder="$t('system.position.enterCode')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.position.level')"
          prop="level"
        >
          <el-input-number
            v-model="form.level"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.position.managerPosition')"
          prop="leaderPostBool"
        >
          <el-switch
            v-model="form.leaderPostBool"
            @change="val => (form.leaderPost = val ? 1 : 0)"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.position.positionStatus')"
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
          :label="$t('system.position.remark')"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            :placeholder="$t('system.position.enterContent')"
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
import { addPost, delPost, exportPost, getPost, listPost, updatePost } from "@/api/system/post";
import { i18n } from "@/i18n";

export default {
  name: "Post",
  data() {
    return {
      // Loading overlay
      loading: true,
      // Export loading overlay
      exportLoading: false,
      // Selected items array
      ids: [],
      // Disable for single item
      single: true,
      // Disable for multiple items
      multiple: true,
      // Display search conditions
      showSearch: true,
      // Total number of items
      total: 0,
      // Post table data
      postList: [],
      // Popup title
      title: "",
      // Whether to show the popup
      open: false,
      // Status dictionary data
      statusOptions: [],
      // Query parameters
      queryParams: {
        current: 1,
        size: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      // Form parameters
      form: {},
      // Form validation rules
      rules: {
        postName: [{ required: true, message: i18n.global.t("system.position.nameNotEmpty"), trigger: "blur" }],
        postCode: [{ required: true, message: i18n.global.t("system.position.codeNotEmpty"), trigger: "blur" }],
        level: [{ required: true, message: i18n.global.t("system.position.levelNotEmpty"), trigger: "blur" }],
        leaderPostBool: [{ required: true, message: i18n.global.t("system.position.levelNotEmpty"), trigger: "blur" }]
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
    /** Query post list */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // Post status dictionary translation
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // Cancel button
    cancel() {
      this.open = false;
      this.reset();
    },
    // Form reset
    reset() {
      this.form = {
        id: undefined,
        postCode: undefined,
        postName: undefined,
        level: 1,
        leaderPost: 0,
        leaderPostBool: false,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** Search button operation */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** Reset button operation */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // Multiple selection checkbox data
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** Add button operation */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = i18n.global.t("system.position.add");
    },
    /** Update button operation */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPost(id).then(response => {
        this.form = {
          ...response.data,
          leaderPostBool: response.data.leaderPost == 1
        };
        this.open = true;
        this.title = i18n.global.t("system.position.edit");
      });
    },
    /** Submit button */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePost(this.form).then(response => {
              this.msgSuccess(i18n.global.t("common.updateSuccess"));
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.msgSuccess(i18n.global.t("system.position.addSuccess"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** Delete button operation */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        i18n.global.t("system.position.confirmDelete") + '"' + ids + '"' + i18n.global.t("system.position.dataItem"),
        i18n.global.t("formI18n.all.waring"),
        {
          confirmButtonText: i18n.global.t("formI18n.all.confirm"),
          cancelButtonText: i18n.global.t("formI18n.all.cancel"),
          type: "warning"
        }
      )
        .then(function () {
          return delPost(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.position.deleteSuccess"));
        })
        .catch(() => {});
    },
    /** Export button operation */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm(i18n.global.t("system.position.confirmExport"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportPost(queryParams);
        })
        .then(response => {
          this.download(response, i18n.global.t("system.position.positionInfo"));
          this.exportLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
