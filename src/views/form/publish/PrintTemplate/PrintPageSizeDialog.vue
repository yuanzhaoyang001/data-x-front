<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('form.printTemplate.pageDialogTitle')"
    width="30%"
  >
    <el-form
      :model="formData"
      size="default"
      :rule="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="$t('form.printTemplate.printDirectionLabel')"
            prop="landscape"
          >
            <el-radio-group v-model="formData.landscape">
              <el-radio-button :label="true">{{ $t("form.printTemplate.landscapeOption") }}</el-radio-button>
              <el-radio-button :label="false">{{ $t("form.printTemplate.portraitOption") }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('form.printTemplate.printPageSize')"
            prop="paperType"
          >
            <el-radio-group v-model="formData.paperType">
              <el-radio-button label="A4">A4</el-radio-button>
              <el-radio-button label="A5">A5</el-radio-button>
              <el-radio-button label="custom">{{ $t("form.printTemplate.customOption") }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="formData.paperType === 'custom'"
        >
          <el-form-item
            :label="$t('form.printTemplate.customWidthLabel')"
            prop="customWidth"
          >
            <el-input-number
              v-model="formData.customWidth"
              :min="1"
              :label="$t('form.printTemplate.customWidthLabel')"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="formData.paperType === 'custom'"
        >
          <el-form-item
            :label="$t('form.printTemplate.customHeightLabel')"
            prop="customHeight"
          >
            <el-input-number
              v-model="formData.customHeight"
              :min="1"
              :label="$t('form.printTemplate.customHeightLabel')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('form.printTemplate.topMarginLabel')"
            prop="topMargin"
          >
            <el-input-number
              v-model="formData.topMargin"
              :min="0"
              :max="100"
              :label="$t('form.printTemplate.topMarginLabel')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('form.printTemplate.bottomMarginLabel')"
            prop="bottomMargin"
          >
            <el-input-number
              v-model="formData.bottomMargin"
              :min="0"
              :max="100"
              :label="$t('form.printTemplate.bottomMarginLabel')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('form.printTemplate.leftMarginLabel')"
            prop="leftMargin"
          >
            <el-input-number
              v-model="formData.leftMargin"
              :min="0"
              :max="100"
              :label="$t('form.printTemplate.leftMarginLabel')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('form.printTemplate.rightMarginLabel')"
            prop="rightMargin"
          >
            <el-input-number
              v-model="formData.rightMargin"
              :min="0"
              :max="100"
              :label="$t('form.printTemplate.rightMarginLabel')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("common.enter") }}</el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          {{ $t("common.cancel") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getFormPrintTemplate, updateFormPrintTemplate } from "@/api/project/printTemplate";
import { MessageUtil } from "@/utils/messageUtil";
import { i18n } from "@/i18n";
import { useRoute } from "vue-router";

const dialogVisible = ref(false);

const formData = ref({
  landscape: false,
  paperType: "A4",
  customHeight: undefined,
  customWidth: undefined,
  topMargin: 5,
  bottomMargin: 5,
  leftMargin: 5,
  rightMargin: 5,
  paramList: []
});

const rules = {
  landscape: [{ required: true, message: i18n.global.t("form.printTemplate.landscapePlaceholder"), trigger: "blur" }],
  paperType: [{ required: true, message: i18n.global.t("form.printTemplate.paperTypePlaceholder"), trigger: "blur" }],
  customWidth: [{ required: true, message: i18n.global.t("form.printTemplate.customWidthPlaceholder"), trigger: "blur" }],
  customHeight: [{ required: true, message: i18n.global.t("form.printTemplate.customHeightPlaceholder"), trigger: "blur" }],
  topMargin: [{ required: true, message: i18n.global.t("form.printTemplate.topMarginPlaceholder"), trigger: "blur" }],
  bottomMargin: [{ required: true, message: i18n.global.t("form.printTemplate.bottomMarginPlaceholder"), trigger: "blur" }],
  leftMargin: [{ required: true, message: i18n.global.t("form.printTemplate.leftMarginPlaceholder"), trigger: "blur" }],
  rightMargin: [{ required: true, message: i18n.global.t("form.printTemplate.rightMarginPlaceholder"), trigger: "blur" }]
};

const handleShow = () => {
  dialogVisible.value = true;
};

onMounted(() => {
  getFormPrintTemplate(route.query.id as unknown as number).then(res => {
    formData.value = res.data.printJson;
  });
});

const route = useRoute();

const handleSave = async () => {
  await updateFormPrintTemplate({
    id: route.query.id,
    printJson: formData.value
  });
  dialogVisible.value = false;
  MessageUtil.success(i18n.global.t("common.saveSuccess"));
};

defineExpose({
  handleShow
});
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
