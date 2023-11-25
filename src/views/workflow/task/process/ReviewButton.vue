<template>
  <div class="clearfix review-btn-warp">
    <el-button
      icon="ele-Check"
      type="success"
      @click="handleComplete"
    >
      {{ $t("formI18n.all.agree") }}
    </el-button>
    <el-button
      icon="ele-RefreshLeft"
      type="warning"
      @click="handleReturn"
      v-if="!simpleReview"
    >
      {{ $t("formI18n.all.return") }}
    </el-button>
    <el-button
      icon="ele-Close"
      type="danger"
      @click="handleReject"
    >
      {{ $t("formI18n.all.refuse") }}
    </el-button>
    <el-button
      icon="ele-Position"
      @click="transferOpen = true"
      v-if="!simpleReview"
    >
      {{ $t("formI18n.all.transfer") }}
    </el-button>
    <el-button
      icon="ele-User"
      @click="delegateOpen = true"
      v-if="!simpleReview"
    >
      {{ $t("formI18n.all.delegate") }}
    </el-button>
    <el-button
      icon="ele-DArrowLeft"
      @click="handleAddSign('BEFORE_ADD_SIGN')"
      v-if="!simpleReview"
    >
      {{ $t("formI18n.all.addSignBefore") }}
    </el-button>
    <el-button
      icon="ele-DArrowRight"
      @click="handleAddSign('AFTER_ADD_SIGN')"
      v-if="!simpleReview"
    >
      {{ $t("formI18n.all.addSignAfter") }}
    </el-button>
    <el-button
      style="float: right"
      icon="ele-Back"
      type="primary"
      @click="goBack"
      v-if="!simpleReview"
    >
      {{ $t("formI18n.all.goBack") }}
    </el-button>
    <!--退回流程-->
    <el-dialog
      :title="$t('formI18n.all.return')"
      v-model="returnOpen"
      width="50%"
      append-to-body
    >
      <el-alert
        :title="$t('workflow.flowDetail.returnTitle')"
        type="success"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-form
        ref="taskForm"
        :model="taskForm"
        label-width="90px"
      >
        <el-form-item
          :label="$t('workflow.flowDetail.returnNode')"
          prop="targetKey"
        >
          <el-radio-group v-model="taskForm.targetKey">
            <el-radio-button
              v-for="item in returnTaskList"
              :key="item.taskDefinitionKey"
              :label="item.taskDefinitionKey"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('workflow.flowDetail.returnOpinions')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.enterOpinions'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.comment"
            type="textarea"
            rows="10"
            :placeholder="$t('workflow.flowDetail.enterOpinions')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            icon="ele-Close"
            @click="returnOpen = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-re-click
            icon="ele-Check"
            type="primary"
            @click="taskReturn"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--审批正常流程-->
    <el-dialog
      :title="$t('formI18n.all.agree')"
      v-model="completeOpen"
      append-to-body
      class="review-dialog"
    >
      <el-alert
        :title="$t('workflow.flowDetail.agreeText')"
        type="success"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-form
        ref="form"
        label-width="90px"
      >
        <el-form-item
          :label="$t('workflow.flowDetail.agreeOpinions')"
          prop="comment"
        >
          <el-input
            v-model="taskForm.comment"
            :placeholder="$t('workflow.flowDetail.enterOpinions')"
            type="textarea"
            rows="10"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            icon="ele-Close"
            @click="completeOpen = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-re-click
            icon="ele-Check"
            type="primary"
            @click="taskComplete"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--驳回流程-->
    <el-dialog
      :title="$t('formI18n.all.refuse')"
      v-model="rejectOpen"
      append-to-body
      class="review-dialog"
    >
      <el-alert
        :title="$t('workflow.flowDetail.refuseTitle')"
        type="error"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-form
        ref="taskForm"
        :model="taskForm"
        label-width="90px"
      >
        <el-form-item
          :label="$t('workflow.flowDetail.refuseOpinions')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.enterOpinions'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.comment"
            type="textarea"
            :placeholder="$t('workflow.flowDetail.enterOpinions')"
            rows="10"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            icon="ele-Close"
            @click="rejectOpen = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-re-click
            icon="ele-Check"
            type="primary"
            @click="taskReject"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--转办流程-->
    <el-dialog
      :title="$t('formI18n.all.transfer')"
      v-model="transferOpen"
      width="50%"
      append-to-body
    >
      <el-alert
        :title="$t('workflow.flowDetail.transferText')"
        type="error"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-form
        ref="taskForm"
        :model="taskForm"
        label-width="90px"
      >
        <el-form-item
          :label="$t('workflow.flowDetail.transactors')"
          prop="comment"
          :rules="[{ required: true, message: '', trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.newAssignee"
            readonly
            :placeholder="$t('workflow.flowDetail.selectTransactors')"
            @click="handleOpenUserSelect()"
          />
        </el-form-item>
        <el-form-item
          :label="$t('workflow.flowDetail.transferOpinions')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.enterOpinions'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.comment"
            type="textarea"
            rows="10"
            :placeholder="$t('workflow.flowDetail.enterOpinions')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            icon="ele-Close"
            @click="transferOpen = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-re-click
            icon="ele-Check"
            type="primary"
            @click="taskTransfer"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--    委派-->
    <el-dialog
      :title="$t('formI18n.all.delegate')"
      v-model="delegateOpen"
      width="50%"
      append-to-body
    >
      <el-alert
        :title="$t('workflow.flowDetail.delegateText')"
        type="error"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-form
        ref="taskForm"
        :model="taskForm"
        label-width="90px"
      >
        <el-form-item
          :label="$t('workflow.flowDetail.delegateUser')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.selectDelegateUser'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.newAssignee"
            readonly
            :placeholder="$t('workflow.flowDetail.selectDelegateUser')"
            @click="handleOpenUserSelect()"
          />
        </el-form-item>
        <el-form-item
          :label="$t('workflow.flowDetail.delegateOpinions')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.enterDelegateOpinions'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.comment"
            type="textarea"
            rows="10"
            :placeholder="$t('workflow.flowDetail.enterOpinions')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            icon="ele-Close"
            @click="delegateOpen = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-re-click
            icon="ele-Check"
            type="primary"
            @click="taskDelegate"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--    前加签-->
    <el-dialog
      :title="$t('workflow.flowDetail.addSign')"
      v-model="addSignOpen"
      width="50%"
      append-to-body
    >
      <el-alert
        v-if="taskForm.addSignType === 'AFTER_ADD_SIGN'"
        :title="$t('workflow.flowDetail.afterSignText')"
        type="error"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-alert
        v-if="taskForm.addSignType === 'BEFORE_ADD_SIGN'"
        :title="$t('workflow.flowDetail.beforeSignText')"
        type="error"
        show-icon
        :closable="false"
        class="mb20"
      />
      <el-form
        ref="taskForm"
        :model="taskForm"
        label-width="90px"
      >
        <el-form-item
          :label="$t('workflow.flowDetail.transactors')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.selectTransactors'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.assignees"
            readonly
            :placeholder="$t('workflow.flowDetail.selectTransactors')"
            @click="handleOpenUserSelect(true)"
          />
        </el-form-item>
        <el-form-item
          :label="$t('workflow.flowDetail.addSignOpinions')"
          prop="comment"
          :rules="[{ required: true, message: $t('workflow.flowDetail.enterOpinions'), trigger: 'blur' }]"
        >
          <el-input
            v-model="taskForm.comment"
            type="textarea"
            rows="10"
            :placeholder="$t('workflow.flowDetail.enterOpinions')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            icon="ele-Close"
            @click="addSignOpen = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            v-re-click
            icon="ele-Check"
            type="primary"
            @click="taskAddSign"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--    用户单选-->
    <user-choose-table
      ref="userChooseTable"
      :multiple="false"
      @submit="
        val => {
          handleSelectUser(val, 'newAssignee');
        }
      "
    />
    <!--     多选-->
    <user-choose-table
      ref="userMulChooseTable"
      @submit="
        val => {
          handleSelectUser(val, 'assignees');
        }
      "
    />
  </div>
</template>

<script>
import UserChooseTable from "@/views/system/user/chooseTable.vue";
import { addSignTask, complete, delegateTask, rejectTask, returnList, returnTask, transferTask } from "@/api/workflow/todo";
import { closeCurrentTag } from "@/utils/other";
import { i18n } from "@/i18n";

export default {
  components: { UserChooseTable },
  props: {
    // 获取
    getFormDataId: {
      type: Function,
      default: () => {
        return Function;
      }
    },
    getFormModel: {
      type: Function,
      default: () => {
        return Function;
      }
    },
    taskInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    simpleReview: {
      type: Boolean,
      default: false
    }
  },
  emits: ["change"],
  data() {
    return {
      // 流程图
      processDiagramData: {},
      // 流程流转数据
      flowRecordList: [],
      taskForm: {
        comment: "", // 意见内容
        instanceId: "", // 流程实例编号
        deployId: "", // 流程定义编号
        taskId: "", // 流程任务编号
        procDefId: "", // 流程编号
        vars: {},
        targetKey: "",
        // 新的办理人
        newAssignee: "",
        addSignType: "",
        // 多个选择人
        assignees: ""
      },
      activeName: "form",
      assignee: null,
      // 回退列表数据
      returnTaskList: [],
      // 是否显示操作按钮
      operated: true,
      completeTitle: null,
      completeOpen: false,
      returnTitle: null,
      returnOpen: false,
      rejectOpen: false,
      transferOpen: false,
      addSignOpen: false,
      delegateOpen: null
    };
  },
  computed: {},
  watch: {
    taskInfo: {
      deep: true,
      handler(newValue, oldValue) {
        this.taskForm = { ...this.taskForm, ...this.taskInfo };
      }
    }
  },
  created() {
    this.taskForm = { ...this.taskForm, ...this.taskInfo };
  },
  methods: {
    /** 审批任务选择 */
    handleComplete() {
      this.completeOpen = true;
      //增加表单默认评论
      this.taskForm.comment = i18n.global.t("workflow.flowDetail.agreeDefaultText");
    },
    /** 审批任务 */
    taskComplete() {
      if (!this.taskForm.comment) {
        this.msgError(i18n.global.t("workflow.flowDetail.enterOpinions"));
        return;
      }
      let data = {
        ...this.taskForm,
        values: this.getFormModel(),
        formDataId: this.getFormDataId()
      };
      complete(data).then(response => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.completeOpen = false;
        this.$emit("change");
        this.goBack();
      });
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      closeCurrentTag(this.$route);
      this.$router.go(-1);
    },
    /** 驳回任务 */
    handleReject() {
      this.rejectOpen = true;
    },
    handleAddSign(type) {
      this.addSignOpen = true;
      this.taskForm.addSignType = type;
    },
    /** 驳回任务 */
    taskReject() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.taskForm.formDataId = this.getFormDataId();
          rejectTask(this.taskForm).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.rejectOpen = false;
            this.goBack();
          });
        }
      });
    },
    /** 转办 */
    taskTransfer() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.taskForm.formDataId = this.getFormDataId();
          transferTask(this.taskForm).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.goBack();
          });
        }
      });
    },
    taskDelegate() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.taskForm.formDataId = this.getFormDataId();
          delegateTask(this.taskForm).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.goBack();
          });
        }
      });
    },
    /** 可退回任务列表 */
    handleReturn() {
      this.returnOpen = true;
      returnList(this.taskForm).then(res => {
        this.returnTaskList = res.data;
        if (res.data && res.data[0]) {
          this.taskForm.targetKey = res.data[0].taskDefinitionKey;
        }
        this.taskForm.values = null;
      });
    },
    /** 提交退回任务 */
    taskReturn() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          returnTask(this.taskForm).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.goBack();
          });
        }
      });
    },
    /** 提交退回任务 */
    taskAddSign() {
      this.$refs["taskForm"].validate(valid => {
        if (valid) {
          this.taskForm.assigneeList = this.taskForm.assignees.split(",");
          addSignTask(this.taskForm).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.goBack();
          });
        }
      });
    },
    handleOpenUserSelect(mul) {
      if (mul) {
        this.$refs.userMulChooseTable.showDialog([]);
      } else {
        this.$refs.userChooseTable.showDialog([]);
      }
    },
    handleSelectUser(val, key) {
      if (val) {
        this.taskForm[key] = val.map(item => item.userName).join(",");
        this.$refs["taskForm"].validate(valid => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.review-dialog {
  width: 45%;
  margin: 0 auto;
}

@media screen and (max-width: 992px) {
  .review-dialog {
    width: 100% !important;
  }
}
</style>
