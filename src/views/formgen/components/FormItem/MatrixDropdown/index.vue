<template>
  <div class="rt-container">
    <div class="rt-table">
      <div class="tr">
        <div class="td" />
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
          class="tr"
          v-for="row in table.rows"
          :key="row.id"
        >
          <div class="td">
            {{ row.label }}
          </div>
          <div
            v-for="col in table.columns"
            :key="col.id"
            class="td"
          >
            <el-select
              v-model="dataValue[row.id][col.id]"
              value-key="label"
              @change="handleChange"
              :placeholder="placeholder"
            >
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// mixin是基础逻辑 包含注入基础字段
import Mixin from "../mixin";
import DropdownMixin from "./DropdownMixin";

export default {
  name: "MatrixDropdown",
  mixins: [Mixin, DropdownMixin]
};
</script>

<style lang="scss" scoped>
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
      .el-select {
        margin: 0 3px;
      }
    }
  }
}
</style>
