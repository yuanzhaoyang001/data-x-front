import { deleteRequest, getRequest, postRequest, putRequest } from "../baseRequest";

// 查询message列表
export const pageMsgTemplate = (params: any) => getRequest("/sys/msg/template/page", params);

export const listMsgTemplate = (params: any) => getRequest("/sys/msg/template/list", params);

// 查询message详细
export const getMsgTemplate = (id: number) => getRequest("/sys/msg/template/" + id);

// 新增message
export const addMsgTemplate = (data: any) => postRequest("/sys/msg/template", data);

// 修改message
export const updateMsgTemplate = (data: any) => putRequest("/sys/msg/template", data);

// 删除message
export const delMsgTemplate = (id: number) => deleteRequest("/sys/msg/template/" + id);

export const sendTemplateMsg = (data: any) => postRequest("/sys/msg/template/sendMsg", data);
/**
 * 同步微信模板消息
 */
export const syncWxTemplateMsg = (data: any) => postRequest("/sys/msg/template/syncWxMpMsgTemplate", data);

export interface MsgTemplate {
  id: number;
  templateName: string;
  templateContent: string;
  templateType: string;
  templateTypeDesc: string;
}
