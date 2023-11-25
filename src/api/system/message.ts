import { getRequest, postRequest, putRequest, deleteRequest } from "../baseRequest";

// 查询msg列表
export const listMessage = (params: any) => getRequest("/sys/msg/page", params);

// 查询msg详细
export const getMessage = (id: number) => getRequest("/sys/msg/" + id);

// 新增msg
export const addMessage = (data: any) => postRequest("/sys/msg", data);

// 修改msg
export const updateMessage = (data: any) => putRequest("/sys/msg", data);

// 删除msg
export const delMessage = (id: number) => deleteRequest("/sys/msg/" + id);
