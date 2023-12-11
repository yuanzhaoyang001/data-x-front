<template>
  <div class="contact-us-setting">
    <el-form-item label="Logo">
      <el-input
        v-model="activeData.logoUrl"
        :placeholder="$t('formgen.image.imageAddressLabel')"
        clearable
        size="default"
      />

      <div class="mt10">
        <span class="el-form-item__label">
          {{ $t("formgen.contactUs.logoHeight") }}
        </span>
        <el-input-number
          v-model="activeData.logoWidth"
          :max="1000"
          :min="0"
          :step="1"
          controls-position="right"
          size="small"
        />
      </div>
      <div class="mt10">
        <span class="el-form-item__label">
          {{ $t("formgen.contactUs.logoWidth") }}
        </span>
        <el-input-number
          v-model="activeData.logoHeight"
          :max="1000"
          :min="0"
          :step="1"
          controls-position="right"
          size="small"
        />
      </div>
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
    <el-divider>{{ $t("formgen.contactUs.name") }}</el-divider>
    <div>
      <div>
        <tinymce
          :id="activeData.formId"
          :key="activeData.formId"
          v-model:value="activeData.name"
        />
      </div>
    </div>
    <el-divider />
    <el-form-item :label="$t('formgen.contactUs.buttonText1')">
      <el-input v-model="activeData.contactBtnText" />
    </el-form-item>
    <el-form-item :label="$t('formgen.contactUs.buttonColor')">
      <el-color-picker v-model="activeData.btnColor" />
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
import tinymce from "@/views/formgen/components/tinymce/index.vue";

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
.contact-us-setting {
  :deep(.tox .tox-tbtn) {
    height: 28px;
  }
}
</style>
