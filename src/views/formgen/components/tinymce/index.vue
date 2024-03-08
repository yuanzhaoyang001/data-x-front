<template>
  <div>
    <textarea
      v-if="!inline"
      :id="tinymceId"
      style="visibility: hidden"
    />
    <!--    内联模式-->
    <div
      v-else
      :id="`${tinymceId}inline`"
    />
    <FieldSelectDialog
      ref="fieldSelectDialogRef"
      :form-item-id="formItemId"
      @submit="handleInsertContent"
    />
    <el-dialog
      fullscreen
      v-model="dialogVisible"
      :title="$t('common.edit')"
      :before-close="handleCloseDialog"
    >
      <textarea
        :id="fullEditTinymceId"
        style="visibility: hidden"
      />
    </el-dialog>
  </div>
</template>

<script setup name="FormTinymce">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { inlineToolbar, tinymceEditorConfig, toolbar as defaultToolbar } from "./config";
import loadTinymce from "../../utils/loadTinymce";
import _ from "lodash-es";
import FieldSelectDialog from "./FieldSelectDialog.vue";

const props = defineProps({
  id: {
    type: String,
    default: () => {
      return `tinymce-${_.uniqueId()}`;
    }
  },
  value: {
    type: String,
    default: ""
  },
  toolbar: {
    type: [Array, String],
    default: () => []
  },
  // 内联模式
  inline: {
    type: Boolean,
    default: false
  },
  formItemId: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  },
  // 其他配置
  config: {
    type: Object,
    default: () => ({})
  }
});

const showFieldSelect = ref(false);

const fieldSelectDialogRef = ref(null);

const tinymceId = ref(props.id);

const fullEditTinymceId = ref(`tinymce-${_.uniqueId()}`);

const dialogVisible = ref(false);

onMounted(() => {
  initDefaultTinymce();
});

const initDefaultTinymce = () => {
  let finalToolbar = [];
  if (props.inline) {
    finalToolbar = props.toolbar && props.toolbar.length ? props.toolbar : inlineToolbar;
  } else {
    finalToolbar = props.toolbar && props.toolbar.length ? props.toolbar : defaultToolbar;
  }
  initTinymce(`#${props.id}${props.inline ? "inline" : ""}`, props.inline, finalToolbar, props.config);
};

const initTinymce = (targetTinymceId, inline, customToolbar, tinymceConf) => {
  // eslint-disable-next-line global-require
  console.log(targetTinymceId);
  let conf = {
    ...tinymceEditorConfig,
    selector: targetTinymceId,
    inline: inline,
    toolbar: customToolbar,
    placeholder: props.placeholder
  };
  // 使用这个插件 需要扩展
  if (customToolbar.indexOf("formvariable") > 0) {
    conf.extended_valid_elements = "formvariable[*]";
    conf.custom_elements = "formvariable[*]";
  }
  loadTinymce(tinymce => {
    console.log("loadTinymce");
    conf = Object.assign(conf, tinymceConf);
    conf.init_instance_callback = editor => {
      if (props.value) editor.setContent(props.value);
      initChangeWatch(editor);
      // 加载完成事件
      emits("load");
    };
    conf.setup = editor => {
      // 注册一个工具栏按钮名称
      editor.ui.registry.addToggleButton("formvariable", {
        icon: "formvariable",
        tooltip: "引用题目",
        onAction: function () {
          showFieldSelectDialog();
        }
      });
      // 全屏编辑
      editor.ui.registry.addToggleButton("fulledit", {
        icon: "fulledit",
        tooltip: "全部编辑",
        onAction: function () {
          editorInstance.destroy();
          editorInstance = null;
          dialogVisible.value = true;
          nextTick(() => {
            initTinymce(`#${fullEditTinymceId.value}`, false, defaultToolbar, {
              height: 900,
              ...props.config
            });
          });
        }
      });
    };
    tinymce.init(conf);
  });
  // 监听页面滚动事件
  window.addEventListener(
    "scroll",
    _.throttle(() => {
      if (props.inline) {
        if (editorInstance) {
          editorInstance?.getElement()?.blur();
        }
      }
    }, 100),
    true
  );
};

onUnmounted(() => {
  console.log("销毁tinymce");
  console.log(editorInstance);
  if (!editorInstance) return;
  window.addEventListener("scroll", () => {}, true);
  editorInstance.destroy();
});

const handleInsertContent = content => {
  editorInstance.insertContent(content);
};
const showFieldSelectDialog = () => {
  showFieldSelect.value = true;
  nextTick(() => {
    fieldSelectDialogRef.value.open();
  });
};

const emits = defineEmits(["update:value", "blur", "change", "load"]);

let editorInstance = null;

const initChangeWatch = editor => {
  editorInstance = editor;
  editor.on("change keyup undo redo", () => {
    editor.save();
    emits("update:value", editor.getContent());
    emits("change", editor.getContent());
  });
  editor.on("blur", () => {
    emits("blur");
  });
};

// 可以直接侦听一个 ref
watch(
  () => props.value,
  async (val, prevVal) => {
    if (editorInstance && val !== prevVal && val !== editorInstance.getContent()) {
      editorInstance.setContent(val || "");
    }
  },
  {
    immediate: true
  }
);

const handleCloseDialog = () => {
  editorInstance.destroy();
  editorInstance = null;
  dialogVisible.value = false;
  nextTick(() => {
    initDefaultTinymce();
  });
};

defineExpose({
  handleInsertContent
});
</script>
<style>
.tox-tinymce-aux {
  z-index: 99999 !important;
}

.tinymce.ui.FloatPanel {
  z-index: 99;
}

[contenteditable] {
  outline: none;
  border: 1px solid transparent;
}
</style>
