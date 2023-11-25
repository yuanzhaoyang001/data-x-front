<template>
  <div class="right-board">
    <el-tabs
      v-model="currentTab"
      class="center-tabs"
    >
      <div>
        <h3 style="margin: 20px">{{ $t("formgen.rightPanel.attribute") }}</h3>
      </div>

      <div class="field-box">
        <el-scrollbar class="right-scrollbar">
          <form-item-config
            v-if="showField && activeData"
            :active-data="activeData"
            :form-conf="formConf"
            :fields="fields"
            @add-fields="handleAddFields"
            @data-change="dataChange"
          />
          <el-empty
            v-else
            :description="$t('formgen.rightPanel.noItem')"
          />
        </el-scrollbar>
      </div>
      <!--      <el-tab-pane label="表单属性" name="FormItem" />-->
    </el-tabs>
  </div>
</template>

<script>
import FormItemConfig from "./FormItemConfig.vue";

export default {
  components: {
    FormItemConfig
  },
  props: ["showField", "activeData", "formConf", "fields"],
  emits: ["data-change", "add-fields"],
  data() {
    return {
      currentTab: "field"
    };
  },
  methods: {
    dataChange(val) {
      this.$emit("data-change", val);
    },
    handleAddFields(val) {
      this.$emit("add-fields", val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/right";
</style>
