<template>
  <div>
    <el-form-item :label="$t('formgen.number.maxValue')">
      <el-input-number
        style="width: 100%"
        v-model="activeData.max"
        :placeholder="$t('formgen.number.maxValue')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.number.minValue')">
      <el-input-number
        style="width: 100%"
        v-model="activeData.min"
        :placeholder="$t('formgen.number.minValue')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.number.stepLength')">
      <el-input-number
        style="width: 100%"
        v-model="activeData.step"
        :placeholder="$t('formgen.number.enterStepLength')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.number.precision')">
      <el-input-number
        style="width: 100%"
        v-model="activeData.precision"
        :placeholder="$t('formgen.number.precisionText')"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemNumber",
  props: ["activeData"]
};
</script>
