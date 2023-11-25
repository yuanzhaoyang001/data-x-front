<template>
  <div
    class="rt-container"
    v-if="!loadding"
    :style="disableStyle"
  >
    <div class="rt-table">
      <el-table
        :data="table.rows"
        border
        style="width: 100%; border-radius: 8px"
      >
        <el-table-column
          fixed
          prop="label"
          label=""
          width="150"
        ></el-table-column>
        <el-table-column
          min-width="150"
          v-for="(col, index) in table.columns"
          :key="index"
          :label="col.label"
        >
          <template #default="scope">
            <el-input
              v-model="dataValue[scope.row.id][col.id]"
              :border="false"
              clearable
              style="width: 100%"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";

export default {
  name: "MatrixInput",
  mixins: [mixin],
  props: {
    table: {
      type: Object,
      default: () => {}
    }
  },
  emits: ["change", "update:value"],
  data() {
    return {
      loadding: true,
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
    dataValue: {
      handler(value) {
        this.handleChange();
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
      let initValue = {};
      this.table.rows.forEach(row => {
        initValue[row.id] = {};
        this.table.columns.forEach(col => {
          if (this.value && this.value[row.id] && this.value[row.id][col.id]) {
            initValue[row.id][col.id] = this.value[row.id][col.id];
          } else {
            initValue[row.id][col.id] = null;
          }
        });
      });
      this.dataValue = initValue;
      this.loadding = false;
    },
    handleChange() {
      this.$emit("update:value", this.dataValue);
      this.$emit("change", this.dataValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.rt-container {
  padding: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;

  :deep(.el-input__inner) {
    border: none;
    padding: 0;
    background: transparent;
  }

  .rt-table {
    width: 100%;
  }

  th,
  td {
    text-align: center;
    vertical-align: middle !important;
  }

  .el-input {
    width: 70%;
  }
}
</style>
