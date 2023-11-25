<template>
  <div>
    <el-form-item
      v-if="activeData.ocrType !== undefined"
      :label="$t('formgen.ocrConfig.ocrType')"
    >
      <el-select
        size="default"
        v-model="activeData.ocrType"
        placeholder=""
      >
        <el-option
          :label="$t('formgen.ocrConfig.text')"
          value="GENERAL"
        />
      </el-select>
      <el-button
        class="mt10"
        size="default"
        style="width: 100%"
        icon="ele-Edit"
        @click="handleOcrRule"
      >
        {{ $t("formgen.ocrConfig.setRule") }}
      </el-button>
    </el-form-item>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('formgen.ocrConfig.setRule')"
      width="40%"
    >
      <span class="text-danger">{{ $t("formgen.ocrConfig.desc") }}</span>
      <div>
        <el-button
          link
          type="primary"
          size="default"
          class="mt20"
          icon="ele-CirclePlus"
          @click="handleCreateFields"
        >
          {{ $t("formgen.ocrConfig.createField") }}
        </el-button>
      </div>
      <div v-if="activeData.fieldMapping && Object.keys(activeData.fieldMapping).length">
        <div
          v-for="key in Object.keys(getOcrFields(activeData.ocrType))"
          :key="key"
        >
          <div class="m5">
            <el-tag>{{ getOcrFields(activeData.ocrType)[key]["label"] }}</el-tag>
            {{ $t("formgen.ocrConfig.saveTo") }}
            <el-tag v-if="Object.keys(activeData.fieldMapping)">
              {{ getFormField(key) }}
            </el-tag>
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
            @click="dialogVisible = false"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { queryProjectItemList } from "../../../api";
import { i18n } from "@/i18n";

export default {
  name: "ConfigItemOcr",
  components: {},
  props: ["activeData", "formConf"],
  emits: ["add-fields"],
  data() {
    return {
      dialogVisible: false,
      // 表单所有字段
      fieldList: [],
      // ocr默认存储字段关系
      ocrFields: {
        GENERAL: {
          url: {
            type: "IMAGE_UPLOAD",
            label: i18n.global.t("formgen.ocrConfig.file")
          },
          ocrContent: {
            type: "INPUT",
            label: i18n.global.t("formgen.ocrConfig.file")
          }
        }
      }
    };
  },
  created() {
    this.getAllFormFields();
  },
  methods: {
    // 创建ocr识别存储的字段
    handleCreateFields() {
      this.dialogVisible = false;
      this.$emit("add-fields", this.ocrFields[this.activeData.ocrType]);
    },
    handleOcrRule() {
      this.dialogVisible = true;
      this.getAllFormFields();
    },
    getOcrFields(key) {
      return this.ocrFields[key];
    },
    // 获取全部表单字段
    getAllFormFields() {
      queryProjectItemList({ key: this.formConf.formKey }).then(res => {
        this.fieldList = res.data;
      });
    },
    getFormField(key) {
      let fieldKey = "";
      if (this.activeData && this.activeData.fieldMapping && this.activeData.fieldMapping[key]) {
        fieldKey = this.activeData.fieldMapping[key];
      }
      let field = this.fieldList.find(item => item.formItemId == fieldKey);
      return field ? field.label : "";
    }
  }
};
</script>
