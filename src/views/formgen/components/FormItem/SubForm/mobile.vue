<template>
  <div
    :id="value"
    :name="value"
    class="form-table-index mobile-t-sub-form"
  >
    <div
      v-for="(valueItem, index) in value"
      class="card"
      :key="index"
    >
      <van-cell
        class="block-title"
        :title="`序号：${index + 1}`"
      >
        <template #default="value">
          <el-button
            @click="updateDomain(index, valueItem)"
            link
            type="primary"
          >
            修改
          </el-button>
          <el-button
            @click="copyDomain(valueItem)"
            link
            type="primary"
          >
            复制
          </el-button>
          <el-button
            @click="removeDomain(index)"
            link
            type="primary"
          >
            删除
          </el-button>
        </template>
      </van-cell>
      <van-cell-group :border="false">
        <van-cell
          v-for="option in item.childList"
          :title="getTableColumnLabel(option)"
          :key="option.vModel"
          :value="showText(valueItem, option.vModel, option)"
        ></van-cell>
      </van-cell-group>
    </div>

    <el-button
      type="primary"
      size="default"
      class="button"
      :disabled="disabled"
      @click="addDomain"
      icon="ele-Plus"
    >
      增 加
    </el-button>
    <AddOrUpdateMobile
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :fields="item.childList"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script>
import "vant/lib/cell/style";
import "vant/lib/cell-group/style";
import { Cell, CellGroup } from "vant";
import AddOrUpdateMobile from "./AddOrUpdateMobile.vue";
import mixin from "../mixin";
import { removeHtmlTag } from "../../../utils";
import { commonFormat } from "@/views/form/data/table/formatTableColumn";
import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";

export default {
  name: "MobileTSubForm",
  components: {
    AddOrUpdateMobile,
    VanCell: Cell,
    VanCellGroup: CellGroup
  },
  mixins: [mixin],
  props: ["models"],
  emits: ["change"],
  data() {
    return {
      addOrUpdateVisible: false,
      isVisible: true
    };
  },
  computed: {
    disabled() {
      return this.item.disabled;
    }
  },
  methods: {
    showText(row, key, item) {
      let value = row[key];
      if (isLabelTag(key)) {
        value = row[`${key}label`];
      }
      return commonFormat(item.typeId, key, value, { scheme: item });
    },
    getTableColumnLabel(option) {
      if (option.config.label) {
        return removeHtmlTag(option.config.label);
      }
      return "";
    },
    removeDomain(index) {
      this.$confirm("确定删除此数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        // type: 'warning'
      }).then(() => {
        if (index !== -1) {
          this.value.splice(index, 1);
          // this.$message({
          //   message: '删除成功',
          //   type: 'success',
          //   duration: 1000
          // })
        }
      });
    },
    updateDomain(index, data) {
      this.addOrUpdateVisible = true;
      data.index = index;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.showDialog(data);
      });
    },
    copyDomain(data) {
      this.value.push(data);
    },
    addDomain() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.showDialog();
      });
    },
    handleFormSubmit(val) {
      if (!this.value) {
        this.value = [];
      }
      if (val.index != undefined) {
        this.value[val.index] = val;
      } else {
        this.value.push(val);
      }
    },
    handleInput() {
      this.$emit("change", this.models);
    }
  }
};
</script>

<style lang="scss">
.mobile-t-sub-form {
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

  .el-button--text {
    padding: 0;
  }
}
</style>
