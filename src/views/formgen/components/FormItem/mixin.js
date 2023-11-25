export default {
  props: {
    //值
    value: {
      type: [Array, Object, String, Number, Boolean]
    },
    // 问题结构 非一定注入
    item: {
      type: Object,
      default: () => {}
    },
    // 考试
    examConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      config: null,
      changeValue: this.value
    };
  },
  inject: {
    elForm: {
      default: ""
    }
  },
  computed: {
    disableStyle() {
      return this.disabledProp() ? "pointer-events: none;opacity: 0.6;" : "";
    }
  },
  created() {
    if (this.item) {
      this.config = this.item.config;
    }
  },
  watch: {
    changeValue: {
      handler(val) {
        this.$emit("update:value", val);
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(val) {
        this.changeValue = val;
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getOptions() {
      return this.item.config.options;
    },
    disabledProp() {
      // 修复不受 elForm 控制禁用
      return (this.item && this.item.disabled) || (this.elForm || {}).disabled;
    }
  },
  emits: ["update:value"]
};
