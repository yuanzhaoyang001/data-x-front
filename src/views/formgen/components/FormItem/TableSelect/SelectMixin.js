export default {
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    tableOptions: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ""
    },
    firstColName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // {rowId: {colId: {label: "选项二", score: 2}, colId: {label: "选项一", score: 1}},…}
      dataValue: {}
    };
  },
  watch: {
    table: {
      handler(value) {
        this.initValue();
      },
      deep: true
    },
    value(val) {
      this.initValue();
    }
  },
  created() {
    this.initValue();
  },
  methods: {
    // 初始化矩阵value为二维数组
    initValue() {
      let initValue = {};
      this.table.rows.forEach((row, index) => {
        if (this.value && this.value[row.id]) {
          initValue[row.id] = this.value[row.id];
        } else {
          initValue[row.id] = {};
        }
      });
      this.dataValue = initValue;
      console.log(this.dataValue);
    },
    handleChange() {
      this.$emit("update:value", this.dataValue);
      this.$emit("change", this.value);
    }
  },
  emits: ["change", "update:value"]
};
