import request from "@/utils/request";

// post
export function postRequest(url: string, parameter?: any) {
  return request({
    url,
    method: "post",
    data: parameter
  });
}

// post method= {post | put}
export function httpRequest(url: string, parameter?: any, method?: any) {
  return request({
    url,
    method,
    data: parameter
  });
}

// put
export function putRequest(url: string, parameter?: any) {
  return request({
    url,
    method: "put",
    data: parameter
  });
}

// get
export function getRequest(url: string, parameter?: any) {
  return request({
    url,
    method: "get",
    params: parameter
  });
}

// deleteRequest
export function deleteRequest(url: string, parameter?: any) {
  return request({
    url,
    method: "delete",
    params: parameter
  });
}

export interface Request {
  code: string;
  msg: string;
}
export interface ResultData<T = any> extends Request {
  data: T;
}
export interface ResPage<T> {
  records: T[];
  current: number;
  size: number;
  total: number;
}
export interface ReqPage {
  current: number;
  size: number;
  total: number;
}
