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
        :label="$t('tool.task.taskNameLabel')"
        prop="jobName"
      >
        <el-input
          v-model="queryParams.jobName"
          clearable
          :placeholder="$t('tool.task.enterTaskName')"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label-width="138px"
        :label="$t('tool.task.taskGroupName')"
        prop="jobGroup"
      >
        <el-select
          v-model="queryParams.jobGroup"
          clearable
          :placeholder="$t('tool.task.selectTaskGroupName')"
          style="width: 240px"
        >
          <el-option
            v-for="dict in sysJobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('tool.task.taskStatus')"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          :placeholder="$t('tool.task.selectTaskStatus')"
          style="width: 240px"
        >
          <el-option
            v-for="dict in sysJobStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('tool.task.executionTime')">
        <el-date-picker
          v-model="dateRange"
          :end-placeholder="$t('tool.task.startTime')"
          range-separator="-"
          :start-placeholder="$t('tool.task.endTime')"
          style="width: 240px"
          type="daterange"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="ele-Search"
          type="primary"
          @click="handleQuery"
        >
          {{ $t("tool.task.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("tool.task.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:job:remove']"
          plain
          @click="handleClean"
        >
          {{ $t("tool.task.clean") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:job:remove']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
          @click="handleDelete"
        >
          {{ $t("tool.task.delete") }}
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          plain-->
      <!--          type="warning"-->
      <!--          @click="handleClose"-->
      <!--        >-->
      <!--          {{ $t("tool.task.close") }}-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="jobLogList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="ID"
        prop="id"
        width="80"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('tool.task.taskName')"
        prop="jobName"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('tool.task.taskGroupName')"
        prop="jobGroup"
      >
        <template #default="scope">
          <dict-tag
            :options="sysJobGroupOptions"
            :value="scope.row.jobGroup"
          />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('tool.task.invokeTargetString')"
        prop="invokeTarget"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('tool.task.logMessage')"
        prop="jobMessage"
      />
      <el-table-column
        align="center"
        :label="$t('tool.task.executionStatus')"
        prop="status"
      >
        <template #default="scope">
          <dict-tag
            :options="sysJobStatusOptions"
            :value="`${scope.row.status}`"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('tool.task.executionTime')"
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
        :label="$t('tool.task.operation')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('tool.task.view')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-View"
              @click="handleView(scope.row)"
              v-hasPermi="['system:job:query']"
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

    <!-- 调度日志详细 -->
    <el-dialog
      v-model="open"
      append-to-body
      :title="$t('tool.task.scheduleLogDetails')"
      width="700px"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.logId')">{{ form.id }}</el-form-item>
            <el-form-item :label="$t('tool.task.taskName')">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.taskGroupLabelInfo')">{{ form.jobGroup }}</el-form-item>
            <el-form-item :label="$t('tool.task.executionTimeLabel')">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('tool.task.invokeMethod')">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('tool.task.logMessage')">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('tool.task.executionStatus')">
              <div v-if="form.status == 0">{{ $t("tool.task.normal") }}</div>
              <div v-else-if="form.status == 1">{{ $t("tool.task.failed") }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.status == 1"
              :label="$t('tool.task.exceptionInfo')"
            >
              {{ form.exceptionInfo }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">{{ $t("tool.task.close") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getJob } from "@/api/tool/job";
import { cleanJobLog, delJobLog, listJobLog } from "@/api/tool/jobLog";
import { i18n } from "@/i18n";

export default {
  name: "JobLog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 调度日志表格数据
      jobLogList: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        jobName: null,
        jobGroup: null,
        status: null
      },
      // 任务组名字典
      sysJobGroupOptions: [],
      sysJobStatusOptions: []
    };
  },
  created() {
    this.getDicts("sys_job_group").then(response => {
      this.sysJobGroupOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.sysJobStatusOptions = response.data;
    });
    const jobId = this.$route.params && this.$route.params.jobId;
    if (jobId !== undefined && jobId != 0) {
      getJob(jobId).then(response => {
        this.queryParams.jobName = response.data.jobName;
        this.queryParams.jobGroup = response.data.jobGroup;
        this.getList();
      });
    } else {
      this.getList();
    }
  },
  methods: {
    /** 查询调度日志列表 */
    getList() {
      this.loading = true;
      listJobLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.jobLogList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // // 返回按钮
    // handleClose() {
    //   this.$router.push({
    //     path: "/sys/job",
    //     query: { t: Date.now(), pageNum: this.$route.query.page }
    //   });
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobLogId);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds = this.ids;
      this.$confirm(i18n.global.t("tool.task.confirmDelteLogNumer") + '"' + jobLogIds + '"' + i18n.global.t("tool.task.dataItem"))
        .then(function () {
          return delJobLog(jobLogIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm(i18n.global.t("tool.task.confirmDeleteAllLog"), i18n.global.t("formI18n.all.waring"))
        .then(function () {
          return cleanJobLog();
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
