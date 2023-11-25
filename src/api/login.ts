import request, { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";

// 登录方法
export function login(username: string, password: string, code?: string, uuid?: string) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: "/login",
    method: "post",
    data: data
  });
}

export interface TokenLoginRes {
  token: string;
  expired: number;
  user: any;
}

// token登录
export const tokenLogin = (token: string): Promise<ResultData<TokenLoginRes>> =>
  requestHttp.post("/user/auth/tokenLogin?token=" + token);

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get"
  });
}

// 注册方法
export function register(data: any) {
  return request({
    url: "/register",
    method: "post",
    data: data
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    method: "get"
  });
}
