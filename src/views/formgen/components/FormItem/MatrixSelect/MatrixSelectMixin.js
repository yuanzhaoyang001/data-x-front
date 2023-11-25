export default {
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 选择校验规则
    columnSelectedCountRule: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 矩阵单选默认数据结构 {"1":"选项1","2":"选项1","3":"选项1","1636537741435":"选项1"}
      // 矩阵多选默认数据结构 {"1":["选项1","选项2","选项3"],"2":["选项1","选项2","选项3"],"3":["选项1","选项2","选项3"]}
      dataValue: {},
      oldDataValue: {}
    };
  },
  emits: ["change", "update:value"],
  watch: {
    table: {
      handler(value) {
        this.initValue();
      },
      deep: true
    },
    multiple: {
      handler(value) {
        this.initValue();
      }
    }
  },
  created() {
    this.initValue();
  },
  methods: {
    // 初始化矩阵value为二维数组
    initValue() {
      let initValue = {};
      // 如果为多选
      if (this.multiple) {
        this.table.rows.forEach((row, index) => {
          if (this.value[row.id]) {
            initValue[row.id] = this.value[row.id];
          } else {
            initValue[row.id] = [];
          }
        });
      } else {
        initValue = this.value || {};
      }
      this.dataValue = initValue;
    },
    handleChange(val, rowId) {
      // 找到value对应的Id
      const colId = this.table.columns.find(item => item.label === val)?.id;
      // 是否有最大选择的规则
      const maxCount = this.columnSelectedCountRule[colId];
      if (this.columnSelectedCountRule && maxCount) {
        // 找到是否达到最大选择的次数
        const count = Object.values(this.dataValue).filter(item => item === val);
        if (count.length > maxCount) {
          this.$message.error(val + `最多只能选择${maxCount}个`);
          this.dataValue[rowId] = this.oldDataValue[rowId];
          return;
        }
      }
      this.oldDataValue = { ...this.dataValue };
      // this.value = this.dataValue;
      this.$emit("update:value", this.dataValue);
      this.$emit("change", this.dataValue);
    }
  }
};
