<template>
  <div>
    <el-form-item :label="$t('formgen.image.imageAddressLabel')">
      <el-input
        size="default"
        v-model="activeData.src"
        :placeholder="$t('formgen.image.imageAddressLabel')"
      />
      <el-upload
        ref="logoUpload"
        :action="getUploadUrl"
        :headers="getUploadHeader"
        :on-progress="uploadProgressHandle"
        :on-success="handleUploadSuccess"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
        style="text-align: center"
      >
        <template #trigger>
          <el-button
            size="default"
            link
            type="primary"
            class="mt10"
          >
            {{ $t("formgen.image.uploadImageLabel") }}
          </el-button>
        </template>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  name: "ConfigItemImage",
  mixins: [mixin],
  props: ["activeData"],
  methods: {
    handleUploadSuccess(response) {
      this.activeData["src"] = response.data;
      this.activeData.src = response.data;
      this.closeUploadProgressHandle();
    }
  }
};
</script>
