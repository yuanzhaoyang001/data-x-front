export default {
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    },
    // 单位
    unit: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dataValue: {}
    };
  },
  watch: {
    table: {
      handler(value) {
        this.initValue();
      },
      deep: true
    }
  },
  created() {
    this.initValue();
  },
  methods: {
    // 初始化矩阵value为二维数组
    initValue() {
      if (this.value) {
        this.dataValue = this.value;
      }
    },
    handleChange(val) {
      this.$emit("update:value", this.dataValue);
      // 触发el-from校验 解决值变化不校验问题
      this.$emit("change", this.value);
    }
  },
  emits: ["update:value", "change"]
};
