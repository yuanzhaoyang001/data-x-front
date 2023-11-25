import { getRequest, postRequest } from "@/api/baseRequest";
import { requestHttp } from "@/utils/request";
import { ResultData } from "@/api/types";
// 获取项目详情
export const queryProject = (formKey: any): Promise<ResultData> => requestHttp.get(`/user/form/${formKey}`);

// 更新项目
export const updateProject = (data: any): Promise<ResultData> => requestHttp.post("/user/form/update", data);

// 创建项目表单项
export const createProjectItem = (data: any): Promise<ResultData> => requestHttp.post("/user/form/item/create", data);

// 创建项目表单项
export const batchCreateProjectItem = (data: any) => postRequest("/user/form/item/batch/create", data);

// 更新项目表单项
export const updateProjectItem = (data: any): Promise<ResultData> => requestHttp.post("/user/form/item/update", data);

// 删除项目表单项
export const deleteProjectItem = (data: any): Promise<ResultData> => requestHttp.post("/user/form/item/delete", data);

// 查询项目表单项
export const queryProjectItemList = (formKey: any): Promise<ResultData> => requestHttp.get("/user/form/item/list", formKey);

// 排序项目表单项
export const sortProjectItem = (data: any): Promise<ResultData> => requestHttp.post("/user/form/item/sort", data);

// 排序项目表单项
export const sortAllProjectItem = (data: any) => postRequest("/user/form/item/sortAll", data);

// 表单逻辑项
export const queryFormLogic = (params: any) => getRequest("/user/form/logic", params);

// 停止发布表单
export const stopPublishFormRequest = (data: any): Promise<ResultData> => requestHttp.post("/user/form/stop", data);

// 查询部门员工列表
export const getEmpTreeRequest = (params: any) => getRequest("/organization/empTrees", params);

// 查询部门列表
export const getDeptTreeRequest = (params: any) => getRequest("/organization/deptTrees", params);
export default {
  queryProject,
  updateProject,
  createProjectItem,
  updateProjectItem,
  deleteProjectItem,
  sortProjectItem,
  sortAllProjectItem
};
