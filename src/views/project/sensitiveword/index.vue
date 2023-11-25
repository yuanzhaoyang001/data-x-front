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
        :label="$t('project.sensitiveWords.word')"
        prop="word"
      >
        <el-input
          v-model="queryParams.word"
          clearable
          :placeholder="$t('project.sensitiveWords.enterSensitiveWord')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
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
    <el-alert
      class="mb10"
      :title="$t('project.sensitiveWords.settingNote')"
      type="warning"
    ></el-alert>
    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:sensitiveword:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("formI18n.all.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:sensitiveword:update']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("formI18n.all.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:sensitiveword:delete']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("formI18n.all.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:sensitiveword:add']"
          icon="ele-Setting"
          plain
          type="warning"
          @click="handleSetting"
        >
          {{ $t("formI18n.all.config") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:sensitiveword:add']"
          icon="ele-Setting"
          plain
          type="info"
          @click="handleSyncWord"
        >
          {{ $t("formI18n.all.refresh") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="sensitiveWordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="true"
        align="center"
        label="ID"
        prop="id"
      />
      <el-table-column
        align="center"
        :label="$t('project.sensitiveWords.word')"
        prop="word"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('formI18n.all.operate')"
      >
        <template #default="scope">
          <el-tooltip
            content="修改"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['sys:sensitiveword:update']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('formI18n.all.modify')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['sys:sensitiveword:delete']"
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

    <!-- 添加或修改敏感词库对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      width="600px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="118px"
      >
        <el-form-item
          :label="$t('project.sensitiveWords.word')"
          prop="word"
        >
          <el-input
            v-model="form.word"
            :placeholder="$t('project.sensitiveWords.enterSensitiveWord')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            :loading="buttonLoading"
            type="primary"
            @click="submitForm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="cancel">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      append-to-body
      v-model="settingDialogVisible"
      :title="$t('formI18n.all.config')"
      width="30%"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item
          label-width="158px"
          :label="$t('project.sensitiveWords.enableSensitiveWords')"
        >
          <el-switch v-model="settingForm.enableCheck"></el-switch>
        </el-form-item>
        <!--        <el-form-item label="加载系统词库">-->
        <!--          <template #label>-->
        <!--            加载系统词库-->
        <!--            <el-tooltip-->
        <!--              class="item"-->
        <!--              content="系统词库默认会比较严格，如果出现误判请关闭"-->
        <!--              effect="dark"-->
        <!--              placement="left"-->
        <!--            >-->
        <!--              <i class="el-icon-question" />-->
        <!--            </el-tooltip>-->
        <!--          </template>-->
        <!--          <el-switch v-model="settingForm.loadDefaultWord"></el-switch>-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="handleSaveSetting"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="settingDialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  addSensitiveWord,
  delSensitiveWord,
  getSensitiveWord,
  listSensitiveWord,
  syncWords,
  updateSensitiveWord
} from "@/api/system/sensitiveword";
import { getEnvConfigValue, saveEnvConfig } from "@/api/system/config";
import { i18n } from "@/i18n";

export default {
  name: "SensitiveWordMange",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
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
      // 敏感词库表格数据
      sensitiveWordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        word: undefined
      },
      // 设置dialog
      settingDialogVisible: false,
      settingForm: {
        enableCheck: false,
        loadDefaultWord: false
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: i18n.global.t("project.sensitiveWords.userIDNotNull"), trigger: "blur" }],
        word: [
          {
            required: true,
            message: i18n.global.t("project.sensitiveWords.sensitiveWordsNotNull"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    getEnvConfigValue("sensitiveWordEnvConfig").then(response => {
      if (response.data) {
        this.settingForm = JSON.parse(response.data);
      }
    });
  },
  methods: {
    /** 查询敏感词库列表 */
    getList() {
      this.loading = true;
      listSensitiveWord(this.queryParams).then(response => {
        this.sensitiveWordList = response.data.records;
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
        word: undefined,
        createTime: undefined,
        updateTime: undefined
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = i18n.global.t("project.sensitiveWords.addSensitiveWordLibrary");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getSensitiveWord(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("project.sensitiveWords.modifySensitiveWordLibrary");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          this.form.type = 1;
          if (this.form.id != null) {
            updateSensitiveWord(this.form)
              .then(response => {
                this.msgSuccess(i18n.global.t("formI18n.all.success"));
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addSensitiveWord(this.form)
              .then(response => {
                this.msgSuccess(i18n.global.t("formI18n.all.success"));
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(i18n.global.t("project.sensitiveWords.isDelete"))
        .then(() => {
          this.loading = true;
          return delSensitiveWord(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    handleSetting() {
      this.settingDialogVisible = true;
    },
    handleSaveSetting() {
      this.settingDialogVisible = false;
      saveEnvConfig({
        envKey: "sensitiveWordEnvConfig",
        envValue: this.settingForm
      }).then(response => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
      });
      this.settingDialogVisible = false;
    },
    handleSyncWord() {
      this.$confirm(i18n.global.t("project.sensitiveWords.refreshConfig"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          syncWords().then(res => {
            this.$message({
              type: "success",
              message: i18n.global.t("formI18n.all.success")
            });
          });
        })
        .catch(() => {});
    }
  }
};
</script>
