// 表单发布相关接口
import { getRequest, postRequest } from "../baseRequest";

// 查询项目权限组详细
export const listAuthGroup = (key: string) => getRequest("/form/auth/group/list", { formKey: key });

// 查询项目权限组详细
export const listSimpleAuthGroup = (key: string, type: number) =>
  getRequest("/form/auth/group/simpleList", { formKey: key, type: type });

// 查询授权组授权对象
export const getAuthObjs = (id: number) => getRequest("/form/auth/group/" + id);

// 查询授权组授权对象
export const saveAuthObjs = (data: any) => postRequest("/form/auth/save", data);

// 查询项目权限组详细
export const getAuthGroup = (id: number) => getRequest("/form/auth/group/" + id);

// 新增项目权限组
export const createAuthGroup = (data: any) => postRequest("/form/auth/group/create", data);

// 修改项目权限组
export const updateAuthGroup = (data: any) => postRequest("/form/auth/group/update", data);

// 删除项目权限组
export const delAuthGroup = (id: number) => postRequest("/form/auth/group/delete/" + id);

// 获取表单用户的权限
export const getFormUserAuthRequest = (formKey: string) => getRequest("/user/form/auth/" + formKey);

// 获取表单公开发布状态
export const getFormStatusRequest = (formKey: string) => getRequest("/user/form/" + formKey);
// 发布表单
export const publishFormRequest = (data: any) => postRequest("/user/form/publish", data);
// 停止发布表单
export const stopPublishFormRequest = (data: any) => postRequest("/user/form/stop", data);
// 查询扩展字段列表
export const getFormLinkExtListRequest = (formKey: string) => getRequest("/user/form/link/extList/" + formKey);
// 查询扩展字段列表
export const saveFormLinkExtRequest = (data: any) => postRequest("/user/form/link/ext", data);
// 删除扩展字段列表
export const deleteFormLinkExtRequest = (data: any) => postRequest("/user/form/link/ext/delete", data);
// 保存公开查询条件
export const savePublicQueryRequest = (data: any) => postRequest("/user/form/public/query/save", data);
// 删除公开查询条件
export const deletePublicQueryRequest = (data: any) => postRequest("/user/form/public/query/delete", data);
// 保存公开查询条件
export const getPublicQueryListRequest = (formKey: string) => getRequest(`/user/form/public/query/${formKey}/list`);
// 公开查询条件页内容
export const getPublicQueryContentRequest = (formKey: string, queryId: any) =>
  getRequest(`/user/form/public/query/${formKey}/content`, { queryId });
// 查询公开查询数据
export const listPublicQueryDataRequest = (data: any) => postRequest("/user/form/public/query/data", data);
