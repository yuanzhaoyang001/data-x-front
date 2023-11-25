<template>
  <el-card>
    <template #header>
      <div>
        <span>{{ $t("form.dataPush.title") }}</span>
        <span class="desc-text ml10">{{ $t("form.dataPush.description") }}</span>
      </div>
    </template>
    <el-alert
      :description="$t('form.dataPush.reminderDescription')"
      class="m5"
      :closable="false"
      style="width: 98%"
      :title="$t('form.dataPush.reminderTitle')"
    ></el-alert>
    <div class="p10">
      <el-form
        :model="form"
        :rules="rules"
        ref="webhookForm"
        class="mt10"
      >
        <el-form-item prop="name">
          <el-switch
            clss="ml5 "
            v-model="form.enabled"
            active-color="#13ce66"
            :active-text="$t('form.dataPush.enabledSwitchLabel')"
            :inactive-text="$t('form.dataPush.disabledSwitchLabel')"
          ></el-switch>
        </el-form-item>
        <el-row
          :gutter="20"
          v-if="form.enabled"
        >
          <el-col :span="8">
            <el-form-item
              :label="$t('form.dataPush.requestTypeLabel')"
              prop="requestType"
            >
              <el-select
                size="default"
                v-model="form.requestType"
              >
                <el-option
                  label="POST"
                  value="POST"
                ></el-option>
                <el-option
                  label="GET"
                  value="GET"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item
              :label="$t('form.dataPush.urlLabel')"
              prop="url"
            >
              <el-input
                size="default"
                v-model="form.url"
                :placeholder="$t('form.dataPush.urlPlaceholder')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            size="default"
            type="primary"
            @click="handleSave"
            v-re-click
          >
            {{ $t("form.dataPush.saveButton") }}
          </el-button>
          <el-button
            size="default"
            @click="handleSendTest"
          >
            {{ $t("form.dataPush.sendTestButton") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { getWebHook, saveWebHook, sendTestWebHook } from "../../../api/tool/webhook";
import { i18n } from "@/i18n";

export default {
  name: "DataPush",
  components: {},
  data() {
    return {
      form: {
        sourceType: "",
        sourceId: "",
        enabled: false,
        requestType: "POST",
        url: ""
      },
      rules: {
        requestType: [{ required: true, message: i18n.global.t("form.dataPush.rulesMessage"), trigger: "blur" }],
        url: [
          { required: true, message: i18n.global.t("form.dataPush.rulesUrlLabel"), trigger: "blur" },
          {
            type: "url",
            message: i18n.global.t("form.dataPush.rulesUrl"),
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.form.sourceType = "form";
    this.form.sourceId = this.$route.query.key;
    this.handleQuery();
  },
  methods: {
    handleQuery() {
      getWebHook(this.form.sourceType, this.form.sourceId).then(res => {
        if (res.data) {
          this.form = res.data;
        }
      });
    },
    handleSendTest() {
      if (this.form.enabled === false) {
        this.msgError(i18n.global.t("form.dataPush.waringText"));
        return;
      }
      this.$refs.webhookForm.validate(valid => {
        if (valid) {
          sendTestWebHook(this.form).then(res => {
            if (res.data) {
              this.msgSuccess(i18n.global.t("formI18n.all.success"));
            } else {
              this.msgError(i18n.global.t("form.dataPush.errorText"));
            }
          });
        } else {
          return false;
        }
      });
    },
    handleSave() {
      this.$refs.webhookForm.validate(valid => {
        if (this.form.enabled === false) {
          this.msgError(i18n.global.t("form.dataPush.waringText"));
          return;
        }
        if (valid) {
          saveWebHook(this.form).then(res => {
            this.msgSuccess(i18n.global.t("formI18n.all.success"));
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
