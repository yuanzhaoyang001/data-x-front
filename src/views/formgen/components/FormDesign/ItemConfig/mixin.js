import { baseUrl, getTokenHeader } from "@/utils/auth";

export default {
  props: ["activeData"],
  data() {
    return {};
  },
  computed: {
    getUploadHeader() {
      return getTokenHeader();
    },
    getUploadUrl() {
      // 动态baseURL
      return `${baseUrl}/user/file/upload`;
    }
  },
  created() {},
  mounted() {},
  methods: {
    uploadProgressHandle() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    closeUploadProgressHandle() {
      setTimeout(() => {
        this.loading.close();
      }, 100);
    }
  }
};
