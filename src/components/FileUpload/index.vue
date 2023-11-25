<template>
  <div class="upload-file">
    <el-upload
      ref="upload"
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="1"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
    >
      <!-- 上传按钮 -->
      <el-button type="primary">{{ $t("formI18n.upload.chooseFile") }}</el-button>
      <!-- 上传提示 -->
      <template #tip>
        <div
          v-if="showTip"
          class="el-upload__tip"
        >
          {{ $t("formI18n.upload.pleaseUpload") }}
          <template v-if="fileSize">
            {{ $t("formI18n.upload.sizeNotExceed") }}
            <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType">
            {{ $t("formI18n.upload.formatIs") }}
            <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
          </template>
          {{ $t("formI18n.upload.file") }}
        </div>
      </template>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group
      class="upload-file-list el-upload-list el-upload-list--text"
      name="el-fade-in-linear"
      tag="ul"
    >
      <li
        v-for="(file, index) in list"
        :key="file.uid"
        class="el-upload-list__item ele-upload-list__item-content"
      >
        <el-link
          :href="file.url"
          :underline="false"
          target="_blank"
        >
          <span class="el-icon-document">{{ getFileName(file.name) }}</span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link
            :underline="false"
            type="danger"
            @click="handleDelete(index)"
          >
            {{ $t("formI18n.upload.delete") }}
          </el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { baseUrl, getToken } from "@/utils/auth";
import { i18n } from "@/i18n";

export default {
  props: {
    // 值
    value: [String, Object, Array],
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf"]
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:value"],
  data() {
    return {
      uploadFileUrl: baseUrl + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      },
      fileList: []
    };
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
    // 列表
    list() {
      let temp = 1;
      if (this.value) {
        // 首先将值转为数组
        const list = Array.isArray(this.value) ? this.value : [this.value];
        // 然后将数组转为对象数组
        return list.map(item => {
          if (typeof item === "string") {
            item = { name: item, url: item };
          }
          item.uid = item.uid || new Date().getTime() + temp++;
          return item;
        });
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fileList = [];
        return [];
      }
    }
  },
  created() {
    this.fileList = this.list;
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(
            `${i18n.t("formI18n.upload.fileFormatIncorrect")} ${this.fileType.join("/")}${i18n.t("formI18n.upload.formatIs")}!`
          );
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`${i18n.t("formI18n.upload.uploadFileSizeExceed")} ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(i18n.t("formI18n.upload.singleFileUploadOnly"));
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error(i18n.t("formI18n.upload.uploadFailedRetry"));
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      this.$message.success(i18n.t("formI18n.upload.uploadSuccess"));
      this.$emit("update:value", res.url);
    },
    // 删除文件
    handleDelete(index) {
      this.fileList.splice(index, 1);
      this.$emit("update:value", "");
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1).toLowerCase();
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
