<template>
  <el-card>
    <el-tabs
      class="=tabs"
      v-model="activeName"
      @tab-change="handleTabClick"
    >
      <el-tab-pane
        :label="$t('system.systemConfig.title')"
        name="systemInfoConfig"
      >
        <system-info-config v-if="activeName === 'systemInfoConfig'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('system.mailConfig.title')"
        name="emailEnvConfig"
      >
        <el-form
          ref="emailEnvConfig"
          :model="form"
          label-width="148px"
        >
          <el-form-item
            label="host"
            prop="host"
            :rules="[{ required: true, message: $t('system.mailConfig.host'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.host"
              placeholder="smtp.88.com"
            />
          </el-form-item>
          <el-form-item
            label="port"
            prop="port"
            :rules="[{ required: true, message: $t('system.mailConfig.port'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.port"
              placeholder="465"
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.mailConfig.username')"
            prop="port"
            :rules="[{ required: true, message: $t('system.mailConfig.enterUsername'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.username"
              :placeholder="$t('system.mailConfig.emailAccount')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.mailConfig.authorizationCode')"
            prop="password"
            :rules="[{ required: true, message: $t('system.mailConfig.enterAuthorizationCode'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.password"
              :placeholder="$t('system.mailConfig.authorizationCodeNote')"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit"
            >
              {{ $t("system.systemConfig.save") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('system.smsConfig.title')"
        name="smsEnvConfig"
      >
        <el-form
          ref="smsEnvConfig"
          :model="form"
          label-width="140px"
        >
          <el-form-item
            :label="$t('system.smsConfig.channel')"
            prop="type"
            :rules="[{ required: true, message: $t('system.smsConfig.selectChannel'), trigger: 'blur' }]"
          >
            <el-select
              v-model="form.type"
              :placeholder="$t('system.smsConfig.selectChannel')"
            >
              <el-option
                :label="$t('system.smsConfig.aliyun')"
                value="ALIYUN"
              />
              <el-option
                :label="$t('system.smsConfig.tencentCloud')"
                value="TENCENT_CLOUD"
              />
              <el-option
                :label="$t('system.smsConfig.zywx')"
                value="VEESING"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.type == 'VEESING'"
            :label="$t('system.smsConfig.appId')"
            prop="appId"
            :rules="[{ required: true, message: $t('system.smsConfig.appId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.appId"
              :placeholder="$t('system.smsConfig.appId')"
            />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'VEESING'"
            :label="$t('system.smsConfig.appKey')"
            prop="secretKey"
            :rules="[{ required: true, message: $t('system.smsConfig.appKey'), trigger: 'blur' }]"
          >
            <el-input
              label-width="140px"
              v-model="form.secretKey"
              :placeholder="$t('system.smsConfig.appKey')"
              show-password
            />
          </el-form-item>
          <el-form-item
            label-width="140px"
            v-if="form.type == 'ALIYUN'"
            :label="$t('system.smsConfig.accessKeyId')"
            prop="secretId"
            :rules="[{ required: true, message: $t('system.smsConfig.enterAccessKeyId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.secretId"
              :placeholder="$t('system.smsConfig.enterAccessKeyId')"
            />
          </el-form-item>
          <el-form-item
            label-width="140px"
            v-if="form.type == 'ALIYUN'"
            :label="$t('system.smsConfig.accessKeySecret')"
            prop="secretKey"
            :rules="[{ required: true, message: $t('system.smsConfig.enterAccessKeySecret'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.secretKey"
              :placeholder="$t('system.smsConfig.enterAccessKeySecret')"
              show-password
            />
          </el-form-item>
          <el-form-item
            label-width="140px"
            v-if="form.type == 'ALIYUN'"
            :label="$t('system.smsConfig.smsSignature')"
            prop="sign"
            :rules="[{ required: true, message: $t('system.smsConfig.enterSmsSignature'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.sign"
              :placeholder="$t('system.smsConfig.enterSmsSignature')"
            />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :label="$t('system.smsConfig.secretId')"
            prop="secretId"
            :rules="[{ required: true, message: $t('system.smsConfig.enterSecretId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.secretId"
              :placeholder="$t('system.smsConfig.enterSecretId')"
            />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :label="$t('system.smsConfig.secretKey')"
            prop="secretKey"
            :rules="[{ required: true, message: $t('system.smsConfig.enterSecretKey'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.secretKey"
              :placeholder="$t('system.smsConfig.enterSecretKey')"
            />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :label="$t('system.smsConfig.smsSignature')"
            prop="sign"
            :rules="[{ required: true, message: $t('system.smsConfig.enterSmsSignature'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.sign"
              :placeholder="$t('system.smsConfig.enterSmsSignature')"
            />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :label="$t('system.smsConfig.appId')"
            prop="appId"
            :rules="[{ required: true, message: $t('system.smsConfig.enterAppId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.appId"
              :placeholder="$t('system.smsConfig.enterAppId')"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit"
            >
              {{ $t("system.systemConfig.save") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        :label="$t('system.fileConfig.title')"
        name="fileEnvConfig"
      >
        <oss-config v-if="activeName === 'fileEnvConfig'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('system.fileStorage.wechatOfficialAccount')"
        name="wxMpEnvConfig"
      >
        <el-form
          ref="wxMpEnvConfig"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            label="appId"
            prop="appId"
            :rules="[{ required: true, message: $t('system.fileStorage.appId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.appId"
              :placeholder="$t('system.fileStorage.appId')"
            />
          </el-form-item>
          <el-form-item
            label="appSecret"
            prop="secret"
            :rules="[{ required: true, message: $t('system.fileStorage.appSecret'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.secret"
              :placeholder="$t('system.fileStorage.appSecret')"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="token"
            prop="token"
            :rules="[{ required: true, message: $t('system.fileStorage.token'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.token"
              :placeholder="$t('system.fileStorage.token')"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="aesKey"
            prop="aesKey"
            :rules="[{ required: true, message: $t('system.fileStorage.aesKey'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.aesKey"
              :placeholder="$t('system.fileStorage.aesKey')"
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
        :label="$t('system.wechatPayment.title')"
        name="wxPayEnvConfig"
      >
        <el-alert
          :closable="false"
          :title="$t('system.wechatPayment.note')"
          type="error"
        ></el-alert>
        <el-form
          ref="wxPayEnvConfig"
          :model="form"
          label-width="180px"
          class="mt10"
        >
          <el-form-item
            label="appId"
            prop="appId"
            :rules="[{ required: true, message: $t('system.wechatPayment.appId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.appId"
              :placeholder="$t('system.wechatPayment.officialAccountAppId')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.wechatPayment.merchantId')"
            prop="mchId"
            :rules="[
              {
                required: true,
                message: $t('system.wechatPayment.enterMerchantId'),
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.mchId"
              :placeholder="$t('system.wechatPayment.enterMerchantId')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.wechatPayment.merchantKey')"
            prop="mchKey"
            :rules="[
              {
                required: true,
                message: $t('system.wechatPayment.enterMerchantKey'),
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.mchKey"
              :placeholder="$t('system.wechatPayment.enterMerchantKey')"
              show-password
            />
          </el-form-item>
          <el-form-item
            :label="$t('system.wechatPayment.callbackUrl')"
            prop="notifyUrl"
            :rules="[
              {
                required: true,
                message: $t('system.wechatPayment.enterCallbackUrl'),
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.notifyUrl"
              :placeholder="$t('system.wechatPayment.enterCallbackUrl')"
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
        :label="$t('system.ocrRecognition.title')"
        name="ocrEnvConfig"
      >
        <el-form
          ref="ocrEnvConfig"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            label="appId"
            prop="appId"
            :rules="[{ required: true, message: $t('system.ocrRecognition.appId'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.appId"
              :placeholder="$t('system.ocrRecognition.appId')"
            />
          </el-form-item>
          <el-form-item
            label="apiKey"
            prop="apiKey"
            :rules="[{ required: true, message: $t('system.ocrRecognition.apiKey'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.apiKey"
              :placeholder="$t('system.ocrRecognition.apiKey')"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="secretKey"
            prop="secretKey"
            :rules="[{ required: true, message: $t('system.ocrRecognition.secretKey'), trigger: 'blur' }]"
          >
            <el-input
              v-model="form.secretKey"
              :placeholder="$t('system.ocrRecognition.secretKey')"
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
        :label="$t('system.faceConfig.title')"
        name="faceIdentifyEnvConfig"
      >
        <face-config v-if="activeName === 'faceIdentifyEnvConfig'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('system.faceVerification.wechatMiniProgram')"
        name="wxMaEnvConfig"
      >
        <el-form
          ref="wxMaEnvConfig"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            label="Appid"
            prop="appid"
            :rules="[
              {
                required: true,
                message: $t('system.faceVerification.miniProgramAppId'),
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.appid"
              :placeholder="$t('system.faceVerification.miniProgramAppId')"
            />
          </el-form-item>
          <el-form-item
            label="secret"
            prop="secret"
            :rules="[
              {
                required: true,
                message: $t('system.faceVerification.miniProgramSecret'),
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.secret"
              :placeholder="$t('system.faceVerification.miniProgramSecret')"
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
        label="企业微信"
        name="wxCpEnvConfig"
      >
        <WxCpConfig v-if="activeName === 'wxCpEnvConfig'" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('system.otherLogin.title')"
        name="thirdpartyLoginConfig"
      >
        <thirdparty-login-config v-if="activeName === 'thirdpartyLoginConfig'" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ConfigMixin from "./subconfig/ConfigMixin";
import SystemInfoConfig from "./subconfig/SystemInfoConfig.vue";
import OssConfig from "./subconfig/OssConfig.vue";
import ThirdpartyLoginConfig from "./subconfig/ThirdpartyLogin.vue";
import FaceConfig from "./subconfig/FaceConfig.vue";
import WxCpConfig from "./subconfig/WxCpConfig.vue";

export default {
  name: "ConfigForm",
  components: {
    FaceConfig,
    ThirdpartyLoginConfig,
    SystemInfoConfig,
    OssConfig,
    WxCpConfig
  },
  mixins: [ConfigMixin],
  methods: {
    handleTabClick() {
      if (!["systemInfoConfig", "fileEnvConfig", "thirdpartyLoginConfig", "faceEnvConfig"].includes(this.activeName)) {
        this.handleClick();
      }
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 35%;
}
</style>
