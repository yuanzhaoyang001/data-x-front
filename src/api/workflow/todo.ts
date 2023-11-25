import { getRequest, postRequest } from "../baseRequest";

/**
 * 我发起的流程
 * @param params
 */
export const todoList = (params: any) => getRequest("/process/task/todoList", params);

/**
 * 完成任务
 * @param data
 */
export const complete = (data: any) => postRequest(`/process/task/complete`, data);

/**
 * 拒绝任务
 * @param data
 */
export const rejectTask = (data: any) => postRequest(`/process/task/reject`, data);

/**
 * 转办任务
 * @param data
 */
export const transferTask = (data: any) => postRequest(`/process/task/transfer`, data);

/**
 * 委派
 * @param data
 */
export const delegateTask = (data: any) => postRequest(`/process/task/delegate`, data);

/**
 * 可退回任务列表
 * @param data
 */
export const returnList = (data: any) => postRequest(`/process/task/returnList`, data);

/**
 * 回退任务到指定节点
 * @param data
 */
export const returnTask = (data: any) => postRequest(`/process/task/return`, data);

/**
 * 任务加签
 */
export const addSignTask = (data: any) => postRequest(`/process/task/addSign`, data);

/**
 * 任务流转记录
 */
export const flowRecord = (params: any) => getRequest(`/process/task/flow/record`, params);

/**
 * 流程详情
 */
export const flowDetail = (params: any) => getRequest(`/process/task/flow/details`, params);

/**
 * 流程图数据
 */
export const getProcessDiagramData = (params: any) => getRequest(`/process/task/getProcessDiagramData`, params);
