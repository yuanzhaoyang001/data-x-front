import request from "@/utils/request";

// 获取授权Url
export function getAuthorizeUrl(type: number) {
  return request({
    url: "/user/auth/authorizeUrl",
    params: { type },
    method: "get"
  });
}

// 登录接口
export function authLogin(type: number, data: any) {
  return request({
    url: "/user/auth/login",
    method: "post",
    params: { type },
    data
  });
}

// 绑定
export function bindLogin(type: number, data: any) {
  return request({
    url: "/user/auth/bind",
    method: "post",
    params: { type },
    data
  });
}

// 获取用户登录信息
export function getBindAccountList() {
  return request({
    url: "/user/auth/bindAccountList",
    method: "get"
  });
}

// 解除绑定
export function unBindAccount(data: any) {
  return request({
    url: "/user/auth/unbind",
    method: "post",
    data
  });
}

// 修改账号
export function updateAccount(data: { account: string; password: string }) {
  return request({
    url: "/user/auth/updateAccount",
    method: "post",
    data
  });
}
