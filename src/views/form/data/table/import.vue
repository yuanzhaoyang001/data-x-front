<template>
  <!-- 数据导入 -->
  <el-dialog
    :title="$t('form.fileUpload.title')"
    :close-on-click-modal="false"
    v-model="upload.open"
    append-to-body
    width="400px"
    class="t-dialog"
  >
    <el-upload
      ref="upload"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
      :headers="upload.headers"
      :limit="1"
      :data="upload.data"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      accept=".xlsx, .xls"
      class="upload-demo"
      drag
    >
      <el-icon>
        <ele-Upload />
      </el-icon>
      <div class="el-upload__text">
        {{ $t("form.fileUpload.uploadText") }}
      </div>
      <template #tip>
        <div class="el-upload__tip">
          {{ $t("form.fileUpload.tip1") }}
          <el-link
            style="font-size: 12px"
            type="primary"
            @click="importTemplate"
          >
            {{ $t("form.fileUpload.tip2") }}
          </el-link>
        </div>
        <div class="el-upload__tip">{{ $t("form.fileUpload.tip3") }}</div>
        <div class="el-upload__tip text-danger">
          {{ $t("form.fileUpload.tip4") }}
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          size="default"
          type="primary"
          @click="submitFileForm"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
        <el-button
          size="default"
          @click="upload.open = false"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { baseUrl, getToken } from "@/utils/auth";
import { downloadImportTemplateRequest } from "@/api/project/data";
import { i18n } from "@/i18n";

export default {
  name: "Import",
  components: {},
  props: {
    formKey: {
      type: String,
      default: ""
    }
  },
  emits: ["success"],
  data() {
    return {
      upload: {
        // 是否显示弹出层
        open: false,
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        data: {
          formKey: ""
        },
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: baseUrl + "/user/form/data/import"
      }
    };
  },
  created() {
    this.upload.data.formKey = this.formKey;
  },
  methods: {
    /** 下载模板操作 */
    importTemplate() {
      downloadImportTemplateRequest({ formKey: this.formKey }).then(response => {
        this.download(response, i18n.global.t("form.fileUpload.tip5"));
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.data, i18n.global.t("form.fileUpload.tip6"), { dangerouslyUseHTMLString: true });
      this.$emit("success");
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
