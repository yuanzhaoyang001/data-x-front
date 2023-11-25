export default {
  props: ["value", "item"],
  data() {
    return {
      fileList: [],
      changeValue: this.value || []
    };
  },
  computed: {},
  created() {
    this.fileList = this.changeValue.map(item => {
      return {
        name: item.name,
        url: item.url,
        status: "success"
      };
    });
  },
  watch: {
    changeValue: {
      handler(newValue, oldValue) {
        this.$emit("update:value", newValue);
      },
      deep: true
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.changeValue.push({
        name: file.name,
        url: response.data
      });
      console.log(file.name);
      console.log(response.data);
      console.log(this.changeValue);
    },
    handleRemove(file) {
      let index = this.changeValue.findIndex(item => item.url === file.url);
      this.changeValue.splice(index, 1);
    },
    handleProgress(event, file, fileList) {},
    handleError(err, file, fileList) {},
    handleExceed() {
      this.$message.error(`最多上传${this.item.limit}个文件`);
    },
    beforeUpload(file) {
      console.log(file);
      let sizeUnitNum = 1;
      // 文件大小判断
      switch (this.item.config.sizeUnit) {
        case "KB":
          sizeUnitNum = 1024;
          break;
        case "MB":
          sizeUnitNum = 1024 * 1024;
          break;
        case "GB":
          sizeUnitNum = 1024 * 1024 * 1024;
          break;
      }
      let totalSize = this.item.config.fileSize * sizeUnitNum;
      if (file.size > totalSize) {
        this.$message.error(`上传图片大小不能超过${this.item.config.fileSize}${this.item.config.sizeUnit}`);
        return false;
      }
      let isAccept = true;

      const fileIndex = file.name.lastIndexOf(".");
      const fileType = file.name.toLowerCase().substring(fileIndex);

      // 判断是否是数组
      if (this.item.accept && Array.isArray(this.item.accept)) {
        for (let ac of this.item.accept) {
          if (ac.indexOf("*") > -1) {
            isAccept = new RegExp(ac).test(fileType) || new RegExp(ac).test(file.type);
          } else {
            let rules = ac.split(",");
            for (let item of rules) {
              isAccept = false;
              if (item === fileType) {
                isAccept = true;
                break;
              }
            }
          }
          if (isAccept) {
            break;
          }
        }
      }
      if (!isAccept) {
        this.$message.error(`应该选择${this.item.accept}类型的文件`);
        return false;
      }
      return true;
    }
  },
  emits: ["update:value", "input"]
};
