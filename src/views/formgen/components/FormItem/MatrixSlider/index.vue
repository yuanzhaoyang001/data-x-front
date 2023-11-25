<template>
  <div class="rt-container">
    <div class="rt-table">
      <el-row
        v-for="(row, rIndex) in table.rows"
        :key="rIndex"
        type="flex"
        justify="center"
        :gutter="20"
        align="middle"
        class="row"
      >
        <el-col
          :span="6"
          class="row-title"
        >
          {{ row.label }}
        </el-col>
        <el-col
          :span="18"
          class="row-slider"
        >
          <div class="slider-tips">
            <span>{{ min }}{{ unit }}</span>
            <span>{{ max }}{{ unit }}</span>
          </div>
          <el-slider
            v-model="dataValue[row.id]"
            @change="handleChange"
            :min="min"
            :max="max"
          ></el-slider>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";
import SliderMixin from "./SliderMixin";

export default {
  name: "MatrixSlider",
  mixins: [mixin, SliderMixin]
};
</script>

<style lang="scss" scoped>
.rt-container {
  padding: 10px;
  width: 100%;
  .rt-table {
    border-radius: 8px;
    width: 100%;
    font-size: 14px;
    color: #606266;
    background-color: #fff;
    border-collapse: separate;
    box-sizing: border-box;
    text-indent: initial;
    border-spacing: 2px;
    border: 1px solid #ebeef5;
    display: flex;
    flex-direction: column;
    .row {
      height: 100%;
    }
    .row-title {
      // 超出换行
      word-break: break-all;
      text-align: center;
    }
    .row-slider {
      margin: 0 20px;
      .slider-tips {
        display: flex;
        justify-content: space-between;
        color: #606266;
        font-size: 13px;
        padding: 0 10px;
      }
    }
  }
}
</style>
