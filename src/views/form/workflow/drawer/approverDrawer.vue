<template>
  <el-drawer
    :append-to-body="true"
    :before-close="saveApprover"
    :wrapper-closable="false"
    v-model="approverDrawer"
    class="set_promoter"
    direction="rtl"
    size="550px"
    :title="$t('workflow.flowDesign.approverSettings')"
  >
    <div class="demo-drawer__content">
      <div class="drawer_content">
        <div class="approver_content">
          <el-tabs
            v-model="activeName"
            type="card"
          >
            <el-tab-pane
              :label="$t('workflow.flowDesign.baseSetting')"
              name="base"
            >
              <div class="medium-font-size text-primary-color mb10">{{ $t("workflow.flowDesign.approverSettings") }}</div>
              <el-radio-group
                v-model="approverConfig.settype"
                style="display: block"
              >
                <el-radio :label="1">{{ $t("workflow.flowDesign.specifyApprovers") }}</el-radio>
                <el-radio :label="2">{{ $t("workflow.flowDesign.departmentManager") }}</el-radio>
                <el-radio :label="3">{{ $t("workflow.flowDesign.initiatorHimself") }}</el-radio>
                <el-radio :label="4">{{ $t("workflow.flowDesign.memberFieldInForm") }}</el-radio>
              </el-radio-group>
              <div v-if="approverConfig.settype === 1">
                <div>
                  <el-button
                    icon="ele-Plus"
                    style="display: block"
                    @click="addApprover"
                  >
                    {{ $t("workflow.flowDesign.addModifyMembers") }}
                  </el-button>
                  <p class="selected_list">
                    <span
                      v-for="(item, index) in approverConfig.nodeUserList"
                      :key="index"
                    >
                      {{ item.nickName }}
                      <el-icon @click="approverConfig.nodeUserList.splice(index, 1)"><ele-Close /></el-icon>
                    </span>
                    <a
                      v-if="approverConfig.nodeUserList && approverConfig.nodeUserList.length != 0"
                      @click="approverConfig.nodeUserList = []"
                    >
                      {{ $t("workflow.flowDesign.clear") }}
                    </a>
                  </p>
                </div>
                <div>
                  <el-button
                    icon="ele-Plus"
                    style="display: block"
                    @click="addRoleApprover"
                  >
                    {{ $t("workflow.flowDesign.addModifyRoles") }}
                  </el-button>
                  <p class="selected_list">
                    <span
                      v-for="(item, index) in approverConfig.nodeRoleList"
                      :key="index"
                    >
                      {{ item.roleName }}
                      <el-icon @click="approverConfig.nodeRoleList.splice(index, 1)"><ele-Close /></el-icon>
                    </span>
                    <a
                      v-if="approverConfig.nodeRoleList && approverConfig.nodeRoleList.length != 0"
                      @click="approverConfig.nodeRoleList = []"
                    >
                      {{ $t("workflow.flowDesign.clear") }}
                    </a>
                  </p>
                </div>
                <div>
                  <el-button
                    icon="ele-Plus"
                    style="display: block"
                    @click="addPostApprover"
                  >
                    {{ $t("workflow.flowDesign.addModifyPositions") }}
                  </el-button>
                  <p class="selected_list">
                    <span
                      v-for="(item, index) in approverConfig.nodePostList"
                      :key="index"
                    >
                      {{ item.postName }}
                      <el-icon @click="approverConfig.nodePostList.splice(index, 1)"><ele-Close /></el-icon>
                    </span>
                    <a
                      v-if="approverConfig.nodePostList && approverConfig.nodePostList.length != 0"
                      @click="approverConfig.nodePostList = []"
                    >
                      {{ $t("workflow.flowDesign.clear") }}
                    </a>
                  </p>
                </div>
                <!--              </div>-->
              </div>
              <div v-if="approverConfig.settype === 2">
                <span>{{ $t("workflow.flowDesign.sponsoring") }} ：</span>
                <el-select
                  v-model="approverConfig.approveDirectorLevel"
                  :placeholder="$t('workflow.flowDesign.choose')"
                  @change="
                    val => {
                      $forceUpdate();
                    }
                  "
                >
                  <el-option
                    :label="$t('workflow.flowDesign.level1Manager')"
                    value="1"
                  />
                  <el-option
                    :label="$t('workflow.flowDesign.level2Manager')"
                    value="2"
                  />
                  <el-option
                    :label="$t('workflow.flowDesign.level3Manager')"
                    value="3"
                  />
                  <el-option
                    :label="$t('workflow.flowDesign.level4Manager')"
                    value="4"
                  />
                  <el-option
                    :label="$t('workflow.flowDesign.level5Manager')"
                    value="5"
                  />
                  <el-option
                    :label="$t('workflow.flowDesign.level6Manager')"
                    value="6"
                  />
                </el-select>
              </div>
              <div
                v-if="approverConfig.settype === 3"
                class="text-secondary-color"
              >
                {{ $t("workflow.flowDesign.initiatorHimselfApprover") }}
              </div>
              <div
                v-if="approverConfig.settype === 4"
                class="text-secondary-color"
              >
                <div class="base-font-size text-primary-color mb10">
                  {{ $t("workflow.flowDesign.selectMemberFieldInForm") }} ：
                  <el-select
                    v-model="approverConfig.formUserFields"
                    :placeholder="$t('workflow.flowDesign.chooseLabel')"
                    @change="
                      val => {
                        $forceUpdate();
                      }
                    "
                  >
                    <el-option
                      v-for="item in getUserFieldList()"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </div>
              </div>
              <div v-if="approverConfig.settype !== 3">
                <div class="text-primary-color medium-font-size mb20">
                  {{ $t("workflow.flowDesign.multipleApprovalMethod") }}
                </div>
                <el-radio-group
                  class="block-radio-group"
                  v-model="approverConfig.multipleApprovalType"
                >
                  <el-radio
                    label="1"
                    v-if="approverConfig.settype !== 2"
                  >
                    {{ $t("workflow.flowDesign.countersignature") }}
                  </el-radio>
                  <el-radio label="2">{{ $t("workflow.flowDesign.discretionary") }}</el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('workflow.flowDesign.formPermissions')"
              name="field"
            >
              <el-table
                :data="approverConfig.formProperties"
                style="width: 100%"
              >
                <el-table-column
                  :label="$t('workflow.flowDesign.fieldName')"
                  prop="name"
                />
                <el-table-column
                  :label="$t('workflow.flowDesign.opration')"
                  prop="id"
                >
                  <template #default="scope">
                    <el-checkbox v-model="scope.row['readable']">{{ $t("workflow.flowDesign.visible") }}</el-checkbox>
                    <el-checkbox v-model="scope.row['writeable']">{{ $t("workflow.flowDesign.editable") }}</el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('workflow.flowDesign.taskEvents')"
              name="event"
            >
              <el-alert
                :title="$t('workflow.flowDesign.postPushTargetInterface')"
                :closable="false"
                type="warning"
              />
              <el-form
                label-position="top"
                label-width="80px"
                :model="approverConfig.taskEvents"
              >
                <el-form-item :label="$t('workflow.flowDesign.customizeApprovalEvent')">
                  <el-switch v-model="approverConfig.taskEvents.agree" />
                </el-form-item>
                <el-form-item
                  v-if="approverConfig.taskEvents.agree"
                  :label="$t('workflow.flowDesign.approvalRequestURL')"
                >
                  <template #label>
                    <span>
                      {{ $t("workflow.flowDesign.approvalRequestURL") }}
                      <el-tooltip
                        :content="$t('workflow.flowDesign.contentText')"
                        placement="top"
                      >
                        <el-icon><ele-QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input
                    v-model="approverConfig.taskEvents.agreeNotifyUrl"
                    :placeholder="$t('workflow.flowDesign.contentText2')"
                  >
                    <template #prepend>POST</template>
                  </el-input>
                </el-form-item>
                <el-form-item :placeholder="$t('workflow.flowDesign.approvalRequestURL')">
                  <el-switch v-model="approverConfig.taskEvents.reject" />
                </el-form-item>
                <el-form-item
                  v-if="approverConfig.taskEvents.reject"
                  :placeholder="$t('workflow.flowDesign.rejectRequestURL')"
                >
                  <template #label>
                    <span>
                      {{ $t("workflow.flowDesign.rejectRequestURL") }}
                      <el-tooltip
                        :content="$t('workflow.flowDesign.contentText')"
                        placement="top"
                      >
                        <el-icon><ele-QuestionFilled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input
                    v-model="approverConfig.taskEvents.rejectNotifyUrl"
                    :placeholder="$t('workflow.flowDesign.contentText2')"
                  >
                    <template #prepend>POST</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="demo-drawer__footer clear">
          <el-button
            type="primary"
            @click="saveApprover"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button @click="closeDrawer">{{ $t("formI18n.all.cancel") }}</el-button>
        </div>
        <employees-dialog
          v-model:data="checkedList"
          v-model:visible="approverVisible"
          @change="sureApprover"
        />
        <role-dialog
          v-model:data="checkedRoleList"
          v-model:visible="approverRoleVisible"
          @change="sureRoleApprover"
        />
        <post-dialog
          v-model:data="checkedPostList"
          v-model:visible="approverPostVisible"
          @change="surePostApprover"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import employeesDialog from "../dialog/employeesDialog.vue";
import roleDialog from "../dialog/roleDialog.vue";
import postDialog from "../dialog/postDialog.vue";
import func from "../preload";
import { cloneDeep } from "lodash-es";
import { listProjectItemRequest } from "@/api/project/form";
import { mapActions, mapState, mapStores } from "pinia";
import { useFormWorkflow } from "@/stores/formWorkflow";

export default {
  name: "ApproverDrawer",
  components: {
    employeesDialog,
    roleDialog,
    postDialog
  },
  props: ["formKey"],
  data() {
    return {
      activeName: "base",
      func: func,
      formProperties: [],
      // 审核配置字段
      approverConfig: {
        settype: 1,
        // 多人审批方式 会签（需所有人审批通过） 或签（一名审批人同意即可）
        multipleApprovalType: "2",
        nodeUserList: [],
        nodeRoleList: [],
        nodePostList: [],
        taskEvents: {
          agree: false,
          agreeNotifyUrl: "",
          reject: false,
          rejectNotifyUrl: ""
        },
        // 主管审核等级
        approveDirectorLevel: null,
        formUserFields: null
      },
      approverVisible: false,
      approverRoleVisible: false,
      approverPostVisible: false,
      checkedRoleList: [],
      checkedPostList: [],
      checkedList: []
    };
  },
  computed: {
    ...mapStores(useFormWorkflow),
    ...mapState(useFormWorkflow, ["approverDrawer"]),
    approverConfig1() {
      return this.formWorkflowStore.approverConfig.value;
    }
  },
  watch: {
    approverConfig1(val) {
      console.log(val);
      this.initApproverConfig();
    }
  },
  created() {
    listProjectItemRequest({ key: this.formKey, displayType: false }).then(res => {
      if (res.data) {
        this.formProperties = res.data.map(item => {
          return {
            id: item.formItemId,
            name: item.textLabel,
            readable: true,
            writeable: false
          };
        });
        this.initApproverConfig();
      }
    });
  },
  methods: {
    initApproverConfig() {
      const val = this.approverConfig1;
      if (val && !val.formProperties) {
        val.formProperties = cloneDeep(this.formProperties);
      } else {
        const tempFormProperties = cloneDeep(val.formProperties);
        val.formProperties = [];
        for (let i = 0; i < this.formProperties.length; i++) {
          let prop = this.formProperties[i];
          // 找到该项 把状态同步上来
          let item = tempFormProperties.find(item => item.id === prop.id);
          if (item) {
            val.formProperties.push(cloneDeep(item));
          } else {
            val.formProperties.push({
              ...cloneDeep(prop),
              readable: false,
              writeable: false
            });
          }
        }
      }
      this.approverConfig = cloneDeep(val);
    },
    ...mapActions(useFormWorkflow, ["updateApprover", "updateApproverConfig"]),
    addApprover() {
      this.approverVisible = true;
      this.checkedList = this.approverConfig.nodeUserList;
    },
    addRoleApprover() {
      this.approverRoleVisible = true;
      this.checkedRoleList = this.approverConfig.nodeRoleList;
    },
    addPostApprover() {
      this.approverPostVisible = true;
      this.checkedPostList = this.approverConfig.nodePostList;
    },
    sureApprover(data) {
      this.approverConfig.nodeUserList = data;
      this.approverVisible = false;
    },
    sureRoleApprover(data) {
      this.approverConfig.nodeRoleList = data;
      this.approverRoleVisible = false;
    },
    surePostApprover(data) {
      this.approverConfig.nodePostList = data;
      this.approverPostVisible = false;
    },
    saveApprover() {
      this.updateApproverConfig({
        value: this.approverConfig,
        flag: true,
        id: this.formWorkflowStore.approverConfig.id
      });
      // this.$emit("update:processNode", this.approverConfig);
      this.closeDrawer();
    },
    closeDrawer() {
      this.updateApprover();
    },
    // 获取成员字段
    getUserFieldList() {
      return this.formProperties.filter(item => item.id.indexOf("user_select") > -1);
    }
  },
  emits: ["update:processNode"]
};
</script>

<style lang="scss">
@import "../dialog/dialog.css";

.set_promoter {
  .approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
    height: 90%;
  }

  .approver_self_select .el-button,
  .approver_content .el-button {
    margin-bottom: 20px;
  }

  .approver_content .el-radio,
  .approver_some .el-radio,
  .approver_self_select .el-radio {
    width: 27%;
    margin-bottom: 20px;
  }

  .approver_manager p {
    line-height: 32px;
  }

  .approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  .approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 12px;
    line-height: 16px;
    color: #f8642d;
  }

  .approver_self {
    padding: 28px 20px;
  }

  .approver_self_select,
  .approver_manager,
  .approver_content,
  .approver_some {
    padding: 20px 20px 0;
  }

  .approver_manager p:first-of-type,
  .approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
  }

  .approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
  }
}
</style>
