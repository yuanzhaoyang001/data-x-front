<template>
  <div>
    <el-form-item :label="$t('formgen.number.maxValue')">
      <el-input-number
        v-model="activeData.max"
        style="width: 100%"
        :placeholder="$t('formgen.number.maxValue')"
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.number.minValue')">
      <el-input-number
        v-model="activeData.min"
        style="width: 100%"
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
  </div>
</template>

<script>
export default {
  name: "ConfigItemSlider",
  props: ["activeData"]
};
</script>
