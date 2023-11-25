<template>
  <el-tabs
    tab-position="left"
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      :label="$t('system.otherLogin.wechat')"
      name="wechatOpenEnvConfig"
    >
      <el-form
        ref="wechatOpenEnvConfig"
        :model="form"
        label-width="120px"
      >
        <el-form-item
          label="AppId"
          prop="clientId"
          :rules="[
            {
              required: true,
              message: $t('system.otherLogin.appid'),
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.clientId"
            :placeholder="$t('system.otherLogin.appid')"
          />
        </el-form-item>
        <el-form-item
          label="Secret"
          prop="clientSecret"
          :rules="[
            {
              required: true,
              message: $t('system.otherLogin.secret'),
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.clientSecret"
            :placeholder="$t('system.otherLogin.secret')"
            show-password
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
    </el-tab-pane>
    <el-tab-pane
      :label="$t('system.otherLogin.companyWechat')"
      name="wechatEnterpriseEnvConfig"
    >
      <el-form
        ref="wechatEnterpriseEnvConfig"
        :model="form"
        label-width="120px"
      >
        <el-form-item
          :label="$t('system.otherLogin.clientid')"
          prop="clientId"
          :rules="[
            { required: true, message: $t('formI18n.all.pleaseEnter') + ' ' + $t('system.otherLogin.clientid'), trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="form.clientId"
            :placeholder="$t('formI18n.all.pleaseEnter') + ' ' + $t('system.otherLogin.clientid')"
          />
        </el-form-item>
        <el-form-item
          label="AgentId"
          prop="agentId"
          :rules="[
            {
              required: true,
              message: $t('system.otherLogin.agentid'),
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.agentId"
            :placeholder="$t('system.otherLogin.agentid')"
          />
        </el-form-item>
        <el-form-item
          label="Secret"
          prop="clientSecret"
          :rules="[
            {
              required: true,
              message: $t('system.otherLogin.companySecret'),
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.clientSecret"
            :placeholder="$t('system.otherLogin.companySecret')"
            show-password
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
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ConfigMixin from "./ConfigMixin";

export default {
  name: "ThirdpartyLoginConfig",
  mixins: [ConfigMixin],
  data() {
    return {};
  },
  async created() {
    this.activeName = "wechatOpenEnvConfig";
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
