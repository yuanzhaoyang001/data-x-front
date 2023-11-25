import loadScript from "./loadScript";
import { ElLoading } from "element-plus";

let html5QrcodeObj: any;

export default function loadHtml5Qrcode(cb: Function) {
  const html5QrcodeUrl = window.origin + "/plugins/html5-qrcode-2.3.7.min.js";

  if (html5QrcodeObj) {
    cb(html5QrcodeObj);
    return;
  }

  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "加载扫码插件中...",
    background: "rgba(255, 255, 255, 0.5)"
  });

  loadScript(html5QrcodeUrl, () => {
    loading.close();
    // eslint-disable-next-line no-undef
    html5QrcodeObj = Html5Qrcode;
    cb(html5QrcodeObj);
  });
}
