<template>
  <div class="rt-container">
    <div class="rt-table">
      <div class="tr t-header">
        <div class="td" />
        <div
          v-for="number in table.level"
          :key="number"
          class="td no-rg-border"
        >
          <div v-if="number === 1">
            {{ table.copyWriting.min }}
          </div>
          <div v-if="number === table.level">
            {{ table.copyWriting.max }}
          </div>
          <span>
            {{ number }}
          </span>
        </div>
      </div>
      <div class="tbody">
        <div
          v-for="(row, rIndex) in table.rows"
          :key="rIndex"
          class="tr"
        >
          <div class="td">
            {{ row.label }}
          </div>
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
  </div>
</template>

<script>
import mixin from "../mixin";

export default {
  name: "MatrixScale",
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
      this.dataValue = this.value;
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

.rt-container {
  padding: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;

  .rt-table {
    border-radius: 8px;
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
