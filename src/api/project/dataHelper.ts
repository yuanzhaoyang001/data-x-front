import { getRequest, postRequest } from "../baseRequest";

// 查询数据助手智能提醒列表
export const listDataHelperReminders = (params: any) => getRequest("form/data/helper/reminders/list", params);

// 查询数据助手智能提醒详细
export const getDataHelperReminders = (id: number) => getRequest("form/data/helper/reminders/" + id);

// 新增数据助手智能提醒
export const addDataHelperReminders = (data: any) => postRequest("form/data/helper/reminders/add", data);

// 修改数据助手智能提醒
export const updateDataHelperReminders = (data: any) => postRequest("form/data/helper/reminders/update", data);

// 删除数据助手智能提醒
export const delDataHelperReminders = (id: number) => postRequest("form/data/helper/reminders/delete/" + id);
