<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
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
        :label="$t('workflow.finished.checkTime')"
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

    <el-table
      v-loading="loading"
      :data="finishedList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />

      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('workflow.wfTodo.inputName')"
        prop="procDefName"
      />
      <el-table-column
        align="center"
        :label="$t('workflow.finished.taskNode')"
        prop="taskName"
      />
      <el-table-column
        align="center"
        :label="$t('workflow.wfTodo.taskUser')"
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
        align="center"
        :label="$t('workflow.wfTodo.inputName')"
        prop="createTime"
        width="180"
      />
      <el-table-column
        align="center"
        :label="$t('workflow.finished.checkTime')"
        prop="finishTime"
        width="180"
      />
      <el-table-column
        align="center"
        :label="$t('workflow.finished.comment')"
        prop="comment"
        width="180"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('workflow.wfTodo.taskNumber')"
        prop="taskId"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('workflow.wfTodo.operate')"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleFlowRecord(scope.row)"
          >
            {{ $t("workflow.finished.records") }}
          </el-button>
          <!--          <el-button-->
          <!--            icon="el-icon-tickets"-->
          <!--            -->
          <!--            link type="primary"-->
          <!--            @click="handleRevoke(scope.row)"-->
          <!--          >-->
          <!--            撤回-->
          <!--          </el-button>-->
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
import { listFinishedTask } from "@/api/workflow/finished";

export default {
  name: "FinishedProcess",
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
      // 已办任务列表数据
      finishedList: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: null,
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
      listFinishedTask(this.queryParams).then(response => {
        this.finishedList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
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
    },
    handleFlowRecord(row) {
      this.$router.push({
        path: "/workflow/task/record/handle",
        query: {
          procInsId: row.procInsId,
          taskId: row.taskId,
          deployId: row.deployId,
          operated: false
        }
      });
    }
  }
};
</script>
