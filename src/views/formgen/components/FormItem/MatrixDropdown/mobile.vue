<template>
  <div class="rt-container mobile-matrix-drop">
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
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import "vant/lib/cell/style";
import "vant/lib/cell-group/style";

import { Cell, CellGroup } from "vant";
import Mixin from "../mixin";
import DropdownMixin from "./DropdownMixin";

export default {
  name: "MobileMatrixDropdown",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup
  },
  mixins: [Mixin, DropdownMixin]
};
</script>

<style lang="scss">
.mobile-matrix-drop {
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
