<template>
  <div>
    <el-input
      v-model="showValue"
      prefix-icon="ele-User"
      readonly
      :disabled="disabled"
      @click="handleShow"
    />
    <el-dialog
      v-model="dialogVisible"
      title="部门选择"
      width="30%"
      append-to-body
    >
      <el-tree
        ref="deptTree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        show-checkbox
      />
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
import { getDeptTreeRequest } from "../../../api";
import _ from "lodash-es";
import mixin from "../mixin";

export default {
  name: "TDeptSelect",
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
        label: "name",
        disabled: this.isDisabled
      }
    };
  },
  created() {
    getDeptTreeRequest().then(res => {
      this.data = res.data;
    });
    this.showValue = this.value?.map(item => item.name);
  },
  methods: {
    isDisabled(data, node) {
      return false;
    },
    handleShow() {
      if (this.disabled) return;
      this.dialogVisible = true;
    },
    handleSubmit() {
      this.changeValue = this.$refs.deptTree.getCheckedNodes(true).map(item => {
        return { name: item.name, id: item.id };
      });
      this.dialogVisible = false;
      if (this.changeValue) {
        this.showValue = this.changeValue.map(item => item.name);
      }
    }
  }
};
</script>
