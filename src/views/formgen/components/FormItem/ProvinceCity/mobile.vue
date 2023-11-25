<template>
  <div class="">
    <el-input
      v-model="showValue"
      readonly
      :placeholder="placeholder"
      read-only
      style="cursor: pointer"
      @click="showPicker"
    />
    <el-row style="margin-top: 1em">
      <el-input
        v-if="item.config.requireDetailAddr"
        @change="changeHandle"
        type="textarea"
        :rows="2"
        :placeholder="$t('formgen.province.desc')"
        v-model="detailAddr"
      ></el-input>
    </el-row>
    <van-popup
      v-model:show="visible"
      round
      position="bottom"
    >
      <van-cascader
        v-model:value="popupCascaderValue"
        :options="options"
        :title="$t('formgen.province.title')"
        :field-names="fieldNames"
        @close="visible = false"
        @finish="handleConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { regionData } from "./data";
import { Cascader, Popup } from "vant";
import "vant/lib/popup/style";
import "vant/lib/cascader/style";
import mixin from "./mixin";

export default {
  name: "MobileProvinceCity",
  components: {
    [Popup.name]: Popup,
    [Cascader.name]: Cascader
  },
  mixins: [mixin],
  props: {
    placeholder: String
  },
  data() {
    return {
      disabled: true,
      visible: false,
      options: regionData,
      fieldNames: {
        text: "label",
        value: "label",
        children: "children"
      },
      popupCascaderValue: null
    };
  },
  methods: {
    /** 显示 Picker */
    showPicker() {
      this.visible = true;
    },
    /** 处理确认选择 */
    handleConfirm({ selectedOptions }) {
      this.visible = false;
      this.cascaderValue = selectedOptions.map(option => option.label);
      this.showValue = this.cascaderValue.join("/");
      this.changeHandle();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/vant";
</style>
