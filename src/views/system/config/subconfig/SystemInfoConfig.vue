<template>
  <el-form
    ref="systemInfoConfig"
    :model="form"
    label-width="168px"
    v-if="!loading"
  >
    <el-form-item
      :label="$t('system.systemConfig.version')"
      prop="name"
      :rules="[{ required: true, message: $t('system.systemConfig.enterSystemName'), trigger: 'blur' }]"
    >
      <el-tag
        size="default"
        type="success"
        effect="dark"
      >
        V{{ appVersion }}
      </el-tag>
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.systemName')"
      prop="name"
      :rules="[{ required: true, message: $t('system.systemConfig.enterSystemName'), trigger: 'blur' }]"
    >
      <el-input
        style="width: 400px"
        v-model="form.name"
      />
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.uploadLogo')"
      prop="logoImg"
      :rules="[{ required: true, message: $t('system.systemConfig.enterLogo'), trigger: 'blur' }]"
    >
      <image-upload v-model:value="form.logoImg" />
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.loginBackground')"
      prop="backgroundImage"
      :rules="[{ required: false, message: $t('system.systemConfig.uploadLoginBackground'), trigger: 'blur' }]"
    >
      <image-upload v-model:value="form.backgroundImage" />
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.domain')"
      prop="webBaseUrl"
      :rules="[{ required: true, message: $t('system.systemConfig.enterDomain'), trigger: 'blur' }]"
    >
      <el-input
        style="width: 400px"
        v-model="form.webBaseUrl"
        placeholder="https://pro.tduckcloud.com/"
      />
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.guestLogin')"
      prop="allowThirdPartyLogin"
    >
      <template #label>
        <span>{{ $t("system.systemConfig.thirdPartyRegistration") }}</span>
      </template>
      <el-switch v-model="form.allowThirdPartyLogin" />
      <span class="desc-text ml10">{{ $t("system.systemConfig.thirdPartyLoginDescription") }}</span>
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.thirdPartyPlatforms')"
      prop="thirdPartyLoginTypeList"
      v-if="form.thirdPartyLoginTypeList"
    >
      <el-checkbox-group v-model="form.thirdPartyLoginTypeList">
        <el-checkbox
          v-for="type in thirdPartyLoginTypeList"
          :label="type.value"
          :key="type.value"
        >
          {{ type.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      :label="$t('system.systemConfig.copyright')"
      prop="copyright"
      :rules="[{ required: true, message: $t('system.systemConfig.enterCopyright'), trigger: 'blur' }]"
    >
      <tinymce
        v-model:value="form.copyright"
        :height="192"
        toolbar="undo redo | blocks fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat"
        placeholder="Copyright © 2018-2021 tduckcloud.com All Rights Reserved."
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
</template>

<script>
import ConfigMixin from "./ConfigMixin";
import constants from "@/utils/constants";
import Tinymce from "@/views/formgen/components/tinymce/index.vue";
import { i18n } from "@/i18n";

export default {
  name: "SystemInfoConfig",
  mixins: [ConfigMixin],
  components: { Tinymce },
  data() {
    return {
      loading: true,
      thirdPartyLoginTypeList: [
        {
          label: i18n.global.t("system.systemConfig.wechat"),
          value: "wechatOpen"
        },
        {
          label: i18n.global.t("system.systemConfig.enterpriseWeChat"),
          value: "wechatEnterprise"
        }
      ]
    };
  },
  computed: {
    appVersion() {
      return constants.version;
    }
  },
  async created() {
    await this.handleClick();
    // 判断是否有thirdPartyLoginTypeList 没有的话给加一个 新版本加的 不然会报错
    if (!this.form.thirdPartyLoginTypeList) {
      this.form["thirdPartyLoginTypeList"] = [];
      this.form["allowThirdPartyLogin"] = false;
    }
    this.loading = false;
  },
  mounted() {}
};
</script>
