import { getRequest } from "../baseRequest";

// 查询部门员工列表
export const getDepartmentListRequest = (query: any) => getRequest("/organization/departments", query);
// 查询部门员工列表
export const getEmpTreeRequest = (query: any) => getRequest("/organization/empTrees", query);
// 查询部门员工列表
export const getEmployeeListRequest = (query: any) => getRequest("/organization/employees", query);
// 查询角色列表
export const getRoleListRequest = (query: any) => getRequest("/organization/roles", query);
// 查询岗位列表
export const getPostListRequest = (query: any) => getRequest("/organization/posts", query);
