<template>
  <div class="rt-container mobile-matrix-select">
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
        <template v-if="multiple">
          <van-checkbox-group
            v-model="dataValue[row.id]"
            direction="horizontal"
            @change="handleChange"
          >
            <van-checkbox
              v-for="col in table.columns"
              :key="col.id"
              :name="col.label"
              shape="square"
            >
              {{ col.label }}
            </van-checkbox>
          </van-checkbox-group>
        </template>
        <template v-else>
          <van-radio-group
            v-model="dataValue[row.id]"
            direction="horizontal"
            @change="val => handleChange(val, row.id)"
          >
            <van-radio
              v-for="col in table.columns"
              :key="col.id"
              :name="col.label"
            >
              {{ col.label }}
            </van-radio>
          </van-radio-group>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin";
import "vant/lib/cell/style";
import "vant/lib/cell-group/style";
import "vant/lib/radio/style";
import "vant/lib/radio-group/style";
import "vant/lib/checkbox/style";
import "vant/lib/checkbox-group/style";
import MatrixSelectMixin from "./MatrixSelectMixin";

import { Cell, CellGroup, RadioGroup, Radio, Checkbox, CheckboxGroup } from "vant";

export default {
  name: "MobileMatrixSelect",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanRadioGroup: RadioGroup,
    VanRadio: Radio,
    VanCheckbox: Checkbox,
    VanCheckboxGroup: CheckboxGroup
  },
  mixins: [mixin, MatrixSelectMixin]
};
</script>

<style lang="scss">
.mobile-matrix-select {
  .card {
    background-color: #fafafa;

    .card-body {
      padding: 10px 16px 0;
      margin-bottom: 10px;
    }

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

  .van-radio,
  .van-checkbox {
    margin-bottom: 10px;
  }
}
</style>
