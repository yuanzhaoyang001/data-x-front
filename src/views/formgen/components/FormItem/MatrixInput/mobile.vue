<template>
  <div class="rt-container mobile-matrix-input">
    <div
      v-for="(row, rIndex) in table.rows"
      class="card"
      :key="row.id"
    >
      <van-cell
        class="block-title"
        :title="row.label"
      />
      <van-cell-group :border="false">
        <van-cell
          v-for="(col, cIndex) in table.columns"
          :title="col.label"
          :key="col.id"
        >
          <template #default="value">
            <el-input
              v-model="dataValue[row.id][col.id]"
              @input="handleChange($event, rIndex, cIndex)"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";
import "vant/lib/cell/style";
import "vant/lib/cell-group/style";

import { Cell, CellGroup } from "vant";

export default {
  name: "MobileMatrixInput",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup
  },
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
      dataValue: []
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
    },
    handleChange() {
      this.$emit("update:value", this.dataValue);
      this.$emit("change", this.dataValue);
    }
  }
};
</script>

<style lang="scss">
.mobile-matrix-input {
  .card {
    background-color: #fafafa;

    .van-cell-group {
      background-color: transparent;
      margin-bottom: 10px;
    }

    .van-cell {
      background: transparent;
    }

    .block-title {
      .van-cell__title {
        font-weight: bold;
      }
    }
  }
}
</style>
