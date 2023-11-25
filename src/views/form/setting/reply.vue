<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      {{ $t("form.setting.replySettingLabel") }}

      <span class="small-font-size ml20 text-secondary-color">
        {{ $t("form.setting.enableCommentsOnPublicQuery") }}
      </span>
    </p>
    <el-divider />
    <el-form
      ref="writeSettingForm"
      :model="writeSettingForm"
      :rules="settingRules"
    >
      <div class="setting-item">
        <p class="label">
          {{ $t("form.setting.enablePublicQueryReplies") }}
          <el-tooltip
            class="item"
            :content="$t('form.setting.enablePublicQueryReplies')"
            effect="dark"
            placement="top-start"
          >
            <el-icon>
              <ele-QuestionFilled />
            </el-icon>
          </el-tooltip>
        </p>
        <el-switch
          v-model="writeSettingForm.openReply"
          @change="saveSettingHandle"
        />
      </div>
      <el-row>
        <p class="project-setting-sub-label">* {{ $t("form.setting.featureOnlyActiveWithPublicQueries") }}</p>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import mixin from "./mixin";
import { getSettingRequest, saveSettingRequest } from "@/api/project/setting";
import { i18n } from "@/i18n";

export default {
  name: "ReplySetting",
  mixins: [mixin],
  data() {
    return {
      settingRules: {},
      writeSettingForm: {
        openReply: false
      }
    };
  },
  mounted() {
    this.queryUserProjectSetting();
  },
  methods: {
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then(res => {
        if (res.data) {
          this.writeSettingForm = res.data;
        }
      });
    },
    saveSettingHandle() {
      this.$refs["writeSettingForm"].validate(valid => {
        if (valid) {
          this.writeSettingForm.formKey = this.formKey;
          saveSettingRequest(this.writeSettingForm).then(() => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.queryUserProjectSetting();
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "settting";
</style>
