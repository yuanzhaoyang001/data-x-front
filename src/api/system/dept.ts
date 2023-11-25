import request from "@/utils/request";

// 查询部门列表
export function pageDept(query: any) {
  return request({
    url: "/system/dept/page",
    method: "get",
    params: query
  });
}

// 查询部门列表
export function listDept(query: any) {
  return request({
    url: "/system/dept/list",
    method: "get",
    params: query
  });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId: number) {
  return request({
    url: "/system/dept/list/exclude/" + deptId,
    method: "get"
  });
}

// 查询部门详细
export function getDept(deptId: number) {
  return request({
    url: "/system/dept/" + deptId,
    method: "get"
  });
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: "/system/dept/treeselect",
    method: "get"
  });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId: number) {
  return request({
    url: "/system/dept/roleDeptTreeselect/" + roleId,
    method: "get"
  });
}

// 新增部门
export function addDept(data: any) {
  return request({
    url: "/system/dept",
    method: "post",
    data: data
  });
}

// 修改部门
export function updateDept(data: any) {
  return request({
    url: "/system/dept",
    method: "put",
    data: data
  });
}

// 删除部门
export function delDept(deptId: number) {
  return request({
    url: "/system/dept/" + deptId,
    method: "delete"
  });
}

// 分页查询部门岗位列表
export function pageDeptPost(query: any) {
  return request({
    url: "/system/dept/post/page",
    method: "get",
    params: query
  });
}

//查询部门不包含的岗位
export function queryDeptNotInPost(query: any) {
  return request({
    url: "/system/dept/post/queryDeptNotInPost",
    method: "get",
    params: query
  });
}

//查询部门包含的岗位
export function queryDeptInPost(query: any) {
  return request({
    url: "/system/dept/post/queryDeptInPost",
    method: "get",
    params: query
  });
}

// 新增部门岗位
export function settingDeptPost(data: any) {
  return request({
    url: "/system/dept/post/settingDeptPost",
    method: "post",
    data: data
  });
}

// 修改部门岗位
export function updateDeptPost(data: any) {
  return request({
    url: "/system/dept/post/update",
    method: "post",
    data: data
  });
}

// 删除部门岗位
export function delDeptPost(deptPostId: number) {
  return request({
    url: "/system/dept/post/" + deptPostId,
    method: "delete"
  });
}
