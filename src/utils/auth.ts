import { Session } from "@/utils/storage";

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
