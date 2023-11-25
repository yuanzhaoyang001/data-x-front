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
        :label="$t('system.myMsg.title')"
        prop="title"
      >
        <el-input
          v-model="queryParams.title"
          :placeholder="$t('system.myMsg.enterTitle')"
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
          {{ $t("system.myMsg.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.myMsg.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="ele-View"
          size="small"
          @click="handleAllRead"
        >
          {{ $t("system.myMsg.markAllRead") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="announcementList"
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
        :label="$t('system.myMsg.title')"
        width="400"
        align="center"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.myMsg.publisher')"
        align="center"
        prop="sender"
      />
      <el-table-column
        :label="$t('system.myMsg.priority')"
        align="center"
        prop="priorityDesc"
      />
      <el-table-column
        :label="$t('system.myMsg.messageType')"
        align="center"
        prop="msgCategoryDesc"
      />
      <el-table-column
        :label="$t('system.myMsg.publishTime')"
        align="center"
        prop="sendTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.sendTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.myMsg.readStatus')"
        align="center"
        prop="readFlag"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.readFlag"
            type="success"
          >
            {{ $t("system.myMsg.read") }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
          >
            {{ $t("system.myMsg.unread") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.myMsg.operation')"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.myMsg.view')"
            placement="top"
          >
            <el-button
              link
              type="primary"
              icon="ele-View"
              @click="handleView(scope.row)"
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

    <el-dialog
      v-if="showOpen"
      :title="$t('system.myMsg.notificationDetails')"
      v-model="showOpen"
      width="800px"
      append-to-body
    >
      <iframe
        :src="showDetailUrl"
        class="detail-iframe"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showOpen = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getMyAnnouncementSend, readAllAnnouncementSend, readAnnouncementSend } from "@/api/system/announcement";
import { getTokenUrl } from "@/utils/auth";
import mittBus from "@/utils/mitt";
import { i18n } from "@/i18n";

export default {
  name: "MyMessage",
  components: {},
  emits: ["sysMsgNotice"],
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
      total: 0,
      // 系统通告表格数据
      announcementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      showOpen: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        delFlag: false,
        title: null
      },
      showDetailUrl: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统通告列表 */
    getList() {
      this.loading = true;
      getMyAnnouncementSend(this.queryParams).then(response => {
        this.announcementList = response.data.records;
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
    handleView(row) {
      if (!row.readFlag) {
        readAnnouncementSend(row.anntId).then(() => {});
      }
      // 打开方式
      if (row.openType && row.openType === "url") {
        this.$router.push({
          path: row.openPage
        });
      } else {
        this.showOpen = true;
        this.showDetailUrl = getTokenUrl("/sys/announce/show/" + row.anntId);
      }
    },
    handleAllRead() {
      this.$confirm(i18n.global.t("system.myMsg.confirmMarkAllRead"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          readAllAnnouncementSend().then(res => {
            // Update the red dot
            mittBus.emit("sysMsgNotice", {});
          });
        })
        .then(() => {
          this.getList();
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
.detail-iframe {
  border: 0;
  width: 100%;
  min-height: 600px;
}
</style>
