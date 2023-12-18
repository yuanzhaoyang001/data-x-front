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
    <field-select-dialog
      ref="fieldSelectDialog"
      :form-item-id="formItemId"
      @submit="handleInsertContent"
    />
  </div>
</template>

<script setup name="FormTinymce">
import { baseUrl, getToken } from "@/utils/auth";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { inlineToolbar, plugins, toolbar as defaultToolbar } from "./config";
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
    default: ""
  },
  toolbar: {
    type: [Array, String],
    default: () => []
  },
  // 内联模式
  inline: {
    default: false
  },
  formItemId: {
    type: String,
    default: ""
  }
});

const showFieldSelect = ref(false);

const fieldSelectDialog = ref(null);

const tinymceId = ref(props.id);

onMounted(() => {
  const token = getToken();
  const uploadUrl = `${baseUrl}/user/file/upload`;
  let finalToolbar = [];
  if (props.inline) {
    finalToolbar = props.toolbar && props.toolbar.length ? props.toolbar : inlineToolbar;
  } else {
    finalToolbar = props.toolbar && props.toolbar.length ? props.toolbar : defaultToolbar;
  }
  // eslint-disable-next-line global-require
  let conf = {
    selector: `#${props.id}${props.inline ? "inline" : ""}`,
    language: "zh_CN",
    menubar: "false",
    icons: "tduck",
    skin: "tduck",
    // skin_url: "/tinymce/skins/ui/tduck",
    // content_css: "/tinymce/skins/content/tduck",
    cache_suffix: "?v=0.0.6",
    plugins,
    inline: props.inline,
    toolbar: finalToolbar,
    toolbar_drawer: "sliding",
    entity_encoding: "row", // 所有字符都将以非实体形式保存，避免出现部分符号变成 html 编码
    toolbar_mode: "sliding",
    height: 200,
    //div[*] 表示允许 <div> 标签以及所有的属性。
    extended_valid_elements: "formvariable[*]",
    custom_elements: "formvariable[*]",
    content_css: "/tinymce/skins/editor.css",
    fontsize_formats: "11px 12px 14px 16px 18px 24px 36px 48px",
    branding: false,
    object_resizing: false,
    end_container_on_empty_block: true,
    powerpaste_word_import: "clean",
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: "square",
    advlist_number_styles: "default",
    default_link_target: "_blank",
    link_title: false,
    statusbar: false,
    convert_urls: false, // 关闭把文件的路径转换成相对的
    relative_urls: false,
    remove_script_host: false,
    paste_data_images: true,
    file_picker_types: "media",
    // image_dimensions: false, // 禁用输入图片宽高
    // content_style: "img {max-width:100%;}",
    images_upload_handler(blobInfo, succFun, failFun) {
      const file = blobInfo.blob(); // 转化为易于理解的file对象
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open("POST", uploadUrl);
      xhr.setRequestHeader("Authorization", token);
      xhr.onload = function () {
        if (xhr.status !== 200) {
          failFun(`HTTP Error: ${xhr.status}`);
          return;
        }
        const json = JSON.parse(xhr.responseText);
        if (!json || typeof json.data !== "string") {
          failFun(`Invalid JSON: ${xhr.responseText}`);
          return;
        }
        succFun(json.data);
      };
      const formData = new FormData();
      formData.append("file", file, file.name); // 此处与源文档不一样
      xhr.send(formData);
    },
    file_picker_callback(cb, value, meta) {
      //以下是原生上传文件
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.click();
      input.onchange = function () {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("Authorization", token);
        xhr.onload = function () {
          if (xhr.status !== 200) {
            return;
          }
          const json = JSON.parse(xhr.responseText);
          if (!json || typeof json.data !== "string") {
            return;
          }
          cb(json.data, { text: json.data });
        };
        const formData = new FormData();
        const file = input.files[0];
        formData.append("file", file, file.name); // 此处与源文档不一样
        xhr.send(formData);
      };
    }
  };
  loadTinymce(tinymce => {
    conf = Object.assign(conf, {});
    conf.init_instance_callback = editor => {
      if (props.value) editor.setContent(props.value);
      initChangeWatch(editor);
    };
    conf.setup = editor => {
      // 注册一个工具栏按钮名称
      editor.ui.registry.addButton("formvariable", {
        text: "",
        icon: "formvariable",
        tooltip: "引用题目",
        onAction: function () {
          showFieldSelectDialog();
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
});

onUnmounted(() => {
  if (!editorInstance) return;
  editorInstance.destroy();
});

const handleInsertContent = content => {
  editorInstance.insertContent(content);
};
const showFieldSelectDialog = () => {
  showFieldSelect.value = true;
  nextTick(() => {
    fieldSelectDialog.value.open();
  });
};

const emits = defineEmits(["update:value", "blur", "change"]);

let editorInstance = null;

const initChangeWatch = editor => {
  editorInstance = editor;
  if (props.value) editor.setContent(props.value);
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
      editorInstance.setContent(val);
    }
  },
  {
    immediate: true
  }
);

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
