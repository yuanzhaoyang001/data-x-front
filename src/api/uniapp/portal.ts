import { requestHttp } from "@/utils/request";
import { ReqPage, ResPage } from "@/api/types";

export interface Portal {
  id: number;
  name: string;
  configValue: string;
  updateTime: string;
  createTime: string;
}

export interface ReqPortalParams extends ReqPage {
  name: string;
}

/**
 * 获取门户列表
 */
export function listPortal(params: ReqPortalParams) {
  return requestHttp.get<ResPage<Portal>>("/uniapp/portal/page", params);
}

/**
 * 获取门户详情
 * @param id
 */
export function getPortal(id: number): any {
  return requestHttp.get(`/uniapp/portal/${id}`);
}

/**
 * 创建门户
 * @param data
 */
export function addPortal(data: any) {
  return requestHttp.post("/uniapp/portal/add", data);
}

/**
 * 修改门户
 * @param data
 */
export function updatePortal(data: any) {
  return requestHttp.post<Portal>("/uniapp/portal/update", data);
}

/**
 * 删除门户
 * @param id
 */
export function delPortal(id: number) {
  return requestHttp.post(`/uniapp/portal/delete/${id}`);
}
