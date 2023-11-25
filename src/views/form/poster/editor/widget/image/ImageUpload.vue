<template>
  <div class="image-uploader">
    <div>
      <el-upload
        ref="logoUpload"
        :action="uploadUrl"
        :headers="uploadHeader"
        :on-success="uploadLogoHandle"
        :show-file-list="false"
        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
      >
        <template #trigger>
          <div class="upload-wrap">
            <el-icon size="20">
              <ele-Plus />
            </el-icon>
          </div>
        </template>
      </el-upload>
    </div>
    <div class="label">{{ label }}</div>
    <div class="image-wrap">
      <el-image
        :preview-src-list="[value]"
        :src="value"
        class="pic"
      >
        <template #error>
          <div class="image-slot">
            <el-icon size="25">
              <ele-Picture />
            </el-icon>
          </div>
        </template>
      </el-image>
      <el-icon
        v-if="value"
        class="delete"
        @click="handleRemove"
      >
        <ele-Delete />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { baseUrl, getTokenHeader } from "@/utils/auth";

defineProps({
  /**
   * 描述文字
   */
  label: {
    type: String,
    default: ""
  },
  /**
   * value
   */
  value: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:value"]);

const uploadUrl = `${baseUrl}/user/file/upload`;

const uploadLogoHandle = (response: any) => {
  emit("update:value", response.data);
};

const handleRemove = () => {
  emit("update:value", "");
};

const uploadHeader = getTokenHeader();
</script>

<style lang="scss" scoped>
.image-uploader {
  margin-bottom: 10px;
  margin-top: 10px;
  background: #f3f3f3;
  border-radius: 6px;
  padding: 8px;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  width: 100%;
  user-select: none;
}

.pic {
  height: 52px;
  width: 52px;
}

.image-wrap {
  position: relative;

  .delete {
    position: absolute;
    top: 0;
    right: 0px;
    font-size: 14px;
    color: var(--el-color-danger);

    &:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
}

.image-slot {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0px solid rgba(0, 0, 0, 0.08);

  .el-icon {
    color: var(--el-color-info-light-3);
  }
}

.label {
  color: var(--el-color-info-light-3);
}

.upload-wrap {
  background-color: var(--el-bg-color);
  height: 26px;
  width: 26px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  border: var(--el-border);
  border-radius: 4px;

  .el-icon {
    color: var(--el-color-info-light-3);
  }
}
</style>
