import { getRequest, postRequest } from "../baseRequest";

/**
 * 发布流程
 * @param data
 * @returns {AxiosPromise}
 */
export const convertBpmnRequest = (data: any) => postRequest(`/workflow/convertBpmn`, data);

/**
 * 流程设计
 * @param data
 * @returns {AxiosPromise}
 */
export const getBusinessDesignListRequest = (formKey: string) => getRequest(`/workflow/business/design/list/${formKey}`);
/**
 * 保存流程设计
 * @param data
 * @returns {AxiosPromise}
 */
export const saveBusinessDesignRequest = (data: any) => postRequest(`/workflow/business/design/save`, data);

/**
 * 发布流程设计
 * @param data
 * @returns {AxiosPromise}
 */
export const publishBusinessDesignRequest = (data: any) => postRequest(`/workflow/business/design/publish`, data);

/**
 * 获取流程设计
 * @param data
 * @returns {AxiosPromise}
 */
export const getBusinessFormRequest = (formKey: string) => getRequest(`/workflow/business/design/deployment/${formKey}`);
/**
 * 获取表单流程实例
 * 包含数据 表单项
 * @param data
 * @returns {AxiosPromise}
 */
export const getBusinessProcessFormRequest = (taskId: string, instanceId: string) =>
  getRequest(`/workflow/business/process/form/`, {
    taskId: taskId,
    instanceId: instanceId
  });

/**
 * 获取流程任务携带表单属性
 * @param instanceId
 * @returns {number}
 */
export const getTaskPropertyRequest = (taskId: string) => getRequest(`/workflow/business/process/property/${taskId}`);
