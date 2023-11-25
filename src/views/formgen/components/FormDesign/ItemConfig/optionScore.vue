<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="$t('formgen.optionScore.title')"
    width="50%"
  >
    <div>
      <div class="el-form el-form--label-top">
        <div class="el-form-item">
          <div class="el-form-item__content">
            <el-table
              :data="copyActiveData.config.options"
              border
            >
              <el-table-column
                :label="$t('formgen.optionQuota.optionSet')"
                property="label"
              >
                <template #default="scope">
                  {{ removeHtmlTag(scope.row.label) }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('formgen.optionScore.title')"
                property="quotaSetting"
              >
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.score"
                    :min="0"
                    placeholder=""
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
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
          @click="saveQuotaSetting"
        >
          {{ $t("formI18n.all.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="OptionScore" setup>
import { removeHtmlTag } from "../../../utils";
import { ref } from "vue";

const props = defineProps({
  activeData: {
    type: Object,
    default: () => ({})
  }
});

const copyActiveData = ref({});
const dialogVisible = ref(false);

const openQuotaSetting = () => {
  copyActiveData.value = JSON.parse(JSON.stringify(props.activeData));
  dialogVisible.value = true;
};

const saveQuotaSetting = () => {
  const copyData = copyActiveData.value;
  props.activeData.config.options = [...copyData.config.options];
  dialogVisible.value = false;
};

defineExpose({
  openQuotaSetting
});
</script>
