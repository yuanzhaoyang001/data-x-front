<template>
  <div>
    <el-divider>{{ $t("formgen.horizontalInput.fillinSet") }}</el-divider>
    <el-input
      id="inputText"
      ref="inputText"
      v-model="activeData.input"
      type="textarea"
      :rows="5"
      :placeholder="$t('formgen.horizontalInput.enterContent')"
    />
    <div style="margin-left: 20px; margin-bottom: 10px">
      <el-button
        icon="ele-CirclePlus"
        style="padding-bottom: 0"
        link
        type="primary"
        @mousedown="handleInsertInput"
      >
        {{ $t("formgen.horizontalInput.addContent") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  name: "ConfigItemHorizontalInput",
  mixins: [mixin],
  methods: {
    handleInsertInput(event) {
      event.preventDefault();
      this.insertInportTxt("$input");
    },
    insertInportTxt(insertTxt) {
      let elInput = document.querySelector("#inputText");
      let startPos = elInput.selectionStart;
      let endPos = elInput.selectionEnd;
      if (startPos === undefined || endPos === undefined) return;
      let txt = elInput.value;
      let result = txt.substring(0, startPos) + insertTxt + txt.substring(endPos);
      elInput.value = result;
      elInput.focus();
      elInput.selectionStart = startPos + insertTxt.length;
      elInput.selectionEnd = startPos + insertTxt.length;
      this.activeData.input = result;
    }
  }
};
</script>
