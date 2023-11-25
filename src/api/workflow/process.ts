// 查询modeler列表
import { getRequest, postRequest } from "../baseRequest";

/**
 * 我发起的流程
 * @param params
 */
export const listMyProcess = (params: any) => getRequest("/process/task/myProcess", params);

/**
 * 完成任务
 * @param data
 */
export const cancelProcess = (data: any) => postRequest(`/process/task/cancel`, data);

/**
 * 删除流程
 */
export const deleteProcess = (instanceId: any) => postRequest(`/process/instance/delete?instanceIdList=${instanceId}`);
