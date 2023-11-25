import { requestHttp } from "@/utils/request";
import { ReqPage, ResPage, ResultData } from "@/api/types";
import { UnwrapRef } from "vue";
//查询流程扩展信息列表
export const getFormExtensionInfoPageRequest = (params: PageExtensionParam): Promise<ResultData<ExtensionPageRes>> =>
  requestHttp.get("/flow/extensionInfo/page", params);
//获取流程扩展信息详细信息
export const getExtensionInfoId = (id: number): Promise<ResultData<FlowExtensionInfo>> =>
  requestHttp.get("/flow/extensionInfo/" + id);

//新增流程扩展信息
export const postFormExtensionInfoAdd = (params: FlowExtensionInfo): Promise<ResultData<FlowExtensionInfo>> =>
  requestHttp.post("/flow/extensionInfo/add", params);
//修改流程扩展信息
export const postExtensionInfoUpdate = (params: FlowExtensionInfo): Promise<ResultData<FlowExtensionInfo>> =>
  requestHttp.post("/flow/extensionInfo/update", params);
//删除流程扩展信息
export const postExtensionInfoDelete = (id: number | number[]): Promise<ResultData> =>
  requestHttp.post("/flow/extensionInfo/delete/" + id);
//查询我能发起的流程列表
export const getAllowedInitiatorList = (value: UnwrapRef<string>): Promise<ResultData> =>
  requestHttp.get("/flow/allowedInitiatorList");

export interface AllowedInitiator extends ResPage<FlowExtensionInfo> {
  cateId: number;
  cateName: string;
  extensionInfoList: FlowExtensionInfo[];
}

/**
 * 流程扩展信息
 */
export interface FlowExtensionInfo {
  /**
   * 分类ID
   */
  categoriesId?: number | number[];
  /**
   * 颜色
   */
  color: string | undefined;

  /**
   * icon
   */
  icon: string | undefined;
  /**
   * 修改时需要
   */
  id?: number;
  /**
   * 流程名称
   */
  name: string | undefined;
  /**
   * 角色Id
   */
  roleIdList?: number[];
  /**
   * 用户列表
   */
  userIdList?: number[];
  /**
   * 部门类型
   */
  deptIdList?: number[];
  // 分类名称
  cateName?: string;

  deptList?: DeptEntityType[];
  roleList?: RoleType[];
  userList?: UserType[];
}

export interface UserType {
  id: number;
  userName: string;
}

export interface DeptType {
  id: number;
  label: string;
}

export interface DeptEntityType {
  id: number;
  deptName: string;
}

export interface RoleType {
  id: number;
  roleName: string;
}

export interface PageExtensionParam extends ReqPage {
  // 名称
  name: string;
  categoriesId: number | number[];
}

export interface ExtensionPageRes extends ResPage<FlowExtensionInfo> {
  records: FlowExtensionInfo[];
  total: number;
}
