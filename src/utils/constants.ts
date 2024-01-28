export default {
  version: "1.2"
};

export const UPDATE_MODEL_EVENT = "update:modelValue";

// 管理路由前缀 因为项目前段后放在一起
export const adminPrefix = "/admin";

// 路由全局基础前缀
export const basePathUrl = import.meta.env.VITE_PUBLIC_PATH;

// 系统展示模式 用户端和客户端分离模式： C ， 混合模式：A 主要是菜单的显示方式
export const systemAdminMode: string = "C";
