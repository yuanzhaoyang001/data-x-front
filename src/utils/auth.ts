import { Session } from "@/utils/storage";
import { basePathUrl } from "@/utils/constants";
import qs from "qs";
import { isWxEnv, isWxMiniEnv } from "@/views/form/write/hooks/wx";
import loadWXJs from "@/views/formgen/utils/loadWxSdk";

export const baseUrl = import.meta.env.VITE_API_URL;

export function getToken() {
  return Session.get("token");
}

export function getTokenUrl(url: string) {
  return baseUrl + url + "?Authorization=Bearer " + getToken();
}

export function getUserName() {
  return Session.get("userInfo")?.userName;
}

export function getTokenHeader(): any {
  return {
    Authorization: "Bearer " + getToken()
  };
}

/**
 * 去登录逻辑
 */
export function toLogin() {
  // 兼容如果实在微信小程序里面的话就让小程序调登录页
  if (isWxEnv()) {
    // 拉起小程序 把参数携带给他
    loadWXJs(wx => {
      isWxMiniEnv().then(res => {
        if (res) {
          const queryStr = window.location.href.split("?")[1];
          const params = qs.parse(queryStr);
          wx.miniProgram.redirectTo({
            url: "/pages/user/login?" + qs.stringify(params),
            success: function () {},
            fail: function (e: any) {
              console.log(e);
            }
          });
        } else {
          jumpToLogin();
        }
      });
    });
  } else {
    jumpToLogin();
  }
}

function jumpToLogin() {
  let path = window.location.pathname;
  path = path.slice(basePathUrl.length);
  const queryStr = window.location.href.split("?")[1];
  window.location.href =
    getBaseUrlPath() + `/login?redirect=${path}&params=${queryStr ? JSON.stringify(qs.parse(queryStr)) : ""}`;
}

/**
 *  获取顶级域名
 * @returns {string}
 */
function getTLD() {
  const hostname = window.location.hostname;
  const hostnameArray = hostname.split(".");
  // 如果是ip地址 或者是localhost
  if (hostnameArray.length === 1) return null;
  // 如果是三级域名 xx.xxx.xxx.com 或者是xxx.xx.com.cn 放弃
  if (hostnameArray.length > 3) return null;
  let i = 0;
  for (i = hostnameArray.length - 1; i > -1; i--) {
    if (hostnameArray[i].length > 2 && i !== hostnameArray.length - 1) {
      break;
    }
  }
  let tldArray = [];
  for (let j = i; j < hostnameArray.length; j++) {
    tldArray.push(hostnameArray[j]);
  }
  return tldArray.join(".");
}

/**
 * 获取基础路径 如果包含了二级路径，需要在路由中配置 这里再获取
 */
export const getBaseUrlPath = () => {
  let url = window.location.protocol + "//" + window.location.host;
  let baseUrl = url + basePathUrl;
  // 最后一个是/ 移除掉
  if (baseUrl.endsWith("/")) {
    console.log(baseUrl.substring(0, baseUrl.length));
    return baseUrl.substring(0, baseUrl.length - 1);
  }
  return baseUrl;
};
