<template>
  <div>
    <el-form-item :label="$t('formgen.video.iframeCode')">
      <el-radio-group v-model="activeData.urlType">
        <el-radio label="iframe">{{ $t("formgen.video.videoType2") }}</el-radio>
        <el-radio label="video">{{ $t("formgen.video.videoType1") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="activeData.urlType === 'iframe'"
      :label="$t('formgen.video.iframeCode')"
    >
      <template #label>
        <span>
          {{ $t("formgen.video.iframeCode") }}
          <el-tooltip
            :content="$t('formgen.randNumberConfig.content')"
            class="item"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-input
        v-model="activeData.videoUrl"
        type="textarea"
      />
    </el-form-item>
    <el-form-item
      v-else
      :label="$t('formgen.video.videoUrl')"
    >
      <el-input v-model="activeData.videoUrl" />
      <el-upload
        ref="logoUpload"
        :action="getUploadUrl()"
        :headers="getUploadHeader()"
        :on-progress="() => uploadProgressHandle()"
        :on-success="handleUploadVideoSuccess"
        :show-file-list="false"
        accept=".mp4,.webm,.ogg"
        style="text-align: center"
      >
        <template #trigger>
          <el-button
            class="mt10"
            link
            size="default"
            type="primary"
          >
            {{ $t("formgen.video.uploadVideo") }}
          </el-button>
        </template>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script lang="ts" name="ConfigItemVideo" setup>
import type { videoComponent } from "@/views/formgen/components/GenerateForm/marketingConfig";
import { PropType } from "vue";
import { closeUploadProgressHandle, getUploadHeader, getUploadUrl, uploadProgressHandle } from "@/utils/uploadFile";

const props = defineProps({
  activeData: {
    type: Object as PropType<videoComponent>,
    default() {
      return {};
    }
  }
});

const handleUploadVideoSuccess = (response: any) => {
  props.activeData.videoUrl = response.data;
  closeUploadProgressHandle();
};
</script>
<style lang="scss" scoped>
.input-map-content-container {
  display: none;
}
</style>
