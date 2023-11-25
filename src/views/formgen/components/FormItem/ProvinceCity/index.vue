<template>
  <div>
    <el-cascader
      v-model="cascaderValue"
      :options="options"
      :props="props"
      size="default"
      style="width: 75%"
      class="provinceInput"
      clearable
      @change="changeHandle"
    />
    <el-row style="margin-top: 1em; width: 75%">
      <el-input
        v-if="item.config.requireDetailAddr"
        @change="changeHandle"
        type="textarea"
        :rows="2"
        :placeholder="$t('formgen.province.desc')"
        v-model="detailAddr"
      ></el-input>
    </el-row>
  </div>
</template>

<script>
import { regionData } from "./data";
import mixin from "./mixin";

export default {
  name: "ProvinceCity",
  mixins: [mixin],
  emits: ["update:value"],
  data() {
    return {
      options: regionData,
      props: {
        label: "label",
        value: "label",
        children: "children"
      }
    };
  },
  methods: {}
};
</script>

<style scoped>
.provinceInput {
  width: 75%;
}
</style>
