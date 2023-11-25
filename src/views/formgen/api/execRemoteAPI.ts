import axios from "axios";
import { baseUrl, getTokenHeader } from "@/utils/auth";

// 可自动判断是否加上 baseURL 的请求
const execRemoteAPI = axios.create({
  timeout: 6000 // 请求超时时间
});

// request 拦截器
execRemoteAPI.interceptors.request.use(
  config => {
    const { params, method, headers } = config;

    // 如果是以 '/' 开头的地址都加上 BaseURL
    let url: string = config.url?.trim() || "";
    if (url.indexOf("/") === 0) {
      url = localStorage.getItem(baseUrl) + url;
    }
    config.url = url;

    // 所有的请求都加上 Token
    Object.keys(getTokenHeader()).forEach((key: string) => {
      headers[key] = getTokenHeader()[key];
    });

    if (method === "get") {
      config.params = {
        _t: new Date().getTime(),
        ...params
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

export { execRemoteAPI };
