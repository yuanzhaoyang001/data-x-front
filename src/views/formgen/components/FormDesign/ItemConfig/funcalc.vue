<template>
  <div>
    <el-form-item :label="$t('formgen.funcalc.formula')">
      <el-input
        v-model="activeData.calcFormula"
        :placeholder="$t('formgen.funcalc.formula')"
        readonly
        @click="handleOpenFormulaDialog"
      />
    </el-form-item>
    <input-config :active-data="activeData" />
    <formula-dialog
      ref="formulaDialog"
      :fields="fields"
      @save="handleChangeFormula"
      :cm-value="activeData.calcFormula"
    />
  </div>
</template>

<script>
import InputConfig from "./input.vue";
import FormulaDialog from "../../formula/index.vue";
import mixin from "./mixin";

export default {
  name: "ConfigItemFunctionCalc",
  components: {
    InputConfig,
    FormulaDialog
  },
  mixins: [mixin],
  props: ["fields"],
  data() {
    return {
      filterFields: []
    };
  },
  methods: {
    // 过滤能用于函数计算的字段
    handleFilterFields() {
      // let list = ["INPUT","NUMBER"]
      this.filterFields = this.fields.filter(item => {
        return list.includes(item.typeId);
      });
    },
    handleOpenFormulaDialog() {
      this.$refs.formulaDialog.open();
    },
    handleChangeFormula(val) {
      this.activeData["calcFormula"] = val;
    }
  }
};
</script>
