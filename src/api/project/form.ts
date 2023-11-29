import { getRequest, postRequest } from "../baseRequest";
import { requestHttp } from "@/utils/request";
import { ResPage, ResultData } from "@/api/types";
// 创建表单
export const createFormRequest = (data: any) => postRequest("/user/form/create", data);
// 修改表单
export const updateFormRequest = (data: any) => postRequest("/user/form/update", data);
// 获取项目详情
export const getProjectRequest = (formKey: string) => getRequest(`/user/form/${formKey}`);
//恢复表单
export const restoreRecycleFormRequest = (data: any) => postRequest("/user/form/recycle/restore", data);
// 从回收站删除表单
export const deleteRecycleFormRequest = (data: any) => postRequest("/user/form/recycle/delete", data);
// 查询回收站表单
export const listRecycleFormRequest = (data: any) => getRequest("/user/form/recycle/page", data);
// 逻辑删除表单
export const logicDeleteFormRequest = (data: any) => postRequest("/user/form/logic/delete", data);
// 删除表单
export const deleteFormRequest = (data: any) => postRequest("/user/form/delete", data);
// 复制表单
export const copyFormRequest = (data: any) => postRequest("/user/form/copy", data);
// 查询管理表单
export const pageMangeFormRequest = (params: FormRey): Promise<ResultData<FormReyPageRes>> =>
  requestHttp.get("/form/manage/page", params);
// 停止收集表单
export const stopFormRequest = (data: any) => postRequest("/user/form/stop", data);

// 查询表单分页
export const pageFormRequest = (params: any) => getRequest("/user/form/page", params);

// 查询表单项内容
export const listProjectItemRequest = (params: { key?: string; displayType?: boolean }) =>
  getRequest("/user/form/item/list", params);

export interface ProjectItem {
  formItemId: string;
  textLabel: string;

  [key: string]: any;
}

// 查询表单项内容
export const listFormFieldsRequest = (formKey: string) => getRequest(`/user/form/fields/${formKey}`);

// 查询固定表单项内容
export const listFixedFormFieldsRequest = (formKey: string) => getRequest(`/user/form/fixed/fields/${formKey}`);

// 查询表单逻辑列表
export const getFormLogicRequest = (params: { formKey: string }) => getRequest("/user/form/logic", params);

// 保存表单逻辑
export const saveFormLogicRequest = (data: any) => postRequest("/user/form/logic/save", data);

// 查询主题列表
export const listThemeRequest = (params: any) => getRequest("/form/theme/list", params);

// 保存表单选中主题
export const saveUserThemeRequest = (data: any) => postRequest("/user/form/theme/save", data);

// 查询表单主题
export const getUserThemeRequest = (projectKey: string) => getRequest(`/user/form/theme/${projectKey}`);

// 查询表单文件夹树
export const getUserFormFolderTreeRequest = () => getRequest(`user/form/folderTree`);

// 我协作的表单
export const getMyCooperationFormsRequest = (params: FormRey): Promise<ResultData<FormReyPageRes>> =>
  requestHttp.get(`user/form/my/cooperation`, params);

// 查询核销码信息
export const getEnquiryConfirmationCodeRequest = (data: any) => postRequest("/form/confirmationCode/getByFormKeyAndCode", data);

// 使用核销码
export const useConfirmationCodeRequest = (data: any) => postRequest("/form/confirmationCode/use", data);

// 获取人脸验证url
export const getFaceIdentifyUrl = (data: any) => getRequest("/form/ext/getFaceVerifyUrl", data);
// 获取人脸识别的信息
export const getFaceIdentifyInfo = (data: any) => getRequest("/form/ext/getFaceVerifyInfo", data);

// 获取我能管理的全部表单
export const getMyHasPermissionRequest = (): Promise<ResultData<FormRey[]>> => requestHttp.get(`/user/form/permission/list`);

// 查询我的当前访问表单的角色
export const getMyFormRoleRequest = (formKey: string) => requestHttp.get<MyFormRole>(`/form/access/role/${formKey}`);

export enum MyFormRole {
  /**
   * 超管
   */
  SUPER_ADMIN = "SUPER_ADMIN",
  /**
   * 所有者
   */
  OWNER = "OWNER",
  /**
   * 协作者
   */
  COLLABORATOR = "COLLABORATOR",
  /**
   * 后台管理员
   */
  FORM_ADMIN = "FORM_ADMIN"
}

export interface FormRey {
  current: number;
  size: number;
  name: string;
  beginDateTime: string;
  endDateTime: string;
  status: number | number[];
  folderId?: number;
  type?: number;
  formKey?: string;
  textName?: string;
  userName?: string;
}
export interface FormReyPageRes extends ResPage<FormRey> {
  records: FormRey[];
  total: number;
}
