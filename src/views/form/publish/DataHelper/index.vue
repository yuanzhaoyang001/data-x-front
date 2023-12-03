<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.dataHelper.title") }}</span>
        <span class="desc-text ml10">{{ $t("form.dataHelper.autoManageData") }}</span>
      </div>
    </template>
    <div class="p10">
      <el-tabs type="card">
        <el-tab-pane :label="$t('form.dataHelper.smartReminders')">
          <el-button
            class="mt15"
            size="default"
            type="primary"
            @click="handleAddReminder"
          >
            <el-icon>
              <ele-Plus />
            </el-icon>
            {{ $t("form.dataHelper.newReminderTask") }}
          </el-button>
          <div
            v-if="dataReminderList && dataReminderList.length"
            class="reminder-list-wrap"
          >
            <div
              v-for="reminderItem in dataReminderList"
              :key="reminderItem.id"
              class="reminder-item"
            >
              <div class="header">
                <div class="title">
                  {{ reminderItem.reminderName }}
                </div>
                <div class="op-btn">
                  <el-link
                    :underline="false"
                    class="mr10"
                    type="primary"
                    @click="handleEditReminder(reminderItem)"
                  >
                    {{ $t("formI18n.all.edit") }}
                  </el-link>
                  <el-link
                    :underline="false"
                    type="danger"
                    @click="handleDeleteReminder(reminderItem)"
                  >
                    {{ $t("formI18n.all.delete") }}
                  </el-link>
                </div>
              </div>
              <div class="desc-text">{{ $t("form.dataHelper.reminderType") }}：{{ reminderItem.reminderTypeDesc }}</div>
              <div class="desc-text">
                {{ $t("form.dataHelper.reminderCondition") }}：{{ reminderItem.reminderConditionTypeDesc }}
              </div>
              <div class="desc-text">{{ $t("form.dataHelper.createTime") }}：{{ reminderItem.createTime }}</div>
            </div>
          </div>
          <el-empty
            v-else
            :description="$t('form.dataHelper.noPushYet')"
          />
        </el-tab-pane>
        <el-dialog
          v-if="dataReminderDialogVisible"
          :title="dataReminderFormTitle"
          v-model="dataReminderDialogVisible"
          :close-on-click-modal="false"
          class="t-dialog"
        >
          <el-form
            ref="dataReminderForm"
            :model="dataReminderForm"
            :rules="dataReminderRules"
            label-width="110px"
          >
            <el-form-item
              :label="$t('form.dataHelper.taskName')"
              prop="reminderName"
            >
              <el-input
                size="default"
                v-model="dataReminderForm.reminderName"
                :placeholder="$t('form.dataHelper.enterTaskName')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('form.dataHelper.isEnabled')"
              prop="reminderStatus"
            >
              <el-switch v-model="dataReminderForm.reminderStatus" />
            </el-form-item>
            <el-form-item
              :label="$t('form.dataHelper.reminderTime')"
              prop="reminderType"
            >
              <el-select
                size="default"
                v-model="dataReminderForm.reminderType"
              >
                <el-option
                  v-for="item in reminderTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="dataReminderForm.reminderType === 2"
              :label="$t('form.dataHelper.modifyConfig')"
              prop="reminderExt.updateTriggerType"
            >
              <el-select
                size="default"
                v-model="dataReminderForm.reminderExt.updateTriggerType"
              >
                <el-option
                  v-for="item in updateTriggerTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                size="default"
                v-if="dataReminderForm.reminderExt.updateTriggerType === 2"
                v-model="dataReminderForm.reminderExt.updateTriggerFields"
                collapse-tags
                multiple
              >
                <el-option
                  v-for="item in fields"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              {{ $t("form.dataHelper.startPushReminder") }}
            </el-form-item>
            <div v-if="dataReminderForm.reminderType === 3">
              <el-form-item
                :label="$t('form.dataHelper.timeConfig')"
                prop="reminderExt.startTime"
              >
                <el-date-picker
                  size="default"
                  v-model="dataReminderForm.reminderExt.startTime"
                  class="mr5"
                  default-time="12:00:00"
                  :placeholder="$t('form.dataHelper.selectStartTime')"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
                <el-date-picker
                  size="default"
                  v-model="dataReminderForm.reminderExt.endTime"
                  default-time="12:00:00"
                  :placeholder="$t('form.dataHelper.selectEndTime')"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
                <p class="ml10 text-secondary-color extra-small-font-size">
                  {{ $t("form.dataHelper.pleaseNote") }}
                </p>
              </el-form-item>
            </div>
            <div v-if="dataReminderForm.reminderType === 4">
              <el-form-item
                :label="$t('form.dataHelper.configTime')"
                prop="reminderExt.timeField"
              >
                <el-row :gutter="5">
                  <el-col :span="4">
                    <el-select
                      size="default"
                      v-model="dataReminderForm.reminderExt.timeField"
                    >
                      <el-option
                        v-for="item in allTimeFields"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="4">
                    <el-select
                      size="default"
                      v-model="dataReminderForm.reminderExt.timeFieldMode"
                      @change="handleTimeFieldModeChange"
                    >
                      <el-option
                        v-for="item in timeFieldModeTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col
                    v-if="dataReminderForm.reminderExt.timeFieldMode !== 1"
                    :span="3"
                  >
                    <el-input-number
                      size="default"
                      v-model="dataReminderForm.reminderExt.timeFieldValue"
                      :controls="false"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col
                    v-if="dataReminderForm.reminderExt.timeFieldMode !== 1"
                    :span="3"
                  >
                    <el-select
                      size="default"
                      v-model="dataReminderForm.reminderExt.timeFieldValueUnit"
                    >
                      <el-option
                        v-for="item in timeFieldValueUnitOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col
                    v-if="getTimeFieldObj && getTimeFieldObj.scheme && getTimeFieldObj.scheme.type == 'date'"
                    :span="2"
                  >
                    <el-time-picker
                      size="default"
                      v-model="dataReminderForm.reminderExt.timeFieldTimeValue"
                      default-time="YYYY-MM-DD HH:mm:ss"
                      format="HH:mm"
                      :placeholder="$t('form.dataHelper.startPushReminderAt')"
                      value-format="HH:mm"
                    ></el-time-picker>
                  </el-col>
                  {{ $t("form.dataHelper.startPushReminderNow") }}
                </el-row>
              </el-form-item>
            </div>
            <div v-show="dataReminderForm.reminderType === 3 || dataReminderForm.reminderType === 4">
              <el-form-item
                :label="$t('form.dataHelper.repeatMode')"
                prop="reminderExt.repeatMode"
              >
                <el-select
                  size="default"
                  v-model="dataReminderForm.reminderExt.repeatMode"
                >
                  <el-option
                    v-for="item in repeatModeOptionsFilter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-date-picker
                  size="default"
                  v-if="dataReminderForm.reminderType === 4"
                  v-model="dataReminderForm.reminderExt.endTime"
                  class="ml5"
                  default-time="12:00:00"
                  :placeholder="$t('form.dataHelper.selectEndTime')"
                  type="datetime"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>

                <el-button
                  size="default"
                  v-if="dataReminderForm.reminderExt.repeatMode == 7"
                  class="ml5"
                  type="primary"
                  @click="handleShowCron"
                >
                  {{
                    dataReminderForm.reminderExt.cronExpression
                      ? $t("form.dataHelper.modifyTask")
                      : $t("form.dataHelper.defineTask")
                  }}
                </el-button>
                <p class="ml10 text-secondary-color extra-small-font-size">
                  {{ $t("form.dataHelper.triggerAtSpecifiedTime") }}
                </p>
              </el-form-item>
            </div>
            <el-form-item
              :label="$t('form.dataHelper.reminderCondition')"
              prop="reminderConditionType"
            >
              <el-select
                size="default"
                v-model="dataReminderForm.reminderConditionType"
              >
                <el-option
                  v-for="item in reminderConditionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="dataReminderForm.reminderConditionType === 2"
              :label="$t('form.dataHelper.conditionConfig')"
              prop="reminderConditionValue"
            >
              <data-filter
                :fields="fields"
                :form-data-filter="dataReminderForm.reminderConditionValue"
                @filter="handleFilterChange"
              />
            </el-form-item>
            <el-form-item
              :label="$t('form.dataHelper.reminderMethod')"
              prop="pushConfig.pushType"
            >
              <el-select
                size="default"
                v-model="dataReminderForm.pushConfig.pushType"
                @change="handleReminderPushTypeChange"
              >
                <el-option
                  v-for="item in reminderPushTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="dataReminderForm.pushConfig.pushType === 1"
              :label="$t('form.dataHelper.notificationTemplate')"
              prop="pushConfig.pushChannelId"
            >
              <el-select
                size="default"
                v-model="dataReminderForm.pushConfig.pushChannelId"
                @change="handleChangePushChannelId"
              >
                <el-option
                  v-for="item in msgTemplateList"
                  :key="item.id"
                  :label="item.templateName"
                  :value="item.id"
                />
              </el-select>
              <el-button
                size="default"
                v-if="dataReminderForm.pushConfig.pushChannelId"
                class="ml5"
                @click="handleMsgParamsConfig"
              >
                {{ $t("form.dataHelper.configParameters") }}
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="dataReminderForm.pushConfig.pushType === 1"
              :label="$t('form.dataHelper.reminderPersons')"
              prop="reminderPersons"
            >
              <reminder-persons
                ref="reminderPersons"
                :fields="fields"
                @submit="val => (dataReminderForm.reminderPersons = val)"
              />
              <el-button
                size="default"
                class="ml5"
                @click="handleShowReminderPersons"
              >
                {{ $t("form.dataHelper.setRecipient") }}
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="dataReminderForm.pushConfig.pushType === 2"
              :label="$t('form.dataHelper.pushAddress')"
              prop="pushConfig.webhookUrl"
            >
              <div class="desc-text">{{ $t("form.dataHelper.pushDataInterface") }}</div>
              <el-input
                size="default"
                v-model="dataReminderForm.pushConfig.webhookUrl"
                :placeholder="$t('form.dataHelper.pleaseEnter')"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button
                size="default"
                @click="dataReminderDialogVisible = false"
              >
                {{ $t("formI18n.all.cancel") }}
              </el-button>
              <el-button
                size="default"
                type="primary"
                @click="handleSaveReminder"
              >
                {{ $t("formI18n.all.confirm") }}
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-tabs>
    </div>
    <el-dialog
      v-model="openCron"
      append-to-body
      class="scrollbar"
      destroy-on-close
      :title="$t('form.dataHelper.expressionGenerator')"
    >
      <crontab
        :expression="expression"
        @fill="crontabFill"
        @hide="openCron = false"
      ></crontab>
    </el-dialog>
    <config-params
      v-if="dataReminderForm.pushConfig && dataReminderForm.pushConfig.pushChannelId"
      ref="msgTemplateConfig"
      :fields="fields"
      :select-template-id="dataReminderForm.pushConfig.pushChannelId"
      :template-list="msgTemplateList"
      @submit="val => (dataReminderForm.pushConfig.templateParamMapping = val)"
    />
  </el-card>
</template>

<script>
import {
  addDataHelperReminders,
  delDataHelperReminders,
  getDataHelperReminders,
  listDataHelperReminders,
  updateDataHelperReminders
} from "@/api/project/dataHelper";
import DataFilter from "@/views/form/data/filter.vue";
import { listFormFieldsRequest } from "@/api/project/form";
import { listMsgTemplate } from "@/api/system/msgtemplate";
import Crontab from "@/components/Crontab/index.vue";
import ReminderPersons from "@/views/form/publish/DataHelper/ReminderPersons.vue";
import ConfigParams from "@/views/form/publish/DataHelper/ConfigParams.vue";
import { i18n } from "@/i18n";

export default {
  name: "DataHelper",
  components: {
    ReminderPersons,
    ConfigParams,
    Crontab,
    DataFilter
  },
  data() {
    return {
      dataReminderList: [],
      dataReminderDialogVisible: false,
      reminderTypeOptions: [
        { label: i18n.global.t("form.dataHelper.newDataSubmitted"), value: 1 },
        { label: i18n.global.t("form.dataHelper.modifyExistingData"), value: 2 },
        { label: i18n.global.t("form.dataHelper.customTime"), value: 3 },
        { label: i18n.global.t("form.dataHelper.formDateField"), value: 4 }
      ],
      reminderConditionTypeOptions: [
        { label: i18n.global.t("form.dataHelper.anyData"), value: 1 },
        { label: i18n.global.t("form.dataHelper.dataMeetingConditions"), value: 2 }
      ],
      reminderPushTypeOptions: [
        { label: i18n.global.t("form.dataHelper.notification"), value: 1 },
        { label: "WebHook", value: 2 }
      ],
      updateTriggerTypeOptions: [
        { label: i18n.global.t("form.dataHelper.anyField"), value: 1 },
        { label: i18n.global.t("form.dataHelper.specifiedField"), value: 2 }
      ],
      repeatModeOptions: [
        { label: i18n.global.t("form.dataHelper.notRepeat"), value: 1 },
        { label: i18n.global.t("form.dataHelper.daily"), value: 2 },
        { label: i18n.global.t("form.dataHelper.weekly"), value: 3 },
        { label: i18n.global.t("form.dataHelper.biWeekly"), value: 4 },
        { label: i18n.global.t("form.dataHelper.monthly"), value: 5 },
        { label: i18n.global.t("form.dataHelper.yearly"), value: 6 },
        { label: i18n.global.t("form.dataHelper.customRepeat"), value: 7 }
      ],
      timeFieldModeTypeOptions: [
        { label: i18n.global.t("form.dataHelper.atThatTime"), value: 1 },
        { label: i18n.global.t("form.dataHelper.before"), value: 2 },
        { label: i18n.global.t("form.dataHelper.after"), value: 3 }
      ],
      timeFieldValueUnitOptions: [
        { label: i18n.global.t("form.dataHelper.minutes"), value: 1 },
        { label: i18n.global.t("form.dataHelper.hours"), value: 2 },
        { label: i18n.global.t("form.dataHelper.days"), value: 3 }
      ],
      dataReminderFormTitle: i18n.global.t("form.dataHelper.newReminder"),
      formKey: "",
      dataReminderForm: {},
      dataReminderRules: {
        reminderName: [
          {
            required: true,
            message: i18n.global.t("form.dataHelper.enterReminderName"),
            trigger: "blur"
          }
        ],
        reminderStatus: [
          {
            required: true,
            message: i18n.global.t("form.dataHelper.selectEnableStatus"),
            trigger: "blur"
          }
        ],
        reminderType: [
          {
            required: true,
            message: i18n.global.t("form.dataHelper.selectReminderType"),
            trigger: "blur"
          }
        ],
        "pushConfig.pushChannelId": [
          { required: true, message: i18n.global.t("form.dataHelper.phoneNumberNotEmpty"), trigger: "blur" }
        ],
        reminderConditionType: [
          { required: true, message: i18n.global.t("form.dataHelper.selectReminderConditionType"), trigger: "blur" }
        ]
      },
      fields: [],
      msgTemplateList: [],
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: ""
    };
  },
  computed: {
    repeatModeOptionsFilter() {
      return this.dataReminderForm.reminderType === 4
        ? this.repeatModeOptions.filter(item => item.value !== 7)
        : this.repeatModeOptions;
    },
    allTimeFields() {
      return this.fields.filter(
        item =>
          item.value.toLowerCase().includes("time") || (item.value.toLowerCase().includes("date") && item.value != "updateBy")
      );
    },
    // 获取选中字段的时间格式
    getTimeFieldObj() {
      const timeField = this.dataReminderForm.reminderExt.timeField;
      if (timeField) {
        const timeFieldItem = this.allTimeFields.find(item => item.value === timeField);
        return timeFieldItem || {};
      }
      return {};
    }
  },
  created() {
    this.formKey = this.$route.query.key;
    this.queryDataReminderList();
    this.queryFormFields();
    this.handleQueryMsgTemplate();
  },
  methods: {
    // 查询表单字段
    queryFormFields() {
      listFormFieldsRequest(this.formKey).then(res => {
        this.fields = res.data;
      });
    },
    queryDataReminderList() {
      listDataHelperReminders({ formKey: this.formKey }).then(res => {
        this.dataReminderList = res.data;
      });
    },
    handleReminderPushTypeChange(val) {
      if (val === 2) {
        this.dataReminderForm.reminderPersons = null;
      }
    },
    handleAddReminder() {
      this.dataReminderFormTitle = i18n.global.t("form.dataHelper.newReminder");
      this.dataReminderForm = {
        formKey: "",
        reminderName: "",
        reminderStatus: true,
        reminderType: 1,
        reminderPersons: {},
        reminderConditionType: 1,
        reminderConditionValue: { rel: "AND", conditionList: [] },
        pushConfig: {
          pushChannelId: null,
          pushType: 1,
          pushChannelType: null,
          templateParamMapping: {},
          webhookUrl: ""
        },
        reminderExt: {
          updateTriggerType: 1,
          updateTriggerFields: [],
          startTime: null,
          endTime: null,
          timeField: null,
          timeFieldMode: 1,
          timeFieldValue: 1,
          timeFieldTimeValue: null,
          timeFieldValueUnit: 1,
          repeatMode: 1,
          cronExpression: ""
        }
      };
      this.dataReminderDialogVisible = true;
    },
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.dataReminderForm.reminderExt.cronExpression;
      this.openCron = true;
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.dataReminderForm.reminderExt.cronExpression = value;
    },
    handleEditReminder(reminderItem) {
      this.dataReminderFormTitle = i18n.global.t("form.dataHelper.editReminder");
      getDataHelperReminders(reminderItem.id).then(res => {
        this.dataReminderForm = res.data;
        this.dataReminderDialogVisible = true;
      });
    },
    handleDeleteReminder(reminderItem) {
      this.$confirm(i18n.global.t("form.dataHelper.deleteReminder"), i18n.global.t("formI18n.all.waring"), {
        confirmButtonText: i18n.global.t("formI18n.all.confirm"),
        cancelButtonText: i18n.global.t("formI18n.all.cancel"),
        type: "warning"
      })
        .then(() => {
          delDataHelperReminders(reminderItem.id).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.queryDataReminderList();
          });
        })
        .catch(() => {});
    },
    handleQueryMsgTemplate() {
      listMsgTemplate({}).then(res => {
        this.msgTemplateList = res.data;
      });
    },
    handleTimeFieldModeChange() {
      this.dataReminderForm.reminderExt.timeFieldTimeValue = null;
    },
    handleFilterChange(filter) {
      this.dataReminderForm.reminderConditionValue = {
        ...filter,
        conditionList: filter.conditionList
          .filter(item => {
            return item.formItemId && item.method;
          })
          .map(item => {
            return {
              formItemId: item.formItemId,
              method: item.method,
              value: item.value
            };
          })
      };
    },
    handleShowReminderPersons() {
      this.$refs.reminderPersons.show(this.dataReminderForm.reminderPersons);
    },
    handleMsgParamsConfig() {
      this.$refs.msgTemplateConfig.show(this.dataReminderForm.pushConfig.templateParamMapping);
    },
    handleChangePushChannelId(val) {
      this.dataReminderForm.pushConfig.pushChannelType = this.msgTemplateList.find(item => item.id === val).templateType;
    },
    handleSaveReminder() {
      // 检查是否选择了推送人
      if (
        this.dataReminderForm.pushConfig.pushType === 1 &&
        (!this.dataReminderForm.reminderPersons.userList || !this.dataReminderForm.reminderPersons.userList.length) &&
        (!this.dataReminderForm.reminderPersons.inputList || !this.dataReminderForm.reminderPersons.inputList.length) &&
        !this.dataReminderForm.reminderPersons.dynamicField
      ) {
        this.msgError(i18n.global.t("form.dataHelper.selectPushRecipient"));
        return;
      }
      this.dataReminderForm.formKey = this.formKey;
      this.$refs["dataReminderForm"].validate(valid => {
        if (valid) {
          if (this.dataReminderForm.id) {
            updateDataHelperReminders(this.dataReminderForm).then(res => {
              this.dataReminderDialogVisible = false;
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.queryDataReminderList();
            });
          } else {
            addDataHelperReminders(this.dataReminderForm).then(res => {
              this.dataReminderDialogVisible = false;
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
              this.queryDataReminderList();
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.reminder-item {
  border: 1px solid #eee;
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: var(--el-color-primary-light-10);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .desc-text {
    color: #999;
    line-height: 20px;
  }
}
</style>
