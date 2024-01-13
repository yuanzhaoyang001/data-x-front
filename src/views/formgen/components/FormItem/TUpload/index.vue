<template>
  <div>
    <el-upload
      v-bind="{ ...item }"
      :accept="(item.accept || []).join(',')"
      :action="item.action"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
    >
      <el-button
        icon="ele-Upload"
        size="default"
      >
        {{ item.config.buttonText }}
      </el-button>
      <template #tip>
        <div
          v-if="item.config.showTip"
          class="el-upload__tip"
        >
          只能上传不超过 {{ item.config.fileSize }}{{ item.config.sizeUnit }}的{{
            (item.accept || []).join(",")
          }}文件,最多不超过{{ item.limit }}个文件
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
import uploadMixin from "../uploadMixin";

export default {
  name: "TUpload",
  mixins: [uploadMixin],
  data() {
    return {};
  },
  methods: {
    handlePreview(file) {
      window.open(file.url);
    }
  }
};
</script>
