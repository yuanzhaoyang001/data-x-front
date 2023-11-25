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

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:process:start']"
          icon="ele-Plus"
          plain
          type="primary"
          @click="handleAdd"
        >
          {{ $t("workflow.myWkf.startWkf") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['workflow:process:delete']"
          :disabled="multiple"
          icon="ele-Delete"
          plain
          type="danger"
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
      :data="myProcessList"
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
        :label="$t('workflow.myWkf.taskVersion')"
        width="100"
      >
        <template #default="scope">
          <el-tag>v{{ scope.row.procDefVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('workflow.wfTodo.time')"
        prop="createTime"
        width="180"
      />
      <el-table-column
        align="center"
        :label="$t('workflow.myWkf.status')"
        width="100"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.status == 1">进行中</el-tag>
          <el-tag
            v-if="scope.row.status == 2"
            type="success"
          >
            已完成
          </el-tag>
          <el-tag
            v-if="scope.row.status == 3 || scope.row.status == 4"
            type="danger"
          >
            {{ scope.row.statusDesc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('workflow.myWkf.useingTime')"
        prop="duration"
        width="180"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        :label="$t('workflow.wfTodo.taskNumber')"
        prop="procInsId"
      />
      <!--      <el-table-column align="center" label="当前节点" prop="taskName"/>-->
      <!--      <el-table-column align="center" label="办理">-->
      <!--        <template slot-scope="scope">-->
      <!--          <label v-if="scope.row.assigneeName">{{ scope.row.assigneeName }}-->
      <!--            <el-tag type="info">{{ scope.row.deptName }}</el-tag>-->
      <!--          </label>-->
      <!--          <label v-if="scope.row.candidate">{{ scope.row.candidate }}</label>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
            {{ $t("formI18n.all.view") }}
          </el-button>
          <el-button
            v-hasPermi="['workflow:process:cancel']"
            v-if="scope.row.status === 1"
            link
            type="danger"
            @click="handleStop(scope.row)"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-hasPermi="['workflow:process:delete']"
            link
            type="primary"
            @click="handleDelete(scope.row)"
          >
            {{ $t("formI18n.all.delete") }}
          </el-button>
          <!--          <el-dropdown>-->
          <!--            <span class="el-dropdown-link">-->
          <!--              更多操作<i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
          <!--            </span>-->
          <!--            <el-dropdown-menu slot="dropdown">-->

          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
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

    <!-- 发起流程 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      width="60%"
    >
      <el-form
        v-show="showSearch"
        ref="startFlowForm"
        :inline="true"
        :model="processQueryParams"
        label-width="68px"
      >
        <el-form-item
          label-width="110px"
          :label="$t('workflow.wfTodo.inputName')"
          prop="name"
        >
          <el-input
            v-model="processQueryParams.name"
            clearable
            style="width: 230px"
            :placeholder="$t('workflow.wfTodo.inputNameText')"
            @keyup.enter="queryListDefinition"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="ele-Search"
            type="primary"
            @click="queryListDefinition"
          >
            {{ $t("formI18n.all.search") }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="processLoading"
        :data="definitionList"
        border
        fit
      >
        <el-table-column
          align="center"
          :label="$t('workflow.wfTodo.inputName')"
          prop="name"
        />
        <el-table-column
          align="center"
          :label="$t('workflow.myWkf.taskVersion')"
        >
          <template #default="scope">
            <el-tag>v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" label="流程分类" prop="category" />-->
        <el-table-column
          align="center"
          class-name="small-padding fixed-width"
          :label="$t('workflow.wfTodo.operate')"
          width="300"
        >
          <template #default="scope">
            <el-button
              icon="ele-Notification"
              link
              type="primary"
              @click="handleOpenVersion(scope.row)"
            >
              {{ $t("workflow.myWkf.taskVersion") }}
            </el-button>
            <el-button
              icon="ele-Promotion"
              link
              type="primary"
              @click="handleStartProcess(scope.row)"
            >
              {{ $t("workflow.myWkf.startWkf") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processTotal > 0"
        v-model:limit="processQueryParams.size"
        v-model:page="processQueryParams.current"
        :total="processTotal"
        @pagination="queryListDefinition"
      />
    </el-dialog>
    <!--流程版本-->
    <el-dialog
      :title="$t('workflow.myWkf.taskVersion')"
      v-model="versionOpen"
      append-to-body
      width="60%"
    >
      <el-table
        :data="versionDefinitionList"
        border
        fit
      >
        <el-table-column
          align="center"
          :label="$t('workflow.wfTodo.inputName')"
          prop="name"
        />
        <el-table-column
          align="center"
          :label="$t('workflow.myWkf.taskVersion')"
        >
          <template #default="scope">
            <el-tag>v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" label="流程分类" prop="category" />-->
        <el-table-column
          align="center"
          class-name="small-padding fixed-width"
          :label="$t('workflow.wfTodo.operate')"
          width="300"
        >
          <template #default="scope">
            <el-button
              icon="ele-Promotion"
              link
              type="primary"
              @click="handleStartProcess(scope.row)"
            >
              {{ $t("workflow.myWkf.startWkf") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processVersionTotal > 0"
        v-model:limit="versionQueryParams.size"
        v-model:page="versionQueryParams.current"
        :total="processVersionTotal"
        @pagination="queryVersionList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listDefinition, listVersionDefinition } from "@/api/workflow/definition";
import { cancelProcess, deleteProcess, listMyProcess } from "@/api/workflow/process";
import { i18n } from "@/i18n";

export default {
  name: "Deploy",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      processLoading: true,
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
      processTotal: 0,
      processVersionTotal: 0,
      // 我发起的流程列表数据
      myProcessList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      versionOpen: false,
      definitionList: [],
      versionDefinitionList: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        instanceName: null,
        beginDate: null,
        endDate: null
      },
      processQueryParams: {
        current: 1,
        size: 10,
        name: null
      },
      versionQueryParams: {
        current: 1,
        size: 10,
        key: ""
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
      listMyProcess(this.queryParams).then(response => {
        this.myProcessList = response.data.records;
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
      this.ids = selection.map(item => item.procInsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = i18n.global.t("workflow.myWkf.startWkf");
      this.queryListDefinition();
    },
    queryListDefinition() {
      listDefinition(this.processQueryParams).then(response => {
        this.definitionList = response.data.records;
        this.processTotal = response.data.total;
        this.processLoading = false;
      });
    },
    /**  发起流程申请 */
    handleStartProcess(row) {
      this.$router.push({
        path: "/workflow/task/record/start",
        query: {
          deployId: row.deploymentId,
          procDefId: row.id,
          finished: true
        }
      });
    },
    handleOpenVersion(row) {
      this.versionOpen = true;
      this.versionQueryParams.key = row.key;
      this.queryVersionList();
    },
    queryVersionList() {
      listVersionDefinition(this.versionQueryParams).then(response => {
        this.versionDefinitionList = response.data.records;
        this.processVersionTotal = response.data.total;
      });
    },
    /**  取消流程申请 */
    handleStop(row) {
      const params = {
        instanceId: row.procInsId,
        formDataId: row.formDataId
      };
      this.$confirm(i18n.global.t("workflow.myWkf.confirmStop"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return cancelProcess(params);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        });
    },
    /** 流程流转记录 */
    handleFlowRecord(row) {
      this.$router.push({
        path: "/workflow/task/record/handle",
        query: {
          procInsId: row.procInsId,
          deployId: row.deployId,
          taskId: row.taskId,
          operated: false
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.procInsId || this.ids;
      const name = row.procDefName || "选中";
      this.$confirm(i18n.global.t("workflow.myWkf.confirmDelete"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return deleteProcess(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.fail"));
        });
    }
  }
};
</script>
