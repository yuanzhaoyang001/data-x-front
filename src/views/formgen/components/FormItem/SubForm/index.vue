<template>
  <div
    :id="value"
    :name="value"
    class="form-table-index"
  >
    <el-table
      class="form-table"
      :row-key="record => record.key"
      :data="value"
    >
      <template v-if="isVisible">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="50"
        />
        <template
          v-for="(option, index) in item.childList"
          :key="index"
        >
          <el-table-column align="center">
            <template #header="scope">
              {{ getTableColumnLabel(option) }}
            </template>
            <template #default="scope">
              {{ showText(scope.row, option.vModel, option) }}
            </template>
          </el-table-column>
        </template>
        <el-table-column
          label="操作"
          align="center"
          width="300"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="default"
              @click="updateDomain(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              link
              type="primary"
              @click="copyDomain(scope.row)"
            >
              复制
            </el-button>
            <el-button
              link
              type="primary"
              size="default"
              @click="removeDomain(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="add-button">
      <el-button
        link
        type="primary"
        :disabled="disabled"
        @click="addDomain"
      >
        增加一行
      </el-button>
    </div>
    <AddOrUpdate
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :fields="item.childList"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script>
import AddOrUpdate from "./AddOrUpdate.vue";
import mixin from "../mixin";
import { removeHtmlTag } from "../../../utils";
import { commonFormat } from "@/views/form/data/table/formatTableColumn";
import { isLabelTag } from "@/views/formgen/components/GenerateForm/FormItemLabel";

export default {
  name: "TSubForm",
  components: {
    AddOrUpdate
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
  watch: {},
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

<style scoped>
.form-table-index {
  width: 100%;
}

.add-button {
  text-align: center;
  margin-top: 10px;
}
</style>
