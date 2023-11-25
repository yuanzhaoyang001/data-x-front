<template>
  <div>
    <template v-if="Array.isArray(activeData.config.formulaValidate)">
      <el-divider>{{ $t("formgen.formItemConfig.customVerification") }}</el-divider>
      <div
        v-for="(item, index) in activeData.config.formulaValidate"
        :key="index"
        class="reg-item"
      >
        <span
          class="close-btn"
          @click="activeData.config.formulaValidate.splice(index, 1)"
        >
          <el-icon><ele-Close /></el-icon>
        </span>
        <el-form-item :label="$t('formgen.formItemConfig.regularExpression')">
          <template #label>
            <span>
              {{ $t("formgen.formItemConfig.regularExpression") }}
            </span>
          </template>
          <el-input
            v-model="item.formula"
            readonly
            @click="handleFormulaClick(index)"
            :placeholder="$t('formgen.formItemConfig.inputCustomFormula')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('formgen.formItemConfig.errorTips')"
          style="margin-bottom: 0"
        >
          <el-input
            v-model="item.message"
            :placeholder="$t('formgen.formItemConfig.errorTips')"
          />
        </el-form-item>
      </div>
      <div style="margin-left: 20px">
        <el-button
          icon="ele-CirclePlus"
          link
          type="primary"
          @click="addCustomValidate"
        >
          {{ $t("formgen.formItemConfig.addCustom") }}
        </el-button>
      </div>
    </template>
    <formula-dialog
      ref="formulaDialogRef"
      :fields="fields"
      @save="handleChangeFormula"
      :cm-value="calcFormula"
    />
  </div>
</template>
<script setup lang="ts">
import FormulaDialog from "@/views/formgen/components/formula/index.vue";
import { ref } from "vue";

const props = defineProps({
  activeData: {
    type: Object,
    default: () => ({})
  },
  fields: {
    type: Array,
    default: () => []
  }
});

const handleChangeFormula = (val: string) => {
  props.activeData.config.formulaValidate[currentIndex.value].formula = val;
};

const calcFormula = ref<string>("");

const addCustomValidate = () => {
  props.activeData.config.formulaValidate.push({
    formula: "",
    message: ""
  });
};

const currentIndex = ref<number>(null);
const formulaDialogRef = ref<any>(null);

const handleFormulaClick = (index: number) => {
  calcFormula.value = props.activeData.config.formulaValidate[index].formula;
  currentIndex.value = index;
  formulaDialogRef.value.open();
};
</script>
<style scoped lang="scss"></style>
