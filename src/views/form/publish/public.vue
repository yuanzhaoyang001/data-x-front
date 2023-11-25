<template>
  <el-card>
    <template #header>
      <div class="m10">
        <span>{{ $t("form.public.publicRelease") }}</span>
        <span class="desc-text ml10">{{ $t("form.public.publicReleaseDescription") }}</span>
      </div>
    </template>
    <p class="desc-text m20">{{ $t("form.public.enableGenerateLink") }}</p>
    <el-switch
      v-model="publishStatus"
      class="ml35"
      @change="handlePublishChange"
    />
    <url-operate
      v-if="publishStatus"
      :link-url="createDataLink"
      class="mt20 ml25"
      qr-code-mode="download"
    />
    <el-divider />
    <p class="desc-text mb20">{{ $t("form.public.addExtensionAttributes") }}</p>
    <el-row
      class="ml20 mb10"
      :gutter="10"
    >
      <el-col :span="12">
        <el-input
          v-model="createDataLink"
          disabled
          readonly
        />
      </el-col>
      <el-col :span="6">
        <el-input
          v-model.trim="extValue"
          :placeholder="$t('form.public.extensionValue')"
        />
      </el-col>
      <el-col :span="5">
        <el-button
          type="primary"
          @click="handleSaveLinkExt"
        >
          {{ $t("form.public.generateLink") }}
        </el-button>
      </el-col>
    </el-row>
    <el-divider />
    <div v-if="publishStatus">
      <el-row
        v-for="ext in linkExtList"
        :key="ext.id"
        type="flex"
        justify="center"
        align="middle"
        class="ml20 mb10"
        :gutter="20"
      >
        <el-col :span="3">
          <span class="ext-label one-text-overflow">
            {{ ext.extValue }}
          </span>
        </el-col>
        <el-col :span="20">
          <url-operate
            :link-url="`${createDataLink}?ext=${ext.extValue}`"
            style="margin: 0 !important"
          />
        </el-col>
        <el-col
          :span="1"
          class="delete-icon"
        >
          <el-icon
            class="text-danger"
            @click="handleDeleteLinkExt(ext)"
          >
            <ele-Delete />
          </el-icon>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import UrlOperate from "./UrlOperate.vue";
import {
  deleteFormLinkExtRequest,
  getFormLinkExtListRequest,
  getFormStatusRequest,
  publishFormRequest,
  saveFormLinkExtRequest,
  stopPublishFormRequest
} from "@/api/project/publish";
import { i18n } from "@/i18n";

export default {
  name: "PublicPublish",
  components: {
    UrlOperate
  },
  data() {
    return {
      publishStatus: false,
      createDataLink: "",
      formKey: "",
      extValue: "",
      linkExtList: []
    };
  },
  created() {
    this.formKey = this.$route.query.key;
    let url = window.location.protocol + "//" + window.location.host;
    this.createDataLink = `${url}/s/${this.formKey}`;
    this.getProjectStatus();
    this.getFormLinkExtList();
  },
  methods: {
    getProjectStatus() {
      getFormStatusRequest(this.formKey).then(res => {
        if (res.data.status == 2) {
          this.publishStatus = true;
        } else {
          this.publishStatus = false;
        }
      });
    },
    getFormLinkExtList() {
      getFormLinkExtListRequest(this.formKey).then(res => {
        this.linkExtList = res.data;
      });
    },
    handleSaveLinkExt() {
      if (!this.extValue) {
        this.msgWarning(i18n.global.t("form.public.enterExtensionName"));
        return;
      }
      if (!this.publishStatus) {
        this.msgError(i18n.global.t("form.public.generateFailed"));
        return;
      }
      saveFormLinkExtRequest({
        formKey: this.formKey,
        extValue: this.extValue
      }).then(() => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.extValue = "";
        this.getFormLinkExtList();
      });
    },
    handleDeleteLinkExt(row) {
      deleteFormLinkExtRequest(row).then(() => {
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
        this.getFormLinkExtList();
      });
    },
    handlePublishChange(val) {
      if (val) {
        this.publishProject();
      } else {
        this.stopPublishProject();
      }
    },
    publishProject() {
      publishFormRequest({ formKey: this.formKey }).then(() => {
        this.publishStatus = true;
        this.msgSuccess(i18n.global.t("formI18n.all.success"));
      });
    },
    stopPublishProject() {
      stopPublishFormRequest({ formKey: this.formKey }).then(res => {
        if (res.data) {
          this.msgSuccess(i18n.global.t("formI18n.all.success"));
          this.getProjectStatus();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.delete-icon {
  cursor: pointer;
  z-index: 999;
}

.ext-label {
  color: #303133;
}
</style>
