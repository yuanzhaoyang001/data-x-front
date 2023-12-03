<template>
  <textarea
    :id="props.id"
    style="visibility: hidden"
  />
</template>

<script setup name="Tinymce">
import { plugins, toolbar } from "@/views/formgen/components/tinymce/config.js";
import _ from "lodash-es";
import { baseUrl, getToken } from "@/utils/auth";
import loadTinymce from "@/views/formgen/utils/loadTinymce";
import { onMounted, onUnmounted, useAttrs, watch } from "vue";

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
  toolbar: []
});

const attrs = useAttrs();

onMounted(() => {
  const token = getToken();
  const uploadUrl = `${baseUrl}/user/file/upload`;
  // eslint-disable-next-line global-require
  let conf = {
    selector: `#${props.id}`,
    language: "zh_CN",
    menubar: "false",
    icons: "tduck",
    skin: "tduck",
    // skin_url: "/tinymce/skins/ui/tduck",
    // content_css: "/tinymce/skins/content/tduck",
    cache_suffix: "?v=0.0.3",
    plugins,
    fontsize_formats: "11px 12px 14px 16px 18px 24px 36px 48px",
    toolbar: props.toolbar ? props.toolbar : toolbar,
    toolbar_drawer: "sliding",
    toolbar_mode: "sliding",
    height: 200,
    // fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
    branding: false,
    object_resizing: false,
    end_container_on_empty_block: true,
    powerpaste_word_import: "clean",
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: "square",
    advlist_number_styles: "default",
    default_link_target: "_blank",
    entity_encoding: "row", // 所有字符都将以非实体形式保存，避免出现部分符号变成 html 编码
    link_title: false,
    statusbar: false,
    content_style: "img {max-width:100%;}",
    nonbreaking_force_tab: true,
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
    conf = Object.assign(conf, attrs);
    conf.init_instance_callback = editor => {
      if (props.value) editor.setContent(props.value);
      initChangeWatch(editor);
    };
    tinymce.init(conf);
  });
});

onUnmounted(() => {
  if (!window.tinymce) return;
  const tinymceInstance = window.tinymce.get(props.id);
  if (tinymceInstance) {
    tinymceInstance.destroy();
  }
});

const emits = defineEmits(["update:value", "blur"]);

let editorInstance = null;

const initChangeWatch = editor => {
  editorInstance = editor;

  editor.on("change keyup undo redo", () => {
    emits("update:value", editor.getContent());
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
      if (typeof val !== "string") val = val.toString();
      _.debounce(editorInstance.setContent, 250, val);
    }
  },
  {
    immediate: false
  }
);
</script>

<style lang="scss">
.tox-tinymce-aux {
  z-index: 99999 !important;
}

.tinymce.ui.FloatPanel {
  z-index: 99;
}
</style>
