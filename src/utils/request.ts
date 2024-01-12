import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { Session } from "@/utils/storage";
import qs from "qs";
import { ResultData } from "@/api/types";
import { useTLocale } from "@/utils/localeUtil";
import VerificationBox from "@/components/Verifition/verification.ts";

const config = {
  // 默认地址
  baseURL: import.meta.env.VITE_API_URL,
  // 设置超时时间（10s）
  timeout: 50000,
  // 跨域时候允许携带凭证
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize(params: any) {
      return qs.stringify(params, { allowDots: true });
    }
  }
};

class RequestHttp {
  service: AxiosInstance;

  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/本地储存当中
     */
    this.service.interceptors.request.use(
      config => {
        // * 将当前请求添加到 pending 中
        // axiosCanceler.addPending(config);
        // showFullScreenLoading();
        if (Session.get("token")) {
          config.headers!["Authorization"] = `${Session.get("token")}`;
        }
        // 多语言 只支持中英文
        config.headers!["Accept-Language"] = useTLocale().acceptLanguage.value;
        return config;
      },
      (error: AxiosError) => {
        Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      async response => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.code && res.code !== 200) {
          // `token` 过期或者账号已在别处登录
          if (res.code === 401 || res.code === 4001) {
            Session.clear(); // 清除浏览器全部临时缓存
            // 获取当前页面的参数
            const path = window.location.pathname;
            const queryStr = window.location.href.split("?")[1];
            window.location.href = `/login?redirect=${path}&params=${queryStr ? JSON.stringify(qs.parse(queryStr)) : ""}`;
          } else if (res.code === 416) {
            // 需要滑动验证
            let result = {};
            await VerificationBox().then(
              async (value: any) => {
                if (!response.config.params) {
                  response.config.params = {};
                }
                response.config.params.slideCode = value;
                if (response.config.data) {
                  response.config.data = JSON.parse(response.config.data);
                }
                result = await this.service.request(response.config);
              },
              (error: any) => {
                console.log(error);
                return Promise.reject("error");
              }
            );
            return Promise.resolve(result);
          } else if (res.code === 410) {
            // 当前url包含 license 就不在跳转
            if (location.href.indexOf("license") > -1) {
              return Promise.reject("error");
            }
            location.href = `/license`;
          } else if (res.code === 500) {
            ElMessage.error(res.msg);
          }
          return Promise.reject(response);
        } else {
          if (response.config.headers["T-Download"]) {
            return response;
          } else {
            return res;
          }
        }
      },
      error => {
        // 对响应错误做点什么
        if (error.message.indexOf("timeout") != -1) {
          ElMessage.error("网络超时");
        } else if (error.message == "Network Error") {
          ElMessage.error("网络连接错误");
        } else {
          if (error.response.data) ElMessage.error(error.response.statusText);
          else ElMessage.error("接口路径找不到");
        }
        return Promise.reject(error);
      }
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }

  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }

  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }

  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }

  download(url: string, params?: object) {
    this.service
      .post(url, params, {
        headers: {
          "T-Download": "true"
        },
        responseType: "blob"
      })
      .then(res => {
        const blob = new Blob([res.data]);
        const fileName = res.headers["content-disposition"].split("filename=")[1];
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", fileName); // 设置下载文件名称
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}

// 导出 axios 实例
let requestHttp = new RequestHttp(config);

export default requestHttp.service;

export { requestHttp };
