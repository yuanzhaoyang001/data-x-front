import { getQueryString } from "@/views/formgen/utils";
import { isWxEnv, onlyWxOpenHandle, setWxConfig } from "@/views/form/write/hooks/wx";
import { getAuthorizationUrl, getAuthorizationUserInfo, getWxSignature } from "@/api/project/wxmp";
import Cookies from "js-cookie";
import { onBeforeMount, ref } from "vue";
import { WxUserInfO } from "@/views/form/write/types";
import { useRouter } from "vue-router";

export function useFormWxHook() {
  // 微信授权地址
  const wxAuthorizationUrl = ref<string>("");
  // 授权COde
  const wxAuthorizationCode = ref<string>("");
  // 微信用户信息
  const wxUserInfo = ref<WxUserInfO>({});
  // 微信签名
  const wxSignature = ref<any>({});
  // 小程序openId
  const miniAppOpenId = ref<string>("");
  // 处于小程序webview中
  const isMiniAppWebview = ref<boolean>(false);

  const formKey = ref<string>("");

  const router = useRouter();

  onBeforeMount(() => {
    formKey.value = (router.currentRoute.value.query["key"] || router.currentRoute.value.params["key"]) as string;

    // 获取Url中携带的openID 微信小程序才会携带
    miniAppOpenId.value = getQueryString("openId");
    // !! 把直变成布尔
    isMiniAppWebview.value = !!miniAppOpenId.value;
    // 非小程序才执行
    if (!isMiniAppWebview.value) {
      // 微信授权重定向到该页 会携带code参数
      getWxAuthorizationUserInfoByCode().then(() => {});
    } else {
      // 设置到表单基础数据中
      wxUserInfo.value = { openid: miniAppOpenId.value, type: "miniapp" };
    }
  });

  // 根据wxcode获取用户信息
  const getWxAuthorizationUserInfoByCode = async () => {
    // 微信授权重定向到该页 会携带code参数
    const wxCode = getQueryString("code");
    if (wxCode) {
      wxAuthorizationCode.value = wxCode;
      await getWxAuthorizationUserInfo();
    }
  };

  // 设置微信的一些配置 比如分享
  const handleSettingWxConfig = (config: any) => {
    if (isWxEnv() && !isMiniAppWebview.value) {
      getWxSignature({ url: window.location.href }).then(res => {
        wxSignature.value = res.data;
        setWxConfig(wxSignature.value, config);
      });
    }
  };

  // 从cookie获取微信用户信息
  const getCookieAuthorizationUserInfo = () => {
    let wxUserInfoFromCookie = Cookies.get("wxUserInfo");
    if (wxUserInfoFromCookie) {
      wxUserInfoFromCookie = JSON.parse(wxUserInfoFromCookie);
      if (wxUserInfoFromCookie.openid) {
        wxUserInfo.value = wxUserInfoFromCookie;
      }
    }
    return wxUserInfoFromCookie;
  };

  // 获取微信授权信息
  const getWxAuthorizationUserInfo = async () => {
    // 根据code 获取用户授权信息
    const res = await getAuthorizationUserInfo({ code: wxAuthorizationCode.value });
    if (res.data) {
      wxUserInfo.value = res.data;
      Cookies.set("wxUserInfo", JSON.stringify(res.data));
      return res.data;
    }
  };

  // 获取授权跳转地址
  const getWxAuthorizationUrl = async (scope: string) => {
    // 获取微信授权url地址
    const res = await getAuthorizationUrl({ url: window.location.href, scope: scope });
    return res.data;
  };

  // 检查微信授权等填写
  const checkWxWriteSetting = (data: { onlyWxWrite: boolean; recordWxUser?: boolean }) => {
    const { onlyWxWrite, recordWxUser } = data || {};
    if (onlyWxWrite) {
      if (!isWxEnv()) {
        onlyWxOpenHandle();
      }
      // 是否需要记录微信授权信息 开启并且没有授权code 避免授权回来进入死循环 小程序的webview也别调了
      if (recordWxUser && !wxAuthorizationCode.value && !isMiniAppWebview.value) {
        if (Object.keys(wxUserInfo.value).length === 0) {
          // cookie获取微信用户信息
          const userInfo = getCookieAuthorizationUserInfo();
          if (!userInfo || !userInfo.headimgurl) {
            wxUserInfo.value = userInfo;
            getWxAuthorizationUrl("snsapi_userinfo").then(res => {
              if (res) location.href = res;
            });
          }
        }
      } else {
        // 微信环境下默认获取openId 避免出现什么毛病 微信操作总是要openId
        if (isWxEnv() && !wxAuthorizationCode.value && !isMiniAppWebview.value) {
          const userInfo = getCookieAuthorizationUserInfo();
          if (userInfo && userInfo.openid) {
            wxUserInfo.value = userInfo;
            return;
          }
          getWxAuthorizationUrl("snsapi_base").then((res: string) => {
            if (res) location.href = res;
          });
        }
      }
    }
  };

  return {
    wxAuthorizationUrl,
    wxAuthorizationCode,
    wxUserInfo,
    wxSignature,
    miniAppOpenId,
    isMiniAppWebview,
    formKey,
    handleSettingWxConfig,
    getCookieAuthorizationUserInfo,
    getWxAuthorizationUserInfo,
    getWxAuthorizationUrl,
    checkWxWriteSetting,
    getWxAuthorizationUserInfoByCode
  };
}
