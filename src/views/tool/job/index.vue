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
        :label="$t('tool.task.taskName')"
        prop="jobName"
      >
        <el-input
          v-model="queryParams.jobName"
          clearable
          :placeholder="$t('tool.task.enterTaskName')"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label-width="128px"
        :label="$t('tool.task.taskGroupName')"
        prop="jobGroup"
      >
        <el-select
          style="width: 200px"
          v-model="queryParams.jobGroup"
          clearable
          :placeholder="$t('tool.task.selectTaskGroupName')"
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
        >
          <el-option
            v-for="dict in sysJobStatusOptions"
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
          v-hasPermi="['system:job:add']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("tool.task.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:job:update']"
          :disabled="single"
          icon="ele-Edit"
          plain
          type="success"
          @click="handleUpdate"
        >
          {{ $t("tool.task.modify") }}
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
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:job:query']"
          icon="ele-Operation"
          plain
          type="info"
          @click="handleJobLog"
        >
          {{ $t("tool.task.log") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="jobList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$t('tool.task.taskNumber')"
        prop="id"
        width="110"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('tool.task.taskName')"
        prop="jobName"
      />
      <el-table-column
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
        :label="$t('tool.task.cronExpression')"
        prop="cronExpression"
      />
      <el-table-column
        align="center"
        :label="$t('tool.task.status')"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        :label="$t('tool.task.operation')"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('tool.task.modify')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:job:edit']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('tool.task.delete')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:job:remove']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('tool.task.runOnce')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-CaretRight"
              @click="handleRun(scope.row)"
              v-hasPermi="['system:job:changeStatus']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('tool.task.taskDetails')"
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
          <el-tooltip
            :content="$t('tool.task.scheduleLog')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-Operation"
              @click="handleJobLog(scope.row)"
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      dialog
      append-to-body
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          :label="$t('tool.task.taskName')"
          prop="jobName"
        >
          <el-input
            v-model="form.jobName"
            :placeholder="$t('tool.task.enterTaskName')"
          />
        </el-form-item>

        <el-form-item
          label-width="130px"
          :label="$t('tool.task.taskGroupName')"
          prop="jobGroup"
        >
          <el-select
            v-model="form.jobGroup"
            :placeholder="$t('tool.task.selectTaskGroupName')"
          >
            <el-option
              v-for="dict in sysJobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="invokeTarget">
          <template #label>
            <span>
              {{ $t("tool.task.invokeMethod") }}
              <el-tooltip placement="top">
                <template #content>
                  <div>
                    {{ $t("tool.task.beanInvokeExample") }}
                    <br />
                    {{ $t("tool.task.classInvokeExample") }}
                    <br />
                    {{ $t("tool.task.parameterExplanation") }}
                  </div>
                </template>
                <el-icon><ele-QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="form.invokeTarget"
            :placeholder="$t('tool.task.enterInvokeTargetString')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('tool.task.cronExpression')"
          prop="cronExpression"
        >
          <el-input
            v-model="form.cronExpression"
            :placeholder="$t('tool.task.enterCronExpression')"
          >
            <template #append>
              <el-button
                type="primary"
                @click="handleShowCron"
              >
                {{ $t("tool.task.generateExpression") }}
                <el-icon>
                  <ele-Timer />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('tool.task.executionStrategy')"
          prop="misfirePolicy"
        >
          <el-radio-group v-model="form.misfirePolicy">
            <el-radio-button label="1">{{ $t("tool.task.executeImmediately") }}</el-radio-button>
            <el-radio-button label="2">{{ $t("tool.task.runOnceOption") }}</el-radio-button>
            <el-radio-button label="3">{{ $t("tool.task.giveUpExecution") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('tool.task.concurrent')"
          prop="concurrent"
        >
          <el-radio-group v-model="form.concurrent">
            <el-radio-button label="0">{{ $t("tool.task.allow") }}</el-radio-button>
            <el-radio-button label="1">{{ $t("tool.task.forbid") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('tool.task.status')">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sysJobStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-re-click
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
      v-model="openCron"
      append-to-body
      class="scrollbar"
      destroy-on-close
      :title="$t('tool.task.cronExpressionGenerator')"
    >
      <crontab
        :expression="expression"
        @fill="crontabFill"
        @hide="openCron = false"
      ></crontab>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog
      v-model="openView"
      append-to-body
      :title="$t('tool.task.taskDetails')"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.taskNumberLabel')">{{ form.id }}</el-form-item>
            <el-form-item :label="$t('tool.task.taskNameLabelInfo')">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.taskGroupLabel')">{{ jobGroupFormat(form) }}</el-form-item>
            <el-form-item :label="$t('tool.task.createTimeLabelInfo')">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.cronExpressionInfo')">{{ form.cronExpression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.nextExecutionTime')">{{ parseTime(form.nextValidTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('tool.task.invokeTargetMethodLabelInfo')">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.taskStateLabelInfo')">
              <div v-if="form.status == 0">{{ $t("tool.task.normal") }}</div>
              <div v-else-if="form.status == 1">{{ $t("tool.task.failed") }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.concurrentLabelInfo')">
              <div v-if="form.concurrent == 0">{{ $t("tool.task.allow") }}</div>
              <div v-else-if="form.concurrent == 1">{{ $t("tool.task.forbid") }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('tool.task.executionStrategyLabelInfo')">
              <div v-if="form.misfirePolicy == 0">{{ $t("tool.task.defaultStrategy") }}</div>
              <div v-else-if="form.misfirePolicy == 1">{{ $t("tool.task.executeImmediately") }}</div>
              <div v-else-if="form.misfirePolicy == 2">{{ $t("tool.task.runOnceOption") }}</div>
              <div v-else-if="form.misfirePolicy == 3">{{ $t("tool.task.giveUpExecution") }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openView = false">{{ $t("tool.task.close") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addJob, changeJobStatus, delJob, getJob, listJob, runJob, updateJob } from "@/api/tool/job";
import Crontab from "@/components/Crontab/index.vue";
import { i18n } from "@/i18n";

export default {
  name: "Job",
  components: {
    Crontab
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
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: "",
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        jobName: null,
        jobGroup: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [{ required: true, message: i18n.global.t("tool.task.enterTaskName"), trigger: "blur" }],
        invokeTarget: [
          {
            required: true,
            message: i18n.global.t("tool.task.invokeTargetStringRequired"),
            trigger: "blur"
          }
        ],
        cronExpression: [
          {
            required: true,
            message: i18n.global.t("tool.task.cronExpressionRequired"),
            trigger: "blur"
          }
        ]
      },
      // 任务组名字典
      sysJobGroupOptions: [],
      sysJobStatusOptions: []
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_job_group").then(response => {
      this.sysJobGroupOptions = response.data;
    });
    this.getDicts("sys_job_status").then(response => {
      this.sysJobStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.sysJobGroupOptions, row.jobGroup);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        jobId: null,
        jobName: null,
        jobGroup: null,
        invokeTarget: null,
        cronExpression: null,
        misfirePolicy: 1,
        concurrent: 1,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleRun":
          this.handleRun(row);
          break;
        case "handleView":
          this.handleView(row);
          break;
        case "handleJobLog":
          this.handleJobLog(row);
          break;
        default:
          break;
      }
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === 0 ? i18n.global.t("tool.task.enable") : i18n.global.t("tool.task.disable");
      this.$confirm(`${i18n.global.t("formI18n.all.confirm")} ${text} ${row.jobName} ${i18n.global.t("tool.task.task")}?`)
        .then(() => {
          return changeJobStatus(row.id, row.status);
        })
        .then(() => {
          this.msgSuccess(`${text}${i18n.global.t("formI18n.all.success")}`);
        })
        .catch(() => {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.$confirm(`${i18n.global.t("tool.task.confirmRunOnce")} ${row.jobName} ${i18n.global.t("tool.task.task")}?`)
        .then(() => {
          return runJob(row.id, row.jobGroup);
        })
        .then(() => {
          this.msgSuccess(i18n.global.t("tool.task.runOnceSuccess"));
        })
        .catch(() => {});
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.id).then(response => {
        this.form = response.data;
        this.openView = true;
      });
    },
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.form.cronExpression;
      this.openCron = true;
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.form.cronExpression = value;
    },
    /** 任务日志列表查询 */
    handleJobLog(row) {
      const jobId = row.id || 0;
      this.$router.push(`/system/job/log/${jobId}`);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = i18n.global.t("tool.task.addTask");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.id || this.ids;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.form.status = `${response.data.status}`;
        this.open = true;
        this.title = i18n.global.t("tool.task.modifyTask");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateJob(this.form).then(response => {
              this.msgSuccess(i18n.global.t("common.updateSuccess"));
              this.open = false;
              this.getList();
            });
          } else {
            addJob(this.form).then(response => {
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
      const jobIds = row.id || this.ids;
      this.$confirm(`${i18n.global.t("tool.task.confirmDelete")} ${jobIds} ${i18n.global.t("tool.task.dataItem")}?`)
        .then(() => {
          return delJob(jobIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("tool.task.deleteSuccess"));
        })
        .catch(() => {});
    }
  }
};
</script>
