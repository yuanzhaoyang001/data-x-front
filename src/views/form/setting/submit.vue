<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      {{ $t("form.setting.submitSettingLabel") }}
      <span class="small-font-size ml20 text-secondary-color">{{ $t("form.setting.submitSettingDescription") }}</span>
    </p>
    <el-divider />
    <el-form
      ref="submitSettingForm"
      :model="submitSettingForm"
      :rules="settingRules"
      @submit.prevent
    >
      <div class="setting-item">
        <p
          class="label"
          style="width: 40%"
        >
          {{ $t("form.setting.submitShowTypeLabel") }}
        </p>
        <el-radio-group
          v-model="submitSettingForm.submitShowType"
          @change="saveSettingHandle"
        >
          <el-radio :label="1">{{ $t("form.setting.systemDefaultPrompt") }}</el-radio>
          <el-radio :label="2">{{ $t("form.setting.customPromptPage") }}</el-radio>
        </el-radio-group>
      </div>
      <div
        v-if="submitSettingForm.submitShowType === 2"
        class="mt20"
      >
        <form-tinymce
          v-model:value="submitSettingForm.submitShowCustomPageContent"
          @blur="saveSettingHandle"
        />
      </div>
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.submitJumpLogicLabel") }}</p>
        <el-button
          @click="showDialog"
          text
          bg
          size="default"
        >
          {{
            submitSettingForm.commitJumpLogicList && submitSettingForm.commitJumpLogicList.length
              ? $t("form.setting.modifyJumpLogic")
              : $t("form.setting.addJumpLogic")
          }}
        </el-button>
      </div>
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.submitJumpLabel") }}</p>
        <el-switch
          v-model="submitSettingForm.submitJump"
          @change="saveSettingHandle"
        />
      </div>
      <el-form-item
        v-if="submitSettingForm.submitJump"
        prop="submitJumpUrl"
        :rules="[
          { required: true, message: $t('form.setting.enterJumpAddress'), trigger: 'blur' },
          {
            type: 'url',
            message: $t('form.setting.enterValidURL'),
            trigger: ['blur', 'change']
          }
        ]"
      >
        <el-input
          @change="saveSettingHandle"
          v-model="submitSettingForm.submitJumpUrl"
          placeholder="https://www.tduckcloud.com"
        />
      </el-form-item>
      <el-divider class="mt20">{{ $t("form.setting.submitAfterAnswerLabel") }}</el-divider>
      <div class="setting-item">
        <p class="label">
          {{ $t("form.setting.viewFilledContentLabel") }}
          <el-tooltip
            class="item"
            :content="$t('form.setting.viewFilledContentTooltip')"
            effect="dark"
            placement="top-start"
          >
            <el-icon>
              <ele-QuestionFilled />
            </el-icon>
          </el-tooltip>
        </p>
        <el-switch
          v-model="submitSettingForm.showSubmitContentBtn"
          @change="saveSettingHandle"
        />
      </div>
      <div class="setting-item">
        <p class="label">{{ $t("form.setting.modifyFilledContentLabel") }}</p>
        <el-switch
          v-model="submitSettingForm.updateSubmitContentBtn"
          @change="saveSettingHandle"
        />
      </div>
    </el-form>
    <el-dialog
      v-model="dialogVisible"
      class="t-dialog"
      :title="$t('form.setting.jumpLogicDialogTitle')"
      width="58%"
    >
      <logic-jump
        v-if="dialogVisible"
        ref="logicJump"
        :submit-setting-form="submitSettingForm"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="default"
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            type="primary"
            size="default"
            @click="submitLogicalSettings"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "./mixin";
import FormTinymce from "@/views/formgen/components/tinymce/index.vue";
import { getSettingRequest, saveSettingRequest } from "@/api/project/setting";
import LogicJump from "@/views/form/setting/LogicJump/index.vue";
import { i18n } from "@/i18n";

export default {
  name: "SubmitSetting",
  components: { LogicJump, FormTinymce },
  mixins: [mixin],
  data() {
    return {
      settingRules: {},
      submitSettingForm: {
        // 提交后显示类型
        submitShowType: 1,
        // 自定义显示内容
        submitShowCustomPageContent:
          '<p><img style="display: block; margin-left: auto; margin-right: auto;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYwOTNFMTgzODRDOTExRTRCODQ1RUFBQTc2OEVENjJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYwOTNFMTg0ODRDOTExRTRCODQ1RUFBQTc2OEVENjJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjA5M0UxODE4NEM5MTFFNEI4NDVFQUFBNzY4RUQ2MkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjA5M0UxODI4NEM5MTFFNEI4NDVFQUFBNzY4RUQ2MkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4iMQ9aAAAHV0lEQVR42uScaWxU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" /></p>\n<p style="text-align: center;"><strong>提交成功</strong></p>',
        submitJump: false,
        submitJumpUrl: "",
        publicResult: false,
        // 可查看已提交内容
        showSubmitContentBtn: false,
        // 可以修改已经提交的内容
        updateSubmitContentBtn: false
      },
      type: 1,
      dialogVisible: false
    };
  },
  mounted() {
    this.queryUserProjectSetting();
  },
  unmounted() {},
  methods: {
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then(res => {
        if (res.data) {
          this.submitSettingForm = res.data;
        }
      });
    },
    saveSettingHandle() {
      this.$refs["submitSettingForm"].validate(valid => {
        if (valid) {
          this.submitSettingForm.formKey = this.formKey;
          saveSettingRequest(this.submitSettingForm).then(() => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
            this.queryUserProjectSetting();
          });
        } else {
          return false;
        }
      });
    },
    showDialog() {
      this.dialogVisible = true;
    },
    submitLogicalSettings() {
      this.submitSettingForm.formKey = this.formKey;
      this.submitSettingForm.commitJumpLogicList = this.$refs.logicJump.commitJumpLogicList;
      saveSettingRequest(this.submitSettingForm).then(() => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.queryUserProjectSetting();
        this.dialogVisible = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "settting";

.submit-prompt-img {
  width: 100%;
  height: 117px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
}
</style>
