import { deleteRequest, getRequest, postRequest } from "../baseRequest";

// 查询modeler列表
export const listDefinition = (params: any) => getRequest("/process/definition/page", params);

// 查询流程部署版本
export const listVersionDefinition = (params: any) => getRequest("/process/definition/version/page", params);
// 获取流程定义XMl
export const getProcessDefineXML = (deployId: string) => getRequest("/process/definition/xml/" + deployId);

// 挂起激活转换
export const suspendOrActiveApply = (data: any) => postRequest("/process/definition/suspendOrActiveApply", data);

// 删除Modeler
export const delDefinition = (id: number) => deleteRequest("/process/definition/" + id);
