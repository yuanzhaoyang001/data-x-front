<template>
  <div>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.inputMapConfig.latitudeAndLongitude") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.inputMapConfig.content')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.longAndLat" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.inputMapConfig.mapSelection") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.inputMapConfig.content2')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.selectLocation" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>
          {{ $t("formgen.inputMapConfig.disableSearch") }}
          <el-tooltip
            class="item"
            :content="$t('formgen.inputMapConfig.content3')"
            effect="dark"
            placement="top-start"
          >
            <el-icon><ele-QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-switch v-model="activeData.showSerachInput" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemInputMap",
  components: {},
  props: ["activeData"]
};
</script>
