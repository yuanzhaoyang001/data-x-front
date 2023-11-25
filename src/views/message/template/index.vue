<template>
  <div class="app-container">
    <el-alert
      :title="$t('system.noticeTemplate.tip')"
      type="warning"
    />
    <el-form
      v-show="showSearch"
      ref="queryForm"
      class="mt10"
      :model="queryParams"
      :inline="true"
      label-width="118px"
    >
      <el-form-item
        :label="$t('system.noticeTemplate.templateTitle')"
        prop="templateName"
      >
        <el-input
          v-model="queryParams.templateName"
          :placeholder="$t('system.noticeTemplate.enterTemplateTitle')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="Code"
        prop="templateCode"
      >
        <el-input
          v-model="queryParams.templateCode"
          :placeholder="$t('system.noticeTemplate.enterTemplateCode')"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        :label="$t('system.noticeTemplate.templateType')"
        prop="templateType"
      >
        <el-select
          v-model="queryParams.templateType"
          :placeholder="$t('system.noticeTemplate.chooseTemplateType')"
          clearable
        >
          <el-option
            :label="$t('system.noticeTemplate.sms')"
            value="SMS"
          />
          <el-option
            :label="$t('system.noticeTemplate.email')"
            value="EMAIL"
          />
          <el-option
            :label="$t('system.noticeTemplate.wechat')"
            value="WX_MP"
          />
          <el-option
            :label="$t('system.noticeTemplate.inbox')"
            value="INTERNAL"
          />
        </el-select>
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

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:save']"
          type="primary"
          plain
          icon="ele-Plus"
          @click="handleAdd"
        >
          {{ $t("formI18n.all.add") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:update']"
          type="success"
          plain
          icon="ele-Edit"
          :disabled="single"
          @click="handleUpdate"
        >
          {{ $t("formI18n.all.modify") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:delete']"
          type="danger"
          plain
          icon="ele-Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          {{ $t("formI18n.all.delete") }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['sys:msgtemplate:save']"
          icon="ele-Refresh"
          plain
          type="primary"
          @click="handleSyncWxMpTemplate"
        >
          {{ $t("system.noticeTemplate.syncWeChatTemplate") }}
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="msgTemplateList"
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
        :label="$t('system.noticeTemplate.templateTitle')"
        align="center"
        prop="templateName"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateCode')"
        align="center"
        prop="templateCode"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateType')"
        width="100"
        align="center"
        prop="templateTypeDesc"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.templateContent')"
        width="100"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleDesc(scope.row.templateContent)"
          >
            {{ $t("system.noticeTemplate.details") }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.noticeTemplate.thirdPartyTemplateId')"
        width="400"
        align="center"
        prop="thirdTemplateId"
      />
      <el-table-column
        :label="$t('system.noticeTemplate.action')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="success"
            icon="ele-Position"
            @click="handleOpenSend(scope.row)"
          ></el-button>

          <el-button
            link
            type="primary"
            icon="ele-Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:msgtemplate:update']"
          ></el-button>
          <el-button
            link
            type="danger"
            icon="ele-Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:msgtemplate:delete']"
          ></el-button>
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

    <!-- 添加或修改message对话框 -->
    <el-dialog
      v-if="open"
      :title="title"
      v-model="open"
      width="800px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          :label="$t('system.noticeTemplate.templateTitle')"
          prop="templateName"
        >
          <el-input
            v-model="form.templateName"
            :placeholder="$t('system.noticeTemplate.enterTemplateTitle')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateCode')"
          prop="templateCode"
        >
          <el-input
            v-model="form.templateCode"
            :placeholder="$t('system.noticeTemplate.enterTemplateCode')"
          >
            <template #append>
              <el-button @click="handleRandCode">{{ $t("system.noticeTemplate.generateRandom") }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateType')"
          prop="templateType"
        >
          <el-select
            v-model="queryParams.templateType"
            :placeholder="$t('system.noticeTemplate.chooseTemplateType')"
            clearable
          >
            <el-option
              :label="$t('system.noticeTemplate.sms')"
              value="SMS"
            />
            <el-option
              :label="$t('system.noticeTemplate.email')"
              value="EMAIL"
            />
            <el-option
              :label="$t('system.noticeTemplate.wechat')"
              value="WX_MP"
            />
            <el-option
              :label="$t('system.noticeTemplate.inbox')"
              value="INTERNAL"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="['1', '3'].includes(form.templateType)"
          :label="$t('system.noticeTemplate.thirdPartyTemplateId')"
          prop="thirdTemplateId"
        >
          <el-input
            v-model="form.thirdTemplateId"
            :placeholder="$t('system.noticeTemplate.enterThirdPartyTemplateId')"
          />
          <p class="tips-text">{{ $t("system.noticeTemplate.wechatTemplateIdNote") }}</p>
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateContent')"
          prop="templateContent"
        >
          <div>
            <div v-if="form.templateType != 3">
              <el-button
                size="small"
                type="primary"
                @click="handleInsertVariable"
              >
                {{ $t("system.noticeTemplate.insertVariables") }}
              </el-button>
              <form-tinymce
                style="width: 600px; margin-top: 5px"
                ref="tinymce"
                v-model:value="form.templateContent"
                :toolbar="getToolbar"
                :key="form.templateType"
                @input="
                  val => {
                    val = form.templateContent = val;
                  }
                "
              />
            </div>
            <div
              v-else
              class="mt10"
            >
              {{ form.templateContent }}
            </div>
          </div>
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
          <el-button @click="cancel">
            {{ $t("formI18n.all.cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--发送测试-->
    <el-dialog
      v-if="sendOpen"
      :title="$t('system.noticeTemplate.sendMessage')"
      v-model="sendOpen"
      width="800px"
      append-to-body
    >
      <el-form
        ref="sendForm"
        :model="sendForm"
        label-width="130px"
      >
        <el-form-item
          :label="$t('system.noticeTemplate.receiver')"
          prop="receiver"
          :rules="[{ required: true, message: $t('system.noticeTemplate.enterReceiver'), trigger: 'blur' }]"
        >
          <el-input
            v-model="sendForm.receiver"
            :placeholder="$t('system.noticeTemplate.enterReceiver')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.templateCode')"
          prop="templateCode"
          :rules="[{ required: true, message: $t('system.noticeTemplate.enterTemplateCode'), trigger: 'blur' }]"
        >
          <el-input
            v-model="sendForm.templateCode"
            :placeholder="$t('system.noticeTemplate.enterTemplateCode')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.messageType')"
          prop="msgType"
          :rules="[{ required: true, message: $t('system.noticeTemplate.selectTemplateType'), trigger: 'blur' }]"
        >
          <el-select
            v-model="queryParams.templateType"
            :placeholder="$t('system.noticeTemplate.chooseTemplateType')"
            clearable
          >
            <el-option
              :label="$t('system.noticeTemplate.sms')"
              value="SMS"
            />
            <el-option
              :label="$t('system.noticeTemplate.email')"
              value="EMAIL"
            />
            <el-option
              :label="$t('system.noticeTemplate.wechat')"
              value="WX_MP"
            />
            <el-option
              :label="$t('system.noticeTemplate.inbox')"
              value="INTERNAL"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('system.noticeTemplate.params')"
          prop="testData"
        >
          <el-input
            rows="8"
            v-model="sendForm.testData"
            type="textarea"
            :placeholder="$t('system.noticeTemplate.templateParams')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="handleSendMsg"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="sendOpen = false">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      append-to-body
      :title="$t('system.noticeTemplate.details')"
      v-model="dialogVisible"
      width="40%"
    >
      <span>{{ dialogContent }}</span>
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
  </div>
</template>

<script>
import {
  addMsgTemplate,
  delMsgTemplate,
  getMsgTemplate,
  pageMsgTemplate,
  sendTemplateMsg,
  syncWxTemplateMsg,
  updateMsgTemplate
} from "@/api/system/msgtemplate";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { customAlphabet } from "nanoid";
import { i18n } from "@/i18n";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

export default {
  name: "MsgTemplate",
  components: { FormTinymce },
  data() {
    return {
      //详情内容
      dialogContent: "",
      //详情弹窗
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
      // message表格数据
      msgTemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      sendOpen: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        templateName: null,
        templateCode: null,
        templateType: null,
        templateContent: null
      },
      // 表单参数
      form: {},
      sendForm: {},
      // 表单校验
      rules: {
        templateName: [
          {
            required: true,
            message: i18n.global.t("system.noticeTemplate.templateName"),
            trigger: "blur"
          }
        ],
        templateCode: [
          {
            required: true,
            message: i18n.global.t("system.noticeTemplate.templateCodeRequired"),
            trigger: "blur"
          }
        ],
        templateType: [
          { required: true, message: i18n.global.t("system.noticeTemplate.templateTypeRequired"), trigger: "change" }
        ],
        templateContent: [
          { required: true, message: i18n.global.t("system.noticeTemplate.templateContentRequired"), trigger: "blur" }
        ],
        thirdTemplateId: [
          {
            required: true,
            message: i18n.global.t("system.noticeTemplate.inputRequired"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    getToolbar() {
      if (this.form.templateType == 2) {
        return " styleselect fontsizeselect bold italic underline strikethrough undo redo  removeformat alignleft aligncenter alignright  subscript superscript  hr  charmap    forecolor backcolor   ";
      }
      return "  ";
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询message列表 */
    getList() {
      this.loading = true;
      pageMsgTemplate(this.queryParams).then(response => {
        this.msgTemplateList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    handleInsertVariable() {
      // 随机id
      this.$refs.tinymce.editor.insertContent("${" + nanoid() + "}");
      this.$refs.tinymce.editor.blur();
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
        templateName: null,
        templateCode: null,
        templateType: null,
        templateContent: null,
        thirdTemplateId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
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
      this.title = i18n.global.t("system.noticeTemplate.addTemplate");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMsgTemplate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = i18n.global.t("system.noticeTemplate.modifyTemplate");
      });
    },
    /** 修改按钮操作 */
    handleOpenSend(row) {
      this.sendOpen = true;
      this.sendForm.templateCode = row.templateCode;
      this.sendForm.msgType = row.templateType;
    },
    handleSendMsg() {
      this.$refs["sendForm"].validate(valid => {
        if (valid) {
          sendTemplateMsg(this.sendForm).then(response => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.sendOpen = false;
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMsgTemplate(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.open = false;
              this.getList();
            });
          } else {
            addMsgTemplate(this.form).then(response => {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
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
      this.$confirm(i18n.global.t("system.noticeTemplate.isDelete"), i18n.global.t("formI18n.all.waring"))
        .then(function () {
          return delMsgTemplate(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
        })
        .catch(() => {});
    },
    /* 详情弹窗*/
    handleDesc(content) {
      this.dialogVisible = true;
      this.dialogContent = content;
    },
    handleRandCode() {
      this.form.templateCode = nanoid();
    },
    handleSyncWxMpTemplate() {
      this.$confirm(i18n.global.t("system.noticeTemplate.syncWxMpTemplate"), i18n.global.t("formI18n.all.waring"))
        .then(function () {
          return syncWxTemplateMsg({});
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

<style>
.tips-text {
  color: #909399;
  font-size: 12px;
}
</style>
