import request, { requestHttp } from "@/utils/request";
import { getRequest, postRequest } from "../baseRequest";
import { ResultData } from "@/api/types";

// 查看表单
export const viewFormResultRequest = (formKey: string) => getRequest(`/user/form/data/view/${formKey}`);
// 保存表单结果数据 不会校验是否能填写
export const createFormResultRequest = (data: any) => postRequest("/user/form/data/create", data);
// 保存公开表单结果数据
export const publicCreateFormResultRequest = (data: SubmitFormData) => postRequest("/user/form/data/public/create", data);

export interface SubmitFormData {
  // 完成时间
  completeTime?: string;
  // 微信信息
  wxUserInfo?: any;
  wxOpenId?: string | null;
  // 数据 表单key
  originalData: any;
  // 表单key
  formKey: string;
  formType: string;
  otherParam: any;
  submitOs: string;
  submitBrowser: string;
  submitUa: string;
  extValue?: string;
}

// 查询数据列表
export const listFormDataTableRequest = (data: any) => postRequest("/user/form/data/query", data);
// 查询数据详情 公开接口
export const getFormDataDetailsRequest = (dataId: number) => getRequest(`/user/form/data/details/${dataId}`);
// 查询我的数据详情
export const getFormDataViewRequest = (dataId: number) => getRequest(`/user/form/data/${dataId}`);

// 删除数据
export const deleteFormDataRequest = (data: any, key: string) => postRequest(`/user/form/data/delete/${key}`, data);
// 修改数据
export const updateFormDataRequest = (data: any) => postRequest("/user/form/data/update", data);
// 导出附件
export const downloadFormDataFileRequest = (data: any) => postRequest("/user/form/data/download/file", data);
// 导出数据
export const exportDataRequest = (data: any) => {
  return request({
    url: "/user/form/data/export",
    method: "post",
    data: data,
    responseType: "blob"
  });
};

// 下载导入模板
export const downloadImportTemplateRequest = (params: any) => {
  return request({
    url: "/user/form/data/import/template",
    method: "get",
    params: params,
    responseType: "blob"
  });
};
// 保存评论数据
export const saveReplyRequest = (data: any) => postRequest("/user/form/data/reply", data);
// 查询回复列表
export const listReplyRequest = (params: any) => getRequest("/user/form/data/reply/list", params);
// 根据数据id查询备注内容
export const getRemarkRequest = (dataId: number) => getRequest(`/user/form/data/remark/${dataId}`);
// 保存备注内容
export const saveRemarkRequest = (data: any) => postRequest("/user/form/data/saveRemark", data);

// 我填写的表单
export const listMyFillFormRequest = (params: any) => getRequest("/user/form/data/my", params);
//根据dataId 查询表单数据
export const getFormDataRequest = (id: number): Promise<ResultData<UserFormData>> =>
  requestHttp.get("/user/form/data/dataId/" + id);

//根据dataId 查询表单数据
export const updateFormDataByDataIdRequest = (data: any): Promise<ResultData> =>
  requestHttp.post("/user/form/data/updateByDataId", data);

/**
 * UserFormDataEntity
 */
export interface UserFormData {
  /**
   * 完成时间
   */
  completeTime?: number | null;
  /**
   * 创建者
   */
  createBy?: null | string;
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 数据唯一id
   */
  dataId?: null | string;
  /**
   * 扩展字段
   */
  extValue?: null | string;
  /**
   * 表单key
   */
  formKey: string;
  formType?: string;

  /**
   * 主键 避免超出长度 前端丢失精度
   */
  id?: number | null;
  /**
   * 填写结果原始数据
   */
  originalData?: MapObject;

  /**
   * 搜索值
   */
  searchValue?: null | string;
  /**
   * 提交序号
   */
  serialNumber?: number | null;
  /**
   * 提交ip
   */
  submitAddress?: null | string;
  /**
   * 提交浏览器
   */
  submitBrowser?: null | string;
  /**
   * 提交系统
   */
  submitOs?: null | string;
  /**
   * 提交ip
   */
  submitRequestIp?: null | string;
  /**
   * 填写用户Ua
   */
  submitUa?: any;
  /**
   * 更新者
   */
  updateBy?: null | string;
  /**
   * 更新时间
   */
  updateTime?: null | string;
  /**
   * 用戶Id
   */
  userId?: number | null;
  /**
   * 微信openID
   */
  wxOpenId?: null | string;
  /**
   * 微信用户信息
   */
  wxUserInfo?: any;
}

export interface MapObject {
  /**
   * data.wxUserInfo.key
   */
  [key: string]: any;
}
