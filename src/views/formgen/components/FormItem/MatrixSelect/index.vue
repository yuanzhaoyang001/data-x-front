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
      <div
        v-if="!multiple"
        class="tbody"
      >
        <el-radio-group
          v-for="row in table.rows"
          :key="row.id"
          v-model="dataValue[row.id]"
          @change="val => handleChange(val, row.id)"
        >
          <div class="tr">
            <div class="td">
              {{ row.label }}
            </div>
            <div
              v-for="(col, index) in table.columns"
              :key="index"
              class="td"
            >
              <el-radio :label="col.label">
                {{ "" }}
              </el-radio>
            </div>
          </div>
        </el-radio-group>
      </div>
      <div
        v-else
        class="tbody"
      >
        <el-checkbox-group
          v-for="row in table.rows"
          :key="row.id"
          v-model="dataValue[row.id]"
          @change="handleChange"
        >
          <div class="tr">
            <div class="td">
              {{ row.label }}
            </div>
            <div
              v-for="col in table.columns"
              :key="col.id"
              class="td"
            >
              <el-checkbox :label="col.label">
                {{ "" }}
              </el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";
import MatrixSelectMixin from "./MatrixSelectMixin";

export default {
  name: "MatrixSelect",
  mixins: [mixin, MatrixSelectMixin]
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

      .el-radio {
        justify-content: center;
      }
    }
  }
}
</style>
