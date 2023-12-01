<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="118px"
    >
      <el-form-item
        :label="$t('system.deptPost.postName')"
        prop="postShowName"
      >
        <el-input
          style="width: 250px"
          v-model="queryParams.postShowName"
          :placeholder="$t('system.deptPost.enterPostShowName')"
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
          {{ $t("system.deptPost.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.deptPost.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:deptpost:setting']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleSetting"
        >
          {{ $t("system.deptPost.postSetting") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:deptpost:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("system.deptPost.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="deptPostList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        align="center"
        :label="$t('system.deptPost.postCode')"
        prop="id"
      />
      <el-table-column
        align="center"
        :label="$t('system.deptPost.postName')"
        prop="postName"
      />
      <el-table-column
        :label="$t('system.deptPost.postShowName')"
        align="center"
        prop="postShowName"
      />
      <!--      <el-table-column-->
      <!--        align="center"-->
      <!--        :label="$t('system.deptPost.postLevel')"-->
      <!--        prop="level"-->
      <!--      />-->
      <el-table-column
        align="center"
        :label="$t('system.deptPost.leaderPost')"
        prop="leaderPost"
        width="180"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.leaderPost === 1"
            type="success"
          >
            {{ $t("system.deptPost.yes") }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
          >
            {{ $t("system.deptPost.no") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.deptPost.operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.deptPost.editAlias')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:deptpost:update']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.deptPost.delete')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:deptpost:delete']"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="deptPostTotal > 0"
      :total="deptPostTotal"
      v-model:page="queryParams.current"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改部门岗位关系对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="118px"
      >
        <el-form-item
          :label="$t('system.deptPost.postShowName')"
          prop="postShowName"
        >
          <el-input
            v-model="form.postShowName"
            :placeholder="$t('system.deptPost.enterPostShowName')"
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
    <!--    设置岗位-->
    <el-dialog
      :title="$t('system.deptPost.deptPostSetting')"
      v-model="settingOpen"
      width="800px"
      append-to-body
    >
      <el-form
        v-show="showSearch"
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="118px"
      >
        <el-form-item
          :label="$t('system.deptPost.postName')"
          prop="postName"
        >
          <el-input
            v-model="postQueryParams.postShowName"
            :placeholder="$t('system.deptPost.enterPostName')"
            clearable
            @keyup.enter="handlePostQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="ele-Search"
            @click="handlePostQuery"
          >
            {{ $t("system.deptPost.search") }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="postTable"
        v-loading="loading"
        :data="postList"
        row-key="id"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          reserve-selection
        />
        <el-table-column
          align="center"
          :label="$t('system.deptPost.deptPostCode')"
          prop="id"
        />
        <el-table-column
          align="center"
          :label="$t('system.deptPost.postCode')"
          prop="postCode"
        />
        <el-table-column
          align="center"
          :label="$t('system.deptPost.postName')"
          prop="postName"
        />
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          :label="$t('system.deptPost.postLevel')"-->
        <!--          prop="level"-->
        <!--        />-->
        <el-table-column
          align="center"
          :label="$t('system.deptPost.leaderPost')"
          prop="leaderPost"
          width="180"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.leaderPost === 1"
              type="success"
            >
              {{ $t("system.deptPost.yes") }}
            </el-tag>
            <el-tag
              v-else
              type="danger"
            >
              {{ $t("system.deptPost.no") }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="postTotal > 0"
        :total="postTotal"
        v-model:page="postQueryParams.current"
        v-model:limit="postQueryParams.size"
        @pagination="getPostList"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="handleSettingDeptPost"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="settingOpen = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { delDeptPost, pageDeptPost, queryDeptNotInPost, settingDeptPost, updateDeptPost } from "../../../api/system/dept";
import { i18n } from "@/i18n";

export default {
  name: "DeptPost",
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
      deptPostTotal: 0,
      // 部门岗位关系表格数据
      deptPostList: [],
      // 部门列表
      postList: [],
      postTotal: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //  设置岗位
      settingOpen: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        deptId: null,
        postShowName: null
      },
      // 查询参数
      postQueryParams: {
        current: 1,
        size: 10,
        deptId: null,
        postShowName: ""
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptId: [{ required: true, message: i18n.global.t("system.deptPost.postName"), trigger: "blur" }],
        postId: [{ required: true, message: i18n.global.t("system.deptPost.postIdNotEmpty"), trigger: "blur" }],
        postShowName: [
          {
            required: true,
            message: i18n.global.t("system.deptPost.postShowNameNotEmpty"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.queryParams.deptId = this.$route.query.id || null;
    this.getList();
  },
  methods: {
    /** 查询部门岗位关系列表 */
    getList() {
      this.loading = true;
      pageDeptPost(this.queryParams).then(response => {
        this.deptPostList = response.data.records;
        this.deptPostTotal = response.data.total;
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
        id: null,
        deptId: null,
        postId: null,
        postShowName: null,
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
    /** 搜索按钮操作 */
    handlePostQuery() {
      this.postQueryParams.current = 1;
      this.getPostList();
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = i18n.global.t("system.deptPost.editAlias");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateDeptPost(this.form).then(response => {
            this.msgSuccess(i18n.global.t("system.deptPost.editSuccess"));
            this.open = false;
            this.getList();
          });
        }
      });
    },
    getPostList() {
      this.postQueryParams.deptId = this.queryParams.deptId;
      queryDeptNotInPost(this.postQueryParams).then(response => {
        this.postList = response.data.records;
        this.postTotal = response.data.total;
      });
    },
    handleSetting() {
      this.settingOpen = true;
      this.getPostList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        i18n.global.t("system.deptPost.confirmDelete") + '"' + ids + '"' + i18n.global.t("system.deptPost.confirmDeleteData")
      )
        .then(function () {
          return delDeptPost(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("system.deptPost.editSuccess"));
        })
        .catch(() => {});
    },
    /** 设置部门岗位 */
    handleSettingDeptPost() {
      console.log(this.$refs.postTable.getSelectionRows());
      if (this.$refs.postTable.getSelectionRows().length === 0) {
        this.msgError(i18n.global.t("system.deptPost.selectPost"));
        return;
      }
      let deptId = this.queryParams.deptId;
      settingDeptPost({
        deptId,
        ids: this.$refs.postTable.getSelectionRows().map(item => item.id)
      }).then(response => {
        this.msgSuccess(i18n.global.t("system.deptPost.editSuccess"));
        this.settingOpen = false;
        this.getList();
      });
    }
  }
};
</script>
