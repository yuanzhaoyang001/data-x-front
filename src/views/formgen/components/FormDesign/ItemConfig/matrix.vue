<template>
  <div>
    <div v-if="activeData.table.rows">
      <el-divider>{{ $t("formgen.option.lineTitle") }}</el-divider>
      <draggable
        :animation="340"
        v-model="activeData.table.rows"
        item-key="id"
        group="selectItem"
        handle=".option-drag"
      >
        <template #item="{ element, index }">
          <div
            :key="index"
            class="select-item"
          >
            <div class="select-line-icon option-drag">
              <el-icon>
                <ele-Operation />
              </el-icon>
            </div>
            <el-input
              v-model="element.label"
              :placeholder="$t('formgen.option.optionName')"
              size="small"
            />
            <div
              class="close-btn select-line-icon"
              @click="activeData.table.rows.splice(index, 1)"
            >
              <el-icon>
                <ele-Remove />
              </el-icon>
            </div>
            <div
              class="close-btn select-line-icon"
              v-if="activeData.isSelectOrganization"
              @click="selectUser(element)"
            >
              <el-button
                link
                type="primary"
              >
                {{ $t("formgen.option.user") }}
              </el-button>
            </div>
            <div
              class="close-btn select-line-icon"
              v-if="activeData.isSelectOrganization"
              @click="selectDept(element)"
            >
              <el-button
                link
                type="primary"
              >
                {{ $t("formgen.option.dept") }}
              </el-button>
            </div>
          </div>
        </template>
      </draggable>
      <div style="margin-left: 20px; margin-bottom: 10px">
        <el-button
          icon="ele-CirclePlus"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="addSelectItem(activeData.table.rows)"
        >
          {{ $t("formgen.option.addOption") }}
        </el-button>
        <el-button
          icon="ele-DocumentCopy"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="openBatchEditDialogHandle('rows')"
        >
          {{ $t("formgen.option.batchEdit") }}
        </el-button>
      </div>
    </div>
    <div v-if="activeData.table.columns">
      <el-divider>{{ $t("formgen.option.colTitle") }}</el-divider>
      <draggable
        :animation="340"
        v-model="activeData.table.columns"
        item-key="id"
        group="selectItem"
        handle=".option-drag"
      >
        <template #item="{ element, index }">
          <div class="select-item">
            <div class="select-line-icon option-drag">
              <el-icon>
                <ele-Operation />
              </el-icon>
            </div>
            <el-input
              v-model="element.label"
              :placeholder="$t('formgen.option.optionName')"
              size="small"
            />
            <div
              class="close-btn select-line-icon"
              @click="activeData.table.columns.splice(index, 1)"
            >
              <el-icon>
                <ele-Remove />
              </el-icon>
            </div>
          </div>
        </template>
      </draggable>
      <div style="margin-left: 20px; margin-bottom: 10px">
        <el-button
          icon="ele-CirclePlus"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="addSelectItem(activeData.table.columns)"
        >
          {{ $t("formgen.option.addOption") }}
        </el-button>
        <el-button
          icon="ele-DocumentCopy"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="openBatchEditDialogHandle('columns')"
        >
          {{ $t("formgen.option.batchEdit") }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('formgen.option.batchEdit')"
      v-model="dialogVisible"
      width="30%"
    >
      <span class="desc-text">{{ $t("formgen.option.lineByOption") }}</span>
      <el-input
        v-model="batchItemValue"
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 5000 }"
        :placeholder="$t('formgen.option.batchDesc')"
      />
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
            @click="batchEditSelectItems"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="userDialogVisible"
      :title="$t('formgen.option.userSelect')"
      append-to-body
    >
      <el-tree
        ref="empTree"
        :accordion="true"
        :data="userData"
        :props="defaultProps"
        node-key="id"
        :default-expanded-keys="defaultShowNodes"
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
          <el-button
            size="default"
            @click="userDialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
          <el-button
            size="default"
            type="primary"
            @click="handleSubmit('user')"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="deptDialogVisible"
      :title="$t('formgen.option.deptSelect')"
      width="30%"
      append-to-body
    >
      <el-tree
        ref="deptTree"
        :data="deptData"
        :props="defaultProps"
        default-expand-all
        show-checkbox
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deptDialogVisible = false">{{ $t("formI18n.all.confirm") }}</el-button>
          <el-button
            type="primary"
            @click="handleSubmit('dept')"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import _ from "lodash-es";
import { getDeptTreeRequest, getEmpTreeRequest } from "@/views/formgen/api";

export default {
  name: "MatrixOption",
  components: {
    draggable
  },
  props: ["activeData"],
  data() {
    return {
      userData: [],
      deptData: [],
      batchItemValue: "",
      batchDataKey: "",
      //默认展开第几级
      defaultShowNodes: [],
      item: "",
      dialogVisible: false,
      userDialogVisible: false,
      deptDialogVisible: false,
      defaultProps: {
        children: "children",
        label: "name",
        disabled: this.isDisabled
      }
    };
  },
  created() {},
  methods: {
    isDisabled(data, node) {
      //如果部门为空则不允许选择
      if (_.startsWith(data.id, "dept") && data.children == null) {
        return true;
      }
      return false;
    },
    selectUser(item) {
      getEmpTreeRequest().then(res => {
        this.userData = res.data;
        //默认展开第一级
        this.defaultShowNodes.push(res.data[0].id);
      });
      this.item = item;
      this.userDialogVisible = true;
    },
    selectDept(item) {
      getDeptTreeRequest().then(res => {
        this.deptData = res.data;
      });
      this.item = item;
      this.deptDialogVisible = true;
    },
    addSelectItem(data) {
      data.push({
        id: new Date().getTime(),
        label: ""
      });
    },
    openBatchEditDialogHandle(key) {
      this.batchDataKey = key;
      let data = this.activeData.table[key];
      this.batchItemValue = _.join(
        data.map(item => item.label),
        "\n"
      );
      this.dialogVisible = true;
    },
    async batchEditSelectItems() {
      const arrStrs = this.batchItemValue;
      const arr = arrStrs.split("\n");
      // 获取原来的下标 避免导致id变化
      let oldData = this.activeData.table[this.batchDataKey];
      let labels = oldData.map(item => item.label);
      if (arr.length > 0) {
        const options = [];
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element.length > 0) {
            let oIndex = labels.indexOf(element);
            options.push({
              id: oIndex > -1 ? oldData[oIndex].id : new Date().getTime() + index,
              label: element
            });
          }
        }
        this.activeData.table[this.batchDataKey] = options;
        this.dialogVisible = false;
      }
    },
    handleSubmit(param) {
      if ("user" == param) {
        this.changeValue = this.$refs.empTree.getCheckedNodes(true).map(item => {
          return { name: item.name, nickName: item.nickName, id: item.id };
        });
        if (this.changeValue) {
          //选中的人员字符串
          this.item.label = this.changeValue.map(item => item.nickName).join(",");
        }
        this.userDialogVisible = false;
      }
      if ("dept" == param) {
        this.changeValue = this.$refs.deptTree.getCheckedNodes(true).map(item => {
          return { name: item.name, id: item.id };
        });
        if (this.changeValue) {
          //选中的部门
          this.item.label = this.changeValue.map(item => item.name).toString();
        }
        this.deptDialogVisible = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/config/options";
</style>
