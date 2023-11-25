<template>
  <div>
    <el-form-item
      v-if="activeData.config.fileSize !== undefined"
      :label="$t('formgen.upload.fileSize')"
    >
      <el-input
        v-model.number="activeData.config.fileSize"
        :placeholder="$t('formgen.upload.fileSize')"
      >
        <template #append>
          <el-select
            v-model="activeData.config.sizeUnit"
            :style="{ width: '66px' }"
          >
            <el-option
              label="KB"
              value="KB"
            />
            <el-option
              label="MB"
              value="MB"
            />
            <el-option
              label="GB"
              value="GB"
            />
          </el-select>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('formgen.upload.multiFile')">
      <el-switch v-model="activeData.multiple" />
    </el-form-item>
    <el-form-item :label="$t('formgen.upload.maxFile')">
      <el-input-number v-model="activeData.limit" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemImageUpload",
  props: ["activeData"]
};
</script>
