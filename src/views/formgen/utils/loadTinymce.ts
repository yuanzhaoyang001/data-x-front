import loadScript from "./loadScript";
import { ElLoading } from "element-plus";
import { basePathUrl } from "@/utils/constants";

let tinymceObj: any;

export default function loadTinymce(cb: Function) {
  const tinymceUrl = window.origin + basePathUrl + "/tinymce/tinymce.min.js";

  if (tinymceObj) {
    cb(tinymceObj);
    return;
  }

  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "资源加载中...",
    background: "rgba(255, 255, 255, 0.5)"
  });

  loadScript(tinymceUrl, () => {
    loading.close();
    // eslint-disable-next-line no-undef
    tinymceObj = tinymce;
    cb(tinymceObj);
  });
}
