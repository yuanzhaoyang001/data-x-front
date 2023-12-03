<template>
  <el-dialog
    :close-on-click-modal="false"
    :fullscreen="fullscreen"
    v-model="dialogVisible"
    width="70%"
    :class="[fullscreen ? 't-dialog--fullscreen' : 't-dialog', 'import-item-dialog']"
    :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="t__dialog__header">
        <span
          :id="titleId"
          :class="titleClass"
          class="el-dialog__title"
        >
          {{ dialogTitle }}
        </span>
        <div class="t__dialog__menu">
          <el-icon
            :size="18"
            class="el-icon--left"
            @click="close"
          >
            <ele-Close />
          </el-icon>
        </div>
      </div>
    </template>
    <div class="body">
      <el-tabs
        v-model="activeName"
        class="h100"
      >
        <el-tab-pane
          :label="$t('formgen.importItem.textImport')"
          name="textImport"
        >
          <el-row>
            <el-col :span="12">
              <div style="text-align: right">
                <el-button
                  icon="ele-Delete"
                  plainl
                  size="small"
                  @click="handleCleanText"
                >
                  {{ $t("formgen.importItem.cleanAll") }}
                </el-button>
              </div>
              <div class="input-wrap mt5">
                <el-scrollbar style="height: 70vh">
                  <el-input
                    v-model="content"
                    :autosize="{ minRows: 29 }"
                    :placeholder="$t('formgen.importItem.inputDesc')"
                    class="import-text-input"
                    type="textarea"
                    @change="handleSplitContent"
                  />
                </el-scrollbar>
              </div>
            </el-col>
            <el-col
              :offset="1"
              :span="10"
              class="right mt20"
            >
              <el-scrollbar style="height: 70vh">
                <generate-form
                  v-if="formConf.fields.length"
                  :key="formParseKey"
                  ref="generateForm"
                  :form-conf="formConf"
                  :page-form-model="{}"
                  style="margin-bottom: 40px"
                />
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('formgen.importItem.importText')"
          name="importHelp"
        >
          <el-alert
            :closable="false"
            class="m10"
            type="success"
          >
            <template #title>
              <div>
                <p>{{ $t("formgen.importItem.templateText1") }}</p>
                <p>{{ $t("formgen.importItem.templateText2") }}</p>
                <p>{{ $t("formgen.importItem.templateText3") }}</p>
                <p>{{ $t("formgen.importItem.templateText4") }}</p>
                <p>{{ $t("formgen.importItem.templateText5") }}</p>
              </div>
            </template>
          </el-alert>
          <text-import-tips />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ $t("formI18n.all.cancel") }}</el-button>
      <el-button
        v-re-click
        type="primary"
        @click="handleImport"
      >
        {{ $t("formI18n.all.confirm") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="ImportFormItem" setup>
import { onMounted, ref, watch } from "vue";
import GenerateForm from "@/views/formgen/components/GenerateForm/GenerateForm.vue";
import { formItemConvertData } from "../../../utils/convert";
import { batchCreateProjectItem } from "../../../api";
import mittBus from "@/utils/mitt";
import { MessageUtil } from "@/utils/messageUtil";
import TextImportTips from "./TextImportTips.vue";
import { parseText } from "@/views/formgen/components/FormDesign/import/parseTextItem";

interface FieldConfig {
  formId: string;
  typeId: string;
  label: string;
  content?: string;
  config: {
    label: string;
    options?: { label: string; value: string }[];
    formId?: string;
  };
  vModel: string;
}

const props = defineProps(["formKey"]);
const emits = defineEmits(["success"]);

const activeName = ref("textImport");
const content = ref(
  "【单选框组】您经常创建什么类型的项目？\n" + "问卷调研\n" + "满意度调查\n" + "投票评选\n" + "表单报名\n" + "测评考试"
);
const dialogVisible = ref(false);
const dialogTitle = ref("导入题目");
const fullscreen = ref(true);
const formConf = ref({
  fields: [] as FieldConfig[],
  labelPosition: "top",
  formKey: "temp001"
});
const formParseKey = ref("");

watch(
  () => content,
  () => handleSplitContent
);

onMounted(() => {
  handleSplitContent();
});

const handleSplitContent = () => {
  formConf.value.fields = parseText(content.value);
  formParseKey.value = "import-preview" + new Date();
};

const handleCleanText = () => {
  content.value = "";
};

const showDialog = () => {
  dialogVisible.value = true;
};

const handleImport = () => {
  let itemList = formConf.value.fields.map(item => formItemConvertData(item, props.formKey));
  batchCreateProjectItem(itemList).then(() => {
    MessageUtil.success("保存成功");
    dialogVisible.value = false;
    mittBus.emit("refreshFormList");
    emits("success");
  });
};

defineExpose({
  showDialog
});
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
  height: 100%;
  margin-bottom: 0 !important;
}

:deep(.el-tabs__content) {
  height: 90%;
}
.right {
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0 20px 40px;
}

:deep(.import-text-input .el-textarea__inner) {
  box-shadow: none;
  resize: none;
}

:deep(.input-wrap) {
  border: var(--el-border);
}
</style>
<style lang="scss">
.import-item-dialog .el-dialog__body {
  height: 85vh;
  padding: 10px 20px;
}
</style>
