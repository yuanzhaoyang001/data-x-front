import request from "@/utils/request";

// 查询角色列表
export function pageRole(query: any) {
  return request({
    url: "/system/role/page",
    method: "get",
    params: query
  });
}

// 查询角色列表
export function listRole(query: any) {
  return request({
    url: "/system/role/list",
    method: "get",
    params: query
  });
}

// 查询角色详细
export function getRole(roleId: number) {
  return request({
    url: "/system/role/" + roleId,
    method: "get"
  });
}

// 新增角色
export function addRole(data: any) {
  return request({
    url: "/system/role",
    method: "post",
    data: data
  });
}

// 修改角色
export function updateRole(data: any) {
  return request({
    url: "/system/role",
    method: "put",
    data: data
  });
}

// 角色数据权限
export function dataScope(data: any) {
  return request({
    url: "/system/role/dataScope",
    method: "put",
    data: data
  });
}

// 角色状态修改
export function changeRoleStatus(id: number, status: any) {
  const data = {
    id,
    status
  };
  return request({
    url: "/system/role/changeStatus",
    method: "put",
    data: data
  });
}

// 删除角色
export function delRole(roleId: number) {
  return request({
    url: "/system/role/" + roleId,
    method: "delete"
  });
}

// 导出角色
export function exportRole(query: any) {
  return request({
    url: "/system/role/export",
    method: "get",
    responseType: "blob",
    params: query
  });
}
