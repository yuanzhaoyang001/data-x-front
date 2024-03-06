<template>
  <div class="">
    <div class="formula-head">
      <slot name="tips">
        <span class="formula-name">公式</span>
        <span class="formula-equal">=</span>
      </slot>
    </div>
    <div
      ref="codeMirrorRef"
      style="min-height: 250px; width: 100%"
    ></div>
  </div>
</template>
<script setup name="FormulaCodeMirror">
import { onMounted, ref, watch, defineExpose, defineProps, nextTick } from "vue";
import { basicSetup, EditorView } from "codemirror";
import { StreamLanguage } from "@codemirror/language";
import { spreadsheet } from "@codemirror/legacy-modes/mode/spreadsheet";
import { customFieldPlugin, setCustomFieldLabelMap, tduckTheme } from "./customFieldPlugin";
import { removeHtmlTag } from "@/views/formgen/utils";

const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  fields: {
    type: Array,
    default: () => []
  }
});

watch(
  () => props.fields,
  () => {
    let fieldObj = {};
    props.fields.forEach(field => {
      fieldObj[field.key] = field.label;
      // 如果是子表单
      if (field.children && field.children.length > 0) {
        field.children.forEach(child => {
          fieldObj[field.key + "," + child.vModel] = field.label + "-" + removeHtmlTag(child.config.label);
        });
      }
    });
    setCustomFieldLabelMap(fieldObj);
  },
  {
    immediate: true,
    deep: true
  }
);

const initValue = () => {
  if (!props.value) {
    return;
  }

  codeMirrorInstance.dispatch({
    changes: { from: 0, to: codeMirrorInstance.state.doc.length, insert: props.value }
  });
  // let fieldObj = {};
  // props.fields.forEach(field => {
  // 	fieldObj[field.key] = field.label;
  // });
  // setCustomFieldLabelMap(fieldObj);
  // this.codemirrorEditor.setValue(this.value);
  // let cursor = { line: 0, ch: 0 };
  // this.codemirrorEditor.eachLine(line => {
  // 	for (let i = 0; i < line.text.length; i++) {
  // 		if (line.text.charAt(i) === "#" && line.text.charAt(i + 1) === "{") {
  // 			cursor.ch = i;
  // 			let htmlNode = document.createElement("span");
  // 			// 查找从指定位置开始的结束符号
  // 			let endIndex = line.text.indexOf("}", i + 1);
  // 			// 截取变量名
  // 			let vModel = line.text.substring(i + 2, endIndex);
  // 			htmlNode.innerText = fieldObj[vModel];
  // 			htmlNode.className = "cm-field-value";
  // 			this.codemirrorEditor.markText(
  // 				cursor,
  // 				{ line: cursor.line, ch: cursor.ch + vModel.length + 3 },
  // 				{
  // 					className: "cm-field-value",
  // 					replacedWith: htmlNode
  // 				}
  // 			);
  // 		}
  // 	}
  // 	cursor.line++;
  // });
};

/**
 * 插入函数
 */
const insertFunction = funName => {
  let cursor = codeMirrorInstance.state.selection.main.head;
  codeMirrorInstance.dispatch({
    changes: { from: cursor, to: cursor, insert: `${funName}()` }
  });
  codeMirrorInstance.dispatch({ selection: { anchor: cursor + funName.length + 1 } });
};

/**
 * 插入变量
 */
const insertVariable = (code, name) => {
  let cursor = codeMirrorInstance.state.selection.main.head;
  let varName = `#{${code}}`;
  codeMirrorInstance.dispatch({
    changes: { from: cursor, to: cursor, insert: varName }
  });
  codeMirrorInstance.focus();
  nextTick(() => {
    codeMirrorInstance.dispatch({ selection: { anchor: cursor + varName.length } });
  });
};

const getValue = () => {
  return codeMirrorInstance.state.doc.toString();
};

const codeMirrorRef = ref(null);

let codeMirrorInstance = null;

onMounted(() => {
  codeMirrorInstance = new EditorView({
    doc: "",
    extensions: [basicSetup, StreamLanguage.define(spreadsheet), tduckTheme, customFieldPlugin],
    parent: codeMirrorRef.value
  });
  initValue();
  // this.codemirrorEditor.on("change", cm => {
  // 	// this.$emit("update:value", cm.getValue());
  // 	// this.$emit("change", cm.getValue());
  // });
  // this.codemirrorEditor.on("inputRead", () => {
  // 	this.codemirrorEditor.showHint();
  // });
});

defineExpose({
  insertFunction,
  insertVariable,
  getValue
});
</script>

<style>
.formula-head {
  background: #f3f8fb;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 12px;
}

:deep(.cm-field-value) {
  margin: 1px;
  padding: 1px;
  background: #1890ff;
  color: #ffffff;
  font-weight: 50;
}
</style>
