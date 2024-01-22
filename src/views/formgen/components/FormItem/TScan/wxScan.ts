import { isWxEnv } from "@/views/form/write/hooks/wx";
import { getWxSignature } from "@/api/project/wxmp";
import loadWXJs from "@/views/formgen/utils/loadWxSdk";

let isReady = false;

export const openWxScanReq = handleFunc => {
  wx.scanQRCode({
    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    success: function (res) {
      // 扫码成功，跳转到二维码指定页面（res.resultStr为扫码返回的结果）
      let scan = res.resultStr;
      // alert(scan);
      handleFunc(scan);
    }
  });
};

export const loadWxApi = () => {
  if (isWxEnv()) {
    getWxSignature({ url: window.location.href }).then(res => {
      const signature = res.data;
      loadWXJs(wx => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: signature.appId, // 必填，公众号的唯一标识
          timestamp: signature.timestamp, // 必填，生成签名的时间戳
          nonceStr: signature.nonceStr, // 必填，生成签名的随机串
          signature: signature.signature, // 必填，签名
          jsApiList: [
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "showMenuItems",
            "hideMenuItems",
            "chooseWXPay",
            "scanQRCode"
          ] // 必填，需要使用的JS接口列表
        });
        // sdk准备完成之后调用
        wx.ready(function () {
          isReady = true;
        });
      });
    });
  }
};
