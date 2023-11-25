<template>
  <div>
    <el-upload
      v-bind="{ ...item }"
      :action="item.action"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-progress="handleProgress"
      list-type="picture-card"
    >
      <el-icon>
        <ele-Plus />
      </el-icon>
    </el-upload>
    <el-image-viewer
      v-if="showViewer"
      :z-index="9999"
      :on-close="handleCloseImageViewer"
      :initial-index="showImageIndex"
      :url-list="urlList"
    />
  </div>
</template>

<script>
import uploadMixin from "../uploadMixin";

export default {
  name: "TImageUpload",
  components: {},
  mixins: [uploadMixin],
  data() {
    return {
      showViewer: false,
      showImageIndex: 0
    };
  },
  computed: {
    urlList() {
      return this.changeValue.map(item => item.url);
    }
  },
  methods: {
    // 上传成功
    handlePictureCardPreview(file) {
      // 数据回显时结构不同
      let url = file.response && file.response.data;
      if (!url) {
        url = file.url;
      }
      // 找到下标
      this.showImageIndex = this.changeValue.findIndex(item => item.url === url);
      this.showViewer = true;
    },
    // 关闭图片预览
    handleCloseImageViewer() {
      this.showViewer = false;
    }
  }
};
</script>
