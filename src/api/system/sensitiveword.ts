import { getRequest, postRequest } from "../baseRequest";

// 查询敏感词库列表
export const listSensitiveWord = (query: any) => getRequest("/system/sensitiveWord/page", query);

// 查询敏感词库详细
export const getSensitiveWord = (id: number) => getRequest("/system/sensitiveWord/" + id);

// 新增敏感词库
export const addSensitiveWord = (data: any) => postRequest("/system/sensitiveWord/add", data);

// 修改敏感词库
export const updateSensitiveWord = (data: any) => postRequest("/system/sensitiveWord/update", data);

// 删除敏感词库
export const delSensitiveWord = (id: number) => postRequest("/system/sensitiveWord/delete/" + id);
// 删除敏感词库
export const syncWords = (id: number) => postRequest("/system/sensitiveWord/syncWords/");
