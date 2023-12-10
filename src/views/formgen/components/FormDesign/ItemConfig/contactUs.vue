<template>
  <div>
    <el-form-item label="Logo">
      <el-input
        v-model="activeData.logoUrl"
        :placeholder="$t('formgen.image.imageAddressLabel')"
        clearable
        size="default"
      />
      <el-upload
        ref="logoUpload"
        :action="getUploadUrl()"
        :headers="getUploadHeader()"
        :on-progress="() => uploadProgressHandle()"
        :on-success="handleUploadLogoSuccess"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
        style="text-align: center"
      >
        <template #trigger>
          <el-button
            class="mt10"
            link
            size="default"
            type="primary"
          >
            {{ $t("formgen.image.uploadImageLabel") }}
          </el-button>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item :label="$t('formgen.contactUs.name')">
      <el-input
        v-model="activeData.name"
        :placeholder="$t('formgen.contactUs.namePlaceholder')"
      />
    </el-form-item>
    <el-divider />
    <el-form-item :label="$t('formgen.contactUs.buttonText1')">
      <el-input v-model="activeData.contactBtnText" />
    </el-form-item>
    <el-form-item :label="$t('formgen.contactUs.contact')">
      <el-select v-model="activeData.contactType">
        <el-option
          v-for="(item, index) in contactTypeOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('formgen.contactUs.contactContent')">
      <el-input
        v-model="activeData.contactContent"
        :placeholder="$t('formgen.image.imageAddressLabel')"
        clearable
      />
      <el-upload
        v-if="activeData.contactType === '1'"
        ref="logoUpload"
        :action="getUploadUrl()"
        :headers="getUploadHeader()"
        :on-progress="() => uploadProgressHandle()"
        :on-success="handleUploadQrcodeSuccess"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
        style="text-align: center"
      >
        <template #trigger>
          <el-button
            class="mt10"
            link
            size="default"
            type="primary"
          >
            {{ $t("formgen.image.uploadImageLabel") }}
          </el-button>
        </template>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script lang="ts" name="ConfigItemContactUs" setup>
import { closeUploadProgressHandle, getUploadHeader, getUploadUrl, uploadProgressHandle } from "@/utils/uploadFile";
import { i18n } from "@/i18n";

const props = defineProps({
  activeData: {
    type: Object,
    default() {
      return {};
    }
  }
});

const contactTypeOptions = [
  {
    label: i18n.global.t("formgen.contactUs.wechatNumber"),
    value: "1"
  },
  {
    label: i18n.global.t("formgen.contactUs.phoneNumber"),
    value: "3"
  }
];

const handleUploadLogoSuccess = (response: any) => {
  props.activeData.logoUrl = response.data;
  closeUploadProgressHandle();
};

const handleUploadQrcodeSuccess = (response: any) => {
  props.activeData.contactContent = response.data;
  closeUploadProgressHandle();
};
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
