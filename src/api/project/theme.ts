import { deleteRequest, getRequest, postRequest, putRequest } from "../baseRequest";

// 查询项目主题外观模板列表
export const listTheme = (params: any) => getRequest("/form/theme/page", params);

// 查询项目主题外观模板详细
export const getTheme = (id: number) => getRequest("/form/theme/" + id);

// 新增项目主题外观模板
export const addTheme = (data: any) => postRequest("/form/theme", data);

// 修改项目主题外观模板
export const updateTheme = (data: any) => putRequest("/form/theme", data);

// 删除项目主题外观模板
export const delTheme = (id: number) => deleteRequest("/form/theme/" + id);

// 查询单主题分类列表
export const listCategory = (params: any) => getRequest("/form/theme/category/list", params);

// 查询单主题分类详细
export const getCategory = (id: number) => getRequest("/form/theme/category/" + id);

// 新增单主题分类
export const addCategory = (data: any) => postRequest("/form/theme/category", data);

// 修改单主题分类
export const updateCategory = (data: any) => putRequest("/form/theme/category", data);

// 删除单主题分类
export const delCategory = (id: number) => deleteRequest("/form/theme/category/" + id);
