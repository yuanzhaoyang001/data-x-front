import { getRequest, postRequest } from "../baseRequest";

// 查询待填写表单列表
export const listTodo = (params: any) => getRequest("/user/form/todo/page", params);

// 查询待填写表单列表
export const listAllTodo = (params: any) => getRequest("/user/form/todo/pageAll", params);

// 分配给用户
export const assignTodo = (data: any) => postRequest("/user/form/todo/assign", data);

// 删除待填写表单
export const delTodo = (data: any) => postRequest("/user/form/todo/delete", data);
