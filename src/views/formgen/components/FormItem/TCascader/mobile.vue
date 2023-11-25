<template>
  <div>
    <template v-if="isMobile">
      <el-input
        v-model="inputValue"
        :placeholder="item.placeholder"
        @click="show = true"
        readonly
      >
        <template #suffix>
          <span v-if="item.clearable">
            <el-icon><ele-CircleClose /></el-icon>
          </span>
        </template>
      </el-input>
      <van-popup
        v-model:show="show"
        round
        position="bottom"
      >
        <van-cascader
          active-color="#1890ff"
          :field-names="fieldNames"
          v-model:value="cascaderValue"
          :title="item.placeholder"
          :options="getOptions()"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
    </template>
    <template v-else>
      <el-cascader
        v-bind="{ ...item }"
        v-model="changeValue"
        popper-class="t-cascader-popper"
        :options="getOptions()"
      />
    </template>
  </div>
</template>

<script>
import mixin from "../mixin";
import { Cascader, Popup } from "vant";
import { findLabelsByIds } from "@/views/formgen/components/GenerateForm/FormItemLabel";

export default {
  name: "MobileTCascader",
  components: {
    [Cascader.name]: Cascader,
    [Popup.name]: Popup
  },
  mixins: [mixin],
  data() {
    return {
      inputValue: "",
      show: false,
      fieldValue: "",
      cascaderValue: "",
      fieldNames: {
        text: "label",
        value: "value",
        children: "children"
      },
      isMobile: false
    };
  },
  watch: {
    changeValue: {
      deep: true,
      handler(val) {
        this.$emit("changeLabel", findLabelsByIds(this.getOptions(), val));
      }
    }
  },
  created() {
    if (this.changeValue) {
      this.cascaderValue = this.changeValue[this.changeValue.length - 1];
      if (this.changeValue.length) {
        const arr = this.getLabels(this.getOptions(), this.changeValue);
        this.setInputValue(arr);
      }
    }
    this.isMobile = this._isMobile();
  },
  methods: {
    getLabels(options, values) {
      const arr = [];
      values.forEach(e => {
        if (!arr.length) {
          const item = options.find(op => op.value === e);
          arr.push(item);
        } else {
          const item = arr[arr.length - 1].children.find(op => op.value === e);
          arr.push(item);
        }
      });
      return arr;
    },
    _isMobile() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return userAgent.indexOf("iphone") > -1 || userAgent.indexOf("mobile") > -1 || userAgent.indexOf("android") > -1;
    },
    onClear() {
      this.changeValue = [];
      this.cascaderValue = "";
      this.inputValue = "";
    },
    setInputValue(selectedOptions) {
      const showAllLevels = this.item["show-all-levels"];
      const vals = selectedOptions.map(e => e.label);
      this.inputValue = showAllLevels ? vals.join("/") : selectedOptions[selectedOptions.length - 1].label;
    },
    onFinish(e) {
      const { selectedOptions } = e;
      this.changeValue = selectedOptions.map(e => e.value);
      this.setInputValue(selectedOptions);
      this.show = false;
    }
  }
};
</script>
