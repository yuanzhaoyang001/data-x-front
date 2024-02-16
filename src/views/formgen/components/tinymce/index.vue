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
import { baseUrl, getBaseUrlPath, getToken } from "@/utils/auth";
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
  const token = getToken();
  const uploadUrl = `${baseUrl}/user/file/upload`;
  // eslint-disable-next-line global-require
  console.log(targetTinymceId);
  let conf = {
    selector: targetTinymceId,
    language: "zh_CN",
    menubar: "false",
    icons: "tduck",
    skin: "tduck",
    // skin_url: "/tinymce/skins/ui/tduck",
    // content_css: "/tinymce/skins/content/tduck",
    cache_suffix: "?v=0.0.9",
    plugins,
    inline: inline,
    toolbar: customToolbar,
    placeholder: props.placeholder,
    entity_encoding: "row", // 所有字符都将以非实体形式保存，避免出现部分符号变成 html 编码
    toolbar_mode: "sliding",
    //div[*] 表示允许 <div> 标签以及所有的属性。
    extended_valid_elements: "formvariable[*]",
    custom_elements: "formvariable[*]",
    content_css: getBaseUrlPath() + "/tinymce/skins/editor.css",
    font_size_formats: "11px 12px 14px 16px 18px 24px 36px 48px",
    branding: false,
    // 此选项允许您打开/关闭图像、表格或媒体对象的大小调整手柄。默认情况下启用此选项，并允许您调整表格和图像的大小
    object_resizing: false,
    quickbars_insert_toolbar: false,
    quickbars_selection_toolbar: false,
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
    promotion: false, // 禁用推广
    // image_dimensions: false, // 禁用输入图片宽高
    // content_style: "img {max-width:100%;}",
    images_upload_handler: (blobInfo, progress) =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("Authorization", token);

        xhr.upload.onprogress = e => {
          progress((e.loaded / e.total) * 100);
        };
        xhr.onload = () => {
          if (xhr.status === 403) {
            reject({ message: "HTTP Error: " + xhr.status, remove: true });
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            reject("HTTP Error: " + xhr.status);
            return;
          }

          const json = JSON.parse(xhr.responseText);

          if (!json || typeof json.data != "string") {
            reject("Invalid JSON: " + xhr.responseText);
            return;
          }
          resolve(json.data);
        };

        xhr.onerror = () => {
          reject("上传失败" + xhr.status);
        };

        const formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
      }),
    file_picker_callback(cb, value, meta) {
      //以下是原生上传文件
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      // 限制视屏文件
      input.setAttribute("accept", ".mp4, .webm, .ogg");

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
    console.log("loadTinymce");
    conf = Object.assign(conf, tinymceConf);
    conf.init_instance_callback = editor => {
      if (props.value) editor.setContent(props.value);
      initChangeWatch(editor);
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
