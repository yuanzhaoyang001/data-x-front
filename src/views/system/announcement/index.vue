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
        :label="$t('system.announcement.title')"
        prop="title"
      >
        <el-input
          v-model="queryParams.title"
          :placeholder="$t('system.announcement.enterTitle')"
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
          {{ $t("system.announcement.search") }}
        </el-button>
        <el-button
          icon="ele-Refresh"
          @click="resetQuery"
        >
          {{ $t("system.announcement.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:announcement:save']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleAdd"
        >
          {{ $t("system.announcement.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:announcement:update']"
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click="handleUpdate"
        >
          {{ $t("system.announcement.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:announcement:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("system.announcement.delete") }}
        </el-button>
      </el-col>
      <right-toolbar
        :show-search="showSearch"
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
        :label="$t('system.announcement.title')"
        align="center"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.announcement.publisher')"
        align="center"
        prop="sender"
      />
      <el-table-column
        :label="$t('system.announcement.priority')"
        align="center"
        prop="priorityDesc"
      />
      <el-table-column
        :label="$t('system.announcement.messageType')"
        align="center"
        prop="msgCategoryDesc"
      />
      <el-table-column
        width="155"
        :label="$t('system.announcement.notificationScope')"
        align="center"
        prop="msgTypeDesc"
      />
      <el-table-column
        :label="$t('system.announcement.publishStatus')"
        align="center"
        prop="sendStatus"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.sendStatus === '1'">{{ $t("system.announcement.unpublished") }}</el-tag>
          <el-tag
            v-else-if="scope.row.sendStatus === '2'"
            type="success"
          >
            {{ $t("system.announcement.published") }}
          </el-tag>
          <el-tag
            v-else
            type="danger"
          >
            {{ $t("system.announcement.revoked") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.announcement.publishTime')"
        align="center"
        prop="sendTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.sendTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.announcement.revokeTime')"
        align="center"
        prop="cancelTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.cancelTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.announcement.summary')"
        align="center"
        prop="msgAbstract"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.announcement.operation')"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template #default="scope">
          <el-tooltip
            :content="$t('system.announcement.update')"
            placement="top"
          >
            <el-button
              v-hasPermi="['sys:announcement:update']"
              link
              type="primary"
              icon="ele-Edit"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.announcement.delete')"
            placement="top"
          >
            <el-button
              v-hasPermi="['sys:announcement:delete']"
              link
              type="danger"
              icon="ele-Delete"
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.announcement.publish')"
            placement="top"
          >
            <el-button
              v-hasPermi="['sys:announcement:release']"
              link
              type="success"
              icon="ele-Promotion"
              @click="handleRelease(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.announcement.revoke')"
            placement="top"
          >
            <el-button
              v-hasPermi="['sys:announcement:revoke']"
              link
              type="warning"
              icon="ele-RefreshLeft"
              @click="handleRevoke(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            :content="$t('system.announcement.view')"
            placement="top"
          >
            <el-button
              v-hasPermi="['sys:announcement:revoke']"
              link
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

    <!-- 添加或修改系统通告对话框 -->
    <el-dialog
      v-if="open"
      :title="$t('system.announcement.title')"
      v-model="open"
      width="50%"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          :label="$t('system.announcement.title')"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :placeholder="$t('system.announcement.enterTitle')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.startTime')"
          prop="startTime"
        >
          <el-date-picker
            v-model="form.startTime"
            clearable
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('system.announcement.selectStartTime')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.endTime')"
          prop="endTime"
        >
          <el-date-picker
            v-model="form.endTime"
            clearable
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('system.announcement.selectEndTime')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.priority')"
          prop="priority"
        >
          <el-select
            v-model="form.priority"
            :placeholder="$t('system.announcement.selectPriority')"
          >
            <el-option
              :label="$t('system.announcement.low')"
              :value="'L'"
            />
            <el-option
              :label="$t('system.announcement.medium')"
              :value="'M'"
            />
            <el-option
              :label="$t('system.announcement.high')"
              :value="'H'"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.messageType')"
          prop="msgCategory"
        >
          <el-select
            v-model="form.msgCategory"
            :placeholder="$t('system.announcement.selectMessageType')"
          >
            <el-option
              :label="$t('system.announcement.notice')"
              :value="'1'"
            />
            <el-option
              :label="$t('system.announcement.systemMessage')"
              :value="'2'"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.notificationScope')"
          prop="msgType"
        >
          <el-select
            v-model="form.msgType"
            :placeholder="$t('system.announcement.selectNotificationScope')"
          >
            <el-option
              :label="$t('system.announcement.specifiedUsers')"
              :value="'1'"
            />
            <el-option
              :label="$t('system.announcement.allUsers')"
              :value="'2'"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.msgType == 1"
          :label="$t('system.announcement.selectUsers')"
          prop="userIdList"
        >
          <el-select
            v-model="form.userIdList"
            class="width-full"
            multiple
            :placeholder="$t('system.announcement.selectUsers')"
            @remove-tag="handleRemoveUserTag"
            @click="handleOpenUserTable"
          >
            <el-option
              v-for="item in form.userSelectList"
              :key="item.id"
              :disabled="true"
              :label="item.nickName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.summary')"
          prop="msgAbstract"
        >
          <el-input
            v-model="form.msgAbstract"
            type="textarea"
            :placeholder="$t('system.announcement.summaryPlaceholder')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.announcement.content')"
          prop="msgContent"
        >
          <tinymce
            v-model:value="form.msgContent"
            toolbar=" styleselect fontsizeselect bold italic underline strikethrough undo redo  blockquote removeformat alignleft aligncenter alignright  subscript superscript  hr bullist numlist link image charmap preview  pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen "
            :height="192"
            :placeholder="$t('system.announcement.summaryPlaceholder')"
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

    <el-dialog
      v-if="showOpen"
      :title="$t('system.announcement.notificationDetails')"
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
    <user-choose-table
      ref="userChooseTable"
      v-model:value="form.userSelectList"
      @submit="handleUserTableSubmit"
    />
  </div>
</template>

<script>
import {
  addAnnouncement,
  delAnnouncement,
  getAnnouncement,
  listAnnouncement,
  releaseAnnouncement,
  revokeAnnouncement,
  updateAnnouncement
} from "@/api/system/announcement";
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import { listUser } from "@/api/system/user";
import { getTokenUrl } from "@/utils/auth";
import Tinymce from "@/views/formgen/components/tinymce/index.vue";

export default {
  name: "Announcement",
  components: {
    Tinymce,
    UserChooseTable
  },
  data() {
    let validateEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t("system.announcement.selectEndTime")));
      } else {
        if (!this.form.startTime) {
          callback(new Error(this.$t("system.announcement.selectStartTime")));
        } else if (Date.parse(this.form.startTime) >= Date.parse(value)) {
          callback(new Error(this.$t("system.announcement.endTimeGreaterStartTime")));
        } else {
          callback();
        }
      }
    };
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
        title: null
      },
      showDetailUrl: "",
      // 表单参数
      form: {
        priority: "L",
        msgCategory: "1",
        msgType: "1",
        userIdList: [],
        userSelectList: []
      },
      // 表单校验
      rules: {
        msgCategory: [{ required: true, message: this.$t("system.announcement.messageTypeRequired"), trigger: "blur" }],
        title: [{ required: true, message: this.$t("system.announcement.titleRequired"), trigger: "blur" }],
        endTime: [
          { required: true, message: this.$t("system.announcement.endTimeRequired"), trigger: "blur" },
          { required: true, validator: validateEndTime, trigger: "blur" }
        ],
        startTime: [{ required: true, message: this.$t("system.announcement.startTimeRequired"), trigger: "blur" }],
        msgType: [
          {
            required: true,
            message: this.$t("system.announcement.notificationScopeRequired"),
            trigger: "blur"
          }
        ],
        noticeContent: [
          {
            required: true,
            message: this.$t("system.announcement.summaryPlaceholder"),
            trigger: "blur"
          }
        ],
        userIdList: [
          {
            required: true,
            message: this.$t("system.announcement.selectNotificationUsers"),
            trigger: "blur"
          }
        ]
      }
    };
  },

  created() {
    this.getList();
  },
  methods: {
    /** 查询系统通告列表 */
    getList() {
      this.loading = true;
      listAnnouncement(this.queryParams).then(response => {
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
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        msgContent: null,
        startTime: null,
        endTime: null,
        priority: "L",
        msgCategory: "1",
        msgType: "1",
        sendTime: null,
        userIds: null,
        msgAbstract: null
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
      this.title = this.$t("system.announcement.addSystemAnnouncement");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getAnnouncement(id).then(response => {
        this.form = response.data;
        listUser({ userIds: response.data.userIds }).then(res => {
          this.form.userSelectList = res.data;
          this.form.userIdList = res.data.map(item => item.id);
        });
        this.open = true;
        this.title = this.$t("system.announcement.modifySystemAnnouncement");
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.userIds = this.form.userIdList.join(",");
          if (this.form.id != null) {
            updateAnnouncement(this.form).then(response => {
              this.msgSuccess(this.$t("system.announcement.modifySuccess"));
              this.open = false;
              this.getList();
            });
          } else {
            addAnnouncement(this.form).then(response => {
              this.msgSuccess(this.$t("system.announcement.addSuccess"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        this.$t("system.announcement.confirmDelete") + '"' + ids + '"' + this.$t("system.announcement.dataItem") + "?",
        this.$t("formI18n.all.waring")
      )
        .then(function () {
          return delAnnouncement(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(this.$t("system.announcement.deleteSuccess"));
        })
        .catch(() => {});
    },
    handleUserTableSubmit(val) {
      this.form.userSelectList = val;
      this.form.userIdList = val.map(item => item.id);
    },
    handleRemoveUserTag(val) {
      this.form.userSelectList = this.form.userSelectList.filter(item => item.id !== val);
    },
    handleOpenUserTable() {
      this.$refs.userChooseTable.showDialog(this.form.userSelectList ? this.form.userSelectList : []);
    },
    handleRelease(row) {
      this.$confirm(this.$t("system.announcement.confirmRelease") + '"' + row.title + '"?', this.$t("formI18n.all.waring"), {
        confirmButtonText: this.$t("formI18n.all.confirm"),
        cancelButtonText: this.$t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return releaseAnnouncement(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(this.$t("formI18n.all.success"));
        })
        .catch(() => {});
    },
    handleView(row) {
      this.showOpen = true;
      console.log(row);
      this.showDetailUrl = getTokenUrl("/sys/announce/show/" + row.id);
    },
    handleRevoke(row) {
      this.$confirm(this.$t("system.announcement.confirmRevoke") + '"' + row.title + '"?', this.$t("formI18n.all.waring"), {
        confirmButtonText: this.$t("formI18n.all.confirm"),
        cancelButtonText: this.$t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(function () {
          return revokeAnnouncement(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(this.$t("formI18n.all.success"));
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

  //height: 88vh;
  min-height: 600px;
}
</style>
