<template>
  <div>
    <el-form-item
      v-if="activeData.accept !== undefined"
      :label="$t('formgen.upload.fileType')"
    >
      <el-select
        v-model="activeData.accept"
        :style="{ width: '100%' }"
        clearable
        allow-create
        collapse-tags
        multiple
        :label="$t('formgen.upload.fileType')"
      >
        <el-option
          :label="$t('formgen.upload.img')"
          value="image/*"
        />
        <el-option
          :label="$t('formgen.upload.video')"
          value="video/*"
        />
        <el-option
          :label="$t('formgen.upload.audio')"
          value="audio/*"
        />
        <el-option
          label="excel"
          value=".xls,.xlsx"
        />
        <el-option
          label="word"
          value=".doc,.docx"
        />
        <el-option
          label="pdf"
          value=".pdf"
        />
        <el-option
          label="txt"
          value=".txt"
        />
        <el-option
          label="ppt"
          value=".ppt,.pptx"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="activeData.config.fileSize !== undefined"
      :label="$t('formgen.upload.fileSize')"
    >
      <el-input
        v-model.number="activeData.config.fileSize"
        :placeholder="$t('formgen.upload.enterSize')"
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
    <el-form-item
      v-if="activeData['list-type'] !== undefined"
      :label="$t('formgen.upload.listType')"
    >
      <el-radio-group
        v-model="activeData['list-type']"
        size="small"
      >
        <el-radio-button label="text">text</el-radio-button>
        <!--        <el-radio-button label="picture">picture</el-radio-button>-->
        <!--        <el-radio-button label="picture-card">picture-card</el-radio-button>-->
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="activeData.config.showTip !== undefined"
      :label="$t('formgen.upload.showTips')"
    >
      <el-switch v-model="activeData.config.showTip" />
    </el-form-item>
    <el-form-item :label="$t('formgen.upload.multiFile')">
      <el-switch v-model="activeData.multiple" />
    </el-form-item>
    <el-form-item :label="$t('formgen.upload.fileNumber')">
      <el-input-number v-model="activeData.limit" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemUpload",
  props: ["activeData"]
};
</script>
