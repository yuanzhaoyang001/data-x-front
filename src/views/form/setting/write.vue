<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      {{ $t("form.setting.recoverySettingLabel") }}
      <span class="small-font-size ml20 text-secondary-color">{{ $t("form.setting.customFormCollection") }}</span>
    </p>
    <el-divider />
    <el-scrollbar :height="`${wdHeight - 200}px`">
      <el-form
        ref="writeSettingFormRef"
        :model="writeSettingForm"
        :rules="settingRules"
        label-position="left"
        @validate="handleFormValidate"
      >
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.onePageOneQuestion") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.enableOnePageOneQuestionDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.onePageOneQuestion.enableOnePageOneQuestion"
            @change="saveSettingHandle"
          />
        </div>
        <div v-if="writeSettingForm?.onePageOneQuestion?.enableOnePageOneQuestion">
          <div class="setting-item">
            <p class="label">
              {{ $t("form.setting.shortestStayTime") }}
              <el-tooltip
                class="item"
                :content="$t('form.setting.shortestStayTimeDescription')"
                effect="dark"
                placement="top-start"
              >
                <el-icon>
                  <ele-QuestionFilled />
                </el-icon>
              </el-tooltip>
            </p>
            <el-switch
              v-model="writeSettingForm.onePageOneQuestion.enableShortestStay"
              @change="saveSettingHandle"
            />
          </div>
          <div
            class="sub-row-box"
            v-if="writeSettingForm.onePageOneQuestion.enableShortestStay"
          >
            <el-input-number
              size="small"
              controls-position="right"
              @change="saveSettingHandle"
              v-model="writeSettingForm.onePageOneQuestion.shortestStayTime"
            />
            {{ $t("form.setting.second") }}
          </div>
          <div class="setting-item">
            <p class="label">
              {{ $t("form.setting.longestStayTime") }}

              <el-tooltip
                class="item"
                :content="$t('form.setting.longestStayTimeDescription')"
                effect="dark"
                placement="top-start"
              >
                <el-icon>
                  <ele-QuestionFilled />
                </el-icon>
              </el-tooltip>
            </p>
            <el-switch
              v-model="writeSettingForm.onePageOneQuestion.enableLongestStay"
              @change="saveSettingHandle"
            />
          </div>
          <div
            class="sub-row-box"
            v-if="writeSettingForm.onePageOneQuestion.enableLongestStay"
          >
            <el-input-number
              size="small"
              @change="saveSettingHandle"
              controls-position="right"
              v-model="writeSettingForm.onePageOneQuestion.longestStayTime"
            />
            {{ $t("form.setting.second") }}
          </div>
          <div class="setting-item">
            <p class="label">
              {{ $t("form.setting.autoNextPage") }}
              <el-tooltip
                class="item"
                :content="$t('form.setting.autoNextPageDescription')"
                effect="dark"
                placement="top-start"
              >
                <el-icon>
                  <ele-QuestionFilled />
                </el-icon>
              </el-tooltip>
            </p>
            <el-switch
              v-model="writeSettingForm.onePageOneQuestion.autoNext"
              @change="saveSettingHandle"
            />
          </div>
        </div>

        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.autoSaveUnsubmittedData") }}

            <el-tooltip
              class="item"
              :content="$t('form.setting.autoSaveUnsubmittedDataDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.saveNotSubmitStatus"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.fillWithLastSubmittedData") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.fillWithLastSubmittedDataDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.saveSubmitStatus"
            @change="saveSettingHandle"
          />
        </div>
        <el-divider>{{ $t("form.setting.fillingRestrictions") }}</el-divider>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.passwordWrite") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.passwordWriteDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.passwordWriteStatus"
            @change="saveSettingHandle"
          />
        </div>
        <div v-if="writeSettingForm.passwordWriteStatus">
          <el-form-item
            :rules="[
              {
                required: true,
                message: $t('form.setting.enterPwd'),

                trigger: 'blur'
              }
            ]"
            prop="writePassword"
          >
            <el-input
              v-model="writeSettingForm.writePassword"
              @change="saveSettingHandle"
              :placeholder="$t('form.setting.enterPwd')"
              show-password
            />
          </el-form-item>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.whiteList") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.whiteListDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.enableWhiteList"
            @change="saveSettingHandle"
          />
        </div>
        <div
          v-if="writeSettingForm.enableWhiteList"
          class="sub-row-box"
        >
          <el-select
            v-model="writeSettingForm.whiteListType"
            @change="saveSettingHandle()"
            size="default"
          >
            <el-option
              v-for="d in whileListTypes"
              :key="d.value"
              :label="d.label"
              :value="d.value"
            >
              {{ d.label }}
            </el-option>
          </el-select>
          <el-button
            bg
            icon="ele-Setting"
            size="small"
            text
            type="primary"
            @click="handleOpenWhiteList"
          >
            {{ $t("form.setting.set") }}
          </el-button>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.onlyAllowLoginWrite") }}
            <el-tooltip
              class="item"
              :content="$t('form.setting.onlyAllowLoginWriteDescription')"
              effect="dark"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.mustLogin"
            @change="saveSettingHandle"
          />
        </div>
        <div class="setting-item">
          <p class="label">{{ $t("form.setting.wxWriteCountLimit") }}</p>
          <el-switch
            v-model="writeSettingForm.wxWriteCountLimitStatus"
            @change="handleWxWriteCountLimitStatusChange"
          />
        </div>
        <div v-if="writeSettingForm.wxWriteCountLimitStatus">
          <el-row>
            <el-col :span="6">
              <el-select
                size="default"
                v-model="writeSettingForm.wxWriteCountLimitDateType"
                @change="saveSettingHandle"
              >
                <el-option
                  v-for="d in dateRangeList"
                  :key="d.value"
                  :label="d.label"
                  :value="d.value"
                >
                  {{ d.label }}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              {{ $t("form.setting.wxWriteCountLimitDescription") }}
              <el-input-number
                size="default"
                v-model="writeSettingForm.wxWriteCountLimit"
                :min="1"
                @change="saveSettingHandle()"
              />
              {{ $t("form.setting.order") }}
            </el-col>
          </el-row>
          <el-form-item
            v-if="writeSettingForm.wxWriteCountLimitStatus"
            :rules="[
              {
                required: writeSettingForm.wxWriteCountLimitStatus,
                message: $t('form.setting.enterTips'),
                trigger: 'blur'
              }
            ]"
            prop="wxWriteCountLimitText"
          >
            <el-input
              size="default"
              v-model="writeSettingForm.wxWriteCountLimitText"
              class="mt10"
              @change="saveSettingHandle()"
              :placeholder="$t('form.setting.wxWriteCountLimitText')"
            />
          </el-form-item>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.ipWriteCountLimit") }}
            <el-tooltip
              :content="$t('form.setting.ipWriteCountLimitDescription')"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.ipWriteCountLimitStatus"
            @change="saveSettingHandle()"
          />
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.accountWriteCountLimit") }}
            <el-tooltip
              :content="$t('form.setting.accountWriteCountLimitDescription')"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.accountWriteCountLimitStatus"
            @change="saveSettingHandle()"
          />
        </div>
        <div v-if="writeSettingForm.accountWriteCountLimitStatus">
          <el-row>
            <el-col :span="6">
              <el-select
                size="default"
                v-model="writeSettingForm.accountWriteCountLimitDateType"
                @change="saveSettingHandle()"
              >
                <el-option
                  v-for="d in dateRangeList"
                  :key="d.value"
                  :label="d.label"
                  :value="d.value"
                >
                  {{ d.label }}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              {{ $t("form.setting.wxWriteCountLimitDescription") }}
              <el-input-number
                size="default"
                v-model="writeSettingForm.accountWriteCountLimit"
                :min="1"
                @change="saveSettingHandle()"
              />
              {{ $t("form.setting.order") }}
            </el-col>
          </el-row>
          <el-form-item
            :rules="[{ required: true, message: $t('form.setting.enterTips'), trigger: 'blur' }]"
            prop="accountWriteCountLimitText"
          >
            <el-input
              size="default"
              v-model="writeSettingForm.accountWriteCountLimitText"
              @change="saveSettingHandle()"
              class="mt10"
              :placeholder="$t('form.setting.accountWriteCountLimitText')"
            />
          </el-form-item>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.deviceWriteCountLimit") }}
            <el-tooltip
              :content="$t('form.setting.deviceWriteCountLimitDescription')"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.deviceWriteCountLimitStatus"
            @change="saveSettingHandle()"
          />
        </div>
        <div v-if="writeSettingForm.deviceWriteCountLimitStatus">
          <el-row>
            <el-col :span="18">
              {{ $t("form.setting.wxWriteCountLimitDescription") }}
              <el-input-number
                size="default"
                v-model="writeSettingForm.deviceWriteCountLimit"
                :min="1"
                @change="saveSettingHandle()"
              />
              {{ $t("form.setting.order") }}
            </el-col>
          </el-row>
          <el-form-item
            :rules="[{ required: true, message: $t('form.setting.enterTips'), trigger: 'blur' }]"
            prop="deviceWriteCountLimitText"
          >
            <el-input
              size="default"
              v-model="writeSettingForm.deviceWriteCountLimitText"
              class="mt10"
              @change="saveSettingHandle()"
              :placeholder="$t('form.setting.deviceWriteCountLimitText')"
            />
          </el-form-item>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.setTotalWriteCountLimit") }}
            <el-tooltip
              :content="$t('form.setting.setTotalWriteCountLimitDescription')"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.totalWriteCountLimitStatus"
            @change="saveSettingHandle()"
          />
        </div>
        <div v-if="writeSettingForm.totalWriteCountLimitStatus">
          <el-row>
            <el-col :span="6">
              <el-select
                size="default"
                v-model="writeSettingForm.totalWriteCountLimitDateType"
                @change="saveSettingHandle()"
              >
                <el-option
                  v-for="d in dateRangeList"
                  :key="d.value"
                  :label="d.label"
                  :value="d.value"
                >
                  {{ d.label }}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              {{ $t("form.setting.wxWriteCountLimitDescription") }}
              <el-input-number
                size="default"
                v-model="writeSettingForm.totalWriteCountLimit"
                :min="1"
                @change="saveSettingHandle()"
              />
              {{ $t("form.setting.order") }}
            </el-col>
          </el-row>
          <el-form-item
            :rules="[{ required: true, message: $t('form.setting.enterTips'), trigger: 'blur' }]"
            prop="totalWriteCountLimitText"
          >
            <el-input
              size="default"
              v-model="writeSettingForm.totalWriteCountLimitText"
              class="mt10"
              @change="saveSettingHandle()"
              :placeholder="$t('form.setting.setTotalWriteCountLimitText')"
            />
          </el-form-item>
        </div>
        <div class="setting-item">
          <p class="label">
            {{ $t("form.setting.interviewTimeRestriction") }}
            <el-tooltip
              :content="$t('form.setting.interviewTimeRestrictionDescription')"
              placement="top-start"
            >
              <el-icon>
                <ele-QuestionFilled />
              </el-icon>
            </el-tooltip>
          </p>
          <el-switch
            v-model="writeSettingForm.writeInterviewTimeStatus"
            @change="saveSettingHandle()"
          />
        </div>
        <div v-if="writeSettingForm.writeInterviewTimeStatus">
          <el-row>
            <el-col :span="5">
              <el-checkbox
                v-model="writeSettingForm.writeInterviewDayTimeStatus"
                @change="saveSettingHandle()"
              >
                {{ $t("form.setting.limitDailyAccessTime") }}
              </el-checkbox>
            </el-col>
          </el-row>
          <div v-if="writeSettingForm.writeInterviewDayTimeStatus">
            <el-row class="mt10">
              <el-col :span="13">
                <el-date-picker
                  v-model="writeSettingForm.writeInterviewDateRange"
                  :end-placeholder="$t('formgen.reserveTimeRange.endTime')"
                  range-separator="-"
                  :start-placeholder="$t('formgen.reserveTimeRange.startTime')"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  @change="saveSettingHandle()"
                />
              </el-col>
            </el-row>
            <el-row class="mt10">
              <el-col :span="13">
                <el-time-picker
                  v-model="writeSettingForm.writeInterviewTimeRange"
                  :end-placeholder="$t('formgen.reserveTimeRange.endTime')"
                  is-range
                  :placeholder="$t('form.setting.selectTimeRange')"
                  range-separator="-"
                  :start-placeholder="$t('formgen.reserveTimeRange.startTime')"
                  value-format="HH:mm:ss"
                  @change="saveSettingHandle()"
                />
              </el-col>
            </el-row>
          </div>

          <el-row
            v-else
            class="mt10"
          >
            <el-col :span="12">
              <el-date-picker
                size="default"
                v-model="writeSettingForm.writeInterviewDateTimeRange"
                :end-placeholder="$t('formgen.reserveTimeRange.endTime')"
                range-separator="-"
                :start-placeholder="$t('formgen.reserveTimeRange.startTime')"
                type="datetimerange"
                @change="saveSettingHandle()"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-col>
          </el-row>
          <div class="checkbox-group mt10">
            <el-checkbox-group
              v-model="writeSettingForm.writeInterviewTimeWhichDays"
              @change="saveSettingHandle()"
              size="small"
            >
              <el-checkbox label="2">{{ $t("formgen.reserveTimeRange.monday") }}</el-checkbox>
              <el-checkbox label="3">{{ $t("formgen.reserveTimeRange.tuesday") }}</el-checkbox>
              <el-checkbox label="4">{{ $t("formgen.reserveTimeRange.wednesday") }}</el-checkbox>
              <el-checkbox label="5">{{ $t("formgen.reserveTimeRange.thursday") }}</el-checkbox>
              <el-checkbox label="6">{{ $t("formgen.reserveTimeRange.friday") }}</el-checkbox>
              <el-checkbox label="7">{{ $t("formgen.reserveTimeRange.saturday") }}</el-checkbox>
              <el-checkbox label="1">{{ $t("formgen.reserveTimeRange.sunday2") }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-form-item
            :rules="[{ required: true, message: $t('form.setting.enterTips'), trigger: 'blur' }]"
            prop="writeInterviewTimeText"
          >
            <el-input
              size="default"
              v-model="writeSettingForm.writeInterviewTimeText"
              @change="saveSettingHandle()"
              class="mt10"
              :placeholder="$t('form.setting.selectTimeRangeDesc')"
            />
          </el-form-item>
        </div>
        <div class="setting-item">
          <p class="label">{{ $t("form.setting.anonymousWrite") }}</p>
          <el-switch
            v-model="writeSettingForm.anonymousWrite"
            @change="saveSettingHandle()"
          />
        </div>
        <div class="setting-item">
          <p class="label">{{ $t("form.setting.onlyInWeChat") }}</p>
          <el-switch
            v-model="writeSettingForm.onlyWxWrite"
            @change="
              val => {
                if (!writeSettingForm.onlyWxWrite && !val) {
                  writeSettingForm.recordWxUser = false;
                }
                saveSettingHandle();
              }
            "
          />
        </div>
        <el-divider>{{ $t("form.setting.info") }}</el-divider>
        <div class="setting-item">
          <p class="label">{{ $t("form.setting.recordWeChatUserInfo") }}</p>
          <el-switch
            v-model="writeSettingForm.recordWxUser"
            @change="
              val => {
                if (!writeSettingForm.onlyWxWrite && val) {
                  writeSettingForm.onlyWxWrite = true;
                }
                saveSettingHandle();
              }
            "
          />
        </div>
        <el-row>
          <p class="project-setting-sub-label">{{ $t("form.setting.recordWeChatUserInfoDescription") }}</p>
        </el-row>
      </el-form>
      <el-dialog
        v-model="whiteListDialogVisible"
        :title="$t('form.setting.whiteList')"
        class="whiteList-dialog"
        fullscreen
        lock-scroll
        destroy-on-close
      >
        <AnswerWhiteListSetting
          ref="answerWhiteListSetting"
          :form-key="formKey"
          :type="writeSettingForm.whiteListType"
        />
      </el-dialog>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="WriteSetting">
import { getSettingRequest, saveSettingRequest } from "@/api/project/setting";
import { useWindowSize } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { MessageUtil } from "@/utils/messageUtil";
import AnswerWhiteListSetting from "@/views/form/setting/components/AnswerWhiteListSetting.vue";
import { i18n } from "@/i18n";

const { height: wdHeight } = useWindowSize();

const dateRangeList = [
  { value: 1, label: i18n.global.t("form.setting.count") },
  { value: 2, label: i18n.global.t("form.setting.byDay") },
  { value: 3, label: i18n.global.t("form.setting.byWeek") },
  { value: 4, label: i18n.global.t("form.setting.byMonth") }
];

const whileListTypes = [
  { value: 1, label: i18n.global.t("form.setting.email") },
  { value: 2, label: i18n.global.t("form.setting.phoneNumber") },
  { value: 3, label: i18n.global.t("form.setting.whiteList") }
];

const settingRules = {};

const writeSettingForm = ref<any>({
  // 仅在微信填写
  onlyWxWrite: false,
  // 记录微信用户信息
  recordWxUser: false,
  // 恢复提交数据
  saveSubmitStatus: false,
  // 保存未恢复数据
  saveNotSubmitStatus: false,
  // 密码填写状态
  passwordWriteStatus: false,
  // 填写密码
  writePassword: "",
  // 每个微信答题次数限制
  wxWriteCountLimitStatus: false,
  // 次数
  wxWriteCountLimit: 1,
  // 日期范围
  wxWriteCountLimitDateType: 1,
  // 文案
  wxWriteCountLimitText: "",
  // 每个IP答题次数限制
  ipWriteCountLimitStatus: false,
  // 次数
  ipWriteCountLimit: 1,
  // 日期范围
  ipWriteCountLimitDateType: 1,
  // 文案
  ipWriteCountLimitText: "",
  // 每个账号答题次数限制
  accountWriteCountLimitStatus: false,
  // 次数
  accountWriteCountLimit: 1,
  // 日期范围
  accountWriteCountLimitDateType: 1,
  // 文案
  accountWriteCountLimitText: "",
  // 每台设备答题次数限制
  deviceWriteCountLimitStatus: false,
  // 次数
  deviceWriteCountLimit: 1,
  // 文案
  deviceWriteCountLimitText: "",
  // 累计答题数量
  totalWriteCountLimitStatus: false,
  // 次数
  totalWriteCountLimit: 1,
  // 日期范围
  totalWriteCountLimitDateType: 1,
  // 文案
  totalWriteCountLimitText: "",
  // 访问时间
  writeInterviewTimeStatus: false,
  // 访问时间是否是一天内的某些小时
  writeInterviewDayTimeStatus: false,
  // 允许访问访问时间范围
  writeInterviewDateTimeRange: [],
  // 允许访问访问日期范围
  writeInterviewDateRange: [],
  // 允许访问访问时间范围
  writeInterviewTimeRange: null,
  // 每周允许周几访问
  writeInterviewTimeWhichDays: [],
  writeInterviewTimeText: "",
  // 必须登录
  mustLogin: false,
  // 是否启用白名单
  enableWhiteList: false,
  // 白名单类型
  whiteListType: 3,
  // 每页一题‘
  onePageOneQuestion: {
    enableOnePageOneQuestion: false,
    enableShortestStay: false,
    shortestStayTime: 1,
    enableLongestStay: false,
    longestStayTime: 60,
    autoNext: false
  },
  anonymousWrite: false
});
const formKey = useRoute().query.key as string;

const queryUserProjectSetting = () => {
  getSettingRequest(formKey).then(res => {
    if (res.data) {
      writeSettingForm.value = Object.assign(writeSettingForm.value, res.data);
    }
  });
};

onMounted(() => {
  queryUserProjectSetting();
});

const writeSettingFormRef = ref<any>(null);

const whiteListDialogVisible = ref<boolean>(false);

const saveSettingHandle = () => {
  // 开关后需要等到下一个tick再进行验证 不然rule还没销毁掉
  setTimeout(() => {
    writeSettingFormRef.value.validate(valid => {
      if (valid) {
        writeSettingForm.value.formKey = formKey;
        saveSettingRequest(writeSettingForm.value).then(() => {
          MessageUtil.success(i18n.global.t("formI18n.all.success"));
          queryUserProjectSetting();
        });
      } else {
        console.log(valid);
      }
    });
  }, 200);
};

const handleOpenWhiteList = () => {
  whiteListDialogVisible.value = true;
};

const handleFormValidate = (prop, isValid, message) => {
  console.log(prop);
  console.log(isValid);
  console.log(message);
};

const handleWxWriteCountLimitStatusChange = () => {
  writeSettingForm.value.recordWxUser = true;
  writeSettingForm.value.onlyWxWrite = true;
  saveSettingHandle();
};
</script>

<style lang="scss" scoped>
@import "settting";

.checkbox-group .el-checkbox {
  margin-right: 23px;
}

:deep(.whiteList-dialog) {
  .el-dialog__body {
    padding: 0 !important;
    height: 100%;
    overflow: hidden;
  }

  overflow: hidden;
}
</style>
