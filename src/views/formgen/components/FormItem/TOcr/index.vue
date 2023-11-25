<template>
  <div class="w100">
    <el-upload
      :action="action"
      accept="image/*"
      :before-remove="beforeRemove"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :show-file-list="false"
    >
      <el-button
        icon="ele-Search"
        :loading="loading"
        type="primary"
      >
        {{ $t("formgen.ocr.identifyingText") }}
      </el-button>
      <template #tip>
        <div class="el-upload__tip">{{ $t("formgen.ocr.tips") }}</div>
      </template>
    </el-upload>
  </div>
</template>

<script>
import mixin from "../mixin";
import { baseUrl } from "@/utils/auth";
import { i18n } from "@/i18n";

export default {
  name: "TOcr",
  mixins: [mixin],
  props: ["models"],
  emits: ["ocr-success"],
  data() {
    return {
      fileList: [],
      action: "",
      loading: false
    };
  },
  created() {
    this.action = baseUrl + "/form/common/ocr";
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {},
    handleSuccess(res, file) {
      this.loading = false;
      this.$message.success(i18n.global.t("formI18n.all.success"));
      if (!Object.keys(this.item.fieldMapping).length) {
        this.$message.error(i18n.global.t("formgen.ocr.errorMapping"));
        return;
      }
      let values = {};
      if (res.data) {
        Object.keys(res.data).forEach(key => {
          let modelKey = this.item.fieldMapping[key];
          values[modelKey] = res.data[key];
        });
      }
      this.$emit("ocr-success", values);
      // this.models[`${this.item.vModel}`] = val
    },
    handleError(err, file, fileList) {
      this.$message.error(err);
      this.loading = false;
    },
    handleBeforeUpload(file) {
      this.loading = true;
    }
  }
};
</script>
