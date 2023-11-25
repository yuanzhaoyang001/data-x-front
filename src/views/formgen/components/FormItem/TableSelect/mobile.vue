<template>
  <div class="rt-container mobile-matrix-drop">
    <div
      v-for="(row, rindex) in table.rows"
      :key="row.id"
      class="card"
    >
      <van-cell
        class="block-title"
        :title="row.label"
      />
      <van-cell-group :border="false">
        <van-cell
          v-for="(col, cindex) in table.columns"
          :key="col.id"
          :title="col.label"
        >
          <template #default="value">
            <div v-if="tableOptions[rindex] && tableOptions[rindex][cindex]">
              <el-radio-group
                v-if="tableOptions[rindex][cindex].type === 'RADIO'"
                v-model="dataValue[`${row.id}`][`${col.id}`]"
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
import DropdownMixin from "./SelectMixin";

export default {
  name: "MobileTableSelect",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup
  },
  mixins: [Mixin, DropdownMixin]
};
</script>

<style lang="scss" scoped>
.el-radio {
  display: block;
  white-space: normal;
  margin-right: 0;
}

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

  .radio {
    display: flex;
    flex-direction: column;
    overflow-wrap: anywhere;
  }

  .radio-sort {
    width: 100%;
    display: flex;
    justify-content: left;
    overflow-wrap: anywhere;
    align-items: center;
  }
}

:deep(.el-checkbox__label) {
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
  width: 100%;
}
</style>
