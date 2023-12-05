<template>
  <div>
    <el-form-item :label="$t('formgen.npsConfig.startNum')">
      <el-input-number
        v-model="activeData.table.min"
        :max="10"
        :min="0"
        label=""
      />
    </el-form-item>
    <el-form-item :label="$t('formgen.npsConfig.number')">
      <el-input-number
        v-model="activeData.table.level"
        :min="0"
        :max="10"
        label=""
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.table.copyWriting"
      :label="$t('formgen.npsConfig.minText')"
    >
      <el-input
        v-model="activeData.table.copyWriting.min"
        placeholder=""
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.table.copyWriting"
      :label="$t('formgen.npsConfig.maxText')"
    >
      <el-input
        v-model="activeData.table.copyWriting.max"
        placeholder=""
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ConfigItemNps",
  components: {},
  props: ["activeData"],
  data() {
    return {};
  },
  computed: {
    styleObject() {
      return {
        "--color": this.activeData.iconColor || "#f7ba2a"
      };
    }
  },
  methods: {}
};
</script>
