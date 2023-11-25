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
        label-width="105px"
        :label="$t('workflow.wfTodo.inputName')"
        prop="instanceName"
      >
        <el-input
          v-model="queryParams.instanceName"
          clearable
          style="width: 230px"
          :placeholder="$t('workflow.wfTodo.inputNameText')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label-width="105px"
        :label="$t('workflow.wfTodo.time')"
        prop="beginDate"
      >
        <el-date-picker
          v-model="queryParams.beginDate"
          clearable
          :placeholder="$t('formI18n.all.beginTime')"
          type="date"
          value-format="YYYY-MM-DD"
          class="mr6"
        />
        -
        <el-date-picker
          v-model="queryParams.endDate"
          clearable
          :placeholder="$t('formI18n.all.lastTime')"
          type="date"
          value-format="YYYY-MM-DD"
          class="ml6"
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

    <el-table
      v-loading="loading"
      :data="todoList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        :label="$t('workflow.wfTodo.inputName')"
        align="center"
        prop="procDefName"
      />
      <el-table-column
        :label="$t('workflow.wfTodo.taskName')"
        align="center"
        prop="taskName"
      />
      <el-table-column
        :label="$t('workflow.wfTodo.taskVersion')"
        align="center"
      >
        <template #default="scope">
          <el-tag>v{{ scope.row.procDefVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('workflow.wfTodo.taskUser')"
        align="center"
      >
        <template #default="scope">
          <label>
            {{ scope.row.startUserName }}
            <el-tag
              v-if="scope.row.startDeptName"
              type="info"
            >
              {{ scope.row.startDeptName }}
            </el-tag>
          </label>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('workflow.wfTodo.acceptTime')"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column
        :label="$t('workflow.wfTodo.taskNumber')"
        align="center"
        prop="taskId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('workflow.wfTodo.operate')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="ele-Edit"
            @click="handleProcess(scope.row)"
          >
            {{ $t("formI18n.all.handel") }}
          </el-button>
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
  </div>
</template>

<script>
import { todoList } from "@/api/workflow/todo";

export default {
  name: "TodoProcess",
  components: {},
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
      // 流程待办任务表格数据
      todoList: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        instanceName: null,
        beginDate: null,
        endDate: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程定义列表 */
    getList() {
      this.loading = true;
      todoList(this.queryParams).then(response => {
        this.todoList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 跳转到处理页面
    handleProcess(row) {
      this.$router.push({
        path: "/workflow/task/record/handle",
        query: {
          procInsId: row.procInsId,
          deployId: row.deployId,
          taskId: row.taskId,
          operated: true
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.beginDate = null;
      this.queryParams.endDate = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    }
  }
};
</script>
