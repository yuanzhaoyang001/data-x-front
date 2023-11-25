<template>
  <div>
    <!--    <el-form-item-->
    <!--      label="选项分隔符"-->
    <!--    >-->
    <!--      <el-input-->
    <!--        v-model="activeData.separator"-->
    <!--        placeholder="请输入选项分隔符"-->
    <!--      />-->
    <!--    </el-form-item>-->

    <!--          <el-FormItem-item-->
    <!--            v-if="activeData.config.tag === 'el-cascader'"-->
    <!--            label="任选层级"-->
    <!--          >-->
    <!--            <el-switch v-model="activeData.props.props.checkStrictly" />-->
    <!--          </el-FormItem-item>-->
    <!--    <el-form-item-->
    <!--      label="是否多选"-->
    <!--    >-->
    <!--      <el-switch v-model="activeData.props.props.multiple" />-->
    <!--    </el-form-item>-->
    <el-form-item :label="$t('formgen.cascader.showAll')">
      <el-switch v-model="activeData['show-all-levels']" />
    </el-form-item>
    <el-form-item :label="$t('formgen.cascader.search')">
      <el-switch v-model="activeData.filterable" />
    </el-form-item>
    <el-divider>{{ $t("formgen.option.optionSet") }}</el-divider>
    <el-radio-group
      v-model="activeData.config.optionsType"
      size="default"
    >
      <el-radio-button :label="0">{{ $t("formgen.option.staticData") }}</el-radio-button>
      <el-radio-button :label="1">{{ $t("formgen.option.dynamic") }}</el-radio-button>
    </el-radio-group>

    <!-- 远程赋值配置 -->
    <div v-if="activeData.config.optionsType === 1">
      <el-input
        v-model="activeData.config.dynamicOptions.url"
        placeholder="https://api.tduckcloud.com/xxx.json"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.url") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.dataPath"
        placeholder="data"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.listPath") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.valueField"
        placeholder="value"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.value") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.labelField"
        placeholder="label"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.option.label") }}</template>
      </el-input>
      <el-input
        v-model="activeData.config.dynamicOptions.childrenField"
        placeholder="chidren"
        size="small"
        @change="handleReQueryOptionsData"
      >
        <template #prepend>{{ $t("formgen.cascader.childOption") }}</template>
      </el-input>
    </div>

    <div v-else>
      <!-- 级联选择静态树 -->
      <el-tree
        :data="treeData"
        :expand-on-click-node="false"
        default-expand-all
        node-key="id"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span class="node-operation">
              <el-icon
                v-if="data.level < 4"
                @click="append(data)"
              >
                <ele-Plus />
              </el-icon>
              <el-icon @click="remove(node, data)">
                <ele-Delete />
              </el-icon>
            </span>
          </div>
        </template>
      </el-tree>
      <div style="margin-left: 20px">
        <el-button
          icon="ele-CirclePlus"
          style="padding-bottom: 0"
          link
          type="primary"
          @click="addTreeItem"
        >
          {{ $t("formgen.option.addOption") }}
        </el-button>
        <el-button
          icon="ele-DocumentCopy"
          link
          type="primary"
          @click="batchEditTreeItem"
        >
          {{ $t("formgen.option.batchEdit") }}
        </el-button>
      </div>
      <el-divider />
    </div>
    <treeNode-dialog
      v-model:visible="dialogVisible"
      :title="$t('formgen.option.addOption')"
      @commit="addNode"
    />
    <el-dialog
      :title="$t('formgen.option.batchEdit')"
      v-model="batchDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <batch-treeNode-dialog
        ref="batch"
        v-if="batchDialogVisible"
        :tree-data="treeData"
        @close="batchAddNode"
      />
      <template #footer>
        <div>
          <el-button
            type="primary"
            size="default"
            @click="handelConfirm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button
            size="default"
            @click="batchDialogVisible = false"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TreeNodeDialog from "../TreeNodeDialog.vue";
import BatchTreeNodeDialog from "../BatchTreeNodeDialog.vue";
import _cloneDeep from "lodash-es/cloneDeep";
import _ from "lodash-es";
import { execRemoteAPI } from "@/views/formgen/api/execRemoteAPI";

export default {
  name: "ConfigItemCascader",
  components: {
    TreeNodeDialog,
    BatchTreeNodeDialog
  },
  props: ["activeData"],
  data() {
    return {
      dialogVisible: false,
      batchDialogVisible: false
    };
  },
  computed: {
    treeData() {
      const { options } = this.activeData.config;

      const handelData = (list, index, id) => {
        list.forEach(item => {
          item.level = index;
          item.parentId = id || 0;
          if (item.children && item.children.length) {
            handelData(item.children, index + 1, item.id);
          }
        });
        return list;
      };
      return handelData(_cloneDeep(options), 1);
    }
  },
  methods: {
    async handleReQueryOptionsData() {
      const config = this.activeData.config;
      // 数据为从接口获取
      let finalOptions = [];
      if (config.optionsType && config.optionsType === 1) {
        execRemoteAPI.get(config.dynamicOptions.url).then(res => {
          const options = _.get(res.data, config.dynamicOptions.dataPath);
          if (options && _.isArray(options)) {
            const dyOptions = options.map(op => ({
              value: _.get(op, config.dynamicOptions.valueField),
              label: _.get(op, config.dynamicOptions.labelField),
              children: _.get(op, config.dynamicOptions.childrenField)
            }));
            finalOptions = dyOptions;
          }
        });
      }
      this.activeData.config.options = finalOptions;
    },
    addNode(data) {
      this.currentNode.push(data);
      this.activeData.config.options = _cloneDeep(this.treeData);
    },
    batchAddNode(data) {
      this.activeData.config.options = _cloneDeep(data);
      this.batchDialogVisible = false;
    },
    addTreeItem() {
      this.dialogVisible = true;
      this.currentNode = this.activeData.config.options;
    },
    append(data) {
      if (!data.children) {
        data["children"] = [];
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      this.activeData.config.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      this.activeData.config.options = _cloneDeep(this.treeData);
    },
    batchEditTreeItem() {
      this.batchDialogVisible = true;
    },
    handelConfirm() {
      this.$refs.batch.handelConfirm();
    }
  }
};
</script>
