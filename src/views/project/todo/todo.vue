<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="98px"
    >
      <el-form-item
        :label="$t('project.todo.formName')"
        prop="formName"
      >
        <el-input
          style="width: 250px"
          v-model="queryParams.formName"
          clearable
          :placeholder="$t('project.todo.formNameText')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label-width="128px"
        :label="$t('project.todo.acceptanceTime')"
      >
        <el-date-picker
          v-model="queryParams.beginDateTime"
          :placeholder="$t('project.todo.aTimeBegin')"
          style="width: 45%"
          class="mr6"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        -
        <el-date-picker
          :default-time="new Date(0, 0, 0, 0, 23, 59, 59)"
          v-model="queryParams.endDateTime"
          :placeholder="$t('project.todo.aTimeLast')"
          style="width: 45%"
          class="ml6"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          {{ $t("project.todo.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("project.todo.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="todoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('project.todo.formName')"
        prop="formName"
      />
      <el-table-column
        align="center"
        :label="$t('project.todo.status')"
        prop="status"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === 0"
            type="danger"
          >
            {{ $t("project.todo.incomplete") }}
          </el-tag>
          <el-tag
            v-else
            type="success"
          >
            {{ $t("project.todo.complete") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('project.todo.acceptanceTime')"
        prop="createTime"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('project.todo.operate')"
      >
        <template #default="scope">
          <el-button
            icon="ele-Edit"
            link
            type="primary"
            @click="handleToWrite(scope.row)"
          >
            {{ $t("project.todo.toWrite") }}
          </el-button>
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
  </div>
</template>

<script>
import { listTodo } from "@/api/project/todo";

export default {
  name: "TodoForm",
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
      // 待填写表单表格数据
      todoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        formName: "",
        beginDateTime: null,
        endDateTime: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询待填写表单列表 */
    getList() {
      this.loading = true;
      listTodo(this.queryParams).then(response => {
        this.todoList = response.data.records;
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
        id: null,
        formKey: null,
        userId: null,
        status: 0,
        createTime: null,
        updateTime: null
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
      this.queryParams = {
        formName: "",
        beginDateTime: null,
        endDateTime: null
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleToWrite(row) {
      let routeData = this.$router.resolve({
        path: `/s/${row.formKey}`
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>
