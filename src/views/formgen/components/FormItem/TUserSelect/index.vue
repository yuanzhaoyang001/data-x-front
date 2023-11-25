<template>
  <div>
    <el-input
      v-model="showValue"
      :disabled="disabled"
      prefix-icon="ele-User"
      class="select-user-input"
      readonly
      @click="handleShow"
    />
    <el-dialog
      v-model="dialogVisible"
      title="人员选择"
      append-to-body
    >
      <el-tree
        ref="empTree"
        :accordion="true"
        :data="data"
        :props="defaultProps"
        show-checkbox
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span v-if="data.weight === 5">{{ node.label }}</span>
            <span v-if="data.weight === 6">{{ data.nickName }}({{ node.label }})</span>
          </span>
        </template>
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEmpTreeRequest } from "../../../api";
import _ from "lodash-es";
import mixin from "../mixin";

export default {
  name: "TUserSelect",
  mixins: [mixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: [],
      showValue: "",
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "name"
        //disabled: this.isDisabled
      }
    };
  },
  created() {
    getEmpTreeRequest().then(res => {
      this.data = res.data;
    });
    console.log(this.value);
    this.showValue = this.value?.map(item => item.nickName).join(",");
  },
  methods: {
    isDisabled(data, node) {
      if (_.startsWith(data.id, "dept")) {
        return true;
      }
      return false;
    },
    handleShow() {
      if (this.disabled) return;
      this.dialogVisible = true;
    },
    handleSubmit() {
      console.log(this.$refs.empTree.getCheckedNodes(true));
      this.changeValue = this.$refs.empTree.getCheckedNodes(true).map(item => {
        return { name: item.name, nickName: item.nickName, id: item.id };
      });
      this.dialogVisible = false;
      if (this.changeValue) {
        this.showValue = this.changeValue.map(item => item.nickName).join(",");
      }
    }
  }
};
</script>

<style>
.select-user-input {
  cursor: pointer;
}
</style>
