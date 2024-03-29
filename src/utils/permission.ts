import { useUserInfo } from "@/stores/userInfo";

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value: any[]): boolean {
  if (value && Array.isArray(value) && value.length > 0) {
    const stores = useUserInfo();
    const permissions = stores.userInfos.authBtnList;
    const permissionDatas = value;
    const all_permission = "*:*:*";

    const hasPermission = permissions.some((permission: string) => {
      return all_permission === permission || permissionDatas.includes(permission);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    console.error("need roles! Like checkPermi=\"['system:user:add','system:user:edit']\"");
    return false;
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value: any[]): boolean {
  if (value && Array.isArray(value) && value.length > 0) {
    const stores = useUserInfo();
    const roles = stores.userInfos.roles;
    const permissionRoles = value;
    const super_admin = "admin";

    const hasRole = roles.some((role: string) => {
      return super_admin === role || permissionRoles.includes(role);
    });

    if (!hasRole) {
      return false;
    }
    return true;
  } else {
    console.error("need roles! Like checkRole=\"['admin','editor']\"");
    return false;
  }
}
