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
        :label="$t('system.noticeLog.messageTitle')"
        prop="title"
      >
        <el-input
          style="width: 250px"
          v-model="queryParams.title"
          :placeholder="$t('system.noticeLog.enterMessageTitle')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.noticeLog.receiver')"
        prop="receiver"
      >
        <el-input
          style="width: 250px"
          v-model="queryParams.receiver"
          :placeholder="$t('system.noticeLog.enterReceiver')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.noticeLog.pushStatus')"
        prop="sendStatus"
      >
        <el-select
          style="width: 250px"
          v-model="queryParams.sendStatus"
          :placeholder="$t('system.noticeLog.selectPushStatus')"
          clearable
        >
          <el-option
            :label="$t('system.noticeLog.notPushed')"
            value="NOT"
          />
          <el-option
            :label="$t('system.noticeLog.success')"
            value="SUCCESS"
          />
          <el-option
            :label="$t('system.noticeLog.failure')"
            value="FAIL"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="ele-Search"
          @click="handleQuery"
        >
          {{ $t("system.noticeLog.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.noticeLog.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          :label="$t('system.noticeLog.delete')"
          v-hasPermi="['sys:msg:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("system.noticeLog.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="msgList"
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
        :label="$t('system.noticeLog.messageTitle')"
        width="200"
        align="center"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.noticeLog.sendMethod')"
        width="110"
        align="center"
        prop="typeDesc"
      />
      <el-table-column
        :label="$t('system.noticeLog.receiver')"
        width="200"
        align="center"
        prop="receiver"
      />
      <el-table-column
        :label="$t('system.noticeLog.parameters')"
        align="center"
      >
        <template #default="scope">
          <el-link
            type="primary"
            @click="handleDesc(scope.row.msgParams)"
          >
            {{ $t("system.noticeLog.details") }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.noticeLog.pushContent')"
        align="center"
        prop="content"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-link
            type="primary"
            @click="handleDesc(scope.row.content)"
          >
            {{ $t("system.noticeLog.details") }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.noticeLog.pushTime')"
        align="center"
        prop="sendTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.sendTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.noticeLog.pushStatus')"
        align="center"
        prop="sendStatusDesc"
      />
      <el-table-column
        :label="$t('system.noticeLog.sendCount')"
        align="center"
        prop="sendNum"
      />
      <el-table-column
        width="120"
        :label="$t('system.noticeLog.pushFailureReason')"
        align="center"
        prop="result"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.noticeLog.remark')"
        align="center"
        prop="remark"
      />
      <el-table-column
        :label="$t('system.noticeLog.operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.noticeLog.delete')"
            placement="top"
          >
            <el-button
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['sys:msg:delete']"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      append-to-body
      :title="$t('system.noticeLog.details')"
      v-model="dialogVisible"
      width="40%"
    >
      <span>{{ dialogDesc }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>

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
import { delMessage, listMessage } from "@/api/system/message";
import { i18n } from "@/i18n";

export default {
  name: "Msg",
  data() {
    return {
      //参数详情
      dialogDesc: "",
      //参数详情遮罩
      dialogVisible: false,
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
      total: 0,
      // msg表格数据
      msgList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        title: null,
        type: null,
        receiver: null,
        sendTime: null,
        sendStatus: null,
        params: {
          orderByColumn: "createTime",
          isAsc: false
        }
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询msg列表 */
    getList() {
      this.loading = true;
      listMessage(this.queryParams).then(response => {
        this.msgList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        i18n.global.t("system.noticeLog.confirmDelete") + ids + i18n.global.t("system.noticeLog.dataItem"),
        i18n.global.t("formI18n.all.waring")
      )
        .then(function () {
          return delMessage(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    },
    /* 详情弹窗*/
    handleDesc(desc) {
      this.dialogVisible = true;
      this.dialogDesc = desc;
    }
  }
};
</script>
