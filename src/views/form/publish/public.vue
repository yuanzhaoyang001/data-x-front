<template>
  <el-card>
    <template #header>
      <div class="m10">
        <span>{{ $t("form.public.publicRelease") }}</span>
        <span class="desc-text ml10">{{ $t("form.public.publicReleaseDescription") }}</span>
      </div>
    </template>
    <div class="body-wrap">
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
      <div v-if="miniAppQrcodeUrl">
        <el-divider>{{ $t("form.public.miniAppQrCode") }}</el-divider>
        <div class="text-center">
          <img
            :src="`data:image/png;base64,${miniAppQrcodeUrl}`"
            class="miniapp-qrcode"
          />
        </div>
      </div>
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
            size="default"
            readonly
          />
        </el-col>
        <el-col :span="6">
          <el-input
            size="default"
            v-model.trim="extValue"
            :placeholder="$t('form.public.extensionValue')"
          />
        </el-col>
        <el-col :span="5">
          <el-button
            type="primary"
            size="default"
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
          <el-col :span="18">
            <url-operate
              :link-url="`${createDataLink}?ext=${ext.extValue}`"
              style="margin: 0 !important"
            />
          </el-col>
          <el-col
            :span="3"
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
    </div>
  </el-card>
</template>

<script setup lang="ts" name="PublicPublish">
import UrlOperate from "./UrlOperate.vue";
import {
  deleteFormLinkExtRequest,
  getFormLinkExtListRequest,
  getFormStatusRequest,
  getMobileFormShareQrcodeRequest,
  publishFormRequest,
  saveFormLinkExtRequest,
  stopPublishFormRequest
} from "@/api/project/publish";
import { i18n } from "@/i18n";
import { getBaseUrlPath } from "@/utils/auth";
import { MessageUtil } from "@/utils/messageUtil";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const publishStatus = ref(false);
const createDataLink = ref("");
const formKey = ref("");
const extValue = ref("");
const linkExtList = ref<any[]>([]);

const miniAppQrcodeUrl = ref("");

const getProjectStatus = () => {
  getFormStatusRequest(formKey.value).then(res => {
    if (res.data.status == 2) {
      publishStatus.value = true;
    } else {
      publishStatus.value = false;
    }
  });
};

const getFormLinkExtList = () => {
  getFormLinkExtListRequest(formKey.value).then(res => {
    linkExtList.value = res.data;
  });
};

const handleSaveLinkExt = () => {
  if (!extValue.value) {
    MessageUtil.warning(i18n.global.t("form.public.enterExtensionName"));
    return;
  }
  if (!publishStatus.value) {
    MessageUtil.error(i18n.global.t("form.public.generateFailed"));
    return;
  }
  saveFormLinkExtRequest({
    formKey: formKey.value,
    extValue: extValue.value
  }).then(() => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    extValue.value = "";
    getFormLinkExtList();
  });
};

const handleDeleteLinkExt = row => {
  deleteFormLinkExtRequest(row).then(() => {
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
    getFormLinkExtList();
  });
};

const handlePublishChange = val => {
  if (val) {
    publishProject();
  } else {
    stopPublishProject();
  }
};

const publishProject = () => {
  publishFormRequest({ formKey: formKey.value }).then(() => {
    publishStatus.value = true;
    MessageUtil.success(i18n.global.t("formI18n.all.success"));
  });
};

const stopPublishProject = () => {
  stopPublishFormRequest({ formKey: formKey.value }).then(res => {
    if (res.data) {
      MessageUtil.success(i18n.global.t("formI18n.all.success"));
      getProjectStatus();
    }
  });
};

const getMiniAppQrCodeUrl = () => {
  getMobileFormShareQrcodeRequest(formKey.value).then(res => {
    miniAppQrcodeUrl.value = res.data;
  });
};

const route = useRoute();

onMounted(() => {
  formKey.value = route.query.key as string;
  let url = getBaseUrlPath();
  createDataLink.value = `${url}/s/${formKey.value}`;
  getProjectStatus();
  getFormLinkExtList();
  getMiniAppQrCodeUrl();
});
</script>
<style lang="scss" scoped>
.body-wrap {
  height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.delete-icon {
  cursor: pointer;
  z-index: 999;
}

.ext-label {
  color: #303133;
}

.miniapp-qrcode {
  width: 150px;
  height: 150px;
}
</style>
