<template>
  <div class="rt-container">
    <div class="rt-table rt-select-table-wrap">
      <div class="tr">
        <div class="td">
          {{ firstColName }}
        </div>
        <div
          v-for="(col, index) in table.columns"
          :key="index"
          class="td"
        >
          {{ col.label }}
        </div>
      </div>
      <div class="tbody">
        <div
          v-for="(row, rindex) in table.rows"
          :key="row.id"
          class="tr"
        >
          <div class="td">
            {{ row.label }}
          </div>
          <div
            v-for="(col, cindex) in table.columns"
            :key="col.id"
            :style="getTdStyle(rindex, cindex)"
            class="td"
            @click="handleColClick(rindex, cindex)"
          >
            <div v-if="tableOptions[rindex] && tableOptions[rindex][cindex]">
              <el-radio-group
                v-if="tableOptions[rindex][cindex].type === 'RADIO'"
                v-model="dataValue[`${row.id}`][`${col.id}`]"
                :style="{ pointerEvents: isDesign ? 'none' : 'auto' }"
                class="radio"
                @input="handleChange"
              >
                <el-radio
                  v-for="item in tableOptions[rindex][cindex].options"
                  :key="item.label"
                  :label="item.label"
                  v-model="item.label"
                  class="radio-sort"
                ></el-radio>
              </el-radio-group>
              <el-checkbox-group
                v-else-if="tableOptions[rindex][cindex].type === 'CHECKBOX'"
                v-model="dataValue[`${row.id}`][`${col.id}`]"
                :style="{ pointerEvents: isDesign ? 'none' : 'auto' }"
                class="radio"
                @input="handleChange"
              >
                <el-checkbox
                  v-for="item in tableOptions[rindex][cindex].options"
                  :key="item.label"
                  :label="item.label"
                  v-model="item.label"
                  class="radio-sort"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// mixin是基础逻辑 包含注入基础字段
import Mixin from "../mixin";
import tableSelectMixin from "./SelectMixin";

export default {
  name: "TableSelect",
  mixins: [Mixin, tableSelectMixin],
  props: {
    // 当前选择的行列下标
    currentRowAndCol: {
      type: Object,
      default: () => {
        return {
          rowIndex: 0,
          colIndex: 0,
          type: "RADIO"
        };
      }
    },
    mode: {
      type: String,
      default: ""
    }
  },
  computed: {
    isDesign() {
      return this.mode === "design";
    }
  },
  methods: {
    getTdStyle(rindex, cindex) {
      if (!this.isDesign) {
        return {};
      }
      return {
        "background-color":
          this.currentRowAndCol.rowIndex === rindex && this.currentRowAndCol.colIndex === cindex ? "#f3f9ff" : "#fff"
      };
    },
    getOptions() {},
    handleColClick(rindex, cindex) {
      if (!this.isDesign) {
        return;
      }
      this.currentRowAndCol["rowIndex"] = rindex;
      this.currentRowAndCol["colIndex"] = cindex;
      try {
        this.currentRowAndCol["type"] = this.tableOptions[rindex][cindex].type;
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss" scoped>
.el-radio {
  display: block;
  line-height: 23px;
  white-space: normal;
  margin-right: 0;
}

.rt-container {
  padding: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  cursor: pointer;

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
    cursor: pointer;

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

    .td {
      flex: 50 0 auto;
      width: 50px;
      padding: 12px 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow-wrap: break-word;
      position: relative;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      text-align: center;
      vertical-align: middle !important;
      font-size: 14px !important;
      cursor: pointer;

      .el-select {
        margin: 0 3px;
      }
    }

    .radio {
      display: flex;
      flex-direction: column;
      overflow-wrap: anywhere;
    }

    .radio-sort {
      width: 99%;
      display: flex;
      justify-content: left;
      align-items: center;
      overflow-wrap: anywhere;
    }
  }
}

:deep(.el-checkbox__label) {
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
</style>
