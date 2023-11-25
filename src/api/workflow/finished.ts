import { getRequest } from "../baseRequest";

/**
 *  已办任务列表
 * @param params
 * @returns {AxiosPromise}
 */
export const listFinishedTask = (params: any) => getRequest("/process/task/finishedList", params);
