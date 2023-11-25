<template>
  <el-dialog
    append-to-body
    :title="$t('form.setting.selectDept')"
    v-model="dialogVisible"
    width="40%"
  >
    <div class="head-container">
      <el-input
        v-model="deptName"
        clearable
        :placeholder="$t('form.setting.enterDeptName')"
        prefix-icon="ele-Search"
        style="margin-bottom: 20px"
      />
    </div>
    <div class="head-container">
      <el-tree
        ref="deptTree"
        node-key="id"
        :data="deptOptions"
        show-checkbox
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="defaultProps"
        default-expand-all
        @check-change="handleCheckChange"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          size="default"
          @click="dialogVisible = false"
        >
          {{ $t("formI18n.all.cancel") }}
        </el-button>
        <el-button
          size="default"
          type="primary"
          @click="submitSelectedDeptHandle"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { treeselect } from "@/api/system/dept";

export default {
  name: "DeptChooseTree",
  emits: ["submit"],
  data() {
    return {
      // 遮罩层
      loading: true,
      dialogVisible: false,
      deptName: "",
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  watch: {
    deptName(val) {
      this.$refs.deptTree.filter(val);
    }
  },
  created() {
    this.getTreeselect();
  },
  methods: {
    // 显示用户选择弹窗
    showDialog(val) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.deptTree) {
          this.$refs.deptTree.setCheckedKeys(
            val.map(item => item.id),
            true
          );
        }
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    handleCheckChange() {},
    // 如果子节点全部被选中 只获取顶级父节点的数据
    getSimpleCheckedNodes(store) {
      const checkedNodes = [];
      const traverse = function (node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        childNodes.forEach(child => {
          console.log(child);
          if (child.checked) {
            checkedNodes.push(child.data);
          }
          if (child.indeterminate) {
            traverse(child);
          }
        });
      };
      traverse(store);
      return checkedNodes;
    },
    submitSelectedDeptHandle() {
      this.$emit("submit", this.getSimpleCheckedNodes(this.$refs.deptTree.store));
      this.dialogVisible = false;
    }
  }
};
</script>
