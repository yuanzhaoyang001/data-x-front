<template>
  <div>
    <el-form-item :label="$t('formgen.scan.enableWxScan')">
      <el-switch v-model="activeData.enableWxScan" />
    </el-form-item>
    <el-form-item
      v-if="activeData.openCut !== undefined"
      :label="$t('formgen.scan.cutStr')"
    >
      <el-switch v-model="activeData.openCut" />
    </el-form-item>
    <div v-if="activeData.openCut">
      <div class="el-form-item__label block">
        {{ $t("formgen.scan.strLength") }}
      </div>
      <el-row
        :gutter="10"
        type="flex"
        align="middle"
      >
        <el-col :span="10">
          <el-input-number
            v-model="activeData.cutStart"
            :min="1"
            :controls="false"
          />
        </el-col>
        <el-col :span="2">-</el-col>
        <el-col :span="5">
          <el-input-number
            v-model="activeData.cutEnd"
            :min="1"
            :controls="false"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfigItemScan",
  props: ["activeData"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.block {
  display: block;
  float: none;
}
</style>
