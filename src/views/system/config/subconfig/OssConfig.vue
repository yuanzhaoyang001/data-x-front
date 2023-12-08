<template>
  <div>
    <el-alert
      class="mb10"
      :title="$t('system.fileConfig.desc')"
      type="success"
    />
    <el-form
      ref="fileEnvConfig"
      :model="form"
      label-width="150px"
    >
      <el-form-item
        :label="$t('system.fileConfig.savePlatform')"
        prop="ossType"
        :rules="[{ required: true, message: $t('system.fileConfig.selectPlatform'), trigger: 'blur' }]"
      >
        <el-select
          v-model="form.ossType"
          :placeholder="$t('system.fileConfig.selectPlatform')"
        >
          <el-option
            :label="$t('system.fileConfig.aliyun')"
            value="ALIYUN"
          />
          <el-option
            :label="$t('system.fileConfig.qiniu')"
            value="QINIU"
          />
          <el-option
            :label="$t('system.fileConfig.upyun')"
            value="UPYUN"
          />
          <el-option
            :label="$t('system.fileConfig.local')"
            value="LOCAL"
          />
          <el-option
            :label="$t('system.fileConfig.genericS3')"
            value="S3"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.ossType !== 'LOCAL'"
        label="AccessKeyID"
        prop="accessKeyId"
        :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' AccessKeyID', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.accessKeyId"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item
        v-if="form.ossType !== 'LOCAL'"
        label="AccessKeySecret"
        prop="accessKeySecret"
        :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' AccessKeySecret', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.accessKeySecret"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item
        v-if="form.ossType === 'ALIYUN' || form.ossType === 'S3'"
        label="Endpoint"
        prop="endpoint"
        :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' Endpoint', trigger: 'blur' }]"
      >
        <el-input v-model="form.endpoint" />
      </el-form-item>
      <el-form-item
        v-if="form.ossType !== 'LOCAL'"
        label="bucketName"
        prop="bucketName"
        :rules="[{ required: true, message: $t('formI18n.all.pleaseEnter') + ' bucketName', trigger: 'blur' }]"
      >
        <el-input v-model="form.bucketName" />
      </el-form-item>
      <el-form-item
        v-if="form.ossType === 'LOCAL'"
        :label="$t('system.fileConfig.storagePath')"
        prop="uploadFolder"
        :rules="[{ required: true, message: $t('system.fileConfig.enterStoragePath'), trigger: 'blur' }]"
      >
        <el-input v-model="form.uploadFolder" />
      </el-form-item>
      <el-form-item
        :label="$t('system.fileConfig.subdirectory')"
        prop="prefixPath"
        v-if="form.ossType !== 'LOCAL'"
        :rules="[
          // { required: true, message: '请输入如 image 格式 不能携带符号', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]*$/,
            message: $t('system.fileConfig.enterSubdirectory'),
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="form.prefixPath" />
      </el-form-item>
      <el-form-item
        :label="$t('system.fileConfig.accessDomain')"
        prop="domain"
        :rules="[
          {
            required: true,
            message: $t('system.fileConfig.enterAccessDomain'),
            trigger: 'blur'
          }
          // { pattern: /^(https?:\/\/[^\/]+)$/, message: '请输入域名 如 https://oss.tduckcloud.com', trigger: 'blur' }
        ]"
      >
        <el-input v-model="form.domain" />
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
  </div>
</template>

<script>
import ConfigMixin from "./ConfigMixin";

export default {
  name: "OssConfig",
  mixins: [ConfigMixin],
  data() {
    return {};
  },
  async created() {
    this.activeName = "fileEnvConfig";
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
