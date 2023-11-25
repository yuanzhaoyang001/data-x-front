<template>
  <div>
    <el-input
      :placeholder="placeholder"
      v-model="changeValue"
      readonly
    >
      <template #append>
        <el-button
          icon="ele-FullScreen"
          @click="handleScanCode"
        ></el-button>
      </template>
    </el-input>
    <scan-code
      ref="scanCode"
      @change="handleScanChange"
    />
  </div>
</template>

<script>
import mixin from "../mixin";
import ScanCode from "./ScanCode.vue";
import { openWxScanReq, loadWxApi } from "./wxScan";

export default {
  name: "TScan",
  components: { ScanCode },
  mixins: [mixin],
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    enableWxScan: {
      type: Boolean,
      default: false
    },
    openCut: {
      type: Boolean,
      default: false
    },
    cutStart: {
      type: Number,
      default: null
    },
    cutEnd: {
      type: Number,
      default: null
    }
  },
  created() {
    if (this.enableWxScan) {
      loadWxApi();
    }
  },

  methods: {
    handleScanCode() {
      if (this.enableWxScan) {
        openWxScanReq(this.handleScanChange);
      } else {
        this.$refs.scanCode.openModal();
      }
    },
    handleScanChange(value) {
      if (value) {
        if (this.openCut) {
          value = value.substring(this.cutStart - 1, this.cutEnd);
        }
      }
      this.changeValue = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.scan {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
