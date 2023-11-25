<template>
  <div class="rt-container mobile-matrix-slider">
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
        <div class="slider-tips">
          <span>{{ min }}{{ unit }}</span>
          <span>{{ max }}{{ unit }}</span>
        </div>
        <van-slider
          v-model:value="dataValue[row.id]"
          @change="handleChange"
          :min="min"
          :max="max"
          active-color="#1890ff"
        >
          <template #button>
            <div class="custom-slider-button">{{ dataValue[row.id] }}</div>
          </template>
        </van-slider>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";
import SliderMixin from "./SliderMixin";

import "vant/lib/cell/style";
import "vant/lib/cell-group/style";
import "vant/lib/slider/style";
import { Cell, CellGroup, Slider } from "vant";

export default {
  name: "MobileMatrixSlider",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanSlider: Slider
  },
  mixins: [mixin, SliderMixin]
};
</script>

<style lang="scss" scoped>
.mobile-matrix-slider {
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
      padding: 10px 16px;
      margin-bottom: 10px;
    }

    .block-title {
      .van-cell__title {
        font-weight: bold;
      }
    }

    .slider-tips {
      display: flex;
      justify-content: space-between;
      color: #606266;
      font-size: 13px;
      padding: 0 10px;
    }

    .custom-slider-button {
      width: 26px;
      color: #fff;
      font-size: 10px;
      line-height: 18px;
      text-align: center;
      background-color: var(--form-theme-color);
      border-radius: 100px;
    }
  }
}

.rt-container {
}
</style>
