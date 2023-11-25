<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :title="$t('form.downloadFile.set')"
    width="60%"
  >
    <el-row
      :gutter="20"
      style="height: 100%"
    >
      <el-col :span="5">
        <div class="box-card">
          <div class="header">
            <el-input
              v-model="filedNameValue"
              :placeholder="$t('form.downloadFile.pleaseEnter')"
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
                  v-for="f in filterFields"
                  :key="f.key"
                  class="field"
                  @click="handleFieldClick(f)"
                >
                  <span class="menu-item with-capsule">{{ f.label }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col
        :span="18"
        class="border"
      >
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
      </el-col>
    </el-row>
    <template #footer>
      <div>
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
          {{ $t("formI18n.all.cancel") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import FormulaCodeMirror from "./CodeMirror.vue";
import { removeHtmlTag } from "../../utils";

export default {
  name: "DynamicFiledEditor",
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
    fields(val) {
      // this.handleConvertFilterField()
    }
  },
  created() {},
  methods: {
    open() {
      this.handleConvertFilterField();
      this.dialogVisible = true;
    },
    handleConvertFilterField() {
      // 转换格式
      this.tempFields = this.fields.map(item => {
        return { key: item.value, label: item.label.replace("\n", "").replace("\t", "") + "1" };
      });
      this.filterFields = this.tempFields;
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
    height: 503px;
  }
}

.scrollbar-box {
  height: 503px;
  user-select: none;
}

.border {
  border: 1px solid #dcdfe6;
  padding: 0 !important;
}

.field-list {
  display: block;

  .field {
    list-style-type: none;
    line-height: 25px;
    padding-left: 10px;
  }

  .field:hover {
    background: #f6f8f9;
    color: rgba(0, 0, 0, 0.75);
    cursor: pointer;
  }
}
</style>
