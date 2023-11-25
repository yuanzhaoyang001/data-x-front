import loadScript from "./loadScript";
import { ElLoading } from "element-plus";

let wxObj: any;

export default function loadWXJs(cb: (wxObj: any) => void): void {
  if (wxObj) {
    cb(wxObj);
    return;
  }

  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "wxsdk资源加载中...",
    spinner: "el-icon-loading",
    background: "rgba(255, 255, 255, 0.5)"
  });

  loadScript("https://res.wx.qq.com/open/js/jweixin-1.6.0.js", () => {
    loading.close();
    // eslint-disable-next-line @typescript-eslint/no-undef
    wxObj = (window as any).wx;
    cb(wxObj);
  });
}
