<template>
  <div class="setting-container">
    <el-tabs
      tab-position="left"
      class="setting-tabs t-tabs"
      v-model="activeName"
    >
      <el-tab-pane
        :label="$t('form.setting.examSettingLabel')"
        v-if="formType === 4 && hasFormButtonAuth('exam')"
        name="exam"
      >
        <template #label>
          <el-icon>
            <ele-School />
          </el-icon>
          {{ $t("form.setting.examSettingLabel") }}
        </template>
        <exam-setting v-if="activeName === 'exam'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.submitSettingLabel')"
        name="submit"
        v-if="hasFormButtonAuth('submit')"
      >
        <template #label>
          <el-icon>
            <ele-CircleCheck />
          </el-icon>
          {{ $t("form.setting.submitSettingLabel") }}
        </template>
        <submit-setting v-if="activeName === 'submit'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.recoverySettingLabel')"
        name="write"
        v-if="hasFormButtonAuth('write')"
      >
        <template #label>
          <el-icon>
            <ele-Iphone />
          </el-icon>
          {{ $t("form.setting.recoverySettingLabel") }}
        </template>
        <write-setting v-if="activeName === 'write'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.notificationSettingLabel')"
        name="notify"
        v-if="hasFormButtonAuth('notify')"
      >
        <template #label>
          <el-icon>
            <ele-Bell />
          </el-icon>
          {{ $t("form.setting.notificationSettingLabel") }}
        </template>
        <notify-setting v-if="activeName === 'notify'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.sharingSettingLabel')"
        name="share"
        v-if="hasFormButtonAuth('share')"
      >
        <template #label>
          <el-icon>
            <ele-Share />
          </el-icon>
          {{ $t("form.setting.sharingSettingLabel") }}
        </template>
        <share-setting v-if="activeName === 'share'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.replySettingLabel')"
        name="reply"
        v-if="hasFormButtonAuth('reply')"
      >
        <template #label>
          <el-icon>
            <ele-EditPen />
          </el-icon>
          {{ $t("form.setting.replySettingLabel") }}
        </template>
        <reply-setting v-if="activeName === 'reply'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('form.setting.teamworkSettingLabel')"
        name="teamwork"
        v-if="hasFormButtonAuth('teamwork')"
      >
        <template #label>
          <el-icon>
            <ele-Pointer />
          </el-icon>
          {{ $t("form.setting.teamworkSettingLabel") }}
        </template>
        <teamwork-setting v-if="activeName === 'teamwork'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="ProjectSetting">
import SubmitSetting from "./submit.vue";
import WriteSetting from "./write.vue";
import NotifySetting from "./notify.vue";
import ShareSetting from "./share.vue";
import TeamworkSetting from "./teamwork.vue";
import ReplySetting from "./reply.vue";
import ExamSetting from "./exam.vue";
import { useFormInfo } from "@/stores/formInfo";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const formInfoStore = useFormInfo();

const { formType } = storeToRefs(formInfoStore);

const activeName = ref(formType.value == 4 ? "exam" : "submit");

const { hasFormButtonAuth } = useFormInfo();
</script>

<style lang="scss" scoped>
.setting-container {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color-page);
  display: flex;
  justify-content: center;
  overflow: auto;

  .setting-tabs {
    border-radius: 8px;
    margin-top: 20px;
    width: 900px;
    min-height: 500px;
  }
}
</style>
