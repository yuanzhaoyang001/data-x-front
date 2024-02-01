<template>
  <div class="rt-container mobile-matrix-scale">
    <div
      v-for="row in table.rows"
      class="card"
      :key="row.id"
    >
      <van-cell
        class="block-title"
        :title="row.label"
      />
      <div class="card-body">
        <el-rate
          v-model="dataValue[row.id]"
          :icon-classes="[icon, icon, icon]"
          :colors="[iconColor, iconColor, iconColor]"
          :max="table.level"
          :void-icon-class="icon"
          :disabled-void-icon-class="icon"
          class="rate"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";

import "vant/lib/cell/style";
import "vant/lib/cell-group/style";

import { Cell, CellGroup } from "vant";

export default {
  name: "MobileMatrixScale",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup
  },
  mixins: [mixin],
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    icon: {
      type: String,
      default: "tduck-star"
    },
    iconColor: {
      type: String,
      default: "#f7ba2a"
    }
  },
  emits: ["update:value", "change"],
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
      this.$emit("change", this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./icon/iconfont.css";

.mobile-matrix-scale {
  .card {
    background-color: #fafafa;

    .van-cell-group {
      background-color: transparent;
      margin-bottom: 10px;
    }

    .van-cell {
      background: transparent;
    }

    .card-body {
      padding: 0 16px;
      margin-bottom: 10px;
    }

    .block-title {
      .van-cell__title {
        font-weight: bold;
      }
    }
  }
}

.rt-container {
  .rt-table {
    width: 100%;
    min-width: 600px;
    font-size: 14px;
    color: #606266;
    background-color: #fff;
    border-collapse: separate;
    box-sizing: border-box;
    text-indent: initial;
    border-spacing: 2px;
    border: 1px solid #ebeef5;
    border-right: none;
    border-bottom: none;
    display: flex;
    flex-direction: column;
    overflow-x: auto;

    .t-header {
      align-items: flex-end !important;
      color: #606266;
      height: 75px;

      .td:first-child {
        height: 100%;
      }
    }

    .tbody {
      display: flex;
      flex-direction: column;
    }

    .tr {
      vertical-align: inherit;
      border-color: inherit;
      -webkit-box-flex: 1;
      flex: 1 0 auto;
      display: -webkit-box;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: row;
      -webkit-box-align: stretch;
      align-items: stretch;
    }

    .td,
    :deep(.el-rate__item) {
      flex: 1 0 auto;
      width: 50px;
      padding: 12px 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow-wrap: break-word;
      position: relative;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      text-align: center;
      vertical-align: middle !important;
      font-size: 14px !important;
      color: #606266;
    }

    :deep(.el-rate__item:not(:last-child)) {
      line-height: inherit !important;
      border-right: none !important;
    }

    .tr .no-rg-border:not(:last-child) {
      border-right: none !important;
    }

    .rate {
      display: contents !important;
    }
  }
}
</style>
