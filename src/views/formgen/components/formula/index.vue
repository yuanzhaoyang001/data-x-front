<template>
  <el-dialog
    :title="$t('formgen.funcalc.title')"
    v-model="dialogVisible"
    width="70%"
    style="padding: 0"
  >
    <div>
      <formula-code-mirror
        ref="formulaCodeMirror"
        :fields="filterFields"
        :mode="mode"
        :value="cmValue"
      >
        <template #tips>
          <slot name="tips"></slot>
        </template>
      </formula-code-mirror>
      <el-divider />
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="box-card">
            <div class="header">
              <el-input
                v-model="filedNameValue"
                size="default"
                :placeholder="$t('formgen.funcalc.varName')"
                prefix-icon="ele-Search"
                @input="handleFilterFields"
              />
            </div>
            <div class="body">
              <el-scrollbar
                ref="scrollMenuRef"
                class="scrollbar-box"
              >
                <ul class="field-list">
                  <li
                    class="field"
                    v-for="f in filterFields"
                    :key="f.key"
                    @click="handleFieldClick(f)"
                  >
                    <el-tooltip
                      class="box-item"
                      effect="tduck"
                      :content="f.fullLabel"
                      placement="top"
                    >
                      <span class="menu-item with-capsule">{{ f.label }}</span>
                    </el-tooltip>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="box-card">
            <div class="header">
              <el-input
                size="default"
                v-model="funNameValue"
                :placeholder="$t('formgen.funcalc.searchFun')"
                prefix-icon="ele-Search"
              />
            </div>
            <div class="body">
              <el-scrollbar
                ref="scrollMenuRef"
                class="scrollbar-box"
              >
                <el-tree
                  class="fun-tree"
                  ref="funTree"
                  :data="formulaList"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  :filter-node-method="filterNode"
                >
                  <template #default="{ node, data }">
                    <span
                      class="custom-tree-node"
                      @mouseenter="handleFunMouseenter(data)"
                    >
                      <span>{{ node.label }}</span>
                    </span>
                  </template>
                </el-tree>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="intro-box">
            <span v-html="selectFun.intro"></span>
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <el-button
        size="default"
        @click="dialogVisible = false"
      >
        {{ $t("formI18n.all.cancel") }}
      </el-button>
      <el-button
        size="default"
        type="primary"
        @click="handleSaveFormula"
      >
        {{ $t("formI18n.all.confirm") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import FormulaCodeMirror from "./CodeMirror.vue";
import { formulaList } from "./FormulaList";
import { removeHtmlTag } from "../../utils";
import { i18n } from "@/i18n";

export default {
  name: "FormFormula",
  components: { FormulaCodeMirror },
  props: {
    /**
     * 公式
     */
    cmValue: {
      type: String,
      default: ""
    },
    /**
     * 全部字段
     */
    fields: {
      type: Array,
      default: () => []
    },
    // 公式模式
    mode: {
      type: String,
      default: "text/x-formula"
    },
    title: {
      type: String,
      default: i18n.global.t("formgen.funcalc.title")
    }
  },
  emits: ["save"],
  data() {
    return {
      dialogVisible: false,
      tempFields: [],
      filterFields: [],
      removeHtmlTag: removeHtmlTag,
      filedNameValue: "",
      funNameValue: "",
      formulaList: formulaList,
      selectFun: {
        name: "",
        intro: ""
      },
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  watch: {
    funNameValue(val) {
      this.$refs.funTree.filter(val);
    },
    fields: {
      handler(val) {
        this.getFieldsList();
      },
      deep: true
    }
  },
  created() {
    this.getFieldsList();
  },
  methods: {
    getFieldsList() {
      // 写一个缩字符串的方法 只保留10个字
      const subStr = str => {
        return str.replace(/[\r\s]/g, "").substring(0, 10);
      };

      // 转换格式
      this.tempFields = this.fields.map(item => {
        let label = removeHtmlTag(item.config.label);
        return { key: item.vModel, fullLabel: label, label: subStr(label) };
      });
      this.filterFields = this.tempFields;
    },
    open() {
      this.dialogVisible = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleFilterFields() {
      if (!this.filedNameValue) {
        this.filterFields = this.tempFields;
      }
      this.filterFields = this.tempFields.filter(item => {
        return item.label.indexOf(this.filedNameValue) > -1;
      });
    },
    handleFieldClick(field) {
      this.$refs.formulaCodeMirror.insertVariable(field.key, field.label);
    },
    handleFunMouseenter(data) {
      this.selectFun = data;
    },
    handleNodeClick(data, node, instance) {
      if (node.level === 1) {
        return;
      }
      this.selectFun = data;
      this.$refs.formulaCodeMirror.insertFunction(data.name);
    },
    handleSaveFormula() {
      this.$emit("save", this.$refs.formulaCodeMirror.getValue());
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  .body {
    border: 1px solid #dfe4ed;
    border-top: none;
    height: 280px;
  }
}

.scrollbar-box {
  height: 100% !important;
  padding-bottom: 0px !important;
}

.intro-box {
  height: 100%;
  border: 1px solid #dfe4ed;
  padding: 10px;
}

.field-list {
  display: block;

  .field {
    list-style-type: none;
    line-height: 30px;
    padding-left: 10px;
    // 超出省略
    overflow: hidden;
    // 禁止换行
    white-space: nowrap;
  }

  .field:hover {
    background: #f6f8f9;
    color: rgba(0, 0, 0, 0.75);
    cursor: pointer;
  }
}
</style>
