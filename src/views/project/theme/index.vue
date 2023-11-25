<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item
        :label="$t('project.themeList.name')"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          :placeholder="$t('formI18n.all.pleaseEnter')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="ele-Search"
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

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['form:theme:save']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleAdd"
        >
          {{ $t("formI18n.all.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['form:theme:update']"
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click="handleUpdate"
        >
          {{ $t("formI18n.all.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['form:theme:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("formI18n.all.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="themeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="ID"
        align="center"
        prop="id"
      />
      <el-table-column
        :label="$t('project.themeList.name')"
        align="center"
        prop="name"
      />
      <el-table-column
        :label="$t('project.themeList.style')"
        align="center"
        prop="style"
      >
        <template #default="scope">
          {{ getStyleName(scope.row.style) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('formI18n.all.operate')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('formI18n.all.modify')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:theme:update']"
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('formI18n.all.delete')"
            placement="top"
          >
            <el-button
              v-hasPermi="['form:theme:delete']"
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改项目主题外观模板对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="80%"
      append-to-body
    >
      <ThemeEdit
        style="height: 600px"
        :theme-form-prop="form"
        :theme-category-list="themeCategoryList"
        ref="themeEditRef"
      />
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
import { addTheme, delTheme, getTheme, listCategory, listTheme, updateTheme } from "@/api/project/theme";
import ThemeEdit from "./ThemeEdit.vue";
import { i18n } from "@/i18n";

export default {
  name: "Theme",
  components: {
    ThemeEdit
  },

  data() {
    return {
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
      // 项目主题外观模板表格数据
      themeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10
      },
      // 表单参数
      form: {},
      themeCategoryList: [],
      // 表单校验
      rules: {
        name: [{ required: true, message: "", trigger: "blur" }],
        style: [{ required: true, message: "", trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
    this.getThemeCategoryList();
  },
  methods: {
    /** 查询项目主题外观模板列表 */
    getList() {
      this.loading = true;
      listTheme(this.queryParams).then(response => {
        this.themeList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getThemeCategoryList() {
      listCategory().then(response => {
        this.themeCategoryList = response.data;
      });
    },
    getStyleName(id) {
      let item = this.themeCategoryList.find(item => item.id == id);
      return item ? item.name : "";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        style: null,
        headImgUrl: null,
        backgroundImg: null,
        themeColor: null,
        updateTime: null,
        createTime: null
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
      this.title = i18n.global.t("project.themeList.addTheme");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTheme(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("project.themeList.modifyTheme");
      });
    },
    /** 提交按钮 */
    async submitForm() {
      const data = await this.$refs.themeEditRef.getThemeConfig();
      if (!data) {
        return;
      }
      if (this.form.id != null) {
        data.id = this.form.id;
        updateTheme(data).then(response => {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.open = false;
          this.getList();
        });
      } else {
        addTheme(data).then(response => {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.open = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(i18n.global.t("project.themeList.isDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return delTheme(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.color-block {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin: 3px auto;
}
</style>
