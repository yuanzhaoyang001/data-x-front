<template>
  <div>
    <el-form-item :label="$t('formgen.rate.max')">
      <el-input-number
        v-model="activeData.max"
        :min="1"
        :max="20"
        :placeholder="$t('formgen.rate.max')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData['allow-half'] !== undefined"
      :label="$t('formgen.rate.halfSelected')"
    >
      <el-switch v-model="activeData['allow-half']" />
    </el-form-item>
    <el-form-item
      v-if="activeData['show-text'] !== undefined"
      :label="$t('formgen.rate.auxiliaryText')"
    >
      <el-switch
        v-model="activeData['show-text']"
        @change="rateTextChange"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData['show-score'] !== undefined"
      :label="$t('formgen.rate.showScore')"
    >
      <el-switch
        v-model="activeData['show-score']"
        @change="rateScoreChange"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData['show-stops'] !== undefined"
      :label="$t('formgen.rate.spacer')"
    >
      <el-switch v-model="activeData['show-stops']" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemRate",
  props: ["activeData"],
  methods: {
    rateTextChange(val) {
      if (val) this.activeData["show-score"] = false;
    },
    rateScoreChange(val) {
      if (val) this.activeData["show-text"] = false;
    }
  }
};
</script>
