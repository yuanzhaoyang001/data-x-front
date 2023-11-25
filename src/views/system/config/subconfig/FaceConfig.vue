<template>
  <el-form
    ref="faceIdentifyEnvConfig"
    :model="form"
    label-width="120px"
  >
    <el-form-item
      label="appId"
      prop="appId"
      :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' appId', trigger: 'blur' }]"
    >
      <el-input
        v-model="form.appId"
        :placeholder="$t('formI18n.all.pleaseEnter')"
      />
    </el-form-item>
    <el-form-item
      label="apiKey"
      prop="apiKey"
      :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' apiKey', trigger: 'blur' }]"
    >
      <el-input
        v-model="form.apiKey"
        :placeholder="$t('formI18n.all.pleaseEnter')"
        show-password
      />
    </el-form-item>
    <el-form-item
      label="secretKey"
      prop="secretKey"
      :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' secretKey', trigger: 'blur' }]"
    >
      <el-input
        v-model="form.secretKey"
        :placeholder="$t('formI18n.all.pleaseEnter')"
        show-password
      />
    </el-form-item>
    <el-form-item
      label="planId"
      prop="planId"
      :rules="[{ required: true, message: $t('system.faceConfig.planid'), trigger: 'blur' }]"
    >
      <el-input
        v-model="form.planId"
        :placeholder="$t('system.faceConfig.enterPlanid')"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        {{ $t("formI18n.all.save") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ConfigMixin from "./ConfigMixin";

export default {
  name: "FaceConfig",
  mixins: [ConfigMixin],
  data() {
    return {};
  },
  async created() {
    this.activeName = "faceIdentifyEnvConfig";
    await this.handleClick();
  },
  mounted() {}
};
</script>

<style scoped>
.el-input {
  width: 35%;
}
</style>
