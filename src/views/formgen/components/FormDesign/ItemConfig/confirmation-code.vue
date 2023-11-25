<template>
  <div>
    <el-form-item
      v-if="activeData.validityType !== undefined"
      :label="$t('formgen.confirmationCode.validityType')"
    >
      <el-select
        v-model="activeData.validityType"
        style="width: 100%"
        size="default"
        placeholder=""
      >
        <el-option
          :label="$t('formgen.confirmationCode.definiteDate')"
          value="DEFINITE_DATE"
        ></el-option>
        <el-option
          :label="$t('formgen.confirmationCode.movementDate')"
          value="MOVEMENT_DATE"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="activeData.validityType === 'MOVEMENT_DATE'"
      :label="$t('formgen.confirmationCode.movementDate')"
    >
      <el-input-number
        v-model="activeData.dynamicDay"
        placeholder=""
      />
      <span class="ml10">{{ $t("formgen.confirmationCode.day") }}</span>
    </el-form-item>
    <el-form-item
      v-if="activeData.validityType === 'DEFINITE_DATE'"
      :label="$t('formgen.confirmationCode.definiteDate')"
    >
      <el-date-picker
        style="width: 14rem"
        v-model="activeData.definiteDate"
        type="datetime"
        :placeholder="$t('formgen.confirmationCode.choiceTime')"
        value-format="YYYY-MM-DD HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
    <!--    <el-form-item v-if="activeData.reConfirm !== undefined" label="二次确认">-->
    <!--      <el-checkbox v-model="activeData.reConfirm">需要二次确认才能完成核销</el-checkbox>-->
    <!--    </el-form-item>-->
    <el-form-item
      v-if="activeData.confirmationCodeType !== undefined"
      :label="$t('formgen.confirmationCode.codeType')"
    >
      <el-radio-group
        size="default"
        v-model="activeData.confirmationCodeType"
      >
        <el-radio label="BAR_CODE">{{ $t("formgen.confirmationCode.barCode") }}</el-radio>
        <el-radio label="QR_CODE">{{ $t("formgen.confirmationCode.qrCode") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <div class="descriptive-text">
      <el-divider>{{ $t("formgen.confirmationCode.showText") }}</el-divider>
      <div>
        <tinymce
          :id="activeData.formId"
          :key="activeData.formId"
          style="font-size: 12px"
          v-model:value="activeData.displayText"
          :placeholder="$t('formgen.confirmationCode.enterText')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import tinymce from "../../tinymce/index.vue";

export default {
  name: "ConfigItemConfirmationCode",
  components: {
    tinymce
  },
  props: ["activeData"],
  methods: {}
};
</script>

<style lang="scss" scoped>
.descriptive-text {
  :deep(.tox .tox-tbtn) {
    height: 28px;
  }
}
</style>
