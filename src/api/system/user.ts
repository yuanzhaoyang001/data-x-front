import request from "@/utils/request";
import { praseStrEmpty } from "@/utils/tduck";

// 查询用户列表
export function pageUser(query: any) {
  return request({
    url: "/system/user/page",
    method: "get",
    params: query
  });
}

// 查询用户列表
export function listUser(query: any) {
  return request({
    url: "/system/user/list",
    method: "get",
    params: query
  });
}

// 查询用户详细
export function getUser(userId: number) {
  return request({
    url: "/system/user/" + praseStrEmpty(userId),
    method: "get"
  });
}

// 新增用户
export function addUser(data: any) {
  return request({
    url: "/system/user",
    method: "post",
    data: data
  });
}

// 修改用户
export function updateUser(data: any) {
  return request({
    url: "/system/user",
    method: "put",
    data: data
  });
}

// 删除用户
export function delUser(userId: number) {
  return request({
    url: "/system/user/" + userId,
    method: "delete"
  });
}

// 导出用户
export function exportUser(query: any) {
  return request({
    url: "/system/user/export",
    method: "get",
    responseType: "blob",
    params: query
  });
}

// 用户密码重置
export function resetUserPwd(id: number, password: string) {
  const data = {
    id,
    password
  };
  return request({
    url: "/system/user/resetPwd",
    method: "put",
    data: data
  });
}

// 用户状态修改
export function changeUserStatus(id: number, status: string | number) {
  const data = {
    id,
    status
  };
  return request({
    url: "/system/user/changeStatus",
    method: "put",
    data: data
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: "/system/user/profile",
    method: "get"
  });
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: data
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    params: data
  });
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: "/system/user/importTemplate",
    method: "get",
    responseType: "blob"
  });
}

// 查询授权角色
export function getAuthRole(userId: number) {
  return request({
    url: "/system/user/authRole/" + userId,
    method: "get"
  });
}

// 保存授权角色
export function updateAuthRole(data: any) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    params: data
  });
}

export interface UserEntity {
  id: number;
  deptId: string;
  userName: string;
  nickName?: string;
  email?: string;
  phonenumber?: string;
  sex?: string;
  avatar?: string;
  password?: string;
  salt?: string;
  status?: string;
  delFlag?: string;
  loginIp?: string;
  loginDate?: string;
  roleIds?: string[];
  postIds?: string[];
  remark?: string;
}
