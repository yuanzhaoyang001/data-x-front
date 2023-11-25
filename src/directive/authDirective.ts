import type { App } from "vue";
import { useUserInfo } from "@/stores/userInfo";
import { judementSameArr } from "@/utils/arrayOperation";

/**
 * 用户权限指令
 */
export function authDirective(app: App) {
  // 判断角色
  app.directive("hasRole", {
    mounted(el, binding) {
      const { value } = binding;
      const super_admin = "admin";
      const stores = useUserInfo();
      const roles = stores.userInfos.roles;

      if (value && value instanceof Array && value.length > 0) {
        const roleFlag = value;

        const hasRole = roles.some(role => {
          return super_admin === role || roleFlag.includes(role);
        });

        if (!hasRole) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error('请设置角色权限标签值"');
      }
    }
  });
  // 是否有权限
  // v-hasPermi
  app.directive("hasPermi", {
    mounted(el, binding) {
      const { value } = binding;
      const all_permission = "*:*:*";
      const stores = useUserInfo();
      const permissions = stores.userInfos.authBtnList;

      if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value;

        const hasPermissions = permissions.some(permission => {
          return all_permission === permission || permissionFlag.includes(permission);
        });

        if (!hasPermissions) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error("请设置操作权限标签值");
      }
    }
  });
}
