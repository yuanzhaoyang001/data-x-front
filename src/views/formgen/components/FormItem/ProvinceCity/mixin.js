export default {
  props: {
    //值
    value: {
      type: [Array, Object, String]
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showValue: "",
      cascaderValue: [],
      detailAddr: ""
    };
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        if (Array.isArray(val)) {
          this.cascaderValue = val;
          this.showValue = val.join("/");
        } else {
          try {
            if (!val) return;
            this.cascaderValue = val.cascadeValue;
            this.showValue = this.cascaderValue.join("/");
            this.detailAddr = val.detailAddr;
          } catch (e) {
            console.log(e);
          }
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    changeHandle(val) {
      const value = {
        cascadeValue: this.cascaderValue,
        detailAddr: this.detailAddr
      };
      this.$emit("update:value", value);
    }
  },
  emits: ["update:value"]
};
